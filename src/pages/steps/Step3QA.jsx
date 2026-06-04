import { useNavigate } from "react-router-dom";
import { BADGE_TYPE } from "../../data/serviceData";

const BADGE_STYLE = {
  tech: "text-blue-400 bg-blue-500/10 border-blue-500/25",
  trouble: "text-amber-400 bg-amber-500/10 border-amber-500/25",
  opt: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
};

const ErrBar = ({ msg }) =>
  msg ? (
    <div className="flex items-start gap-2 bg-[var(--rd)] border border-red-500/25 rounded-md p-3 text-xs text-red-300 mb-5">
      <svg
        className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 stroke-current fill-none stroke-2 [stroke-linecap:round]"
        viewBox="0 0 16 16"
      >
        <circle cx="8" cy="8" r="6" />
        <path d="M8 5v3M8 10v.5" />
      </svg>
      {msg}
    </div>
  ) : null;

function QACard({
  q,
  i,
  answer,
  skipped,
  feedback,
  feedbackText,
  onAnswerChange,
  onSkip,
  onFeedback,
}) {
  const badgeKey = BADGE_TYPE[q.type] || "tech";
  const cnt = answer.length;
  const animClass =
    i === 0
      ? "animate-fade-up"
      : i === 1
        ? "animate-fade-up2"
        : "animate-fade-up3";

  return (
    <div
      className={`bg-s1 border border-white/5 rounded-lg overflow-hidden mb-3 ${animClass} ${skipped ? "opacity-40" : ""} transition-colors focus-within:border-white/[0.16]`}
    >
      {/* Question */}
      <div className="px-6 py-5 border-b border-white/5">
        <div className="flex items-center gap-2 mb-2.5">
          <span
            className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${BADGE_STYLE[badgeKey]}`}
          >
            {q.type}
          </span>
          <span className="text-[11px] text-t3 font-mono ml-auto">
            Q{i + 1}
          </span>
        </div>
        <p className="text-[14px] text-t1 leading-relaxed mb-3">{q.question}</p>
      </div>

      {/* Answer */}
      <div className="px-6 py-[18px] bg-white/[0.018]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-semibold text-t3 tracking-wider uppercase">
            내 답변
          </span>
          {skipped ? (
            <span className="text-[10px] text-t3 bg-s3 border border-white/5 rounded px-2 py-0.5">
              건너뜀
            </span>
          ) : (
            <button
              className="text-[11px] text-t3 underline underline-offset-2 bg-transparent border-none cursor-pointer hover:text-t2 transition-colors"
              onClick={() => onSkip(i)}
            >
              건너뛰기
            </button>
          )}
        </div>

        {!skipped && (
          <>
            <textarea
              className="w-full min-h-[88px] resize-y bg-s2 border border-white/[0.09] rounded-md px-3.5 py-2.5 text-[13px] leading-relaxed text-t1 outline-none focus:border-white/[0.18] placeholder:text-t3 transition-colors"
              rows={3}
              placeholder="자유 형식으로 답변해주세요. 키워드 나열도 좋습니다."
              value={answer}
              onChange={(e) => onAnswerChange(i, e.target.value)}
            />
            <p
              className={`text-[10px] font-mono mt-1.5 ${cnt > 0 && cnt < 10 ? "text-red-400" : "text-t3"}`}
            >
              {cnt}자{cnt > 0 && cnt < 10 ? " · 10자 이상 권장" : ""}
            </p>

            {/* Feedback */}
            {feedback === "loading" && (
              <div className="flex items-center gap-2 text-[11px] text-t3 mt-2.5">
                <div className="w-3 h-3 border-[1.5px] border-s4 border-t-accent rounded-full animate-spin-fast flex-shrink-0" />
                답변을 분석하는 중...
              </div>
            )}
            {feedback === "shown" && (
              <div className="bg-[var(--gd)] border border-accent/15 rounded-md px-3.5 py-3 mt-2.5 animate-fade-up">
                <p className="text-[10px] font-semibold text-accent tracking-wide mb-1.5">
                  ✦ AI 피드백
                </p>
                <p className="text-[12px] text-t2 leading-relaxed">
                  {feedbackText}
                </p>
              </div>
            )}
            {feedback === null && (
              <button
                disabled={cnt < 10}
                onClick={() => onFeedback(i)}
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-accent bg-[var(--gd)] border border-accent/20 rounded-md px-3.5 py-1.5 mt-2.5 cursor-pointer transition-all hover:bg-[var(--gd2)] hover:border-accent/40 hover:-translate-y-px disabled:opacity-30 disabled:cursor-not-allowed disabled:translate-y-0"
              >
                ✦ AI 피드백 받기
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function Step3QA({
  questions,
  answers,
  skipped,
  feedback,
  feedbackText,
  error,
  onAnswerChange,
  onSkip,
  onFeedback,
  onNext,
}) {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <span className="sec-tag">
          <svg
            className="w-3 h-3 stroke-current fill-none stroke-2 [stroke-linecap:round]"
            viewBox="0 0 16 16"
          >
            <path d="M3 8h10M3 4h7M3 12h5" />
          </svg>
          질문 & 답변
        </span>
        <h2 className="sec-title">맞춤형 면접 질문 3개</h2>
        <p className="sec-sub">
          코드와 컨텍스트를 분석하여 생성된 질문입니다. 각 질문 아래에 자유롭게
          답변을 작성하세요.
        </p>
      </div>

      <ErrBar msg={error} />

      {questions.map((q, i) => (
        <QACard
          key={i}
          q={q}
          i={i}
          answer={answers[i]}
          skipped={skipped[i]}
          feedback={feedback[i]}
          feedbackText={feedbackText[i]}
          onAnswerChange={onAnswerChange}
          onSkip={onSkip}
          onFeedback={onFeedback}
        />
      ))}

      <div className="flex gap-2.5 mt-6">
        <button className="btn-ghost" onClick={() => navigate("/step/2")}>
          ← 이전
        </button>
        <button className="btn-primary flex-1" onClick={onNext}>
          트러블슈팅 리포트 생성 →
        </button>
      </div>
    </div>
  );
}
