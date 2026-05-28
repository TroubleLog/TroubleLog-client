import RadarChart    from '../components/RadarChart'
import GrassCalendar from '../components/GrassCalendar'

function parseMd(text) {
  if (!text) return ''
  return text
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/```[\s\S]*?```/g, m => `<pre class="bg-s2 border border-white/[0.09] rounded-md p-4 text-xs font-mono overflow-x-auto my-3 leading-7 text-emerald-300 whitespace-pre-wrap">${m.slice(3,-3).replace(/^[a-z]*\n/,'')}</pre>`)
    .replace(/`([^`]+)`/g, '<code class="font-mono text-[11.5px] bg-s3 px-1.5 py-0.5 rounded text-emerald-300">$1</code>')
    .replace(/^## (.+)$/gm, '<h2 class="text-[11px] font-semibold text-t3 uppercase tracking-[1.2px] mt-6 mb-2 pb-1.5 border-b border-white/5 first:mt-0">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-t1 font-medium">$1</strong>')
    .replace(/^- (.+)$/gm, '<li class="mb-1 text-t2">$1</li>')
    .replace(/(<li[\s\S]*?<\/li>\n?)+/g, m => `<ul class="pl-5 mb-3">${m}</ul>`)
    .replace(/\n\n+/g, '</p><p class="mb-3 text-t2">').replace(/\n/g, '<br>')
}

export default function Step4Report({ report, radar, user, onRestart }) {
  const copyReport = () => {
    navigator.clipboard.writeText(report).catch(() => {})
  }

  return (
    <div className="animate-fade-up">
      {/* Success Banner */}
      <div className="bg-[var(--gd)] border border-accent/20 rounded-lg px-6 py-5 flex items-center gap-3.5 mb-6 animate-fade-up">
        <div className="w-9 h-9 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-[18px] h-[18px] stroke-white fill-none stroke-[2.5] [stroke-linecap:round] [stroke-linejoin:round]" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <div>
          <strong className="block text-[14px] font-medium text-t1 mb-0.5">리포트 생성 완료</strong>
          <span className="text-[12px] text-t2">오늘의 면접 세션이 완료되었습니다.</span>
        </div>
      </div>

      {/* Radar */}
      <div className="mb-2">
        <span className="sec-tag">
          <svg className="w-3 h-3 stroke-current fill-none stroke-2" viewBox="0 0 16 16">
            <path d="M8 2l1.5 4.5H14l-3.5 2.5 1.5 4.5L8 11l-4 2.5 1.5-4.5L2 6.5h4.5z"/>
          </svg>
          역량 분석
        </span>
        <h2 className="sec-title">역량 레이더 차트</h2>
      </div>

      <div className="bg-s1 border border-white/5 rounded-lg p-6 mb-4 flex gap-8 items-center">
        <div className="flex-shrink-0">
          <RadarChart data={radar} />
        </div>
        <div className="flex-1 flex flex-col gap-2.5">
          {(radar || []).map((d) => (
            <div key={d.label} className="flex items-center gap-2.5">
              <span className="text-[12px] text-t2 w-[72px] flex-shrink-0">{d.label}</span>
              <div className="flex-1 h-[3px] bg-s3 rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full transition-[width] duration-1000" style={{ width: d.val + '%' }} />
              </div>
              <span className="text-[11px] text-t3 font-mono w-9 text-right">{d.val}점</span>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-white/5 my-6" />

      {/* Report */}
      <div className="flex items-center justify-between mb-5">
        <span className="sec-tag" style={{ margin: 0 }}>
          <svg className="w-3 h-3 stroke-current fill-none stroke-2" viewBox="0 0 16 16">
            <path d="M3 2h10v12H3zM6 6h4M6 9h4M6 12h2"/>
          </svg>
          트러블슈팅 리포트
        </span>
        <button
          onClick={copyReport}
          className="flex items-center gap-1.5 text-[12px] text-t2 bg-s2 border border-white/[0.09] rounded-md px-3.5 py-1.5 cursor-pointer hover:bg-s3 hover:text-t1 transition-colors"
        >
          <svg className="w-[13px] h-[13px] stroke-current fill-none stroke-2 [stroke-linecap:round]" viewBox="0 0 16 16">
            <rect x="5" y="5" width="9" height="9" rx="1"/>
            <path d="M3 11H2a1 1 0 01-1-1V2a1 1 0 011-1h8a1 1 0 011 1v1"/>
          </svg>
          마크다운 복사
        </button>
      </div>

      <div className="bg-s1 border border-white/5 rounded-lg p-6">
        <div
          className="text-[13.5px] leading-[1.8] text-t2"
          dangerouslySetInnerHTML={{ __html: '<p class="mb-3 text-t2">' + parseMd(report) + '</p>' }}
        />
      </div>

      {/* Grass */}
      <GrassCalendar email={user?.email} />

      {/* Restart */}
      <div className="mt-6">
        <button className="btn-ghost w-full" onClick={onRestart}>↩ 새 코드로 다시 시작</button>
      </div>
    </div>
  )
}
