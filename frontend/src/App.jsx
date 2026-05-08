import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shorten from './pages/Shorten';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/app" element={<Shorten />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics/:code" element={<Analytics />} />
        <Route
          path="*"
          element={
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] gap-4 pt-16">
              <p className="text-5xl font-semibold tracking-tight text-ink">404</p>
              <p className="text-ink-muted">Page not found</p>
            </div>
          }
        />
      </Routes>
    </div>
  );
}
