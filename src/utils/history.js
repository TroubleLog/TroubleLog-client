export const toISO = (d) =>
  d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')

const hKey = (email) => `tl_h_${email||'guest'}`

export const loadHist = (email) => { try { return JSON.parse(localStorage.getItem(hKey(email))||'{}') } catch { return {} } }
export const saveHist = (email, h) => { try { localStorage.setItem(hKey(email), JSON.stringify(h)) } catch {} }
export const getNickname = (email) => localStorage.getItem(`tl_nk_${email}`) || email.split('@')[0]
export const saveNickname = (email, nick) => localStorage.setItem(`tl_nk_${email}`, nick)

export function seedHist(email) {
  if (localStorage.getItem(hKey(email))) return
  const today = new Date()
  const hist = {}
  for (let i = 0; i < 100; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - Math.floor(Math.random() * 200) - 1)
    const iso = toISO(d)
    hist[iso] = (hist[iso] || 0) + Math.floor(Math.random() * 3) + 1
  }
  saveHist(email, hist)
}