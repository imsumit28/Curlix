import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/landing/Hero';
import Architecture from '../components/landing/Architecture';
import Features from '../components/landing/Features';
import Metrics from '../components/landing/Metrics';
import TechStack from '../components/landing/TechStack';
import BuiltForEngineers from '../components/landing/BuiltForEngineers';
import Footer from '../components/landing/Footer';

export default function Home() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [hash]);

  return (
    <main className="relative">
      <Hero />
      <Metrics />
      <Features />
      <Architecture />
      <BuiltForEngineers />
      <TechStack />
      <Footer />
    </main>
  );
}
