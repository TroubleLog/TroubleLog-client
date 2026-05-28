import { useState } from "react";
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
} from "./data/mockData";
import {
  toISO,
  loadHist,
  saveHist,
  seedHist,
  getNickname,
  saveNickname,
} from "./utils/history";

const INIT = {
  view: "login",
  user: null,
  step: 1,
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

export default function App() {
  const [S, setS] = useState(INIT);
  const upd = (p) => setS((prev) => ({ ...prev, ...p }));

  const login = (email) => {
    const nickname = getNickname(email);
    seedHist(email);
    upd({ user: { email, nickname }, view: "app", error: "" });
  };
  const register = (email, nickname) => {
    saveNickname(email, nickname);
    seedHist(email);
    upd({ user: { email, nickname }, view: "app", error: "" });
  };
  const logout = () => setS({ ...INIT });
  const restart = () =>
    upd({
      step: 1,
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

  const genQuestions = () => {
    if (S.code.trim().length < 20) {
      upd({ error: "코드를 20자 이상 입력해주세요." });
      return;
    }
    upd({ loading: true, error: "" });
    setTimeout(
      () => upd({ loading: false, questions: MOCK_QUESTIONS, step: 3 }),
      1800,
    );
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
      upd({ loading: false, report: MOCK_REPORT, radar: MOCK_RADAR, step: 4 });
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

  if (S.view === "login") {
    return (
      <LoginPage
        onLogin={login}
        onSwitch={(v) => upd({ view: v, error: "" })}
      />
    );
  }
  if (S.view === "register") {
    return (
      <SignUpPage
        onRegister={register}
        onSwitch={(v) => upd({ view: v, error: "" })}
      />
    );
  }

  const renderStep = () => {
    if (S.loading) return <Loading isReport={S.step === 3} />;
    switch (S.step) {
      case 1:
        return (
          <Step1Code
            code={S.code}
            error={S.error}
            onChange={(c) => upd({ code: c, error: "" })}
            onNext={() => {
              if (S.code.trim().length < 20) {
                upd({ error: "코드를 20자 이상 입력해주세요." });
                return;
              }
              upd({ step: 2, error: "" });
            }}
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
            onBack={() => upd({ step: 1, error: "" })}
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
            onBack={() => upd({ step: 2, error: "" })}
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
        return null;
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar step={S.step} user={S.user} onLogout={logout} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar step={S.step} user={S.user} />
        <main className="flex-1">
          <div className="max-w-[780px] mx-auto px-10 py-10 pb-16 w-full">
            {renderStep()}
          </div>
        </main>
      </div>
    </div>
  );
}

function Loading({ isReport }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-7 h-7 border-2 border-s4 border-t-accent rounded-full animate-spin-fast mb-4" />
      <p className="text-sm text-t2 mb-1">
        {isReport
          ? "트러블슈팅 리포트를 작성하는 중..."
          : "AI 면접 질문을 생성하는 중..."}
      </p>
      <p className="text-xs text-t3">
        {isReport
          ? "포트폴리오에 활용 가능한 리포트를 생성합니다."
          : "기술 의사결정, 트러블슈팅 영역을 분석합니다."}
      </p>
    </div>
  );
}
