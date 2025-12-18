import { useEffect, useState } from 'react'
import './App.css'

/* ----------  CONSTANTS  ---------- */
const SLEEP_GATE_KEY = 'holistic-sleep-gate'
const BREATH_KEY = 'holistic-breath'
const NAP_KEY = 'holistic-nap'
const SAVINGS_KEY = 'holistic-savings'

/* ----------  MAIN APP  ---------- */
function App() {
  /* ----  STATE  ---- */
  const [sleepGate, setSleepGate] = useState(() =>
    JSON.parse(localStorage.getItem(SLEEP_GATE_KEY) || '{"start":"23:30","end":"00:30"}')
  )
  const [savings, setSavings] = useState(() =>
    Number(localStorage.getItem(SAVINGS_KEY) || 0)
  )
  const [breath, setBreath] = useState({ active: false, cycle: 0 })
  const [nap, setNap] = useState({ active: false, sec: 12 * 60 })

  /* ----  PERSIST  ---- */
  useEffect(() => localStorage.setItem(SLEEP_GATE_KEY, JSON.stringify(sleepGate)), [sleepGate])
  useEffect(() => localStorage.setItem(SAVINGS_KEY, savings), [savings])

  /* ----  BREATH TIMER  ---- */
  useEffect(() => {
    if (!breath.active) return
    const t = breath.cycle === 0 ? 4000 : breath.cycle === 1 ? 7000 : 8000
    const id = setTimeout(() => {
      const next = (breath.cycle + 1) % 3
      setBreath({ ...breath, cycle: next })
    }, t)
    return () => clearTimeout(id)
  }, [breath])

  /* ----  NAP COUNTDOWN  ---- */
  useEffect(() => {
    if (!nap.active || nap.sec === 0) return
    const id = setInterval(() => setNap(p => ({ ...p, sec: p.sec - 1 })), 1000)
    return () => clearInterval(id)
  }, [nap])

  /* ----  HANDLERS  ---- */
  const addSaving = (usd) => setSavings(s => s + usd)

  /* ----  UI  ---- */
  return (
    <div className="app">
      <header>
        <h1>Holistic Health</h1>
        <p>Offline-first micro-recovery toolkit</p>
      </header>

      <section className="card">
        <h2>Sleep Gate</h2>
        <label>Start</label>
        <input
          type="time"
          value={sleepGate.start}
          onChange={(e) => setSleepGate({ ...sleepGate, start: e.target.value })}
        />
        <label>End</label>
        <input
          type="time"
          value={sleepGate.end}
          onChange={(e) => setSleepGate({ ...sleepGate, end: e.target.value })}
        />
        <p className="info">
          Aim to be in bed somewhere inside this 60-minute window every night.
        </p>
      </section>

      <section className="card">
        <h2>4-7-8 Breathing</h2>
        <button
          className={breath.active ? 'active' : ''}
          onClick={() => setBreath({ active: !breath.active, cycle: 0 })}
        >
          {breath.active ? 'Stop' : 'Start'}
        </button>
        <div className="cycle">
          {['Inhale 4s', 'Hold 7s', 'Exhale 8s'][breath.cycle]}
        </div>
      </section>

      <section className="card">
        <h2>12-Minute Nap</h2>
        <button
          className={nap.active ? 'active' : ''}
          onClick={() => setNap({ active: !nap.active, sec: 12 * 60 })}
        >
          {nap.active ? 'Cancel' : 'Start'}
        </button>
        <div className="timer">{Math.floor(nap.sec / 60)}:{(nap.sec % 60).toString().padStart(2, '0')}</div>
        {nap.sec === 0 && <p className="info">Wake up — you’re done!</p>}
      </section>

      <section className="card">
        <h2>Money & Sleep Saved</h2>
        <p className="savings">${savings.toFixed(2)} saved</p>
        <div className="buttons">
          <button onClick={() => addSaving(5)}>Skipped latte</button>
          <button onClick={() => addSaving(15)}>Cooked vs. take-out</button>
          <button onClick={() => addSaving(25)}>DIY vs. cleaner</button>
        </div>
        <p className="info">Every $5 ≈ 15 min you don’t have to earn.</p>
      </section>

      <footer>
        <p>Add this page to your home screen — it works offline.</p>
      </footer>
    </div>
  )
}

export default App