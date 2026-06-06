import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { EditorView } from "@codemirror/view";
import { oneDark } from "@codemirror/theme-one-dark";

const LANG_OPTIONS = [
  { id: "javascript", label: "JavaScript", ext: () => javascript() },
  {
    id: "typescript",
    label: "TypeScript",
    ext: () => javascript({ typescript: true }),
  },
  { id: "java", label: "Java", ext: () => java() },
  { id: "python", label: "Python", ext: () => python() },
];

const editorTheme = EditorView.theme({
  "&": {
    backgroundColor: "#18181C",
    fontSize: "12.5px",
  },
  ".cm-scroller": {
    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
    lineHeight: "1.75",
  },
  ".cm-content": {
    padding: "16px 12px 16px 0",
    caretColor: "#22C55E",
  },
  ".cm-gutters": {
    backgroundColor: "#18181C",
    border: "none",
    color: "#55555F",
    paddingLeft: "8px",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  ".cm-activeLine": {
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": {
    backgroundColor: "rgba(34, 197, 94, 0.2) !important",
  },
});

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

function LangDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = LANG_OPTIONS.find((o) => o.id === value);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 font-mono text-[10px] text-t2 hover:text-t1 transition-colors px-1.5 py-0.5 rounded hover:bg-white/[0.05]"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selected?.label}
        <svg
          className={`w-2.5 h-2.5 stroke-current fill-none stroke-2 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 12 12"
        >
          <path d="M3 4.5L6 7.5L9 4.5" />
        </svg>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full mt-1 min-w-[120px] bg-s3 border border-white/[0.09] rounded-md py-1 shadow-lg z-10"
        >
          {LANG_OPTIONS.map((opt) => (
            <li key={opt.id} role="option" aria-selected={opt.id === value}>
              <button
                type="button"
                onClick={() => {
                  onChange(opt.id);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 font-mono text-[10px] transition-colors hover:bg-white/[0.06] ${
                  opt.id === value ? "text-accent" : "text-t2 hover:text-t1"
                }`}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Step1Code({ code, error, onChange, onSetError, onNext, piiWarning, onClearPiiWarning }) {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("javascript");

  const extensions = useMemo(() => {
    const lang = LANG_OPTIONS.find((o) => o.id === language);
    return [lang.ext(), oneDark, editorTheme, EditorView.lineWrapping];
  }, [language]);

  const handleNext = () => {
    onNext();
  };

  return (
    <div className="animate-fade-up">
      {piiWarning && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-s1 border border-white/[0.09] rounded-xl p-6 max-w-[380px] w-full mx-4">
            <h3 className="text-[16px] font-semibold text-t1 mb-2">🔒 개인정보가 감지되었어요</h3>
            <p className="text-[13px] text-t2 leading-relaxed mb-5">{piiWarning}</p>
            <button className="btn-primary w-full" onClick={onClearPiiWarning}>
              확인
            </button>
          </div>
        </div>
      )}
      <div className="mb-8">
        <span className="sec-tag">
          <svg
            className="w-3 h-3 stroke-current fill-none stroke-2 [stroke-linecap:round]"
            viewBox="0 0 16 16"
          >
            <path d="M4 4l4 4-4 4M9 12h3" />
          </svg>
          코드 제출
        </span>
        <h2 className="sec-title">분석할 코드를 붙여넣기 해주세요</h2>
        <p className="sec-sub">
          핵심 로직 코드를 입력하면 AI 면접관이 분석하여 맞춤형 기술 면접 질문을
          생성합니다.
        </p>
      </div>

      <ErrBar msg={error} />

      {/* Code Editor */}
      <div
        className="
          border border-white/[0.09]
          rounded-md
          overflow-hidden
          transition-colors
          focus-within:border-accent
          focus-within:shadow-[0_0_0_1px_#22C55E]
        "
      >
        <div className="bg-s2 px-3.5 py-2 flex items-center justify-between border-b border-white/[0.09]">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28CA41]" />
          </div>

          <LangDropdown value={language} onChange={setLanguage} />
        </div>

        <CodeMirror
          value={code}
          height="260px"
          theme={oneDark}
          extensions={extensions}
          onChange={onChange}
          basicSetup={{
            lineNumbers: true,
            foldGutter: false,
            highlightActiveLine: true,
            autocompletion: false,
          }}
        />
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="text-[11px] text-t3">
          💡 함수·클래스 단위 핵심 로직을 붙여넣으면 질문 품질이 높아집니다
        </span>
        <span className="font-mono text-[10px] text-t3">{code.length}자</span>
      </div>

      <div className="flex gap-2.5 mt-6">
        <button className="btn-primary flex-1" onClick={handleNext}>
          다음 — 컨텍스트 입력 →
        </button>
      </div>
    </div>
  );
}
