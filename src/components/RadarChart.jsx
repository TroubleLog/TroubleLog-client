import { useRef, useEffect } from 'react'

export default function RadarChart({ data }) {
  const ref = useRef(null)

  useEffect(() => {
    const cv = ref.current
    if (!cv || !data) return
    const W = 220, H = 200
    cv.width = W; cv.height = H
    const c = cv.getContext('2d')
    const cx = W / 2, cy = H / 2 + 4, R = 72, N = data.length
    const ang = data.map((_, i) => (i / N) * 2 * Math.PI - Math.PI / 2)

    // Grid
    ;[0.25, 0.5, 0.75, 1].forEach(r => {
      c.beginPath()
      ang.forEach((a, i) => {
        const x = cx + Math.cos(a) * R * r, y = cy + Math.sin(a) * R * r
        i === 0 ? c.moveTo(x, y) : c.lineTo(x, y)
      })
      c.closePath(); c.strokeStyle = 'rgba(255,255,255,0.07)'; c.lineWidth = 0.5; c.stroke()
    })
    ang.forEach(a => {
      c.beginPath(); c.moveTo(cx, cy)
      c.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R)
      c.strokeStyle = 'rgba(255,255,255,0.07)'; c.lineWidth = 0.5; c.stroke()
    })

    // Data polygon
    c.beginPath()
    data.forEach((d, i) => {
      const v = d.val / 100, x = cx + Math.cos(ang[i]) * R * v, y = cy + Math.sin(ang[i]) * R * v
      i === 0 ? c.moveTo(x, y) : c.lineTo(x, y)
    })
    c.closePath()
    c.fillStyle = 'rgba(34,197,94,0.18)'; c.fill()
    c.strokeStyle = '#22C55E'; c.lineWidth = 1.5; c.stroke()

    // Dots
    data.forEach((d, i) => {
      const v = d.val / 100, x = cx + Math.cos(ang[i]) * R * v, y = cy + Math.sin(ang[i]) * R * v
      c.beginPath(); c.arc(x, y, 3, 0, 2 * Math.PI)
      c.fillStyle = '#22C55E'; c.fill()
    })

    // Labels
    c.font = '10px Outfit, system-ui'; c.fillStyle = 'rgba(255,255,255,0.4)'; c.textAlign = 'center'
    data.forEach((d, i) => {
      const a = ang[i]
      c.fillText(d.label, cx + Math.cos(a) * (R + 20), cy + Math.sin(a) * (R + 16) + 4)
    })
  }, [data])

  return <canvas ref={ref} width={220} height={200} />
}
