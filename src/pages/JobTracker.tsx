import { useState, createContext, useContext } from 'react'
import { Link } from 'react-router-dom'

interface DashboardCtx { user: string; isDark: boolean; toggleDark: () => void; sidebarOpen: boolean; toggleSidebar: () => void }
const Ctx = createContext<DashboardCtx>({ user: '', isDark: false, toggleDark: () => {}, sidebarOpen: false, toggleSidebar: () => {} })

const links = [
  { text: 'Add Job', icon: '📝' },
  { text: 'All Jobs', icon: '📋' },
  { text: 'Stats', icon: '📊' },
  { text: 'Profile', icon: '👤' },
  { text: 'Admin', icon: '⚙️' },
]

function Navbar() {
  const { toggleDark, isDark, toggleSidebar } = useContext(Ctx)
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', background: isDark ? '#1f2937' : '#4f46e5', color: 'white' }}>
      <button onClick={toggleSidebar} style={{ background: 'none', border: 'none', color: 'white', fontSize: 20, cursor: 'pointer' }}>☰</button>
      <span style={{ fontWeight: 600 }}>JobTracker</span>
      <button onClick={toggleDark} style={{ background: 'none', border: 'none', color: 'white', fontSize: 18, cursor: 'pointer' }}>{isDark ? '☀️' : '🌙'}</button>
    </div>
  )
}

function Sidebar() {
  const { isDark, sidebarOpen, toggleSidebar } = useContext(Ctx)
  if (!sidebarOpen) return null
  return (
    <div style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: 220, background: isDark ? '#111827' : '#1e293b', color: 'white', padding: 20, zIndex: 50 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h3 style={{ fontSize: 18 }}>Menu</h3>
        <button onClick={toggleSidebar} style={{ background: 'none', border: 'none', color: 'white', fontSize: 18, cursor: 'pointer' }}>✕</button>
      </div>
      {links.map(l => (
        <div key={l.text} style={{ padding: '10px 12px', cursor: 'pointer', borderRadius: 6, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>{l.icon}</span><span>{l.text}</span>
        </div>
      ))}
    </div>
  )
}

function PageCard({ title, children }: { title: string; children: React.ReactNode }) {
  const { isDark } = useContext(Ctx)
  return (
    <div className="card" style={{ background: isDark ? '#1f2937' : 'white', color: isDark ? '#e5e7eb' : '#333', marginBottom: 16 }}>
      <h3 style={{ marginBottom: 12, color: isDark ? '#93c5fd' : '#4f46e5' }}>{title}</h3>
      {children}
    </div>
  )
}

function Dashboard() {
  const { isDark } = useContext(Ctx)
  const [activeTab, setActiveTab] = useState(links[0].text)
  const bg = isDark ? '#0f172a' : '#f1f5f9'
  const text = isDark ? '#e5e7eb' : '#333'

  return (
    <div style={{ display: 'flex', borderBottom: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`, marginBottom: 16, gap: 4 }}>
      {links.map(l => (
        <button key={l.text} onClick={() => setActiveTab(l.text)}
          style={{ padding: '8px 16px', border: 'none', background: activeTab === l.text ? bg : 'transparent', color: activeTab === l.text ? '#4f46e5' : text, fontWeight: activeTab === l.text ? 600 : 400, cursor: 'pointer', borderBottom: activeTab === l.text ? `2px solid #4f46e5` : '2px solid transparent', fontSize: 14 }}>
          {l.icon} {l.text}
        </button>
      ))}
    </div>
  )
}

export default function JobTracker() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('darkTheme') === 'true')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleDark = () => { setIsDark(d => { const next = !d; localStorage.setItem('darkTheme', String(next)); return next }) }
  const toggleSidebar = () => setSidebarOpen(s => !s)

  const bg = isDark ? '#0f172a' : '#f1f5f9'
  const text = isDark ? '#e5e7eb' : '#333'

  return (
    <Ctx.Provider value={{ user: 'john', isDark, toggleDark, sidebarOpen, toggleSidebar }}>
      <div style={{ minHeight: '100vh', background: bg, color: text }}>
        <Navbar />
        <Sidebar />
        <div className="container">
          <Link to="/" className="back-link" style={{ color: isDark ? '#93c5fd' : '#4f46e5' }}>&larr; Back to home</Link>
          <Dashboard />
          <PageCard title="Add Job">
            <p style={{ color: isDark ? '#9ca3af' : '#666' }}>Job creation form would appear here. Position, company, location, status fields.</p>
          </PageCard>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <PageCard title="Stats">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, textAlign: 'center' }}>
                <div style={{ background: isDark ? '#374151' : '#e0e7ff', padding: 16, borderRadius: 8 }}><div style={{ fontSize: 24, fontWeight: 700, color: '#4f46e5' }}>12</div><div style={{ fontSize: 13 }}>Applied</div></div>
                <div style={{ background: isDark ? '#374151' : '#d1fae5', padding: 16, borderRadius: 8 }}><div style={{ fontSize: 24, fontWeight: 700, color: '#059669' }}>5</div><div style={{ fontSize: 13 }}>Interview</div></div>
                <div style={{ background: isDark ? '#374151' : '#fef3c7', padding: 16, borderRadius: 8 }}><div style={{ fontSize: 24, fontWeight: 700, color: '#d97706' }}>3</div><div style={{ fontSize: 13 }}>Offers</div></div>
              </div>
            </PageCard>
            <PageCard title="All Jobs">
              <div style={{ fontSize: 14, color: isDark ? '#9ca3af' : '#666' }}>
                {['Frontend Dev - Google', 'React Dev - Meta', 'Full Stack - Amazon'].map(j => <div key={j} style={{ padding: '8px 0', borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`, display: 'flex', justifyContent: 'space-between' }}><span>{j}</span><span style={{ color: '#4f46e5' }}>Applied</span></div>)}
              </div>
            </PageCard>
          </div>
        </div>
      </div>
    </Ctx.Provider>
  )
}
