import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Logo } from './Logo';
import { 
  Search, Heart, ShoppingBag, User, X, Plus, Minus, Trash2, 
  ChevronDown, Settings, LogOut, CheckCircle2, Sliders, LayoutDashboard
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    cart, wishlist, currentUser, activeRole, simulateRoleChange, logout,
    updateCartQuantity, removeFromCart, products, toggleWishlist, addToCart,
    founderProfile
  } = useStore();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Active subcategory filters trigger navigating with queries
  const handleSubcategoryClick = (mainCategory: string, sub: string) => {
    navigate(`/home?category=${mainCategory}&subcategory=${encodeURIComponent(sub)}`);
    setIsMobileMenuOpen(false);
  };

  const handleCategoryClick = (mainCategory: string) => {
    navigate(`/home?category=${mainCategory}`);
    setIsMobileMenuOpen(false);
  };

  const subtotal = cart.reduce((sum, item) => {
    const price = item.product.sale_price || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  // Logo Navigation Rule: 
  // Clicking Logo from any page -> /home (except if already on /home, then -> /)
  const handleLogoClick = () => {
    if (location.pathname === '/home') {
      navigate('/');
    } else {
      navigate('/home');
    }
  };

  const filteredSearchProducts = searchQuery.trim() 
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subcategory.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <>
      <nav id="fc-navbar" className="sticky top-0 z-[100] w-full border-b border-brand-light-gray bg-brand-beige py-4 px-4 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          
          {/* LEFT: Elegant Logo System */}
          <Logo variant="primary" onClick={handleLogoClick} />

          {/* CENTER: Editorial Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <span 
              onClick={() => navigate('/home')} 
              className={`clickable font-sans text-xs tracking-widest uppercase font-medium hover:text-brand-gold ${location.pathname === '/home' ? 'text-brand-gold font-semibold' : 'text-brand-charcoal'}`}
            >
              Home
            </span>

            {/* HAIR DROPDOWN */}
            <div className="group relative py-2">
              <span className="clickable font-sans text-xs tracking-widest uppercase font-medium text-brand-charcoal hover:text-brand-gold flex items-center gap-1">
                Hair <ChevronDown className="h-3 w-3" />
              </span>
              <div className="invisible absolute top-full left-0 mt-1 w-48 border border-brand-light-gray bg-white p-3 shadow-lg group-hover:visible z-[100]">
                {['Wigs', 'Braided Hair', 'Weaves', 'Hair Care', 'Accessories'].map(sub => (
                  <div 
                    key={sub} 
                    onClick={() => handleSubcategoryClick('hair', sub)}
                    className="clickable py-1.5 px-2 text-xs text-brand-charcoal hover:bg-brand-beige hover:text-brand-gold font-medium"
                  >
                    {sub}
                  </div>
                ))}
                <div className="border-t border-brand-light-gray mt-2 pt-2">
                  <div 
                    onClick={() => handleCategoryClick('hair')}
                    className="clickable py-1 px-2 text-xs uppercase tracking-wider text-brand-gold hover:underline font-semibold"
                  >
                    View All Hair
                  </div>
                </div>
              </div>
            </div>

            {/* WOMEN DROPDOWN */}
            <div className="group relative py-2">
              <span className="clickable font-sans text-xs tracking-widest uppercase font-medium text-brand-charcoal hover:text-brand-gold flex items-center gap-1">
                Women <ChevronDown className="h-3 w-3" />
              </span>
              <div className="invisible absolute top-full left-0 mt-1 w-48 border border-brand-light-gray bg-white p-3 shadow-lg group-hover:visible z-[100]">
                {['Dresses', 'Tops', 'Sets', 'Accessories'].map(sub => (
                  <div 
                    key={sub} 
                    onClick={() => handleSubcategoryClick('women', sub)}
                    className="clickable py-1.5 px-2 text-xs text-brand-charcoal hover:bg-brand-beige hover:text-brand-gold font-medium"
                  >
                    {sub}
                  </div>
                ))}
                <div className="border-t border-brand-light-gray mt-2 pt-2">
                  <div 
                    onClick={() => handleCategoryClick('women')}
                    className="clickable py-1 px-2 text-xs uppercase tracking-wider text-brand-gold hover:underline font-semibold"
                  >
                    View All Women
                  </div>
                </div>
              </div>
            </div>

            {/* MEN DROPDOWN */}
            <div className="group relative py-2">
              <span className="clickable font-sans text-xs tracking-widest uppercase font-medium text-brand-charcoal hover:text-brand-gold flex items-center gap-1">
                Men <ChevronDown className="h-3 w-3" />
              </span>
              <div className="invisible absolute top-full left-0 mt-1 w-48 border border-brand-light-gray bg-white p-3 shadow-lg group-hover:visible z-[100]">
                {['Shirts', 'Casual Wear', 'Traditional Wear', 'Accessories'].map(sub => (
                  <div 
                    key={sub} 
                    onClick={() => handleSubcategoryClick('men', sub)}
                    className="clickable py-1.5 px-2 text-xs text-brand-charcoal hover:bg-brand-beige hover:text-brand-gold font-medium"
                  >
                    {sub}
                  </div>
                ))}
                <div className="border-t border-brand-light-gray mt-2 pt-2">
                  <div 
                    onClick={() => handleCategoryClick('men')}
                    className="clickable py-1 px-2 text-xs uppercase tracking-wider text-brand-gold hover:underline font-semibold"
                  >
                    View All Men
                  </div>
                </div>
              </div>
            </div>

            <span 
              onClick={() => navigate('/fashion-lifestyle')} 
              className={`clickable font-sans text-xs tracking-widest uppercase font-medium hover:text-brand-gold ${location.pathname === '/fashion-lifestyle' ? 'text-brand-gold font-semibold' : 'text-brand-charcoal'}`}
            >
              Fashion & Lifestyle
            </span>

            <span 
              onClick={() => navigate('/founder')} 
              className={`clickable font-sans text-xs tracking-widest uppercase font-medium hover:text-brand-gold ${location.pathname === '/founder' ? 'text-brand-gold font-semibold' : 'text-brand-charcoal'}`}
            >
              About The Founder
            </span>
          </div>

          {/* RIGHT: System Icons */}
          <div className="flex items-center gap-4">
            {/* Search Icon */}
            <button 
              id="btn-search-trigger"
              onClick={() => setIsSearchOpen(true)} 
              className="clickable p-1.5 text-brand-charcoal hover:text-brand-gold transition-colors"
              aria-label="Search Catalog"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Wishlist Icon */}
            <button 
              id="btn-wishlist-trigger"
              onClick={() => setIsWishlistOpen(true)}
              className="clickable relative p-1.5 text-brand-charcoal hover:text-brand-gold transition-colors"
              aria-label="View Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-brand-gold text-[0.6rem] text-white flex items-center justify-center rounded-full font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button 
              id="btn-cart-trigger"
              onClick={() => setIsCartOpen(true)}
              className="clickable relative p-1.5 text-brand-charcoal hover:text-brand-gold transition-colors"
              aria-label="View Shopping bag"
            >
              <ShoppingBag className="h-5 w-5" />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-brand-charcoal text-[0.6rem] text-brand-beige flex items-center justify-center rounded-full font-bold">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
            </button>

            {/* Account Icon / Role Switcher Indicator */}
            <button 
              id="btn-account-trigger"
              onClick={() => setIsAccountOpen(true)}
              className="clickable flex items-center gap-1.5 p-1 text-brand-charcoal hover:text-brand-gold transition-colors border border-transparent rounded-full"
              aria-label="My Account"
            >
              {currentUser ? (
                activeRole === 'admin' || activeRole === 'editor' ? (
                  <img 
                    src={founderProfile.profile_image_url} 
                    className="h-6 w-6 rounded-full object-cover border border-brand-gold shrink-0 bg-white" 
                    alt="Founder Icon"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-brand-charcoal text-brand-beige flex items-center justify-center font-serif text-[0.65rem] font-bold uppercase shrink-0 border border-brand-light-gray">
                    {currentUser.name ? currentUser.name.trim().charAt(0).toUpperCase() : 'C'}
                  </div>
                )
              ) : (
                <User className="h-5 w-5" />
              )}
              {currentUser && (
                <span className="hidden md:inline text-[0.65rem] tracking-widest uppercase font-medium text-brand-gold-dark px-1 bg-brand-gold/10">
                  {activeRole}
                </span>
              )}
            </button>

            {/* Hamburger for mobile screens */}
            <button 
              id="btn-mobile-menu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="clickable lg:hidden p-1.5 text-brand-charcoal"
              aria-label="Open navigation menu"
            >
              <span className="text-xl font-bold">☰</span>
            </button>
          </div>

        </div>
      </nav>

      {/* MOBILE FULL NAVIGATION OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[150] bg-white p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-brand-light-gray">
              <Logo variant="primary" onClick={() => { navigate('/home'); setIsMobileMenuOpen(false); }} />
              <button onClick={() => setIsMobileMenuOpen(false)} className="clickable p-2 text-brand-charcoal">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex flex-col gap-5 pt-8">
              <span 
                onClick={() => { navigate('/home'); setIsMobileMenuOpen(false); }} 
                className="clickable font-serif text-xl tracking-wide text-brand-charcoal"
              >
                Home Store
              </span>

              {/* Hair Group */}
              <div className="py-1">
                <h4 className="font-sans text-xs tracking-widest uppercase font-semibold text-brand-gray mb-2">Premium Hair</h4>
                <div className="grid grid-cols-2 gap-2 pl-2">
                  {['Wigs', 'Braided Hair', 'Weaves', 'Hair Care', 'Accessories'].map(sub => (
                    <span 
                      key={sub} 
                      onClick={() => handleSubcategoryClick('hair', sub)}
                      className="clickable text-xs text-brand-charcoal py-1"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              {/* Women Group */}
              <div className="py-1">
                <h4 className="font-sans text-xs tracking-widest uppercase font-semibold text-brand-gray mb-2">Women's Fashion</h4>
                <div className="grid grid-cols-2 gap-2 pl-2">
                  {['Dresses', 'Tops', 'Sets', 'Accessories'].map(sub => (
                    <span 
                      key={sub} 
                      onClick={() => handleSubcategoryClick('women', sub)}
                      className="clickable text-xs text-brand-charcoal py-1"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              {/* Men Group */}
              <div className="py-1">
                <h4 className="font-sans text-xs tracking-widest uppercase font-semibold text-brand-gray mb-2">Men's Fashion</h4>
                <div className="grid grid-cols-2 gap-2 pl-2">
                  {['Shirts', 'Casual Wear', 'Traditional Wear', 'Accessories'].map(sub => (
                    <span 
                      key={sub} 
                      onClick={() => handleSubcategoryClick('men', sub)}
                      className="clickable text-xs text-brand-charcoal py-1"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              <span 
                onClick={() => { navigate('/fashion-lifestyle'); setIsMobileMenuOpen(false); }} 
                className="clickable font-serif text-xl tracking-wide text-brand-charcoal border-t border-brand-light-gray pt-4"
              >
                Fashion & Lifestyle Hub
              </span>

              <span 
                onClick={() => { navigate('/founder'); setIsMobileMenuOpen(false); }} 
                className="clickable font-serif text-xl tracking-wide text-brand-charcoal"
              >
                Meet The Founder
              </span>
            </div>
          </div>

          <div className="text-center font-serif text-xs text-brand-gray tracking-widest">
            FUMILAYO THOMAS • FITINS & CUTE
          </div>
        </div>
      )}

      {/* SEARCH SYSTEM DROPDOWN OVERLAY */}
      {isSearchOpen && (
        <div id="search-overlay" className="fixed inset-x-0 top-0 z-[160] bg-white border-b border-brand-light-gray shadow-xl p-6">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center justify-between gap-4">
              <Search className="h-6 w-6 text-brand-gray shrink-0" />
              <input 
                type="text" 
                placeholder="Search collection (e.g. wig, silk gown, cashmere, traditional set)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-none outline-none font-serif text-xl text-brand-charcoal bg-transparent placeholder-brand-gray/50"
                autoFocus
              />
              <button 
                onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }} 
                className="clickable p-2 text-brand-charcoal hover:bg-brand-beige"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Live Search results list */}
            {searchQuery.trim() && (
              <div className="mt-6 border-t border-brand-light-gray pt-4 max-h-[60vh] overflow-y-auto no-scrollbar">
                <span className="font-sans text-[0.65rem] tracking-widest uppercase text-brand-gray">
                  Search Results ({filteredSearchProducts.length})
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  {filteredSearchProducts.map(p => (
                    <div 
                      key={p.id}
                      onClick={() => {
                        navigate('/home', { state: { selectedProduct: p } });
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="clickable flex gap-3 p-2 hover:bg-brand-beige rounded border border-transparent hover:border-brand-light-gray"
                    >
                      <img 
                        src={p.images[0]} 
                        alt={p.name} 
                        className="h-16 w-12 object-cover object-center bg-gray-50 border border-brand-light-gray"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex flex-col justify-center">
                        <h4 className="font-serif text-sm font-medium text-brand-charcoal leading-tight">{p.name}</h4>
                        <span className="font-sans text-[0.65rem] tracking-wider text-brand-gray uppercase mt-1">
                          {p.main_category} • {p.subcategory}
                        </span>
                        <span className="font-serif text-xs text-brand-gold font-medium mt-1">
                          ${p.sale_price || p.price} USD
                        </span>
                      </div>
                    </div>
                  ))}
                  {filteredSearchProducts.length === 0 && (
                    <div className="col-span-2 py-4 text-center">
                      <p className="font-serif text-sm text-brand-gray italic">No editorial matching articles or collection units found.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* WISHLIST DRAWER */}
      {isWishlistOpen && (
        <div id="wishlist-drawer" className="fixed inset-0 z-[180] flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsWishlistOpen(false)} />
          <div className="relative w-full max-w-md bg-brand-beige h-full flex flex-col shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-brand-light-gray">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-brand-charcoal" />
                <h3 className="font-serif text-xl font-semibold text-brand-charcoal">My Wishlist</h3>
              </div>
              <button onClick={() => setIsWishlistOpen(false)} className="clickable p-2 text-brand-charcoal hover:bg-brand-light-gray rounded">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pt-4 no-scrollbar">
              {wishlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                  <p className="font-serif text-base text-brand-gray italic mb-4">Your wishlist is currently empty.</p>
                  <button 
                    onClick={() => { setIsWishlistOpen(false); navigate('/home'); }}
                    className="clickable font-sans text-xs uppercase tracking-widest bg-brand-charcoal text-white py-3 px-6 hover:bg-brand-gray hover:text-white"
                  >
                    Browse Collections
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {wishlist.map(id => {
                    const product = products.find(p => p.id === id);
                    if (!product) return null;
                    return (
                      <div 
                        key={product.id} 
                        className="flex items-center justify-between gap-3 p-3 bg-white border border-brand-light-gray"
                      >
                        <div className="flex items-center gap-3">
                          <img 
                            src={product.images[0]} 
                            alt={product.name} 
                            className="h-16 w-12 object-cover object-center border border-brand-light-gray shrink-0" 
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h4 className="font-serif text-xs font-semibold text-brand-charcoal leading-tight line-clamp-1">{product.name}</h4>
                            <span className="font-sans text-[0.6rem] text-brand-gray block mt-0.5">{product.subcategory}</span>
                            <span className="font-serif text-xs text-brand-gold font-medium mt-1 block">${product.sale_price || product.price} USD</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          <button 
                            onClick={() => {
                              addToCart(product, 1, product.sizes?.[0], product.colors?.[0]);
                              setIsWishlistOpen(false);
                              setIsCartOpen(true);
                            }}
                            className="clickable font-sans text-[0.65rem] tracking-wider uppercase bg-brand-charcoal text-white p-2 text-center"
                          >
                            Add To Bag
                          </button>
                          <button 
                            onClick={() => toggleWishlist(product.id)}
                            className="clickable font-sans text-[0.6rem] text-rose-600 uppercase tracking-widest text-right flex items-center gap-1 justify-end hover:underline"
                          >
                            <Trash2 className="h-3 w-3" /> Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SHOPPING BAG CART DRAWER */}
      {isCartOpen && (
        <div id="cart-drawer" className="fixed inset-0 z-[180] flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-md bg-brand-beige h-full flex flex-col shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-brand-light-gray">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-brand-charcoal" />
                <h3 className="font-serif text-xl font-semibold text-brand-charcoal">Shopping Bag</h3>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="clickable p-2 text-brand-charcoal hover:bg-brand-light-gray/50 rounded">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pt-4 no-scrollbar">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                  <p className="font-serif text-base text-brand-gray italic mb-4">Your shopping bag is empty.</p>
                  <button 
                    onClick={() => { setIsCartOpen(false); navigate('/home'); }}
                    className="clickable font-sans text-xs uppercase tracking-widest bg-brand-charcoal text-white py-3 px-6 hover:bg-brand-gray hover:text-white"
                  >
                    Browse Collections
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {cart.map((item, idx) => (
                    <div 
                      key={`${item.product.id}-${idx}`} 
                      className="flex gap-4 p-3 bg-white border border-brand-light-gray"
                    >
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name} 
                        className="h-20 w-16 object-cover object-center border border-brand-light-gray shrink-0" 
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-serif text-sm font-semibold text-brand-charcoal line-clamp-2 leading-tight">{item.product.name}</h4>
                            <button 
                              onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                              className="clickable p-1 text-brand-gray hover:text-rose-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="font-sans text-[0.65rem] text-brand-gray mt-1 uppercase tracking-wider">
                            {item.product.subcategory} 
                            {item.selectedSize ? ` • Size: ${item.selectedSize}` : ''}
                            {item.selectedColor ? ` • Color: ${item.selectedColor}` : ''}
                          </p>
                        </div>
                        
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-brand-beige">
                          <div className="flex items-center border border-brand-light-gray bg-brand-beige">
                            <button 
                              onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.selectedSize, item.selectedColor)}
                              className="clickable p-1 hover:bg-brand-light-gray"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2.5 font-mono text-xs text-brand-charcoal font-semibold">{item.quantity}</span>
                            <button 
                              onClick={() => updateCartQuantity(item.product.id, item.quantity + 1, item.selectedSize, item.selectedColor)}
                              className="clickable p-1 hover:bg-brand-light-gray"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="font-serif text-sm font-semibold text-brand-charcoal">
                            ${((item.product.sale_price || item.product.price) * item.quantity)} USD
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-brand-light-gray pt-4 mt-4 bg-brand-beige">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-sans text-xs tracking-wider uppercase text-brand-gray font-medium">Sartorial Subtotal</span>
                  <span className="font-serif text-lg font-bold text-brand-charcoal">${subtotal} USD</span>
                </div>
                <button 
                  onClick={() => { setIsCartOpen(false); navigate('/checkout'); }}
                  className="clickable w-full font-sans text-xs uppercase tracking-widest bg-brand-charcoal hover:bg-brand-gray hover:text-white text-white py-4 text-center font-semibold"
                >
                  Proceed to Secure Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ACCOUNT & ROLE SWITCHER DRAWER */}
      {isAccountOpen && (
        <div id="account-drawer" className="fixed inset-0 z-[180] flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsAccountOpen(false)} />
          <div className="relative w-full max-w-md bg-brand-beige h-full flex flex-col shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-brand-light-gray">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-brand-charcoal" />
                <h3 className="font-serif text-lg tracking-wider font-semibold text-brand-charcoal uppercase">
                  {currentUser ? 'My Profile' : 'Access Member Area'}
                </h3>
              </div>
              <button onClick={() => setIsAccountOpen(false)} className="clickable p-2 text-brand-charcoal hover:bg-brand-light-gray rounded">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 no-scrollbar">
              {currentUser ? (
                <div className="flex flex-col gap-6">
                  {/* Account Header */}
                  <div className="flex items-center gap-4 bg-white p-4 border border-brand-light-gray justify-start w-full text-left">
                    {activeRole === 'admin' || activeRole === 'editor' ? (
                      <img 
                        src={founderProfile.profile_image_url} 
                        alt="Founder avatar" 
                        className="h-14 w-14 rounded-full object-cover border border-brand-gold shrink-0 bg-white"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-full bg-brand-charcoal text-brand-beige flex items-center justify-center font-serif text-lg font-bold uppercase shrink-0 border border-brand-gold">
                        {currentUser.name ? currentUser.name.trim().charAt(0).toUpperCase() : 'C'}
                      </div>
                    )}
                    <div>
                      {activeRole === 'admin' ? (
                        <>
                          <h4 className="font-serif text-base font-semibold text-brand-charcoal leading-none mb-1">{founderProfile.name}</h4>
                          <p className="font-sans text-xs text-brand-gray">{currentUser.email}</p>
                          <span className="inline-block mt-2 text-[0.55rem] uppercase tracking-widest bg-brand-gold text-white px-2.5 py-1 rounded-full font-bold">
                            ADMIN BADGE
                          </span>
                        </>
                      ) : activeRole === 'editor' ? (
                        <>
                          <h4 className="font-serif text-base font-semibold text-brand-charcoal leading-none mb-1">Elite Style Editor</h4>
                          <p className="font-sans text-xs text-brand-gray">{currentUser.email}</p>
                          <span className="inline-block mt-2 text-[0.55rem] uppercase tracking-widest bg-brand-charcoal text-white px-2.5 py-1 rounded-full font-bold">
                            EDITOR BADGE
                          </span>
                        </>
                      ) : (
                        <>
                          <h4 className="font-serif text-base font-semibold text-brand-charcoal leading-none mb-1">{currentUser.name}</h4>
                          <p className="font-sans text-xs text-brand-gray">{currentUser.email}</p>
                          <span className="inline-block mt-2 text-[0.55rem] uppercase tracking-widest bg-brand-beige text-brand-charcoal px-2 py-1 rounded-full font-bold border border-brand-light-gray">
                            Customer Access
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* SIMULATE ROLE SWITCHER (Fascinating feature for verification!) */}
                  <div className="bg-brand-gold/10 p-4 border border-brand-gold/30">
                    <div className="flex items-center gap-1.5 text-brand-gold-dark font-medium mb-2">
                      <Sliders className="h-4 w-4" />
                      <span className="font-sans text-[0.7rem] uppercase tracking-widest">Aistudio Interactive Role-Switcher</span>
                    </div>
                    <p className="font-sans text-[0.7rem] text-brand-charcoal/80 mb-3 leading-relaxed">
                      Instantly change roles below to verify permission access levels without re-logging!
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {(['customer', 'editor', 'admin'] as const).map(role => (
                        <button 
                          key={role}
                          onClick={() => simulateRoleChange(role)}
                          className={`clickable py-1.5 px-1 text-[0.65rem] uppercase tracking-wider text-center border font-semibold ${
                            activeRole === role 
                              ? 'bg-brand-charcoal text-white border-brand-charcoal' 
                              : 'bg-white text-brand-charcoal border-brand-light-gray hover:bg-brand-light-gray/30'
                          }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Shortcut navigation based on roles */}
                  <div className="flex flex-col gap-2">
                    {/* Admin/Editor Dashboard links */}
                    {(activeRole === 'admin' || activeRole === 'editor') && (
                      <button 
                        onClick={() => { setIsAccountOpen(false); navigate('/admin'); }}
                        className="clickable flex items-center justify-between p-3.5 bg-brand-charcoal text-white hover:bg-brand-gray font-sans text-xs tracking-widest uppercase transition-all"
                      >
                        <span className="flex items-center gap-2">
                          <LayoutDashboard className="h-4 w-4" /> Go to Administrative Dashboard
                        </span>
                        <span>→</span>
                      </button>
                    )}

                    <div className="bg-white border border-brand-light-gray p-4 flex flex-col gap-2.5">
                      <h5 className="font-sans text-[0.7rem] uppercase tracking-widest text-brand-gray border-b border-brand-beige pb-1.5 mb-1">
                        Customer Actions
                      </h5>
                      <span onClick={() => { setIsAccountOpen(false); navigate('/home'); }} className="clickable text-xs hover:text-brand-gold py-1 block">Browse Collection Catalogs</span>
                      <span onClick={() => { setIsAccountOpen(false); setIsWishlistOpen(true); }} className="clickable text-xs hover:text-brand-gold py-1 block">My Personal Wishlist ({wishlist.length})</span>
                      <span onClick={() => { setIsAccountOpen(false); setIsCartOpen(true); }} className="clickable text-xs hover:text-brand-gold py-1 block">Active Shopping Cart ({cart.length})</span>
                    </div>
                  </div>

                  {/* Log Out */}
                  <button 
                    onClick={() => { logout(); setIsAccountOpen(false); navigate('/home'); }}
                    className="clickable mt-4 flex items-center justify-center gap-2 border border-rose-600 text-rose-600 hover:bg-rose-50 py-3 font-sans text-xs tracking-widest uppercase font-semibold"
                  >
                    <LogOut className="h-4 w-4" /> Log out of account
                  </button>
                </div>
              ) : (
                /* Login / Signup Simple Simulated form */
                <LoginForm onLoginSuccess={() => setIsAccountOpen(false)} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* INTERNAL COMPONENT OF NAVBAR FOR SIGNIN SIMULATOR */
const LoginForm: React.FC<{ onLoginSuccess: () => void }> = ({ onLoginSuccess }) => {
  const { login, signUp } = useStore();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'admin' | 'editor' | 'customer'>('customer');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email) {
      setError('Please provide an email Address');
      return;
    }

    try {
      if (isSignUp) {
        if (!name) {
          setError('Please provide your name');
          return;
        }
        await signUp(email, name, role);
        setSuccess('Account registered successfully! Welcome.');
      } else {
        await login(email);
        setSuccess('Authorised access successful! Redirecting...');
      }
      
      setTimeout(() => {
        onLoginSuccess();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'An unexpected authentication error occurred.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-5 border border-brand-light-gray">
      <h4 className="font-serif text-lg font-semibold text-brand-charcoal text-center mb-1">
        {isSignUp ? 'Create Elite Profile' : 'Authenticate Access'}
      </h4>
      <p className="font-sans text-[0.7rem] text-brand-gray text-center leading-relaxed mb-2">
        Unlock premium ordering tracking, priority reservation lists, and exclusive collection releases.
      </p>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-2.5 text-center font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs p-2.5 text-center font-medium flex items-center justify-center gap-1">
          <CheckCircle2 className="h-4 w-4" /> {success}
        </div>
      )}

      {isSignUp && (
        <div className="flex flex-col gap-1">
          <label className="font-sans text-[0.65rem] tracking-widest uppercase text-brand-gray">Full Name</label>
          <input 
            type="text" 
            placeholder="Fumilayo Thomas" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-brand-light-gray p-2.5 text-xs outline-none bg-brand-beige"
          />
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label className="font-sans text-[0.65rem] tracking-widest uppercase text-brand-gray">Email Address</label>
        <input 
          type="email" 
          placeholder="email@example.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-brand-light-gray p-2.5 text-xs outline-none bg-brand-beige"
        />
      </div>

      {isSignUp && (
        <div className="flex flex-col gap-1">
          <label className="font-sans text-[0.65rem] tracking-widest uppercase text-brand-gray">Select Authorized Role</label>
          <select 
            value={role}
            onChange={(e: any) => setRole(e.target.value)}
            className="border border-brand-light-gray p-2.5 text-xs outline-none bg-brand-beige clickable uppercase font-medium"
          >
            <option value="customer">Customer Access</option>
            <option value="editor">Editor Access</option>
            <option value="admin">Admin Privilege</option>
          </select>
        </div>
      )}

      <button 
        type="submit"
        className="clickable w-full bg-brand-charcoal hover:bg-brand-gray hover:text-white text-white font-sans text-xs tracking-widest uppercase py-3 font-semibold mt-2"
      >
        {isSignUp ? 'Generate Member Profile' : 'Authenticate member ID'}
      </button>

      <div className="text-center mt-2 border-t border-brand-beige pt-3">
        <span 
          onClick={() => setIsSignUp(!isSignUp)} 
          className="clickable font-sans text-[0.65rem] tracking-widest uppercase text-brand-gold hover:underline"
        >
          {isSignUp 
            ? 'Already have an elite profile? Login' 
            : 'New to Fitins & Cute? Create Profile'}
        </span>
      </div>

      <div className="bg-brand-beige p-3 text-[0.65rem] text-brand-gray/80 leading-relaxed font-mono">
        <strong>Dev Tip:</strong> Login with <span className="underline">fumilayo@fitinscute.com</span> to automatically gain Admin Privilege. Any new email login is fully functional.
      </div>
    </form>
  );
};
