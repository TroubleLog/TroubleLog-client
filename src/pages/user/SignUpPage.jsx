import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../components/Logo";
import { signup } from "../../utils/api";

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

export default function SignUpPage({ onRegister }) {
  const navigate = useNavigate();
  const [nick, setNick] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pwc, setPwc] = useState("");
  const [agree, setAgree] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!nick) {
      setErr("닉네임을 입력해주세요.");
      return;
    }
    if (!email.includes("@")) {
      setErr("올바른 이메일 형식을 입력해주세요.");
      return;
    }
    if (pw.length < 8) {
      setErr("비밀번호를 8자 이상 입력해주세요.");
      return;
    }
    if (pw !== pwc) {
      setErr("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!agree) {
      setErr("개인정보 수집 및 활용에 동의해주세요.");
      return;
    }

    setErr("");
    setLoading(true);
    try {
      const data = await signup({
        email,
        password: pw,
        username: nick,
      });
      onRegister(data.email, data.username, data.memberId);
      navigate("/step/1");
    } catch (e) {
      setErr(e.message || "회원가입에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      label: "닉네임",
      id: "rg-nk",
      type: "text",
      placeholder: "홍길동",
      value: nick,
      setValue: setNick,
    },
    {
      label: "이메일",
      id: "rg-e",
      type: "email",
      placeholder: "trouble@log.com",
      value: email,
      setValue: setEmail,
    },
    {
      label: "비밀번호",
      id: "rg-p",
      type: "password",
      placeholder: "8자 이상",
      value: pw,
      setValue: setPw,
    },
    {
      label: "비밀번호 확인",
      id: "rg-pc",
      type: "password",
      placeholder: "비밀번호 재입력",
      value: pwc,
      setValue: setPwc,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-bg">
      <div className="w-full max-w-[400px] bg-s1 border border-white/[0.09] rounded-xl p-8 pb-7">
        <Logo />

        {/* 타이틀 */}
        <h1 className="text-[20px] font-bold text-t1 mb-1">회원가입</h1>
        <p className="text-[14px] text-t2 mb-6 leading-relaxed">
          계정을 만들고 TroubleLog를 경험해보세요
        </p>

        {fields.map((field) => (
          <div key={field.id} className="mb-4">
            <label className="block text-[14px] font-medium text-t2 mb-1.5">
              {field.label}
            </label>
            <input
              id={field.id}
              className="field-input"
              type={field.type}
              placeholder={field.placeholder}
              value={field.value}
              onChange={(e) => field.setValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
          </div>
        ))}
        <div
          className="flex items-start gap-2.5 bg-s2 border border-white/5 rounded-md p-3 mb-4 cursor-pointer"
          onClick={() => setAgree(!agree)}
        >
          <input
            type="checkbox"
            checked={agree}
            readOnly
            className="mt-0.5 accent-accent w-3.5 h-3.5 flex-shrink-0 cursor-pointer"
          />
          <label className="text-xs text-t2 cursor-pointer leading-relaxed">
            개인정보 수집 및 활용에 동의합니다
          </label>
        </div>

        <ErrMsg msg={err} />

        {/* 회원가입 버튼 */}
        <button
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={submit}
          disabled={loading}
        >
          회원가입
        </button>

        {/* go to 로그인 */}
        <p className="text-center text-[14px] text-t3 mt-5">
          이미 계정이 있으신가요?{" "}
          <button
            className="text-accent underline underline-offset-2 bg-transparent border-none cursor-pointer ml-2 text-[14px]"
            onClick={() => navigate("/login")}
          >
            로그인
          </button>
        </p>
      </div>
    </div>
  );
}
