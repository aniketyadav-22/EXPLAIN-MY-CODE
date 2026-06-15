import Navbar from './Navbar';
import ParticleBackground from './ParticleBackground';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-dark-950 bg-mesh relative">
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
}
