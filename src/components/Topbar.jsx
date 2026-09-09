import { STEPS_META } from "../data/serviceData";

export default function Topbar({ step, user }) {
  return (
    <div className="h-[63px] border-b border-white/5 bg-s1 flex items-center justify-between px-8 sticky top-0 z-50">
      <div className="text-[13px] text-t3">
        TroubleLog /{" "}
        <span className="text-t2 font-medium">
          {STEPS_META[step - 1]?.name}
        </span>
      </div>
      <div className="flex items-center gap-2.5">
        <span className="text-[11px] text-t2 bg-s2 border border-white/[0.09] rounded-sm px-2.5 py-[3px]">
          Step {step} / 4
        </span>
        {user?.nickname && (
          <span className="text-[11px] text-t2 bg-s2 border border-white/[0.09] rounded-sm px-2.5 py-[3px]">
            {user.nickname}
          </span>
        )}
      </div>
    </div>
  );
}
