import { useReducer } from 'react'
import { Link } from 'react-router-dom'

interface State { loading: boolean; person: any; error: string }
type Action = { type: 'START' } | { type: 'SUCCESS'; payload: any } | { type: 'FAIL'; payload: string }

const init: State = { loading: false, person: null, error: '' }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'START': return { loading: true, person: null, error: '' }
    case 'SUCCESS': return { loading: false, person: action.payload, error: '' }
    case 'FAIL': return { loading: false, person: null, error: action.payload }
    default: return state
  }
}

export default function UseReducerDemo() {
  const [state, dispatch] = useReducer(reducer, init)

  const getPerson = async () => {
    dispatch({ type: 'START' })
    try {
      const res = await fetch('https://randomuser.me/api/')
      const data = await res.json()
      dispatch({ type: 'SUCCESS', payload: data.results[0] })
    } catch {
      dispatch({ type: 'FAIL', payload: 'Could not fetch person' })
    }
  }

  return (
    <div className="container">
      <Link to="/" className="back-link">&larr; Back to home</Link>
      <div className="card" style={{ textAlign: 'center', maxWidth: 450, margin: '0 auto' }}>
        <h2 className="page-title">useReducer Demo</h2>
        <button className="btn" disabled={state.loading} onClick={getPerson} style={{ padding: '10px 24px', fontSize: 16, marginBottom: 20 }}>
          {state.loading ? 'Loading...' : 'Get Random Person'}
        </button>
        {state.error && <p style={{ color: '#dc2626' }}>{state.error}</p>}
        {state.person && (
          <div>
            <img src={state.person.picture.large} alt="person" style={{ borderRadius: '50%', border: '3px solid #4f46e5' }} />
            <p style={{ fontSize: 18, fontWeight: 600, marginTop: 8 }}>
              {state.person.name.first} {state.person.name.last}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
