import { loadHist, toISO } from '../utils/history'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function GrassCalendar({ email }) {
  const hist = loadHist(email)
  const hSet = new Set(hist)
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const todayISO = toISO(today)

  // Build 52 weeks starting from this week's Sunday
  const thisSun = new Date(today)
  thisSun.setDate(today.getDate() - today.getDay())
  const start = new Date(thisSun)
  start.setDate(start.getDate() - 51 * 7)

  const weeks = []
  for (let w = 0; w < 52; w++) {
    const week = []
    for (let d = 0; d < 7; d++) {
      const dt = new Date(start)
      dt.setDate(start.getDate() + w * 7 + d)
      week.push(dt > today ? null : dt)
    }
    weeks.push(week)
  }

  // Month label positions
  const marks = []; let lastM = -1
  weeks.forEach((wk, wi) => {
    const first = wk.find(d => d !== null)
    if (first) { const m = first.getMonth(); if (m !== lastM) { marks.push({ wi, lbl: MONTHS[m] }); lastM = m } }
  })

  const CT = 14 // cell(11) + gap(3)
  const totalSubs = hist.filter(d => { const dt = new Date(d); return !isNaN(dt) && dt >= start && dt <= today }).length

  return (
    <div className="bg-s1 border border-white/5 rounded-lg p-6 mt-6">
      <div className="flex items-center justify-between mb-5">
        <span className="text-[13px] font-medium text-t1">활동 기록</span>
        <span className="text-[11px] text-t3 font-mono">{totalSubs}회 제출 (최근 1년)</span>
      </div>

      <div className="overflow-x-auto">
        <div style={{ minWidth: 52 * CT }}>
          {/* Month labels */}
          <div className="relative h-[14px] mb-1">
            {marks.map(({ wi, lbl }) => (
              <span key={wi} className="absolute text-[10px] text-t3 font-mono whitespace-nowrap" style={{ left: wi * CT }}>
                {lbl}
              </span>
            ))}
          </div>

          {/* Grid */}
          <div className="flex gap-[3px]">
            {weeks.map((wk, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {wk.map((d, di) => {
                  if (d === null) return <div key={di} className="w-[11px] h-[11px] rounded-[2px] bg-s3 opacity-15" />
                  const iso = toISO(d)
                  const active = hSet.has(iso)
                  const isToday = iso === todayISO
                  return (
                    <div
                      key={di}
                      title={iso}
                      className={`w-[11px] h-[11px] rounded-[2px] transition-opacity ${active ? 'bg-accent hover:opacity-80' : 'bg-s3'}`}
                      style={isToday ? { outline: '2px solid #22C55E', outlineOffset: '1px', borderRadius: '3px' } : {}}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-3 justify-end">
        <span className="text-[10px] text-t3">없음</span>
        <div className="flex gap-[3px]">
          <div className="w-[11px] h-[11px] rounded-[2px] bg-s3" />
          <div className="w-[11px] h-[11px] rounded-[2px] bg-accent opacity-35" />
          <div className="w-[11px] h-[11px] rounded-[2px] bg-accent opacity-65" />
          <div className="w-[11px] h-[11px] rounded-[2px] bg-accent" />
        </div>
        <span className="text-[10px] text-t3">많음</span>
      </div>
    </div>
  )
}
