import { useState } from "react";
import Logo from "../../components/Logo";

const ErrMsg = ({ msg }) =>
  msg ? (
    <div className="flex items-start gap-2 bg-[var(--rd)] border border-red-500/25 rounded-md p-3 text-xs text-red-300 mb-4">
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

export default function LoginPage({ onLogin, onSwitch }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  const submit = () => {
    if (!email || !pw) {
      setErr("이메일과 비밀번호를 입력해주세요.");
      return;
    }
    if (!email.includes("@")) {
      setErr("올바른 이메일 형식을 입력해주세요.");
      return;
    }
    onLogin(email);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-bg">
      <div className="w-full max-w-[400px] bg-s1 border border-white/[0.09] rounded-xl p-8 pb-7">
        <Logo />

        {/* 타이틀 */}
        <h1 className="text-[20px] font-bold text-t1 mb-1">로그인</h1>
        <p className="text-[14px] text-t2 mb-6 leading-relaxed">
          TroubleLog와 기술 면접을 준비해보세요
        </p>

        {/* 이메일 */}
        <div className="mb-4">
          <label className="block text-[14px] font-medium text-t2 mb-1.5">
            이메일
          </label>
          <input
            className="field-input"
            type="email"
            placeholder="trouble@log.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && document.getElementById("li-pw")?.focus()
            }
          />
        </div>

        {/* 비밀번호 */}
        <div className="mb-4">
          <label className="block text-[14px] font-medium text-t2 mb-1.5">
            비밀번호
          </label>
          <input
            id="li-pw"
            className="field-input"
            type="password"
            placeholder="••••••••"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </div>

        {/* 에러 메시지 */}
        <ErrMsg msg={err} />

        {/* 로그인 버튼 */}
        <button className="btn-primary w-full" onClick={submit}>
          로그인
        </button>

        {/* go to 회원가입 */}
        <p className="text-center text-[14px] text-t3 mt-5">
          계정이 없으신가요?
          <button
            className="text-accent underline underline-offset-2 bg-transparent border-none cursor-pointer ml-2 text-[14px]"
            onClick={() => onSwitch("register")}
          >
            회원가입
          </button>
        </p>
      </div>
    </div>
  );
}
