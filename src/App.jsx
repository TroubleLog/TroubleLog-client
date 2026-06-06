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
  getNickname,
  saveNickname,
} from "./utils/history";
import { logout as logoutApi } from "./utils/api";

const INIT = {
  user: null,
  code: MOCK_CODE,
  ctx: { intent: "", alt: "", edge: "" },
  questions: [],
  answers: ["", "", ""],
  skipped: [false, false, false],
  report: "",
  radar: null,
  loading: false,
  error: "",
  feedback: [null, null, null],
  feedbackText: ["", "", ""],
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

  const login = (email) => {
    const nickname = getNickname(email);
    seedHist(email);
    upd({ user: { email, nickname }, error: "" });
  };

  const register = (email, nickname) => {
    saveNickname(email, nickname);
    seedHist(email);
    upd({ user: { email, nickname }, error: "" });
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
      ctx: { intent: "", alt: "", edge: "" },
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

  const genQuestions = () => {
    if (S.code.trim().length < 20) {
      upd({ error: "코드를 20자 이상 입력해주세요." });
      return;
    }
    upd({ loading: true, error: "" });
    setTimeout(() => {
      upd({ loading: false, questions: MOCK_QUESTIONS });
      navigate("/step/3");
    }, 1800);
  };

  const genReport = () => {
    const valid = S.answers.filter(
      (a, i) => !S.skipped[i] && a.trim().length >= 10,
    );
    if (!valid.length) {
      upd({ error: "최소 1개 질문에 10자 이상 답변을 입력해주세요." });
      return;
    }
    upd({ loading: true, error: "" });
    setTimeout(() => {
      const today = toISO(new Date());
      const h = loadHist(S.user?.email);
      if (!h.includes(today)) {
        h.push(today);
        saveHist(S.user?.email, h);
      }
      upd({ loading: false, report: MOCK_REPORT, radar: MOCK_RADAR });
      navigate("/step/4");
    }, 2200);
  };

  const requestFeedback = (i) => {
    const fb = [...S.feedback];
    fb[i] = "loading";
    upd({ feedback: fb });
    setTimeout(() => {
      const fb2 = [...S.feedback],
        ft = [...S.feedbackText];
      fb2[i] = "shown";
      ft[i] = MOCK_FEEDBACK[i] || "";
      upd({ feedback: fb2, feedbackText: ft });
    }, 1300);
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
