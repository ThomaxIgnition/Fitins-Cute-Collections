import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { BlogPost, Product } from '../types';
import { Search, MessageSquare, Clock, ArrowLeft, Star, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const BlogPage: React.FC = () => {
  const navigate = useNavigate();
  const { blogPosts, comments, addComment, products, addToCart } = useStore();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Comment form states
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentSuccess, setCommentSuccess] = useState('');

  const handleBackToJournal = () => {
    setSelectedPost(null);
    setCommentSuccess('');
    window.scrollTo({ top: 0 });
  };

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
    setCommentSuccess('');
    window.scrollTo({ top: 0 });
  };

  const handleCommentSubmit = (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    if (!commentName || !commentEmail || !commentText) return;

    addComment(postId, commentName, commentEmail, commentText);
    setCommentSuccess('Your luxury commentary has been published instantaneously!');
    setCommentName('');
    setCommentEmail('');
    setCommentText('');

    setTimeout(() => {
      setCommentSuccess('');
    }, 4000);
  };

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(blogPosts.map(p => p.category)))];

  // Filters posts
  const filteredPosts = blogPosts.filter(post => {
    const matchesCat = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Calculate related products for a selected article
  const getRelatedCollectionProducts = (category: string): Product[] => {
    const lowerCat = category.toLowerCase();
    if (lowerCat.includes('hair')) {
      return products.filter(p => p.main_category === 'hair').slice(0, 2);
    }
    if (lowerCat.includes('fashion') || lowerCat.includes('style')) {
      return products.filter(p => p.main_category === 'women' || p.main_category === 'men').slice(0, 2);
    }
    // Fallback
    return products.slice(0, 2);
  };

  // Render article details main view
  if (selectedPost) {
    const postComments = comments.filter(c => c.post_id === selectedPost.id && c.is_approved);
    const relatedProducts = getRelatedCollectionProducts(selectedPost.category);

    return (
      <div id="blog-detail-view" className="bg-brand-beige min-h-screen py-12 px-4 md:px-8">
        <div className="mx-auto max-w-4xl bg-white border border-brand-light-gray p-6 md:p-12 relative">
          
          <button 
            onClick={handleBackToJournal}
            className="clickable flex items-center gap-2 font-sans text-xs tracking-widest uppercase font-bold text-brand-charcoal hover:text-brand-gold mb-8 mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Journal Entries
          </button>

          <span className="font-mono text-xs tracking-[0.25em] uppercase text-brand-gold font-bold">
            {selectedPost.category} JOURNAL • {selectedPost.read_time}
          </span>
          
          <h1 className="font-serif text-3xl md:text-5xl font-light text-brand-charcoal mt-3 mb-6 leading-tight">
            {selectedPost.title}
          </h1>

          <div className="border-y border-brand-light-gray py-4 mb-8 flex items-center justify-between font-mono text-[0.65rem] text-brand-gray">
            <span>WRITTEN BY: {selectedPost.author_name.toUpperCase()}</span>
            <span>PUBLISHED: {new Date(selectedPost.published_at).toLocaleDateString()}</span>
          </div>

          <div className="aspect-[16/9] w-full bg-brand-beige overflow-hidden mb-8">
            <img 
              src={selectedPost.image} 
              alt={selectedPost.title} 
              className="w-full h-full object-cover object-center grayscale hover:grayscale-0 duration-700 transition-all" 
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Fully styled editorial content column */}
          <article className="markdown-body font-light mb-12">
            <div dangerouslySetInnerHTML={{ __html: selectedPost.content.replace(/\n\n/g, '<br/><br/>').replace(/### (.*)/g, '<h3>$1</h3>').replace(/\* (.*)/g, '<li>$1</li>') }} />
          </article>

          {/* FOUNDER BRAND SIGNATURE (Mandatory append) */}
          <div className="border-t border-brand-light-gray pt-8 mt-12 bg-brand-beige/20 p-6 border border-brand-light-gray/40">
            <p className="font-serif italic text-base text-brand-charcoal font-medium">
              With style and appreciation,
            </p>
            <h4 className="font-serif text-xl font-bold text-brand-charcoal mt-4 leading-none">
              Fumilayo Thomas
            </h4>
            <p className="font-sans text-[0.7rem] uppercase tracking-widest text-brand-gold-dark mt-2 font-semibold">
              Founder, Style Curator & Lifestyle Contributor
            </p>
            <p className="font-serif text-xs text-brand-gray italic mt-1 font-light">
              Fitins & Cute Collections
            </p>
          </div>

          {/* ASSOCIATED COUTURE ITEMS PANEL */}
          {relatedProducts.length > 0 && (
            <div className="border-t border-brand-light-gray pt-10 mt-12">
              <h3 className="font-serif text-xl tracking-wide text-brand-charcoal mb-6">
                Acquire The Silhouettes Highlighted
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {relatedProducts.map(p => (
                  <div key={p.id} className="flex gap-4 p-4 border border-brand-light-gray bg-brand-beige/30 items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <img 
                        src={p.images[0]} 
                        alt={p.name} 
                        className="h-20 w-16 object-cover border border-brand-light-gray cursor-pointer"
                        onClick={() => navigate('/home', { state: { selectedProduct: p } })}
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <span className="font-sans text-[0.6rem] text-brand-gray block uppercase tracking-widest">{p.subcategory}</span>
                        <h4 
                          className="clickable font-serif text-sm font-semibold text-brand-charcoal cursor-pointer line-clamp-1 hover:text-brand-gold"
                          onClick={() => navigate('/home', { state: { selectedProduct: p } })}
                        >
                          {p.name}
                        </h4>
                        <span className="font-serif text-xs text-brand-gold font-semibold block mt-1">${p.price} USD</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => addToCart(p, 1, p.sizes?.[0], p.colors?.[0])}
                      className="clickable bg-brand-charcoal text-white text-[0.62rem] font-sans uppercase tracking-widest py-2 px-3 font-bold hover:bg-brand-gray"
                    >
                      Acquire
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DISCUSSION CORNER COMMENTS SECTION */}
          <div className="border-t border-brand-light-gray pt-10 mt-12">
            <h3 className="font-serif text-2xl font-light text-brand-charcoal mb-6">
              Salon Discussions ({postComments.length})
            </h3>

            {/* List existing comments */}
            <div className="flex flex-col gap-4 mb-8">
              {postComments.map((c) => (
                <div key={c.id} className="p-4 bg-brand-beige/55 border border-brand-light-gray text-left">
                  <div className="flex justify-between items-center mb-1.5 font-sans text-xs">
                    <span className="font-bold text-brand-charcoal">{c.user_name}</span>
                    <span className="text-[0.65rem] text-brand-gray/60 font-mono">
                      {new Date(c.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="font-serif text-[0.8rem] text-brand-gray leading-relaxed font-light">
                    "{c.comment}"
                  </p>
                </div>
              ))}
              {postComments.length === 0 && (
                <p className="font-serif text-sm text-brand-gray italic">No conversational threads are currently published on this article.</p>
              )}
            </div>

            {/* Write a comment */}
            <form onSubmit={(e) => handleCommentSubmit(e, selectedPost.id)} className="bg-brand-beige p-6 border border-brand-light-gray flex flex-col gap-4">
              <h4 className="font-serif text-lg font-bold text-brand-charcoal mb-1">Add Commentary</h4>
              
              {commentSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 text-center mb-2 font-medium">
                  {commentSuccess}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-sans text-[0.62rem] tracking-widest uppercase text-brand-gray font-bold">Your Name</label>
                  <input 
                    type="text" 
                    placeholder="E.g. Chioma Bello"
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    className="bg-white border border-brand-light-gray p-2.5 text-xs outline-none focus:border-brand-gold"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-sans text-[0.62rem] tracking-widest uppercase text-brand-gray font-bold">Your Email</label>
                  <input 
                    type="email" 
                    placeholder="email@example.com"
                    value={commentEmail}
                    onChange={(e) => setCommentEmail(e.target.value)}
                    className="bg-white border border-brand-light-gray p-2.5 text-xs outline-none focus:border-brand-gold"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-sans text-[0.62rem] tracking-widest uppercase text-brand-gray font-bold">Commentary Text</label>
                <textarea 
                  rows={4} 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts regarding style alignment, raw hair longevity, or wardrobe integration..."
                  className="bg-white border border-brand-light-gray p-2.5 text-xs outline-none focus:border-brand-gold resize-none"
                  required
                />
              </div>

              <button 
                type="submit"
                className="clickable bg-brand-charcoal hover:bg-brand-gray hover:text-white text-white font-sans text-xs tracking-widest uppercase py-3 font-bold text-center"
              >
                Publish Commentary
              </button>
            </form>

          </div>

        </div>
      </div>
    );
  }

  // Blog list view
  return (
    <div id="fashion-lifestyle-journal" className="bg-brand-beige min-h-screen py-12 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Header Display */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-brand-gold font-bold block mb-2">
            DESIGN, HERITAGE & FORM
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-brand-charcoal">
            The Fashion & Lifestyle Journal
          </h1>
          <p className="font-serif text-sm text-brand-gray leading-relaxed mt-4 font-light italic">
            Visual coordinates, maintenance guides, and curation design essays by our founder, Fumilayo Thomas.
          </p>
        </div>

        {/* Filters and search line */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-brand-light-gray pb-4 mb-8">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`clickable py-1.5 px-4 text-[0.68rem] uppercase tracking-widest font-semibold border transition-colors ${
                  activeCategory === cat 
                    ? 'bg-brand-charcoal border-brand-charcoal text-white' 
                    : 'bg-white border-brand-light-gray text-brand-charcoal hover:border-brand-gold'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-2 border border-brand-light-gray bg-white py-1.5 px-3 w-full md:w-80">
            <Search className="h-4 w-4 text-brand-gray" />
            <input 
              type="text" 
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-none border-none outline-none font-serif text-xs text-brand-charcoal placeholder-brand-gray/50"
            />
          </div>
        </div>

        {/* ARTICLES GRID (No motion libraries) */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => (
              <div 
                key={post.id}
                className="bg-white border border-brand-light-gray flex flex-col justify-between"
              >
                <div>
                  <div 
                    onClick={() => handlePostClick(post)}
                    className="clickable aspect-[16/10] bg-brand-beige overflow-hidden cursor-pointer"
                  >
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="p-6">
                    <span className="font-mono text-[0.62rem] tracking-widest uppercase text-brand-gold font-bold block mb-2">
                      {post.category} • {post.read_time}
                    </span>
                    <h3 
                      onClick={() => handlePostClick(post)} 
                      className="clickable font-serif text-lg font-bold text-brand-charcoal hover:text-brand-gold mt-1 mb-2 leading-snug cursor-pointer"
                    >
                      {post.title}
                    </h3>
                    <p className="font-serif text-xs text-brand-gray leading-relaxed line-clamp-3 font-light mb-4 text-[#555555]">
                      {post.summary}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-3 border-t border-brand-beige flex justify-between items-center text-[0.65rem] font-mono text-brand-gray mt-auto">
                  <span>BY {post.author_name.toUpperCase()}</span>
                  <button 
                    onClick={() => handlePostClick(post)}
                    className="clickable py-1 px-3 text-brand-gold hover:text-brand-charcoal bg-brand-beige hover:bg-brand-light-gray font-bold rounded"
                  >
                    READ ESSAY
                  </button>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-brand-light-gray">
            <p className="font-serif text-base text-brand-gray italic mb-4">No matching editorial articles found.</p>
            <button 
              onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
              className="clickable bg-brand-charcoal text-white uppercase text-xs tracking-widest py-3 px-6 font-semibold"
            >
              Reset Search Filter
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
