import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AgeFinder from './pages/AgeFinder'
import ContextDemo from './pages/ContextDemo'
import UseReducerDemo from './pages/UseReducerDemo'
import JobPortal from './pages/JobPortal'
import JobTracker from './pages/JobTracker'
import TeamAvengers from './pages/TeamAvengers'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/age-finder" element={<AgeFinder />} />
      <Route path="/context-demo" element={<ContextDemo />} />
      <Route path="/use-reducer-demo" element={<UseReducerDemo />} />
      <Route path="/job-portal" element={<JobPortal />} />
      <Route path="/job-tracker" element={<JobTracker />} />
      <Route path="/team-avengers" element={<TeamAvengers />} />
    </Routes>
  )
}
