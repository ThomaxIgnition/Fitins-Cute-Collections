import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Sparkles, HelpCircle, Star, Quote } from 'lucide-react';

export const FounderPage: React.FC = () => {
  const navigate = useNavigate();
  const { blogPosts, founderProfile } = useStore();

  const founderPosts = blogPosts.filter(p => p.author_name.toLowerCase().includes(founderProfile.name.toLowerCase().split(' ')[0]));

  return (
    <div id="founder-page" className="bg-brand-beige min-h-screen py-12 px-4 md:px-8">
      <div className="mx-auto max-w-5xl bg-white border border-brand-light-gray p-6 md:p-12">
        
        {/* TOP LAYOUT: Split Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Column 1: Dramatic portrait alignment (5 cols) */}
          <div className="lg:col-span-5 bg-brand-beige border border-brand-light-gray relative aspect-[3/4]">
            <img 
              src={founderProfile.profile_image_url} 
              alt={`${founderProfile.name}, Founder of Fitins & Cute Collections`} 
              className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-[1000ms]"
              referrerPolicy="no-referrer"
            />
            {/* Elegant overlay badge */}
            <div className="absolute bottom-4 left-4 right-4 bg-brand-charcoal text-white p-3 text-center border border-brand-gold/30">
              <span className="font-serif text-[0.65rem] tracking-[0.25em] uppercase text-brand-gold font-bold block mb-0.5">
                {founderProfile.name.toUpperCase()}
              </span>
              <span className="font-sans text-[0.55rem] tracking-widest text-white/70 uppercase">
                FOUNDER & CHIEF STYLE DIRECTOR
              </span>
            </div>
          </div>

          {/* Column 2: Narrative autobiography (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-brand-gold font-semibold mb-2">
              THE VISIONARY BEHIND THE CURATIONS
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-light text-brand-charcoal mb-6 leading-tight">
              About {founderProfile.name}
            </h1>

            {/* Pull Quote */}
            <div className="border-l-2 border-brand-gold pl-4 py-1.5 mb-6 text-brand-charcoal">
              <Quote className="h-5 w-5 text-brand-gold mb-2" />
              <p className="font-serif text-base italic leading-relaxed font-light text-[#555555]">
                "{founderProfile.quote}"
              </p>
            </div>

            <div className="flex flex-col gap-4 font-serif text-sm text-brand-gray leading-relaxed font-light">
              {founderProfile.bio.split('\n\n').map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

          </div>

        </div>

        {/* MIDDLE LAYOUT: Brand Mission & Statement */}
        <div className="border-t border-brand-light-gray grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-12 text-left">
          
          <div className="bg-brand-beige p-6 border border-brand-light-gray flex flex-col gap-3">
            <Sparkles className="h-6 w-6 text-brand-gold shrink-0SB" />
            <h3 className="font-serif text-lg font-bold text-brand-charcoal">Cultural Integrity</h3>
            <p className="font-serif text-xs text-brand-gray leading-relaxed font-light">
              We reject generic modern visual formats. Our collections take immense pride in elevating Nigerian cashmere agbadas, Senegalese traditional trims, and custom geometric Yoruba embroidery alongside clean European tailoring.
            </p>
          </div>

          <div className="bg-brand-beige p-6 border border-brand-light-gray flex flex-col gap-3">
            <div className="h-6 w-6 font-bold text-brand-gold border border-brand-gold rounded-full flex items-center justify-center font-serif">A</div>
            <h3 className="font-serif text-lg font-bold text-brand-charcoal">Raw Materials</h3>
            <p className="font-serif text-xs text-brand-gray leading-relaxed font-light">
              We source strictly. From grade 6A mulberry silk to double-drawn, cuticle-aligned raw Vietnamese hair, our raw materials represent physical longevity and unparalleled tactile response.
            </p>
          </div>

          <div className="bg-brand-beige p-6 border border-brand-light-gray flex flex-col gap-3">
            <div className="text-brand-gold"><Quote className="h-6 w-6" /></div>
            <h3 className="font-serif text-lg font-bold text-brand-charcoal">Independent Curation</h3>
            <p className="font-serif text-xs text-brand-gray leading-relaxed font-light">
              We release items in micro-batches or bespoke commissions. We deliberately maintain low stocks to prevent overproduction, preserving structural rarity for every single collector.
            </p>
          </div>

        </div>

        {/* GALLERIES: Beautiful editorial moodboard */}
        <div className="border-t border-brand-light-gray mt-16 pt-12 text-left">
          <h3 className="font-serif text-xl font-bold tracking-wide text-brand-charcoal mb-6">
            The Atelier Moodboard
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 aspect-[16/6] min-h-[220px]">
            <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=400" alt="Mood 1" className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
            <img src="https://images.unsplash.com/photo-1595959183077-51578557b7f5?auto=format&fit=crop&q=80&w=400" alt="Mood 2" className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
            <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=400" alt="Mood 3" className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
            <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400" alt="Mood 4" className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
          </div>
        </div>

        {/* ESSAYS LIST: Written by her */}
        {founderPosts.length > 0 && (
          <div className="border-t border-brand-light-gray mt-16 pt-12 text-left">
            <h3 className="font-serif text-xl font-bold tracking-wide text-brand-charcoal mb-6">
              Essays Penned By {founderProfile.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {founderPosts.map(post => (
                <div 
                  key={post.id} 
                  onClick={() => navigate('/fashion-lifestyle')}
                  className="clickable p-4 border border-brand-light-gray hover:border-brand-gold bg-brand-beige/20 flex gap-4 cursor-pointer"
                >
                  <img src={post.image} alt={post.title} className="h-20 w-20 object-cover shrink-0" referrerPolicy="no-referrer" />
                  <div className="flex flex-col justify-center">
                    <span className="font-mono text-[0.55rem] text-brand-gold block font-semibold uppercase">{post.category}</span>
                    <h4 className="font-serif text-sm font-bold text-brand-charcoal mt-1 line-clamp-1">{post.title}</h4>
                    <p className="font-serif text-xs text-brand-gray/80 line-clamp-2 mt-1 leading-snug">{post.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
