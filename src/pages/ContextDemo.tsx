import { createContext, useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const ThemeContext = createContext<{ theme: string; toggleTheme: () => void }>({ theme: 'white', toggleTheme: () => {} })
const LangContext = createContext<{ lang: string; toggleLang: () => void }>({ lang: 'en', toggleLang: () => {} })

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'white')
  const toggleTheme = () => setTheme(t => t === 'white' ? 'dark' : 'white')
  useEffect(() => { localStorage.setItem('theme', theme) }, [theme])
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState('en')
  const toggleLang = () => setLang(l => l === 'en' ? 'us' : 'en')
  return <LangContext.Provider value={{ lang, toggleLang }}>{children}</LangContext.Provider>
}

function Section({ name, showLang = true }: { name: string; showLang?: boolean }) {
  const { theme, toggleTheme } = useContext(ThemeContext)
  const { lang, toggleLang } = useContext(LangContext)
  return (
    <div style={{ marginBottom: 16 }}>
      <h3 style={{ marginBottom: 4 }}>{name}</h3>
      <p>Theme: {theme}</p>
      {showLang && <p>Language: {lang}</p>}
      <button className="btn" onClick={toggleTheme} style={{ marginRight: 8, marginTop: 4 }}>Toggle Theme</button>
      {showLang && <button className="btn" onClick={toggleLang} style={{ marginTop: 4 }}>Toggle Lang</button>}
    </div>
  )
}

export default function ContextDemo() {
  const { theme } = useContext(ThemeContext)
  return (
    <ThemeProvider>
      <LangProvider>
        <Inner theme={theme} />
      </LangProvider>
    </ThemeProvider>
  )
}

function Inner({ theme }: { theme: string }) {
  return (
    <div className="container" style={{ minHeight: '100vh', background: theme === 'dark' ? '#111' : '#f5f5f5', color: theme === 'dark' ? '#fff' : '#333' }}>
      <Link to="/" className="back-link" style={{ color: theme === 'dark' ? '#93c5fd' : '#4f46e5' }}>&larr; Back to home</Link>
      <div className="card" style={{ background: theme === 'dark' ? '#222' : 'white', color: theme === 'dark' ? '#fff' : '#333', maxWidth: 500, margin: '0 auto' }}>
        <h2 className="page-title">Context API Demo</h2>
        <p style={{ marginBottom: 20, color: theme === 'dark' ? '#aaa' : '#666' }}>
          Theme and Language contexts shared across header, main, and footer
        </p>
        <Section name="Header" />
        <hr style={{ margin: '16px 0', borderColor: theme === 'dark' ? '#444' : '#e5e7eb' }} />
        <Section name="Main" />
        <hr style={{ margin: '16px 0', borderColor: theme === 'dark' ? '#444' : '#e5e7eb' }} />
        <Section name="Footer" showLang={false} />
      </div>
    </div>
  )
}
