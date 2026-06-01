import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Logo } from './Logo';
import { Mail, Check, AlertCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const { subscribeNewsletter } = useStore();
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState({ text: '', isError: false });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg({ text: '', isError: false });
    const res = subscribeNewsletter(email);
    if (res.success) {
      setMsg({ text: res.message, isError: false });
      setEmail('');
    } else {
      setMsg({ text: res.message, isError: true });
    }
  };

  return (
    <footer id="fc-footer" className="bg-brand-charcoal text-white pt-16 pb-8 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-white/10">
          
          {/* COLUMN 1: Brand Pitch */}
          <div className="flex flex-col gap-6">
            {/* White Logo variant for dark background */}
            <div className="clickable flex items-center gap-3" onClick={() => navigate('/home')}>
              <svg 
                className="h-9 w-9 text-brand-gold shrink-0"
                viewBox="0 0 100 100" 
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M25 20 H75 V26 H60 V45 H75 V51 H60 V80 H52 V51 H35 V80 H27 V20 M35 45 H52 V26 H35 V45 Z" 
                  fillRule="evenodd" 
                  clipRule="evenodd"
                />
                <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3" />
                <path d="M47 8 L50 4 L53 8 Z" fill="currentColor" />
              </svg>
              <div className="flex flex-col text-left">
                <span className="font-serif text-lg md:text-xl tracking-[0.18em] font-semibold text-white leading-none">
                  FITINS & CUTE
                </span>
                <span className="font-sans text-[0.6rem] md:text-[0.65rem] tracking-[0.35em] text-brand-gold uppercase font-medium mt-1">
                  COLLECTIONS
                </span>
              </div>
            </div>

            <p className="font-serif text-sm text-brand-beige/70 font-light leading-relaxed">
              Curating raw structural elegance in human hair integrations, together with avant-garde African traditional weaves and editorial lifestyle silhouettes. Founded by Fumilayo Thomas.
            </p>
            <div className="flex flex-col text-xs font-mono text-brand-gold gap-1">
              <span>FOUNDER: FUMILAYO THOMAS</span>
              <span>LAGOS • LONDON • NEW YORK</span>
            </div>
          </div>

          {/* COLUMN 2: Collections Shortcuts */}
          <div className="flex flex-col gap-4">
            <h4 className="font-sans text-xs tracking-[0.25em] uppercase font-bold text-brand-gold">Shopping Portals</h4>
            <div className="flex flex-col gap-3 font-sans text-xs text-brand-beige/70">
              <span onClick={() => navigate('/home?category=hair')} className="clickable hover:text-brand-gold hover:underline">Premium Hair Integrations</span>
              <span onClick={() => navigate('/home?category=hair&subcategory=Wigs')} className="clickable hover:text-brand-gold hover:underline">HD Frontal Wigs</span>
              <span onClick={() => navigate('/home?category=women')} className="clickable hover:text-brand-gold hover:underline">Women's Couture Sets</span>
              <span onClick={() => navigate('/home?category=men')} className="clickable hover:text-brand-gold hover:underline">Men's Traditional Agbada</span>
              <span onClick={() => navigate('/home')} className="clickable hover:text-brand-gold hover:underline">Custom Luxury Accessories</span>
            </div>
          </div>

          {/* COLUMN 3: Company Philosophy */}
          <div className="flex flex-col gap-4">
            <h4 className="font-sans text-xs tracking-[0.25em] uppercase font-bold text-brand-gold">The House</h4>
            <div className="flex flex-col gap-3 font-sans text-xs text-brand-beige/70">
              <span onClick={() => navigate('/founder')} className="clickable hover:text-brand-gold hover:underline">Our Founder biography</span>
              <span onClick={() => navigate('/fashion-lifestyle')} className="clickable hover:text-brand-gold hover:underline">Fashion & Lifestyle Journal</span>
              <span className="clickable hover:text-brand-gold">Global Order Concierge</span>
              <span className="clickable hover:text-brand-gold">VIP Personal Atelier</span>
              <span className="clickable hover:text-brand-gold">Intellectual Property</span>
            </div>
          </div>

          {/* COLUMN 4: Newsletter */}
          <div className="flex flex-col gap-4">
            <h4 className="font-sans text-xs tracking-[0.25em] uppercase font-bold text-brand-gold">The Inner Circle</h4>
            <p className="font-serif text-sm text-brand-beige/70 font-light leading-relaxed">
              Subscribe to obtain priority updates on limited-run hair batches, editorial collections, and design essays.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col gap-2 mt-2">
              <div className="flex border border-white/20 hover:border-brand-gold transition-colors">
                <input 
                  type="email" 
                  placeholder="Enter email Address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border-none outline-none text-xs p-3 font-sans font-light placeholder-white/30 text-white"
                  required
                />
                <button type="submit" className="clickable bg-brand-gold hover:bg-brand-gold-dark text-brand-charcoal p-3 flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4" />
                </button>
              </div>

              {msg.text && (
                <div className={`text-[0.7rem] font-medium p-1.5 flex items-center gap-1 mt-1 ${msg.isError ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {msg.isError ? <AlertCircle className="h-3 w-3 inline" /> : <Check className="h-3 w-3 inline" />}
                  {msg.text}
                </div>
              )}
            </form>
          </div>

        </div>

        {/* BOTTOM: Socials and legal */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-brand-beige/40 gap-4">
          <div className="font-mono">
            © 2026 FITINS & CUTE COLLECTIONS. COUTURE RESERVED.
          </div>
          <div className="flex gap-6 font-sans">
            <span className="clickable hover:text-white">Instagram</span>
            <span className="clickable hover:text-white">Pinterest</span>
            <span className="clickable hover:text-white">Editorial Press</span>
            <span className="clickable hover:text-white">Privacy Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
