import { useState } from 'react'
import { Link } from 'react-router-dom'

function timeSince(date: string) {
  const today = new Date().getTime()
  const other = new Date(date).getTime()
  const diff = Math.abs(today - other)
  let days = Math.floor(diff / (1000 * 3600 * 24))
  const years = Math.floor(days / 365)
  days -= years * 365
  const months = Math.floor(days / 31)
  days -= months * 31
  return `${years} years, ${months} months, and ${days} days`
}

export default function AgeFinder() {
  const [birthday, setBirthday] = useState('1992-06-21')
  const [newDate, setNewDate] = useState('')
  const [show, setShow] = useState(false)

  return (
    <div className="container">
      <Link to="/" className="back-link">&larr; Back to home</Link>
      <div className="card" style={{ textAlign: 'center', maxWidth: 500, margin: '0 auto' }}>
        <h2 className="page-title">Input Your Birthday!</h2>
        <input
          type="date"
          value={newDate}
          onChange={e => setNewDate(e.target.value)}
          style={{ padding: '8px 12px', fontSize: 16, border: '1px solid #d1d5db', borderRadius: 6, marginRight: 8 }}
        />
        <button className="btn" onClick={() => { setBirthday(newDate); setShow(true) }} style={{ padding: '8px 20px' }}>
          Submit
        </button>
        {show && (
          <div style={{ marginTop: 24, animation: 'fadeIn 2s' }}>
            <h3 style={{ color: '#4f46e5' }}>{birthday}</h3>
            <p style={{ fontSize: 18, marginTop: 8 }}>Congrats on {timeSince(birthday)}!</p>
            <div style={{ fontSize: 64, marginTop: 12 }}>🎉</div>
          </div>
        )}
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </div>
  )
}
