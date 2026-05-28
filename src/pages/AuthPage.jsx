import { useState } from 'react'
import { saveNickname } from '../utils/history'

const LogoRow = () => (
  <div className="flex items-center gap-2.5 mb-7">
    <div className="w-7 h-7 bg-accent rounded-[7px] flex items-center justify-content-center flex-shrink-0 flex items-center justify-center">
      <svg className="w-[15px] h-[15px] stroke-white fill-none stroke-[2.3] [stroke-linecap:round]" viewBox="0 0 16 16">
        <path d="M2 4h12M2 8h8M2 12h5"/>
        <circle cx="13" cy="11" r="2.5"/>
        <path d="M15 13l1.5 1.5"/>
      </svg>
    </div>
    <span className="text-[15px] font-semibold text-t1 tracking-tight">TroubleLog</span>
    <span className="text-[9px] font-semibold text-accent bg-[var(--gd)] border border-accent/25 rounded px-1.5 py-0.5 tracking-wide">BETA</span>
  </div>
)

const ErrMsg = ({ msg }) => msg ? (
  <div className="flex items-start gap-2 bg-[var(--rd)] border border-red-500/25 rounded-md p-3 text-xs text-red-300 mb-4">
    <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 stroke-current fill-none stroke-2 [stroke-linecap:round]" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="6"/><path d="M8 5v3M8 10v.5"/>
    </svg>
    {msg}
  </div>
) : null

function LoginForm({ onLogin, onSwitch }) {
  const [email, setEmail] = useState('')
  const [pw, setPw]       = useState('')
  const [err, setErr]     = useState('')

  const submit = () => {
    if (!email || !pw) { setErr('이메일과 비밀번호를 입력해주세요.'); return }
    if (!email.includes('@')) { setErr('올바른 이메일 형식을 입력해주세요.'); return }
    onLogin(email)
  }

  return (
    <>
      <LogoRow />
      <h1 className="text-xl font-semibold text-t1 tracking-tight mb-1">다시 만나서 반가워요 👋</h1>
      <p className="text-[13px] text-t2 mb-6 leading-relaxed">로그인하고 면접 세션을 이어가세요</p>
      <ErrMsg msg={err} />
      <div className="mb-3.5">
        <label className="block text-xs font-medium text-t2 mb-1.5">이메일</label>
        <input className="field-input" type="email" placeholder="name@example.com" value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && document.getElementById('li-pw').focus()}
        />
      </div>
      <div className="mb-6">
        <label className="block text-xs font-medium text-t2 mb-1.5">비밀번호</label>
        <input id="li-pw" className="field-input" type="password" placeholder="••••••••" value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
        />
      </div>
      <button className="btn-primary w-full" onClick={submit}>로그인</button>
      <p className="text-center text-xs text-t3 mt-5">
        계정이 없으신가요?{' '}
        <button className="text-accent underline underline-offset-2 bg-transparent border-none cursor-pointer text-xs" onClick={() => onSwitch('register')}>
          회원가입
        </button>
      </p>
    </>
  )
}

function RegisterForm({ onRegister, onSwitch }) {
  const [nick, setNick]   = useState('')
  const [email, setEmail] = useState('')
  const [pw, setPw]       = useState('')
  const [pwc, setPwc]     = useState('')
  const [agree, setAgree] = useState(false)
  const [err, setErr]     = useState('')

  const submit = () => {
    if (!nick)               { setErr('닉네임을 입력해주세요.'); return }
    if (!email.includes('@')){ setErr('올바른 이메일을 입력해주세요.'); return }
    if (pw.length < 8)       { setErr('비밀번호는 8자 이상이어야 합니다.'); return }
    if (pw !== pwc)          { setErr('비밀번호가 일치하지 않습니다.'); return }
    if (!agree)              { setErr('개인정보 활용에 동의해주세요.'); return }
    onRegister(email, nick)
  }

  return (
    <>
      <LogoRow />
      <h1 className="text-xl font-semibold text-t1 tracking-tight mb-1">TroubleLog 시작하기</h1>
      <p className="text-[13px] text-t2 mb-6 leading-relaxed">계정을 만들고 기술 면접을 준비해보세요</p>
      <ErrMsg msg={err} />
      {[
        { label:'닉네임',      id:'rg-nk',  type:'text',     ph:'홍길동',            val:nick,  set:setNick  },
        { label:'이메일',      id:'rg-e',   type:'email',    ph:'name@example.com', val:email, set:setEmail },
        { label:'비밀번호',    id:'rg-p',   type:'password', ph:'8자 이상',          val:pw,    set:setPw    },
        { label:'비밀번호 확인',id:'rg-pc', type:'password', ph:'비밀번호 재입력',   val:pwc,   set:setPwc   },
      ].map(f => (
        <div key={f.id} className="mb-3.5">
          <label className="block text-xs font-medium text-t2 mb-1.5">{f.label}</label>
          <input id={f.id} className="field-input" type={f.type} placeholder={f.ph}
            value={f.val} onChange={e => f.set(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
          />
        </div>
      ))}
      <div className="flex items-start gap-2.5 bg-s2 border border-white/5 rounded-md p-3 mb-5 cursor-pointer" onClick={() => setAgree(!agree)}>
        <input type="checkbox" checked={agree} readOnly className="mt-0.5 accent-accent w-3.5 h-3.5 flex-shrink-0 cursor-pointer" />
        <label className="text-xs text-t2 cursor-pointer leading-relaxed">개인정보 수집 및 활용에 동의합니다</label>
      </div>
      <button className="btn-primary w-full" onClick={submit}>회원가입</button>
      <p className="text-center text-xs text-t3 mt-5">
        이미 계정이 있으신가요?{' '}
        <button className="text-accent underline underline-offset-2 bg-transparent border-none cursor-pointer text-xs" onClick={() => onSwitch('login')}>
          로그인
        </button>
      </p>
    </>
  )
}

export default function AuthPage({ view, onLogin, onRegister, onSwitch }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-bg">
      <div className="w-full max-w-[400px] bg-s1 border border-white/[0.09] rounded-xl p-8 pb-7">
        {view === 'login'
          ? <LoginForm    onLogin={onLogin}        onSwitch={onSwitch} />
          : <RegisterForm onRegister={onRegister}  onSwitch={onSwitch} />
        }
      </div>
    </div>
  )
}
