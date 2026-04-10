import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CrisisLayout from './components/CrisisLayout';
import Overview from './pages/Overview';
import Incidents from './pages/Incidents';
import ZoneMap from './pages/ZoneMap';
import ResourceInventory from './pages/ResourceInventory';
import VolunteerDashboard from './pages/VolunteerDashboard';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Routes>
        {/* Pages with Sidebar + Topbar layout */}
        <Route path="/"          element={<CrisisLayout><Overview /></CrisisLayout>} />
        <Route path="/incidents" element={<CrisisLayout><Incidents /></CrisisLayout>} />
        <Route path="/resources" element={<CrisisLayout><ResourceInventory /></CrisisLayout>} />
        <Route path="/zone-map"  element={<CrisisLayout><ZoneMap /></CrisisLayout>} />
        <Route path="/volunteer" element={<CrisisLayout><VolunteerDashboard /></CrisisLayout>} />
        <Route path="/settings"  element={<CrisisLayout><Settings /></CrisisLayout>} />

        {/* Standalone auth pages — no layout chrome */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
