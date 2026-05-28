const ErrBar = ({ msg }) => msg ? (
  <div className="flex items-start gap-2 bg-[var(--rd)] border border-red-500/25 rounded-md p-3 text-xs text-red-300 mb-5">
    <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 stroke-current fill-none stroke-2 [stroke-linecap:round]" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="6"/><path d="M8 5v3M8 10v.5"/>
    </svg>
    {msg}
  </div>
) : null

export default function Step1Code({ code, error, onChange, onNext }) {
  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <span className="sec-tag">
          <svg className="w-3 h-3 stroke-current fill-none stroke-2 [stroke-linecap:round]" viewBox="0 0 16 16">
            <path d="M4 4l4 4-4 4M9 12h3"/>
          </svg>
          코드 제출
        </span>
        <h2 className="sec-title">분석할 코드를 붙여넣기 해주세요</h2>
        <p className="sec-sub">핵심 로직 코드를 입력하면 AI 면접관이 분석하여 맞춤형 기술 면접 질문을 생성합니다.</p>
      </div>

      <ErrBar msg={error} />

      {/* Code Editor */}
      <div>
        <div className="bg-s2 border border-white/[0.09] border-b-0 rounded-t-md px-3.5 py-2 flex items-center justify-between">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28CA41]" />
          </div>
          <span className="font-mono text-[10px] text-t3">JavaScript / TypeScript</span>
        </div>
        <textarea
          className="w-full min-h-[260px] resize-y bg-s2 border border-white/[0.09] border-t-0 rounded-b-md px-5 py-4 font-mono text-[12.5px] leading-7 text-t1 outline-none focus:border-accent focus:shadow-[inset_0_0_0_1px_#22C55E] tab-size-2"
          spellCheck="false"
          value={code}
          onChange={e => onChange(e.target.value)}
        />
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="text-[11px] text-t3">💡 함수·클래스 단위 핵심 로직을 붙여넣으면 질문 품질이 높아집니다</span>
        <span className="font-mono text-[10px] text-t3">{code.length}자</span>
      </div>

      <div className="flex gap-2.5 mt-6">
        <button className="btn-primary flex-1" onClick={onNext}>
          다음 — 컨텍스트 입력 →
        </button>
      </div>
    </div>
  )
}
