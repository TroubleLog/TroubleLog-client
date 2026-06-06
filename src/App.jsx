import { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Step1Code from "./pages/steps/Step1Code";
import Step2Context from "./pages/steps/Step2Context";
import Step3QA from "./pages/steps/Step3QA";
import Step4Report from "./pages/steps/Step4Report";
import LoginPage from "./pages/user/LoginPage";
import SignUpPage from "./pages/user/SignUpPage";
import {
  MOCK_CODE,
  MOCK_QUESTIONS,
  MOCK_REPORT,
  MOCK_RADAR,
  MOCK_FEEDBACK,
} from "./data/serviceData";
import {
  toISO,
  loadHist,
  saveHist,
  seedHist,
  saveNickname,
} from "./utils/history";
import { logout as logoutApi, createProject, submitPreContext, submitInterview, generateReport, submitAnswer } from "./utils/api";

const INIT = {
  user: null,
  code: MOCK_CODE,
  ctx: { intent: "", alt: "", edge: "", scale: "" },
  questions: [],
  answers: ["", "", ""],
  skipped: [false, false, false],
  report: "",
  radar: null,
  loading: false,
  error: "",
  feedback: [null, null, null],
  feedbackText: ["", "", ""],
  sessionId: null,
  piiWarning: null,
};

function RequireAuth({ user }) {
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function AppLayout({ user, onLogout }) {
  const { step } = useParams();
  const stepNum = Number(step) || 1;

  return (
    <div className="flex min-h-screen">
      <Sidebar step={stepNum} user={user} onLogout={onLogout} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar step={stepNum} user={user} />
        <main className="flex-1">
          <div className="max-w-[780px] mx-auto px-10 py-10 pb-16 w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function Loading({ isReport }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-10 h-10 border-2 border-s4 border-t-accent rounded-full animate-spin-fast mb-4" />
      <p className="text-sm text-t2 mb-1">
        {isReport ? "트러블슈팅 리포트 생성 중..." : "AI 면접 질문 생성 중..."}
      </p>
      <p className="text-xs text-t3">{isReport ? "" : ""}</p>
    </div>
  );
}

function StepRoutes({
  S,
  upd,
  genQuestions,
  genReport,
  requestFeedback,
  restart,
}) {
  const { step } = useParams();
  const location = useLocation();
  const stepNum = Number(step);

  if (S.loading) {
    return <Loading isReport={location.pathname === "/step/3"} />;
  }

  switch (stepNum) {
    case 1:
      return (
        <Step1Code
          code={S.code}
          error={S.error}
          onChange={(c) => upd({ code: c, error: "" })}
          onSetError={(msg) => upd({ error: msg })}
        />
      );
    case 2:
      return (
        <Step2Context
          ctx={S.ctx}
          error={S.error}
          onChange={(id, val) =>
            upd({ ctx: { ...S.ctx, [id]: val }, error: "" })
          }
          onSetError={(msg) => upd({ error: msg })}
          onNext={genQuestions}
        />
      );
    case 3:
      return (
        <Step3QA
          questions={S.questions}
          answers={S.answers}
          skipped={S.skipped}
          feedback={S.feedback}
          feedbackText={S.feedbackText}
          error={S.error}
          onAnswerChange={(i, val) => {
            const a = [...S.answers];
            a[i] = val;
            upd({ answers: a, error: "" });
          }}
          onSkip={(i) => {
            const sk = [...S.skipped];
            sk[i] = true;
            upd({ skipped: sk });
          }}
          onFeedback={requestFeedback}
          onNext={genReport}
          piiWarning={S.piiWarning}
          onClearPiiWarning={() => upd({ piiWarning: null })}
        />
      );
    case 4:
      return (
        <Step4Report
          report={S.report}
          radar={S.radar}
          user={S.user}
          onRestart={restart}
        />
      );
    default:
      return <Navigate to="/step/1" replace />;
  }
}

export default function App() {
  const [S, setS] = useState(INIT);
  const navigate = useNavigate();
  const upd = (p) => setS((prev) => ({ ...prev, ...p }));

  const login = (email, nickname, memberId) => {
    saveNickname(email, nickname);
    seedHist(email);
    upd({ user: { email, nickname, memberId }, error: "" });
  };

  const register = (email, nickname, memberId) => {
    saveNickname(email, nickname);
    seedHist(email);
    upd({ user: { email, nickname, memberId }, error: "" });
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch {
      // 서버 로그아웃 실패 시에도 로컬 세션 정리
    }
    setS({ ...INIT });
    navigate("/login");
  };

  const restart = () => {
    upd({
      ctx: { intent: "", alt: "", edge: "", scale: "" },
      questions: [],
      answers: ["", "", ""],
      skipped: [false, false, false],
      report: "",
      radar: null,
      error: "",
      feedback: [null, null, null],
      feedbackText: ["", "", ""],
    });
  };

  const genQuestions = async () => {
    if (S.code.trim().length < 20) {
      upd({ error: "코드를 20자 이상 입력해주세요." });
      return;
    }
    upd({ loading: true, error: "" });
    try {
      const { sessionId } = await createProject({
        memberId: S.user.memberId,
        codeContent: S.code,
        githubUrl: "",
      });

      const { questions } = await submitPreContext({
        memberId: S.user.memberId,
        sessionId,
        codePurpose: S.ctx.intent,
        techRationale: S.ctx.alt,
        exceptionHandling: S.ctx.edge,
        projectScale: S.ctx.scale ?? "",
      });

      upd({ loading: false, questions, sessionId });
      navigate("/step/3");
    } catch (e) {
      upd({ loading: false, error: e.message });
    }
  };

  const genReport = async () => {
    const valid = S.answers.filter((a, i) => !S.skipped[i] && a.trim().length >= 10);
    if (!valid.length) {
      upd({ error: "최소 1개 질문에 10자 이상 답변을 입력해주세요." });
      return;
    }
    upd({ loading: true, error: "" });
    try {
      const answers = S.questions.map((q, i) => ({
        questionId: q.questionId,
        answer: S.skipped[i] ? "" : S.answers[i],
      }));

      const submitRes = await submitInterview({
        sessionId: S.sessionId,
        memberId: S.user.memberId,
        answers,
      });

      if (!submitRes.reportGenerationReady) {
        upd({ loading: false, piiWarning: submitRes.blockedReason || "개인정보가 감지되었습니다. 코드나 답변을 수정해주세요." });
        return;
      }

      const { report, radarScore } = await generateReport({ sessionId: S.sessionId });

      const radar = [
        { label: "문제해결", val: radarScore.problemSolving },
        { label: "기술 판단력", val: radarScore.techJudgment },
        { label: "코드 신뢰성", val: radarScore.codeReliability },
        { label: "커뮤니케이션", val: radarScore.communication },
        { label: "설계 사고력", val: radarScore.designThinking },
      ];

      const today = toISO(new Date());
      const h = loadHist(S.user?.email);
      if (!h.includes(today)) { h.push(today); saveHist(S.user?.email, h); }

      upd({ loading: false, report, radar });
      navigate("/step/4");
    } catch (e) {
      upd({ loading: false, error: e.message });
    }
  };

  const requestFeedback = async (i) => {
    const fb = [...S.feedback];
    fb[i] = "loading";
    upd({ feedback: fb });
    try {
      const questionId = S.questions[i].questionId;
      const data = await submitAnswer({
        sessionId: S.sessionId,
        questionId,
        memberId: S.user.memberId,
        answer: S.answers[i],
      });

      const fb2 = [...S.feedback], ft = [...S.feedbackText];
      fb2[i] = "shown";
      ft[i] = data.improvement || "";
      upd({ feedback: fb2, feedbackText: ft });
    } catch (e) {
      const fb2 = [...S.feedback];
      fb2[i] = null;
      upd({ feedback: fb2, error: e.message });
    }
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage onLogin={login} />} />
      <Route path="/register" element={<SignUpPage onRegister={register} />} />
      <Route element={<RequireAuth user={S.user} />}>
        <Route element={<AppLayout user={S.user} onLogout={logout} />}>
          <Route
            path="/step/:step"
            element={
              <StepRoutes
                S={S}
                upd={upd}
                genQuestions={genQuestions}
                genReport={genReport}
                requestFeedback={requestFeedback}
                restart={restart}
              />
            }
          />
        </Route>
      </Route>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
