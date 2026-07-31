import { Link } from 'react-router-dom'

const demos = [
  { path: '/age-finder', title: 'Age Finder', desc: 'Birthday age calculator with celebration graphic' },
  { path: '/context-demo', title: 'Context API Demo', desc: 'Theme (dark/light) and language context with localStorage' },
  { path: '/use-reducer-demo', title: 'useReducer Demo', desc: 'Fetch random user data with useReducer state management' },
  { path: '/job-portal', title: 'Job Portal', desc: 'Job board with listings, add, edit, and delete' },
  { path: '/job-tracker', title: 'Job Tracker', desc: 'Dashboard with sidebar, dark mode toggle, and routing' },
  { path: '/team-avengers', title: 'Team Avengers', desc: 'Avengers squad builder with stats (useReducer + context)' },
]

export default function Home() {
  return (
    <div className="container">
      <div style={{ textAlign: 'center', marginTop: 40, marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#1f2937' }}>React Practice Demos</h1>
        <p style={{ color: '#666', marginTop: 8, fontSize: 16 }}>
          All React learning projects consolidated into one app
        </p>
      </div>
      <div className="demo-grid">
        {demos.map(d => (
          <Link to={d.path} key={d.path} className="demo-card" style={{ display: 'block' }}>
            <h3>{d.title}</h3>
            <p>{d.desc}</p>
            <span className="btn">Open Demo</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
