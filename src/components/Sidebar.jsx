import { STEPS_META } from "../data/serviceData";

const LogoutIcon = () => (
  <svg
    className="w-[13px] h-[13px] stroke-current fill-none stroke-2 [stroke-linecap:round]"
    viewBox="0 0 16 16"
  >
    <path d="M11 5l3 3-3 3M8 8h6" />
    <path d="M6 14H2a1 1 0 01-1-1V3a1 1 0 011-1h4" />
  </svg>
);

const CheckIcon = () => (
  <svg
    className="w-2.5 h-2.5 stroke-white fill-none stroke-[2.5] [stroke-linecap:round] [stroke-linejoin:round]"
    viewBox="0 0 10 10"
  >
    <polyline points="1.5 5 4 7.5 8.5 2.5" />
  </svg>
);

export default function Sidebar({ step, user, onLogout }) {
  const pct = Math.round(((step - 1) / 3) * 100);
  const initial = (user?.nickname || "?")[0].toUpperCase();

  return (
    <aside className="w-[250px] flex-shrink-0 border-r border-white/5 bg-s1 flex flex-col sticky top-0 h-screen">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <span className="text-[#23C363] text-[20px] font-semibold text-t1 tracking-tight">
            TroubleLog
          </span>
        </div>
      </div>

      {/* Steps */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto">
        <p className="text-[10px] font-semibold text-t3 tracking-widest uppercase px-2 mb-2">
          진행 단계
        </p>
        {STEPS_META.map((s, i) => {
          const n = i + 1;
          const done = n < step;
          const active = n === step;
          return (
            <div key={i}>
              <div
                className={`flex items-start gap-2.5 px-2.5 py-2 rounded-md mb-0.5 transition-colors ${active ? "bg-s2" : ""}`}
              >
                <div
                  className={`
                  w-[22px] h-[22px] rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0 mt-0.5 transition-all
                  ${
                    done
                      ? "bg-accent text-white"
                      : active
                        ? "bg-accent text-white shadow-[0_0_0_4px_var(--gd2)]"
                        : "bg-s3 border border-white/[0.09] text-t3"
                  }
                `}
                >
                  {done ? <CheckIcon /> : n}
                </div>
                <div>
                  <div
                    className={`text-[13px] font-medium leading-snug transition-colors ${active ? "text-t1" : "text-t2"}`}
                  >
                    {s.name}
                  </div>
                  <div className="text-[11px] text-t3 mt-0.5">{s.desc}</div>
                </div>
              </div>
              {i < 3 && (
                <div
                  className={`w-px h-3.5 ml-[21px] mb-0.5 transition-colors ${done ? "bg-accent/40" : "bg-white/5"}`}
                />
              )}
            </div>
          );
        })}
      </nav>

      {/* Progress */}
      <div className="px-5 py-4 border-t border-white/5">
        <div className="flex justify-between text-[11px] text-t3 mb-1.5">
          <span>전체 진행률</span>
          <span>{pct}%</span>
        </div>
        <div className="h-[3px] bg-s3 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-[width] duration-500"
            style={{ width: pct + "%" }}
          />
        </div>
      </div>

      {/* User */}
      <div className="px-5 py-3 border-t border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent to-blue-500 flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-medium text-t1 truncate">
              {user?.nickname}
            </div>
            <div className="text-[10px] text-t3 truncate">{user?.email}</div>
          </div>
          <button
            onClick={onLogout}
            title="로그아웃"
            className="text-t3 p-1 rounded-sm hover:bg-s3 hover:text-t2 transition-colors flex items-center"
          >
            <LogoutIcon />
          </button>
        </div>
      </div>
    </aside>
  );
}
