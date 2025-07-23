import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Layout from './pages/Layout'
import CreateMap from './pages/CreateMap'
import SiteLocationSelector from './pages/SiteLocationSelector'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-map" element={<CreateMap/>} />
        </Route>
        
        <Route path="/site-location-selector" element={<SiteLocationSelector />} />

      </Routes>
    </Router>
  )
}

export default App
