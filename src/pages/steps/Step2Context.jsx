import { useNavigate } from "react-router-dom";
import { CTX_META } from "../../data/serviceData";

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

export default function Step2Context({ ctx, error, onChange, onNext, onSetError }) {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <span className="sec-tag">
          <svg
            className="w-3 h-3 stroke-current fill-none stroke-2 [stroke-linecap:round]"
            viewBox="0 0 16 16"
          >
            <circle cx="8" cy="8" r="6" />
            <path d="M8 5v3M8 10v.5" />
          </svg>
          사전 컨텍스트
        </span>
        <h2 className="sec-title">개발 배경을 알려주세요</h2>
        <p className="sec-sub">
          코드만으로 파악하기 어려운 의사결정 배경을 수집합니다.<br/>
          모두 선택 사항이며, 입력할수록 질문의 깊이가 달라집니다.
        </p>
      </div>

      <ErrBar msg={error} />

      {CTX_META.map((q, i) => (
        <div
          key={q.id}
          className="bg-s1 border border-white/5 rounded-lg px-6 py-5 mb-3 focus-within:border-white/[0.16] transition-colors"
        >
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-6 h-6 rounded-full bg-s3 border border-white/[0.09] text-[11px] font-semibold text-t2 flex items-center justify-center flex-shrink-0">
              {i + 1}
            </div>
            <span className="text-[16px] font-medium text-t1">{q.label}</span>
            <span className="text-[10px] text-t3 ml-auto bg-s3 rounded px-1.5 py-0.5">
              선택
            </span>
          </div>
          <div className="text-[14px] text-[#808080] font-medium mb-3">
            {q.sub}
          </div>
          <textarea
            className="w-full min-h-[76px] resize-y bg-s2 border border-white/[0.09] rounded-md px-3.5 py-2.5 text-[14px] leading-relaxed text-t1 outline-none focus:border-white/20 placeholder:text-t3 transition-colors"
            rows={3}
            placeholder={q.ph}
            value={ctx[q.id]}
            onChange={(e) => onChange(q.id, e.target.value)}
          />
        </div>
      ))}

      <div className="flex gap-2.5 mt-6">
        <button className="btn-ghost" onClick={() => navigate("/step/1")}>
          ← 이전
        </button>
        <button className="btn-primary flex-1" onClick={onNext}>
          AI 면접 질문 생성 →
        </button>
      </div>
    </div>
  );
}
