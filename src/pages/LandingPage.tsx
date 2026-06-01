import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div 
      id="brand-landing-page"
      className="min-h-screen bg-brand-beige flex flex-col justify-between"
    >
      {/* LANDING HEADER: Pure elegant brand introduction */}
      <header className="p-6 md:p-8 flex justify-center">
        <Logo variant="wordmark" className="scale-110" />
      </header>

      {/* HERO SECTION: Highly Visual Editorial Split Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6">
        
        {/* Left Side: Dramatic Typography & Statement */}
        <div className="lg:col-span-5 flex flex-col justify-center text-left py-4">
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-brand-gold font-semibold mb-3">
            FUMILAYO THOMAS PRESENTS
          </span>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-none text-brand-charcoal font-light tracking-tight">
            Elevate Your Style.<br />
            Define Your <span className="italic font-medium">Identity.</span>
          </h1>
          <p className="font-serif text-base md:text-lg text-brand-gray mt-6 max-w-md font-light leading-relaxed">
            Premium hand-styled raw human hair, avant-garde women's sets, and traditional men's cashmere tailoring curated for modern international elegance.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-4 mt-8">
            <button 
              id="btn-enter-store"
              onClick={() => navigate('/home')}
              className="clickable bg-brand-charcoal hover:bg-brand-gray text-white font-sans text-xs uppercase tracking-[0.2em] py-4 px-8 font-semibold transition-all border border-brand-charcoal shadow-sm"
            >
              Enter Store
            </button>
            <button
              id="btn-explore-journal"
              onClick={() => navigate('/fashion-lifestyle')}
              className="clickable bg-transparent hover:bg-brand-charcoal hover:text-white text-brand-charcoal font-sans text-xs uppercase tracking-[0.2em] py-4 px-6 font-semibold transition-all border border-brand-charcoal"
            >
              Explore Journal
            </button>
          </div>

          {/* Brand highlights footer */}
          <div className="grid grid-cols-3 gap-4 border-t border-brand-light-gray mt-12 pt-6 font-mono text-[0.65rem] text-brand-gray">
            <div>
              <span className="text-brand-gold font-bold block mb-1">RAW HAIR</span>
              100% Single Donor
            </div>
            <div>
              <span className="text-brand-gold font-bold block mb-1">TAILORING</span>
              Cashmere & Silk
            </div>
            <div>
              <span className="text-brand-gold font-bold block mb-1">SHIPPING</span>
              Global Concierge
            </div>
          </div>
        </div>

        {/* Right Side: Editorial Curated Image Mosaic (Strictly No animations) */}
        <div className="lg:col-span-7 grid grid-cols-12 gap-4 h-[75vh] max-h-[650px]">
          
          <div className="col-span-7 bg-brand-charcoal relative overflow-hidden shadow-md">
            <img 
              src="https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800" 
              alt="Luxury Hair Integrations" 
              className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-700" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm py-1.5 px-3 border border-brand-light-gray">
              <span className="font-serif text-[0.7rem] uppercase tracking-widest text-brand-charcoal font-bold">THE WIG GALLERY</span>
            </div>
          </div>

          <div className="col-span-5 grid grid-rows-2 gap-4 h-full">
            <div className="bg-brand-charcoal relative overflow-hidden shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=800" 
                alt="Women Luxury Wear" 
                className="w-full h-full object-cover object-center" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm py-1 px-2.5 border border-brand-light-gray">
                <span className="font-serif text-[0.65rem] uppercase tracking-widest text-brand-charcoal font-bold">COUTURE</span>
              </div>
            </div>
            <div className="bg-brand-charcoal relative overflow-hidden shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800" 
                alt="Men Traditional Tailoring" 
                className="w-full h-full object-cover object-center" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm py-1 px-2.5 border border-brand-light-gray">
                <span className="font-serif text-[0.65rem] uppercase tracking-widest text-brand-charcoal font-bold">TRADITIONAL TRIMS</span>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* LANDING FOOTER */}
      <footer className="p-6 text-center border-t border-brand-light-gray/60 bg-white/20">
        <span className="font-sans text-[0.65rem] tracking-[0.3em] uppercase text-brand-gray">
          FITINS & CUTE COLLECTIONS • WORLDWIDE COUTURE LANUCH • EST. 2026
        </span>
      </footer>
    </div>
  );
};
