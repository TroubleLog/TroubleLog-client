export default function Logo() {
  return (
    <div className="flex items-center gap-2.5 mb-8">
      <div className="w-7 h-7 bg-accent rounded-[7px] flex-shrink-0 flex items-center justify-center">
        <svg
          className="w-[15px] h-[15px] stroke-white fill-none stroke-[2.3] [stroke-linecap:round]"
          viewBox="0 0 16 16"
        >
          <path d="M2 4h12M2 8h8M2 12h5" />
          <circle cx="13" cy="11" r="2.5" />
          <path d="M15 13l1.5 1.5" />
        </svg>
      </div>
      <span className="text-[24px] font-semibold">TroubleLog</span>
    </div>
  );
}
