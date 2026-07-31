import { createContext, useContext, useReducer } from 'react'
import { Link } from 'react-router-dom'

interface Character { id: number; name: string; strength: number; intelligence: number; speed: number }

const ALL_CHARACTERS: Character[] = [
  { id: 0, name: 'Superman', strength: 10, intelligence: 7, speed: 9 },
  { id: 1, name: 'Batman', strength: 7, intelligence: 10, speed: 6 },
  { id: 2, name: 'Wonderwoman', strength: 5, intelligence: 9, speed: 7 },
  { id: 3, name: 'Blackpanther', strength: 5, intelligence: 6, speed: 10 },
  { id: 4, name: 'Green Lantern', strength: 7, intelligence: 8, speed: 7 },
  { id: 5, name: 'Aquaman', strength: 8, intelligence: 7, speed: 8 },
  { id: 6, name: 'Captain America', strength: 9, intelligence: 8, speed: 6 },
  { id: 7, name: 'Green Arrow', strength: 5, intelligence: 9, speed: 7 },
  { id: 8, name: 'Hawkman', strength: 5, intelligence: 8, speed: 8 },
  { id: 9, name: 'Ironman', strength: 10, intelligence: 9, speed: 7 },
]

type Action = { type: 'ADD'; id: number } | { type: 'REMOVE'; id: number }

function squadReducer(heroes: Character[], action: Action): Character[] {
  switch (action.type) {
    case 'ADD':
      const char = ALL_CHARACTERS.find(c => c.id === action.id)
      return char ? [...heroes, char] : heroes
    case 'REMOVE':
      return heroes.filter(h => h.id !== action.id)
    default:
      return heroes
  }
}

function availableReducer(characters: Character[], action: Action): Character[] {
  switch (action.type) {
    case 'ADD':
      return characters.filter(c => c.id !== action.id)
    case 'REMOVE':
      const char = ALL_CHARACTERS.find(c => c.id === action.id)
      return char ? [...characters, char] : characters
    default:
      return characters
  }
}

const SquadCtx = createContext<{ heroes: Character[]; dispatch: React.Dispatch<Action> }>({ heroes: [], dispatch: () => {} })
const AvailCtx = createContext<{ available: Character[]; dispatch: React.Dispatch<Action> }>({ available: [], dispatch: () => {} })

function CharacterList() {
  const { available, dispatch } = useContext(AvailCtx)
  return (
    <div>
      <h4 style={{ marginBottom: 8 }}>Available Characters</h4>
      <ul style={{ listStyle: 'none' }}>
        {available.map(c => (
          <li key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#f9fafb', borderRadius: 6, marginBottom: 4 }}>
            <span>{c.name}</span>
            <span style={{ cursor: 'pointer', color: '#059669', fontWeight: 700, fontSize: 18 }} onClick={() => dispatch({ type: 'ADD', id: c.id })}>+</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function HeroList() {
  const { heroes, dispatch } = useContext(SquadCtx)
  return (
    <div>
      <h4 style={{ marginBottom: 8 }}>Your Hero Squad</h4>
      {heroes.length === 0 ? <p style={{ color: '#9ca3af', fontSize: 14 }}>No heroes added yet</p> : (
        <ul style={{ listStyle: 'none' }}>
          {heroes.map(h => (
            <li key={h.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#fef3c7', borderRadius: 6, marginBottom: 4 }}>
              <span>{h.name}</span>
              <span style={{ cursor: 'pointer', color: '#dc2626', fontWeight: 700 }} onClick={() => dispatch({ type: 'REMOVE', id: h.id })}>x</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function SquadStats() {
  const { heroes } = useContext(SquadCtx)
  const sum = (key: 'strength' | 'intelligence' | 'speed') => heroes.reduce((a, h) => a + h[key], 0)
  return (
    <div>
      <h4 style={{ marginBottom: 8 }}>Squad Stats</h4>
      <ul style={{ listStyle: 'none' }}>
        <li style={{ padding: '8px 12px', background: '#e0e7ff', borderRadius: 6, marginBottom: 4 }}><b>Strength:</b> {sum('strength')}</li>
        <li style={{ padding: '8px 12px', background: '#d1fae5', borderRadius: 6, marginBottom: 4 }}><b>Intelligence:</b> {sum('intelligence')}</li>
        <li style={{ padding: '8px 12px', background: '#fef3c7', borderRadius: 6, marginBottom: 4 }}><b>Speed:</b> {sum('speed')}</li>
      </ul>
    </div>
  )
}

export default function TeamAvengers() {
  const [heroes, dispatch] = useReducer(squadReducer, [])
  const [available, availDispatch] = useReducer(availableReducer, ALL_CHARACTERS)

  const wrappedAvailDispatch = (action: Action) => { dispatch(action); availDispatch(action) }
  const wrappedHeroDispatch = (action: Action) => { dispatch(action); availDispatch(action) }

  return (
    <SquadCtx.Provider value={{ heroes, dispatch: wrappedHeroDispatch }}>
      <AvailCtx.Provider value={{ available, dispatch: wrappedAvailDispatch }}>
        <div className="container">
          <Link to="/" className="back-link">&larr; Back to home</Link>
          <div className="card">
            <h2 className="page-title" style={{ textAlign: 'center' }}>Team Avengers</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginTop: 16 }}>
              <CharacterList />
              <HeroList />
              <SquadStats />
            </div>
          </div>
        </div>
      </AvailCtx.Provider>
    </SquadCtx.Provider>
  )
}
