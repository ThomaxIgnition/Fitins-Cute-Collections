import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { 
  Heart, ShoppingBag, Filter, Check, Star, X, Info, ShieldCheck, 
  Sparkles, Truck, RotateCcw, Plus, Minus, AlertTriangle, Eye
} from 'lucide-react';

export const StorePage: React.FC = () => {
  const location = useLocation();
  const { 
    products, wishlist, toggleWishlist, addToCart, reviews, addReview 
  } = useStore();

  // Route filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number>(1000);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Selected Product for Dedicated Immersive Modal Detail View
  const [activeDetailProduct, setActiveDetailProduct] = useState<Product | null>(null);

  // Support direct selection via React Router state (triggered by Search Overlay!)
  useEffect(() => {
    if (location.state && (location.state as any).selectedProduct) {
      setActiveDetailProduct((location.state as any).selectedProduct);
      // Clear location state to prevent loop
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Read query params from URL (triggered by subcategory dropdown links)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    const sub = params.get('subcategory');

    if (cat) setSelectedCategory(cat);
    if (sub) {
      setSelectedSubcategory(decodeURIComponent(sub));
    } else {
      setSelectedSubcategory('all');
    }
  }, [location.search]);

  // Fetch unique subcategories depending on the active category
  const filteredSubcategories = products
    .filter(p => selectedCategory === 'all' || p.main_category === selectedCategory)
    .map(p => p.subcategory)
    .filter((value, index, self) => self.indexOf(value) === index);

  // Filter and Sort core matching logic
  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'all' || p.main_category === selectedCategory;
    const matchesSub = selectedSubcategory === 'all' || p.subcategory === selectedSubcategory;
    const matchesPrice = (p.sale_price || p.price) <= priceRange;
    return matchesCat && matchesSub && matchesPrice;
  }).sort((a, b) => {
    const priceA = a.sale_price || a.price;
    const priceB = b.sale_price || b.price;

    if (sortBy === 'price-asc') return priceA - priceB;
    if (sortBy === 'price-desc') return priceB - priceA;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    
    // Fallback to featured
    return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
  });

  return (
    <div id="store-page" className="bg-brand-beige min-h-screen">
      
      {/* 1. HERO COMMERCIAL HERO BANNER */}
      <section className="relative bg-brand-charcoal h-[350px] flex items-center justify-center p-8 border-b border-brand-light-gray overflow-hidden">
        {/* Editorial styled background photo */}
        <div className="absolute inset-0 opacity-40 mix-blend-luminosity">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200" 
            alt="Luxury background editorial" 
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative text-center max-w-2xl z-10 text-white flex flex-col items-center">
          <span className="font-mono text-[0.65rem] tracking-[0.4em] text-brand-gold uppercase font-bold mb-3">
            LIMITED COLLECTION RELEASES
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-light tracking-wide leading-tight text-white mb-4">
            The Atelier Drops
          </h2>
          <p className="font-serif text-sm text-brand-beige/85 font-light leading-relaxed max-w-lg mb-6">
            Meltable HD lace wig frontal designs paired together with cashmere traditional lines. Selected and certified by Fumilayo Thomas.
          </p>
          <div className="flex gap-4 font-mono text-[0.7rem] text-brand-gold bg-brand-charcoal/80 py-2 px-6 border border-brand-gold/30 rounded">
            <span>OFFLINE PERSISTENCE READY</span>
            <span>•</span>
            <span>SECURE FLUTTERWAVE GATEWAY</span>
          </div>
        </div>
      </section>

      {/* 2. MAIN CATALOG CORE SECTION */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* DESKTOP FILTER BAR COLUMN (Left side, hidden on mobile) */}
          <aside className="hidden lg:block w-64 shrink-0 bg-white p-6 border border-brand-light-gray h-fit">
            <h3 className="font-serif text-lg font-bold text-brand-charcoal border-b border-brand-light-gray pb-3 mb-6">
              Filters & Curations
            </h3>

            {/* Main Category */}
            <div className="mb-6">
              <h4 className="font-sans text-xs tracking-wider uppercase font-bold text-brand-gray mb-3 pb-1 border-b border-brand-beige">
                Main Line
              </h4>
              <div className="flex flex-col gap-2">
                {[
                  { id: 'all', label: 'Entire Collection' },
                  { id: 'hair', label: 'Premium Hair' },
                  { id: 'women', label: "Women's Line" },
                  { id: 'men', label: "Men's Line" }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); setSelectedSubcategory('all'); }}
                    className={`clickable text-left py-1 text-xs uppercase tracking-widest font-semibold flex justify-between items-center transition-colors ${
                      selectedCategory === cat.id ? 'text-brand-gold' : 'text-brand-charcoal hover:text-brand-gold'
                    }`}
                  >
                    {cat.label}
                    {selectedCategory === cat.id && <Check className="h-3.5 w-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Subcategories dependent filtering */}
            <div className="mb-6">
              <h4 className="font-sans text-xs tracking-wider uppercase font-bold text-brand-gray mb-3 pb-1 border-b border-brand-beige">
                Specific Curation
              </h4>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setSelectedSubcategory('all')}
                  className={`clickable text-left py-1 text-xs font-medium flex justify-between items-center ${
                    selectedSubcategory === 'all' ? 'text-brand-gold font-bold' : 'text-brand-charcoal/80 hover:text-brand-gold'
                  }`}
                >
                  All Subcategories
                  {selectedSubcategory === 'all' && <Check className="h-3 w-3" />}
                </button>
                {filteredSubcategories.map(sub => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubcategory(sub)}
                    className={`clickable text-left py-1 text-xs font-medium flex justify-between items-center ${
                      selectedSubcategory === sub ? 'text-brand-gold font-bold' : 'text-brand-charcoal/80 hover:text-brand-gold'
                    }`}
                  >
                    {sub}
                    {selectedSubcategory === sub && <Check className="h-3 w-3" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter Slider */}
            <div className="mb-6">
              <h4 className="font-sans text-xs tracking-wider uppercase font-bold text-brand-gray mb-3 pb-1 border-b border-brand-beige flex justify-between">
                <span>Max Investment</span>
                <span className="font-mono text-brand-gold font-bold text-[0.65rem]">${priceRange} USD</span>
              </h4>
              <input 
                type="range" 
                min="30" 
                max="1000" 
                step="10"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-brand-gold clickable"
              />
              <div className="flex justify-between font-mono text-[0.6rem] text-brand-gray mt-1">
                <span>$30</span>
                <span>$1,000 USD</span>
              </div>
            </div>

            {/* Sorting order */}
            <div>
              <h4 className="font-sans text-xs tracking-wider uppercase font-bold text-brand-gray mb-3 pb-1 border-b border-brand-beige">
                Arrangement
              </h4>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-brand-light-gray p-2 text-xs h-9 bg-brand-beige outline-none clickable uppercase font-medium text-brand-charcoal"
              >
                <option value="featured">Editorial Highlights</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated Guest Reviews</option>
                <option value="newest">Newly Handcrafted</option>
              </select>
            </div>

          </aside>

          {/* MOBILE FILTER TRIGGERS AND ACTIVE CRUMBS (Hidden on Desktop) */}
          <div className="lg:hidden w-full flex items-center justify-between gap-4 mb-6 bg-white p-3 border border-brand-light-gray">
            <button 
              onClick={() => setIsMobileFiltersOpen(true)}
              className="clickable flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-wider text-brand-charcoal"
            >
              <Filter className="h-4 w-4" /> Filter Options
            </button>
            <div className="flex items-center gap-1">
              <span className="font-mono text-[0.65rem] text-brand-gray">Sort:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border-none bg-transparent font-sans text-xs text-brand-charcoal font-semibold outline-none clickable"
              >
                <option value="featured">Highlights</option>
                <option value="price-asc">$ Low-High</option>
                <option value="price-desc">$ High-Low</option>
                <option value="rating">Top Reviews</option>
                <option value="newest">New Drops</option>
              </select>
            </div>
          </div>

          {/* RIGHT: Grid of Products */}
          <div className="flex-1">
            <div className="flex justify-between items-baseline mb-6 border-b border-brand-light-gray pb-3">
              <h3 className="font-serif text-2xl font-light text-brand-charcoal">
                Interactive Catalog{' '}
                <span className="font-sans text-xs tracking-widest text-brand-gray font-semibold ml-2 uppercase">
                  ({filteredProducts.length} Items)
                </span>
              </h3>
              
              {/* Filter resetting indicators */}
              {(selectedCategory !== 'all' || selectedSubcategory !== 'all' || priceRange < 1000) && (
                <button
                  onClick={() => { setSelectedCategory('all'); setSelectedSubcategory('all'); setPriceRange(1000); }}
                  className="clickable font-sans text-[0.65rem] tracking-widest uppercase text-brand-gold font-bold hover:underline"
                >
                  Clear Active Filters
                </button>
              )}
            </div>

            {/* PRODUCT BENTO GRID */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => {
                  const isWish = wishlist.includes(product.id);
                  const displayPrice = product.price;
                  const discountPrice = product.sale_price;
                  
                  return (
                    <div 
                      key={product.id}
                      className="group bg-white border border-brand-light-gray relative flex flex-col justify-between"
                    >
                      {/* Badge releases */}
                      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                        {product.is_new && (
                          <span className="bg-brand-charcoal text-white text-[0.55rem] font-bold tracking-widest uppercase py-1 px-2">
                            NEW DROP
                          </span>
                        )}
                        {product.is_bestseller && (
                          <span className="bg-brand-gold text-white text-[0.55rem] font-bold tracking-widest uppercase py-1 px-2">
                            BESTSELLER
                          </span>
                        )}
                        {product.inventory === 0 && (
                          <span className="bg-rose-600 text-white text-[0.55rem] font-bold tracking-widest uppercase py-1 px-2">
                            OUT OF STOCK
                          </span>
                        )}
                        {product.inventory > 0 && product.inventory <= 5 && (
                          <span className="bg-amber-600 text-white text-[0.55rem] font-semibold tracking-wide py-0.5 px-2">
                            ONLY {product.inventory} LEFT
                          </span>
                        )}
                      </div>

                      {/* Wishlist toggle bubble */}
                      <button 
                        onClick={() => toggleWishlist(product.id)}
                        className="clickable absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm self-center p-2 rounded-full border border-brand-light-gray/20 hover:text-rose-600 text-brand-charcoal transition-colors shadow-sm"
                        aria-label="Toggle Wishlist"
                      >
                        <Heart className={`h-4 w-4 ${isWish ? 'fill-rose-600 text-rose-600' : ''}`} />
                      </button>

                      {/* Photo wrapper */}
                      <div 
                        onClick={() => setActiveDetailProduct(product)}
                        className="clickable aspect-[4/5] bg-brand-beige overflow-hidden relative cursor-pointer"
                      >
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="w-full h-full object-cover object-center transition-all duration-[800ms] group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        
                        {/* Immersive Quick View overlay on hover (Fully compliance, no animation library) */}
                        <div className="absolute inset-0 bg-brand-charcoal/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <span className="bg-white/95 text-brand-charcoal py-2 px-4 shadow-xl font-sans text-[0.65rem] tracking-widest uppercase font-bold border border-brand-charcoal flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5" /> View Curated Details
                          </span>
                        </div>
                      </div>

                      {/* Metadata Details */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-sans text-[0.65rem] tracking-widest uppercase text-brand-gray">
                              {product.subcategory}
                            </span>
                            <div className="flex items-center gap-0.5 text-brand-gold">
                              <Star className="h-3 w-3 fill-brand-gold" />
                              <span className="font-mono text-[0.65rem] font-bold">{product.rating}</span>
                            </div>
                          </div>
                          
                          <h4 
                            onClick={() => setActiveDetailProduct(product)}
                            className="clickable font-serif text-sm font-semibold text-brand-charcoal hover:text-brand-gold leading-tight line-clamp-2"
                          >
                            {product.name}
                          </h4>
                        </div>

                        <div className="mt-4 pt-3 border-t border-brand-beige flex items-center justify-between">
                          <span className="font-serif text-sm font-bold text-brand-charcoal">
                            {discountPrice ? (
                              <span className="flex items-center gap-2">
                                <span className="text-brand-gold">${discountPrice} USD</span>
                                <span className="text-xs text-brand-gray/50 line-through font-light">${displayPrice}</span>
                              </span>
                            ) : (
                              `$${displayPrice} USD`
                            )}
                          </span>

                          <button 
                            disabled={product.inventory === 0}
                            onClick={() => addToCart(product, 1, product.sizes?.[0], product.colors?.[0])}
                            className={`clickable font-sans text-[0.65rem] tracking-widest uppercase py-2 px-3.5 font-bold transition-all ${
                              product.inventory === 0 
                                ? 'bg-brand-light-gray text-brand-gray cursor-not-allowed'
                                : 'bg-brand-charcoal hover:bg-brand-gray text-white'
                            }`}
                          >
                            {product.inventory === 0 ? 'SOLD' : 'ADD TO BAG'}
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-20 text-center bg-white border border-brand-light-gray p-8">
                <p className="font-serif text-lg text-brand-gray italic mb-4">No couture items align with the active filter options.</p>
                <button 
                  onClick={() => { setSelectedCategory('all'); setSelectedSubcategory('all'); setPriceRange(1000); }}
                  className="clickable font-sans text-xs uppercase tracking-widest bg-brand-charcoal text-white py-3 px-6 font-semibold"
                >
                  View All Pieces
                </button>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 3. MOBILE FILTERS OVERLAY */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-[150] flex lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileFiltersOpen(false)} />
          <div className="relative w-full max-w-xs bg-white h-full p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-brand-light-gray mb-6">
                <h3 className="font-serif text-lg font-bold text-brand-charcoal">Curation Settings</h3>
                <button onClick={() => setIsMobileFiltersOpen(false)} className="clickable p-2 text-brand-charcoal">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Main Line */}
              <div className="mb-6">
                <h4 className="font-sans text-[0.7rem] uppercase tracking-wider font-bold text-brand-gray mb-3">Main Line</h4>
                <div className="flex flex-col gap-1.5">
                  {[
                    { id: 'all', label: 'Entire Collection' },
                    { id: 'hair', label: 'Premium Hair' },
                    { id: 'women', label: "Women's Line" },
                    { id: 'men', label: "Men's Line" }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat.id); setSelectedSubcategory('all'); }}
                      className={`clickable text-left py-1.5 px-2 text-xs uppercase tracking-wider font-semibold rounded ${
                        selectedCategory === cat.id ? 'bg-brand-gold/10 text-brand-gold' : 'text-brand-charcoal'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specific curations */}
              <div className="mb-6">
                <h4 className="font-sans text-[0.7rem] uppercase tracking-wider font-bold text-brand-gray mb-3">Curations</h4>
                <div className="flex flex-col gap-1 bg-brand-beige p-2 max-h-40 overflow-y-auto rounded border border-brand-light-gray">
                  <button
                    onClick={() => { setSelectedSubcategory('all'); }}
                    className={`clickable text-left py-1 text-xs ${selectedSubcategory === 'all' ? 'text-brand-gold font-bold' : 'text-brand-charcoal'}`}
                  >
                    All Subcategories
                  </button>
                  {filteredSubcategories.map(sub => (
                    <button
                      key={sub}
                      onClick={() => { setSelectedSubcategory(sub); }}
                      className={`clickable text-left py-1 text-xs ${selectedSubcategory === sub ? 'text-brand-gold font-bold' : 'text-brand-charcoal'}`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div className="mb-6">
                <h4 className="font-sans text-[0.7rem] uppercase tracking-wider font-bold text-brand-gray mb-2 flex justify-between">
                  <span>Max Budget</span>
                  <span className="font-mono text-brand-gold font-bold">${priceRange} USD</span>
                </h4>
                <input 
                  type="range" 
                  min="30" 
                  max="1000" 
                  step="20"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-brand-gold clickable"
                />
              </div>
            </div>

            <button 
              onClick={() => setIsMobileFiltersOpen(false)}
              className="clickable w-full bg-brand-charcoal text-white font-sans text-xs tracking-widest uppercase py-3 font-semibold"
            >
              See Results ({filteredProducts.length})
            </button>
          </div>
        </div>
      )}

      {/* 4. IMMERSIVE COMPREHENSIVE PRODUCT DETAILED OVERLAY MODAL */}
      {activeDetailProduct && (
        <ProductDetailModal 
          product={activeDetailProduct} 
          onClose={() => setActiveDetailProduct(null)} 
        />
      )}

    </div>
  );
};

/* INNER COMPONENT: GORGEOUS DETAILED PRODUCT VIEWER MODAL WITH FULL REVIEW FEED */
interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { wishlist, toggleWishlist, addToCart, reviews, addReview } = useStore();
  
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [addBagSuccess, setAddBagSuccess] = useState(false);

  // Review Form state
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  // Fetch reviews designated to this specific product id
  const productReviews = reviews.filter(r => r.product_id === product.id && r.is_approved);

  const isWish = wishlist.includes(product.id);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestEmail || !reviewComment) return;
    
    addReview(product.id, guestName, guestEmail, rating, reviewComment);
    setReviewSuccess('Premium Review submitted successfully! Thank you.');
    setGuestName('');
    setGuestEmail('');
    setReviewComment('');
    setRating(5);
    
    // Clear success after 4s
    setTimeout(() => {
      setReviewSuccess('');
    }, 4000);
  };

  const handleAddToBag = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    setAddBagSuccess(true);
    setTimeout(() => {
      setAddBagSuccess(false);
    }, 3000);
  };

  return (
    <div id="product-detail-modal" className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Dark overlay backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      
      {/* Modal Box */}
      <div className="relative w-full max-w-5xl bg-white max-h-[92vh] overflow-y-auto shadow-2xl z-10 grid grid-cols-1 md:grid-cols-12 no-scrollbar border border-brand-light-gray">
        
        {/* Absolute exit button */}
        <button 
          onClick={onClose} 
          className="clickable absolute top-4 right-4 z-20 bg-brand-charcoal text-white hover:bg-brand-gold p-2 shadow-lg"
          aria-label="Close detail view"
        >
          <X className="h-5 w-5" />
        </button>

        {/* LEFT COMPONENT: Image Carousel Display (md:col-span-6) */}
        <div className="md:col-span-6 bg-brand-beige p-6 flex flex-col justify-between border-r border-brand-light-gray">
          <div className="aspect-[4/5] overflow-hidden bg-white border border-brand-light-gray relative">
            <img 
              src={product.images[activeImageIdx] || product.images[0]} 
              alt={product.name} 
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Miniature gallery handles */}
          {product.images.length > 1 && (
            <div className="flex gap-2.5 mt-4 justify-center">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIdx(index)}
                  className={`clickable h-16 w-14 border object-cover ${activeImageIdx === index ? 'border-brand-gold stroke-2' : 'border-brand-light-gray opacity-60'}`}
                >
                  <img src={img} alt={`view-${index}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}

          {/* Premium Concierge Trust Indicators */}
          <div className="grid grid-cols-3 gap-2 border-t border-brand-light-gray mt-6 pt-4 text-[0.62rem] font-mono text-brand-gray text-center">
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-brand-gold" />
              <span>AUTHENTICITY GUARANTEE</span>
            </div>
            <div className="flex flex-col items-center gap-1 border-x border-brand-light-gray px-1">
              <Truck className="h-4 w-4 text-brand-gold" />
              <span>COMPLIMENTARY DHL SHIPPING</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RotateCcw className="h-4 w-4 text-brand-gold" />
              <span>RETURN ON DISCOVERY</span>
            </div>
          </div>
        </div>

        {/* RIGHT COMPONENT: Fine Details, Specifications & Reviews (md:col-span-6) */}
        <div className="md:col-span-6 p-6 md:p-8 flex flex-col justify-between h-full bg-white">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-sans text-[0.65rem] tracking-[0.25em] uppercase text-brand-gold font-bold">
                {product.main_category} Collection • {product.subcategory}
              </span>
              <button 
                onClick={() => toggleWishlist(product.id)}
                className={`clickable p-1.5 hover:text-rose-600 ${isWish ? 'text-rose-600' : 'text-brand-gray'}`}
              >
                <Heart className={`h-5 w-5 ${isWish ? 'fill-rose-600' : ''}`} />
              </button>
            </div>

            <h1 className="font-serif text-2xl md:text-3xl font-light text-brand-charcoal leading-tight mb-2">
              {product.name}
            </h1>

            {/* Price section */}
            <div className="text-xl font-serif text-brand-charcoal font-semibold mb-4">
              {product.sale_price ? (
                <span className="flex items-center gap-3">
                  <span className="text-brand-gold">${product.sale_price} USD</span>
                  <span className="text-sm text-brand-gray/50 line-through font-light">${product.price}</span>
                </span>
              ) : (
                `$${product.price} USD`
              )}
            </div>

            {/* Editorial Description divider */}
            <p className="font-serif text-sm text-brand-gray leading-relaxed mb-6 font-light">
              {product.description}
            </p>

            {/* Inventory notification bar */}
            {product.inventory === 0 ? (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 text-xs font-sans font-semibold flex items-center gap-2 mb-6">
                <AlertTriangle className="h-4 w-4" /> Solitary Batch Sold Out. Subscribe to backorder notifications below.
              </div>
            ) : product.inventory <= 5 ? (
              <div className="bg-amber-50 border border-amber-200 text-amber-700 p-3 text-xs font-sans font-semibold flex items-center gap-2 mb-6">
                <Sparkles className="h-4 w-4" /> Limited Availability: Only {product.inventory} units remain in this batch release.
              </div>
            ) : null}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-4">
                <label className="font-sans text-[0.62rem] tracking-widest uppercase font-bold text-brand-gray block mb-1.5">
                  1. Choose Curation Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`clickable py-1.5 px-3 border text-xs font-semibold uppercase tracking-wider transition-colors ${
                        selectedSize === size 
                          ? 'bg-brand-charcoal border-brand-charcoal text-white' 
                          : 'border-brand-light-gray text-brand-charcoal hover:border-brand-gold'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <label className="font-sans text-[0.62rem] tracking-widest uppercase font-bold text-brand-gray block mb-1.5">
                  2. Choose Selection Color / Blend
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`clickable py-1.5 px-3 border text-xs font-semibold uppercase tracking-wider transition-colors ${
                        selectedColor === color 
                          ? 'bg-brand-charcoal border-brand-charcoal text-white' 
                          : 'border-brand-light-gray text-brand-charcoal hover:border-brand-gold'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Features Checkbox Accordion */}
            {product.features && product.features.length > 0 && (
              <div className="mb-6 bg-brand-beige p-4 border border-brand-light-gray">
                <span className="font-sans text-[0.62rem] tracking-widest uppercase font-bold text-brand-gray block mb-2">
                  Premium Specifications
                </span>
                <ul className="flex flex-col gap-1.5 font-serif text-[0.75rem] text-brand-charcoal/90">
                  {product.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-brand-gold shrink-0">•</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 3. Operational controls */}
            <div className="flex items-center gap-4 border-t border-brand-light-gray pt-6 mb-8">
              <div className="flex items-center border border-brand-light-gray">
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="clickable p-2.5 bg-brand-beige hover:bg-brand-light-gray text-brand-charcoal"
                  disabled={product.inventory === 0}
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="px-5 font-mono text-xs font-bold text-brand-charcoal select-none">{quantity}</span>
                <button 
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="clickable p-2.5 bg-brand-beige hover:bg-brand-light-gray text-brand-charcoal"
                  disabled={product.inventory === 0}
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>

              <div className="flex-1">
                <button 
                  disabled={product.inventory === 0}
                  onClick={handleAddToBag}
                  className={`clickable w-full font-sans text-xs uppercase tracking-widest py-4.5 text-center font-bold transition-all border ${
                    product.inventory === 0 
                      ? 'bg-brand-light-gray hover:bg-brand-light-gray text-brand-gray border-brand-light-gray cursor-not-allowed'
                      : 'bg-brand-charcoal hover:bg-brand-gray text-white border-brand-charcoal shadow-md'
                  }`}
                >
                  {product.inventory === 0 ? 'SOLD OUT RELEASE' : 'ADD TO COUTURE BAG'}
                </button>
              </div>
            </div>

            {/* Bag Addition Feedback message */}
            {addBagSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 font-sans font-semibold text-center mb-6">
                ✓ Curated item added successfully to your shopping bag! Open the cart drawer above to check out.
              </div>
            )}

          </div>

          {/* REVIEWS SECTION: FULLY INTERACTIVE READ & WRITE ACCORDION */}
          <div className="border-t border-brand-light-gray pt-6">
            <h3 className="font-serif text-lg font-bold text-brand-charcoal mb-4 flex justify-between items-baseline">
              <span>Guest Reviews ({productReviews.length})</span>
              <span className="font-mono text-brand-gold text-xs font-bold">★★★★★ {product.rating}</span>
            </h3>

            {/* List Reviews */}
            <div className="flex flex-col gap-4 max-h-56 overflow-y-auto pr-1 mb-6 no-scrollbar">
              {productReviews.map((rev) => (
                <div key={rev.id} className="bg-brand-beige p-3 border border-brand-light-gray flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-serif text-xs font-bold text-brand-charcoal">{rev.user_name}</span>
                    <div className="flex text-brand-gold">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${i < rev.rating ? 'fill-brand-gold' : 'text-brand-light-gray'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="font-serif text-[0.75rem] text-brand-gray italic leading-relaxed">
                    "{rev.comment}"
                  </p>
                  <span className="font-mono text-[0.55rem] text-brand-gray/60 flex justify-end">
                    {new Date(rev.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {productReviews.length === 0 && (
                <div className="py-4 text-center">
                  <p className="font-serif text-xs text-brand-gray italic">No editorial member feedback has been published yet.</p>
                </div>
              )}
            </div>

            {/* Guest write review */}
            <form onSubmit={handleAddReview} className="bg-brand-beige/50 p-4 border border-brand-light-gray">
              <span className="font-sans text-[0.62rem] tracking-widest uppercase font-bold text-brand-gray block mb-3">
                Publish Curation Feedback
              </span>

              {reviewSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-2.5 text-center font-medium mb-3">
                  {reviewSuccess}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 mb-2">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="bg-white border border-brand-light-gray p-2 text-xs outline-none focus:border-brand-gold"
                  required
                />
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="bg-white border border-brand-light-gray p-2 text-xs outline-none focus:border-brand-gold"
                  required
                />
              </div>

              <div className="flex items-center gap-1.5 mb-3.5">
                <span className="font-sans text-[0.6rem] uppercase tracking-wider text-brand-gray">Curation Rating:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setRating(num)}
                      className="clickable text-brand-gold"
                    >
                      <Star className={`h-4 w-4 ${num <= rating ? 'fill-brand-gold' : 'text-brand-light-gray'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <textarea 
                placeholder="Share your experience regarding fiber movement, density alignment, or fabric tailoring..."
                rows={2}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full bg-white border border-brand-light-gray p-2 text-xs outline-none focus:border-brand-gold resize-none mb-3"
                required
              />

              <button 
                type="submit"
                className="clickable w-full bg-brand-charcoal text-white font-sans text-[0.65rem] tracking-widest uppercase py-2 font-bold hover:bg-brand-gray text-center"
              >
                Submit Curation Review
              </button>
            </form>

          </div>
        </div>

      </div>
    </div>
  );
};
