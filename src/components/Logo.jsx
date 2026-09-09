import LogoIcon from "../assets/images/logo-icon.svg";

export default function Logo() {
  return (
    <div className="flex items-center gap-2 mb-6">
      <img src={LogoIcon} className="w-6 h-6" />
      <span className="text-[#23C360] text-[24px] font-semibold">
        TroubleLog
      </span>
    </div>
  );
}
