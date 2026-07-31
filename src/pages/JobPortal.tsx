import { useState } from 'react'
import { Link } from 'react-router-dom'

interface Job {
  id: number; title: string; type: string; description: string; location: string; salary: string
  company: { name: string; description: string; contactEmail: string; contactPhone: string }
}

const initialJobs: Job[] = [
  { id: 1, title: 'Senior React Developer', type: 'Full-Time', description: 'Build and maintain React applications with modern best practices.', location: 'Boston, MA', salary: '$120K - $140K', company: { name: 'Tech Co', description: 'Leading tech company', contactEmail: 'hr@techco.com', contactPhone: '555-0100' } },
  { id: 2, title: 'Front-End Developer (React)', type: 'Full-Time', description: 'Create responsive web applications using React and TypeScript.', location: 'Remote', salary: '$90K - $110K', company: { name: 'WebDev Inc', description: 'Web development agency', contactEmail: 'jobs@webdev.com', contactPhone: '555-0101' } },
  { id: 3, title: 'React Native Developer', type: 'Part-Time', description: 'Develop cross-platform mobile applications with React Native.', location: 'Austin, TX', salary: '$70K - $90K', company: { name: 'Mobile Apps Co', description: 'Mobile first company', contactEmail: 'careers@mobileapps.com', contactPhone: '555-0102' } },
]

export default function JobPortal() {
  const [jobs, setJobs] = useState(initialJobs)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Job | null>(null)
  const [form, setForm] = useState({ title: '', type: 'Full-Time', description: '', location: '', salary: 'Under $50K', companyName: '', companyDescription: '', contactEmail: '', contactPhone: '' })

  const resetForm = () => setForm({ title: '', type: 'Full-Time', description: '', location: '', salary: 'Under $50K', companyName: '', companyDescription: '', contactEmail: '', contactPhone: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) {
      setJobs(jobs.map(j => j.id === editing.id ? { ...j, title: form.title, type: form.type, description: form.description, location: form.location, salary: form.salary, company: { name: form.companyName, description: form.companyDescription, contactEmail: form.contactEmail, contactPhone: form.contactPhone } } : j))
    } else {
      const newJob: Job = { id: Math.max(0, ...jobs.map(j => j.id)) + 1, title: form.title, type: form.type, description: form.description, location: form.location, salary: form.salary, company: { name: form.companyName, description: form.companyDescription, contactEmail: form.contactEmail, contactPhone: form.contactPhone } }
      setJobs([newJob, ...jobs])
    }
    resetForm(); setShowForm(false); setEditing(null)
  }

  const deleteJob = (id: number) => { if (window.confirm('Delete this job?')) setJobs(jobs.filter(j => j.id !== id)) }
  const editJob = (job: Job) => { setEditing(job); setForm({ title: job.title, type: job.type, description: job.description, location: job.location, salary: job.salary, companyName: job.company.name, companyDescription: job.company.description, contactEmail: job.company.contactEmail, contactPhone: job.company.contactPhone }); setShowForm(true) }

  const f = (label: string, key: string, type = 'text', options?: string[]) => (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 14 }}>{label}</label>
      {options ? (
        <select value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={inputStyle} required>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={inputStyle} required />
      )}
    </div>
  )

  return (
    <div className="container">
      <Link to="/" className="back-link">&larr; Back to home</Link>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 className="page-title" style={{ margin: 0 }}>Job Portal</h2>
        <button className="btn" onClick={() => { setShowForm(!showForm); setEditing(null); resetForm() }} style={{ padding: '10px 20px' }}>
          {showForm ? 'Cancel' : 'Add Job'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16 }}>{editing ? 'Edit Job' : 'Add Job'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {f('Job Type', 'type', 'text', ['Full-Time', 'Part-Time', 'Remote', 'Internship'])}
              {f('Job Title', 'title')}
              {f('Location', 'location')}
              {f('Salary', 'salary', 'text', ['Under $50K', '$50K - 60K', '$60K - 70K', '$70K - 80K', '$80K - 90K', '$90K - 100K', '$100K - 125K', '$125K - 150K', '$150K - 175K', '$175K - 200K', 'Over $200K'])}
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 14 }}>Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <h4 style={{ margin: '16px 0 8px' }}>Company Info</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {f('Company Name', 'companyName')}
              {f('Contact Email', 'contactEmail', 'email')}
              {f('Contact Phone', 'contactPhone')}
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 14 }}>Company Description</label>
              <textarea value={form.companyDescription} onChange={e => setForm({ ...form, companyDescription: e.target.value })} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <button type="submit" className="btn" style={{ padding: '10px 24px', marginTop: 8 }}>{editing ? 'Update' : 'Submit'}</button>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {jobs.map(job => (
          <div key={job.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: 8 }}>
              <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 600 }}>{job.type}</span>
            </div>
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>{job.title}</h3>
            <p style={{ color: '#666', fontSize: 14, marginBottom: 8, flex: 1 }}>{job.description}</p>
            <p style={{ color: '#4f46e5', fontWeight: 600, marginBottom: 8 }}>{job.salary}</p>
            <p style={{ fontSize: 13, color: '#888', marginBottom: 12 }}>{job.location} &middot; {job.company.name}</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn" onClick={() => editJob(job)} style={{ background: '#059669', fontSize: 13, padding: '6px 12px' }}>Edit</button>
              <button onClick={() => deleteJob(job.id)} style={{ background: '#dc2626', color: 'white', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 13 }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = { width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }
