import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { Product, BlogPost, Order, OrderStatus, BlogComment, Review } from '../types';
import { 
  Users, ShoppingBag, DollarSign, BookOpen, MessageSquare, ShieldAlert,
  Trash2, Edit, Plus, CheckCircle, Clock, X, Eye, Settings, Upload, Save, HelpCircle
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentUser, activeRole, products, orders, blogPosts, comments, reviews, subscribers,
    addProduct, updateProduct, deleteProduct, updateOrderStatus, deleteOrder,
    approveComment, deleteComment, approveReview, deleteReview, addBlogPost, deleteBlogPost
  } = useStore();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'blogs' | 'comments' | 'reviews' | 'subscribers'>('dashboard');

  // Product Creator state
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProd, setNewProd] = useState({
    name: '',
    description: '',
    price: 150,
    main_category: 'hair' as 'hair' | 'women' | 'men',
    subcategory: 'Wigs',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800',
    inventory: 20,
    features: ''
  });

  // Blog Creator state
  const [isAddingBlog, setIsAddingBlog] = useState(false);
  const [newBlog, setNewBlog] = useState({
    title: '',
    summary: '',
    content: '',
    category: 'Fashion & Style',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800'
  });

  // PROTECTING ROUTE GUIDELINES:
  // If no user is logged in, or role is Customer -> Lock out page immediately!
  if (!currentUser || (activeRole !== 'admin' && activeRole !== 'editor')) {
    return (
      <div id="unauthorized-lock-screen" className="bg-brand-beige min-h-[85vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-brand-light-gray p-8 text-center shadow-xl">
          <div className="flex justify-center mb-4">
            <ShieldAlert className="h-14 w-14 text-rose-600" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-brand-charcoal mb-2">Access Unauthorized</h1>
          <p className="font-serif text-sm text-brand-gray font-light leading-relaxed mb-6 text-[#555555]">
            This portal is restricted to authorized administrative personel, curators, and style editors. Customers lack privilege permissions.
          </p>

          <div className="bg-brand-beige p-4 rounded text-left border border-brand-light-gray mb-6 text-xs text-brand-gray font-mono leading-relaxed">
            <strong>Active Role:</strong> {activeRole.toUpperCase()}<br />
            <strong>Required Privilege:</strong> ADMIN or EDITOR
          </div>

          <div className="flex flex-col gap-2.5">
            <button 
              onClick={() => navigate('/home')}
              className="clickable bg-brand-charcoal hover:bg-brand-gray text-white font-sans text-xs uppercase tracking-widest py-3.5 font-bold"
            >
              Back to Home Store
            </button>
            <span className="font-sans text-[0.65rem] tracking-widest text-brand-gray uppercase">OR</span>
            <div className="bg-brand-gold/10 p-4 border border-brand-gold/30">
              <span className="font-sans text-[0.65rem] text-brand-gold-dark font-bold block mb-1">LOG IN AS AN ADMIN FOR DEMO ACCORDINGLY:</span>
              <p className="font-serif text-[0.7rem] text-brand-charcoal leading-normal mb-3">
                Open the member account section in the top navigation bar, sign in with email <strong>fumilayo@fitinscute.com</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- STATS MATHEMATICAL COMPILING ---
  const totalFinancialSales = orders
    .filter(o => o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered')
    .reduce((sum, o) => sum + o.total_amount, 0);

  const totalCoutureOrdersCount = orders.length;
  const activeSubscribersCount = subscribers.filter(s => s.status === 'active').length;
  const totalCoutureProductsCount = products.length;

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name || !newProd.description) return;

    const parsedFeatures = newProd.features
      ? newProd.features.split('\n').filter(f => f.trim())
      : [];

    addProduct({
      name: newProd.name,
      description: newProd.description,
      price: Number(newProd.price),
      main_category: newProd.main_category,
      subcategory: newProd.subcategory,
      images: [newProd.image],
      inventory: Number(newProd.inventory),
      is_featured: true,
      is_bestseller: false,
      is_new: true,
      features: parsedFeatures.length > 0 ? parsedFeatures : undefined
    });

    setIsAddingProduct(false);
    setNewProd({
      name: '',
      description: '',
      price: 150,
      main_category: 'hair',
      subcategory: 'Wigs',
      image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800',
      inventory: 20,
      features: ''
    });
  };

  const handleCreateBlogPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlog.title || !newBlog.content) return;

    addBlogPost({
      title: newBlog.title,
      summary: newBlog.summary || newBlog.content.slice(0, 100) + '...',
      content: newBlog.content,
      author_name: currentUser.name,
      author_role: currentUser.role === 'admin' ? 'Founder & Chief Curator' : 'Content Editor',
      category: newBlog.category,
      image: newBlog.image,
      is_featured: false
    });

    setIsAddingBlog(false);
    setNewBlog({
      title: '',
      summary: '',
      content: '',
      category: 'Fashion & Style',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800'
    });
  };

  return (
    <div id="admin-dashboard-container" className="min-h-screen bg-brand-beige py-12 px-4 md:px-8">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row gap-8">
        
        {/* LEFT COMPONENT: Admin Utility Navigation bar (3 cols / md:w-64) */}
        <aside className="w-full md:w-64 bg-white border border-brand-light-gray h-fit shrink-0 p-6 flex flex-col gap-6">
          <div className="border-b border-brand-light-gray pb-4">
            <h2 className="font-serif text-xl font-bold text-brand-charcoal uppercase leading-none mb-1">Privilege portal</h2>
            <span className="font-sans text-[0.65rem] tracking-widest text-brand-gold uppercase font-bold">
              AUTHORIZED ROLE: {activeRole}
            </span>
          </div>

          <nav className="flex flex-col gap-1.5 text-left">
            {[
              { id: 'dashboard', label: 'Dashboard Hub', icon: DollarSign },
              { id: 'products', label: 'Couture Products', icon: ShoppingBag },
              { id: 'orders', label: 'Customer Orders', icon: ShoppingBag },
              { id: 'blogs', label: 'Journal Posts', icon: BookOpen },
              { id: 'comments', label: 'Moderation Comments', icon: MessageSquare },
              { id: 'reviews', label: 'Customer Reviews', icon: MessageSquare },
              { id: 'subscribers', label: 'Newsletter list', icon: Users }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id as any); setIsAddingProduct(false); setIsAddingBlog(false); }}
                  className={`clickable flex items-center gap-3 py-2 px-3 text-xs tracking-wider uppercase font-semibold transition-all border ${
                    activeTab === tab.id 
                      ? 'bg-brand-charcoal text-white border-brand-charcoal' 
                      : 'bg-white border-transparent text-brand-charcoal hover:bg-brand-beige'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" /> {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* RIGHT COMPONENT: Operational View (9 cols / flex-1) */}
        <main className="flex-1 bg-white border border-brand-light-gray p-6 md:p-8">
          
          {/* ================ TABCARD 1: MAIN METRIC HUB DAHBOARD ================ */}
          {activeTab === 'dashboard' && (
            <div id="tab-dashboard" className="flex flex-col gap-8">
              <h3 className="font-serif text-2xl font-light text-brand-charcoal border-b border-brand-light-gray pb-3 text-left">
                Administrative Performance Summary
              </h3>

              {/* Stat Bento Grids */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-brand-beige p-5 border border-brand-light-gray flex flex-col justify-between">
                  <span className="font-sans text-[0.62rem] tracking-widest uppercase text-brand-gray font-bold">Sales Gross Charge</span>
                  <span className="font-serif text-2xl font-bold text-brand-gold mt-2 block">${totalFinancialSales} USD</span>
                </div>
                <div className="bg-brand-beige p-5 border border-brand-light-gray flex flex-col justify-between">
                  <span className="font-sans text-[0.62rem] tracking-widest uppercase text-brand-gray font-bold">Secured transacts</span>
                  <span className="font-serif text-2xl font-bold text-brand-charcoal mt-2 block">{totalCoutureOrdersCount} Orders</span>
                </div>
                <div className="bg-brand-beige p-5 border border-brand-light-gray flex flex-col justify-between">
                  <span className="font-sans text-[0.62rem] tracking-widest uppercase text-brand-gray font-bold">Inner-Circle members</span>
                  <span className="font-serif text-2xl font-bold text-brand-charcoal mt-2 block">{activeSubscribersCount} Subscribers</span>
                </div>
                <div className="bg-brand-beige p-5 border border-brand-light-gray flex flex-col justify-between">
                  <span className="font-sans text-[0.62rem] tracking-widest uppercase text-brand-gray font-bold">Handcrafted units</span>
                  <span className="font-serif text-2xl font-bold text-brand-charcoal mt-2 block">{totalCoutureProductsCount} Silhouettes</span>
                </div>
              </div>

              {/* Visual summaries of orders */}
              <div className="text-left border border-brand-light-gray p-6">
                <h4 className="font-serif text-lg font-bold text-brand-charcoal border-b border-brand-light-gray pb-2 mb-4">
                  Incoming Orders Queue
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-brand-beige/50 p-4 border border-brand-light-gray">
                    <span className="font-sans text-[0.65rem] text-brand-gray block uppercase font-bold mb-1">Queue Statuses</span>
                    <div className="flex gap-4 font-mono text-xs items-center mt-2.5">
                      <div className="flex gap-1.5 items-center bg-white p-2 border border-brand-light-gray">
                        <Clock className="h-4 w-4 text-brand-gold" />
                        <span>Pending ({orders.filter(o => o.status === 'pending').length})</span>
                      </div>
                      <div className="flex gap-1.5 items-center bg-white p-2 border border-brand-light-gray">
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                        <span>Authorized ({orders.filter(o => o.status === 'paid').length})</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-brand-beige/50 p-4 border border-brand-light-gray">
                    <span className="font-sans text-[0.65rem] text-brand-gray block uppercase font-bold mb-1">Administrative Rules</span>
                    <p className="font-serif text-[0.7rem] leading-relaxed italic text-brand-gray mt-1 font-light">
                      Under founders direct guidance, order tracking statuses updated here instantly compile back to safe persistent local storages, syncing with user interfaces.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================ TABCARD 2: COUTURE PRODUCTS MANAGER ================ */}
          {activeTab === 'products' && (
            <div id="tab-products" className="text-left flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-brand-light-gray pb-3">
                <h3 className="font-serif text-2xl font-light text-brand-charcoal">
                  Products Collection Manager ({products.length} units)
                </h3>
                {!isAddingProduct && (
                  <button 
                    onClick={() => setIsAddingProduct(true)}
                    className="clickable bg-brand-charcoal text-white text-xs tracking-widest uppercase py-2 px-4 font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="h-4 w-4" /> Introduce Product
                  </button>
                )}
              </div>

              {/* Product addition Form panel */}
              {isAddingProduct ? (
                <form onSubmit={handleCreateProduct} className="bg-brand-beige p-6 border border-brand-light-gray flex flex-col gap-4">
                  <div className="flex justify-between items-baseline border-b border-brand-light-gray pb-2 mb-2">
                    <h4 className="font-serif text-lg font-bold text-brand-charcoal">Introduce Couture Unit</h4>
                    <button type="button" onClick={() => setIsAddingProduct(false)} className="clickable p-1 text-brand-gray hover:text-brand-charcoal">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="font-sans text-[0.62rem] tracking-widest uppercase text-brand-gray font-bold">Silhouette Title</label>
                      <input 
                        type="text" 
                        placeholder="Fumi Luxury Frontal Wig 2.0" 
                        value={newProd.name}
                        onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                        className="bg-white border border-brand-light-gray p-2 text-xs outline-none focus:border-brand-gold"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-sans text-[0.62rem] tracking-widest uppercase text-brand-gray font-bold">Investment Price (USD)</label>
                      <input 
                        type="number" 
                        value={newProd.price}
                        onChange={(e) => setNewProd({ ...newProd, price: Number(e.target.value) })}
                        className="bg-white border border-brand-light-gray p-2 text-xs outline-none focus:border-brand-gold"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="font-sans text-[0.62rem] tracking-widest uppercase text-brand-gray font-bold">Line Curation</label>
                      <select 
                        value={newProd.main_category}
                        onChange={(e: any) => setNewProd({ ...newProd, main_category: e.target.value })}
                        className="bg-white border border-brand-light-gray p-2 text-xs outline-none clickable uppercase font-medium"
                      >
                        <option value="hair">Premium Hair</option>
                        <option value="women">Women's Line</option>
                        <option value="men">Men's Line</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-sans text-[0.62rem] tracking-widest uppercase text-brand-gray font-bold">Sub-Curation Tab</label>
                      <input 
                        type="text" 
                        placeholder="Melted Lace Frontal, Dresses, Traditional..." 
                        value={newProd.subcategory}
                        onChange={(e) => setNewProd({ ...newProd, subcategory: e.target.value })}
                        className="bg-white border border-brand-light-gray p-2 text-xs outline-none focus:border-brand-gold"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-sans text-[0.62rem] tracking-widest uppercase text-brand-gray font-bold">Stock Inventory units</label>
                      <input 
                        type="number" 
                        value={newProd.inventory}
                        onChange={(e) => setNewProd({ ...newProd, inventory: Number(e.target.value) })}
                        className="bg-white border border-brand-light-gray p-2 text-xs outline-none focus:border-brand-gold"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-sans text-[0.62rem] tracking-widest uppercase text-brand-gray font-bold">Atelier Description</label>
                    <textarea 
                      rows={3} 
                      value={newProd.description}
                      onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                      className="bg-white border border-brand-light-gray p-2 text-xs outline-none focus:border-brand-gold resize-none"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-sans text-[0.62rem] tracking-widest uppercase text-brand-gray font-bold">Features (One line per feature)</label>
                    <textarea 
                      placeholder="Indicates double-drawn cuticle-aligned alignment&#10;Includes luxury silk travel preserve wraps"
                      rows={2} 
                      value={newProd.features}
                      onChange={(e) => setNewProd({ ...newProd, features: e.target.value })}
                      className="bg-white border border-brand-light-gray p-2 text-xs outline-none focus:border-brand-gold resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-sans text-[0.62rem] tracking-widest uppercase text-brand-gray font-bold">Unsplash Direct Image URL</label>
                    <input 
                      type="text" 
                      value={newProd.image}
                      onChange={(e) => setNewProd({ ...newProd, image: e.target.value })}
                      className="bg-white border border-brand-light-gray p-2 text-xs outline-none focus:border-brand-gold"
                      required
                    />
                  </div>

                  <button 
                    type="submit"
                    className="clickable bg-brand-charcoal text-white font-sans text-xs tracking-widest uppercase py-3 font-semibold text-center border mt-2 hover:bg-brand-gray"
                  >
                    Commit Introduce Curation Piece
                  </button>
                </form>
              ) : (
                /* Traditional lists */
                <div className="overflow-x-auto no-scrollbar border border-brand-light-gray">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-brand-beige border-b border-brand-light-gray font-sans uppercase font-bold text-[0.6rem] text-brand-gray">
                        <th className="p-3">Piece Details</th>
                        <th className="p-3">Main Line</th>
                        <th className="p-3">Curation Category</th>
                        <th className="p-3 text-right">Budget Price</th>
                        <th className="p-3 text-center">Inv Stock</th>
                        <th className="p-3 text-right">Atelier Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(p => (
                        <tr key={p.id} className="border-b border-brand-light-gray bg-white hover:bg-brand-beige/25">
                          <td className="p-3 font-serif font-bold flex gap-3 items-center">
                            <img src={p.images[0]} alt={p.name} className="h-10 w-8 object-cover border border-brand-light-gray" referrerPolicy="no-referrer" />
                            <span className="line-clamp-1">{p.name}</span>
                          </td>
                          <td className="p-3 uppercase tracking-wider font-mono text-[0.62rem] text-brand-gold font-bold">{p.main_category}</td>
                          <td className="p-3 text-[#555555] font-medium">{p.subcategory}</td>
                          <td className="p-3 text-right font-serif font-bold">${p.price} USD</td>
                          <td className="p-3 text-center font-mono font-bold">
                            <span className={`px-2 py-0.5 ${p.inventory <= 5 ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                              {p.inventory}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button 
                              onClick={() => deleteProduct(p.id)}
                              className="clickable p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ================ TABCARD 3: CUSTOMER ORDERS VIEW ================ */}
          {activeTab === 'orders' && (
            <div id="tab-orders" className="text-left flex flex-col gap-6">
              <h3 className="font-serif text-2xl font-light text-brand-charcoal border-b border-brand-light-gray pb-3">
                Couture Order Fulfillment Matrix ({orders.length} units)
              </h3>

              <div className="overflow-x-auto no-scrollbar border border-brand-light-gray">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-brand-beige border-b border-brand-light-gray font-sans uppercase font-bold text-[0.6rem] text-brand-gray">
                      <th className="p-3">Order Code</th>
                      <th className="p-3">Customer Profile</th>
                      <th className="p-3">Date Submitted</th>
                      <th className="p-3 text-right">Total Charges</th>
                      <th className="p-3 text-center">Fulfillment Status</th>
                      <th className="p-3 text-right">Administrative</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id} className="border-b border-brand-light-gray bg-white hover:bg-brand-beige/25">
                        <td className="p-3 font-mono font-bold text-[0.65rem] text-brand-gold-dark">{o.id}</td>
                        <td className="p-3 flex flex-col font-serif">
                          <span className="font-bold">{o.customer_name}</span>
                          <span className="text-[0.65rem] text-brand-gray font-sans">{o.customer_email}</span>
                        </td>
                        <td className="p-3 text-brand-gray font-mono text-[0.65rem]">{new Date(o.created_at).toLocaleString()}</td>
                        <td className="p-3 text-right font-serif font-bold text-brand-charcoal">${o.total_amount} USD</td>
                        <td className="p-3 text-center">
                          <select 
                            value={o.status}
                            onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                            className="border border-brand-light-gray p-1 text-[0.65rem] outline-none clickable uppercase font-bold bg-white text-brand-charcoal"
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-3 text-right">
                          <button 
                            onClick={() => deleteOrder(o.id)}
                            className="clickable p-1.5 text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center font-serif text-brand-gray italic">
                          No customer orders have been authorized on the system yet. Place mock orders in the store page to generate records.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================ TABCARD 4: JOURNAL POSTS EDITOR ================ */}
          {activeTab === 'blogs' && (
            <div id="tab-blogs" className="text-left flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-brand-light-gray pb-3">
                <h3 className="font-serif text-2xl font-light text-brand-charcoal">
                  Journal Entry Editors ({blogPosts.length} essays)
                </h3>
                {!isAddingBlog && (
                  <button 
                    onClick={() => setIsAddingBlog(true)}
                    className="clickable bg-brand-charcoal text-white text-xs tracking-widest uppercase py-2 px-4 font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="h-4 w-4" /> Pen Curation Essay
                  </button>
                )}
              </div>

              {isAddingBlog ? (
                <form onSubmit={handleCreateBlogPost} className="bg-brand-beige p-6 border border-brand-light-gray flex flex-col gap-4">
                  <div className="flex justify-between items-baseline border-b border-brand-light-gray pb-2 mb-2">
                    <h4 className="font-serif text-lg font-bold text-brand-charcoal">Pen Curation Essay</h4>
                    <button type="button" onClick={() => setIsAddingBlog(false)} className="clickable p-1 text-brand-gray hover:text-brand-charcoal">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-sans text-[0.62rem] tracking-widest uppercase text-brand-gray font-bold">Essay Title</label>
                    <input 
                      type="text" 
                      placeholder="The Texture of Silk Drapes" 
                      value={newBlog.title}
                      onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                      className="bg-white border border-brand-light-gray p-2.5 text-xs outline-none focus:border-brand-gold"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="font-sans text-[0.62rem] tracking-widest uppercase text-brand-gray font-bold">Curation Category</label>
                      <input 
                        type="text" 
                        value={newBlog.category}
                        onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                        className="bg-white border border-brand-light-gray p-2 text-xs outline-none focus:border-brand-gold"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-sans text-[0.62rem] tracking-widest uppercase text-brand-gray font-bold">Unsplash Banner Image</label>
                      <input 
                        type="text" 
                        value={newBlog.image}
                        onChange={(e) => setNewBlog({ ...newBlog, image: e.target.value })}
                        className="bg-white border border-brand-light-gray p-2 text-xs outline-none focus:border-brand-gold"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-sans text-[0.62rem] tracking-widest uppercase text-brand-gray font-bold">Brief summary</label>
                    <textarea 
                      rows={2} 
                      value={newBlog.summary}
                      onChange={(e) => setNewBlog({ ...newBlog, summary: e.target.value })}
                      placeholder="Enter a brief, eye-catching summary detailing design, hair care secrets, or heritage lines..."
                      className="bg-white border border-brand-light-gray p-2.5 text-xs outline-none focus:border-brand-gold resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-sans text-[0.62rem] tracking-widest uppercase text-brand-gray font-bold">Full Essay Content</label>
                    <textarea 
                      rows={8} 
                      value={newBlog.content}
                      onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                      placeholder="Use detailed paragraphs to outline recommendations, thermal heat limits, pattern alignments..."
                      className="bg-white border border-brand-light-gray p-2.5 text-xs outline-none focus:border-brand-gold resize-none"
                      required
                    />
                  </div>

                  <button 
                    type="submit"
                    className="clickable bg-brand-charcoal text-white font-sans text-xs tracking-widest uppercase py-3 font-semibold text-center border mt-2 hover:bg-brand-gray"
                  >
                    Commit Publish Curation Essay
                  </button>
                </form>
              ) : (
                <div className="flex flex-col gap-4">
                  {blogPosts.map(post => (
                    <div key={post.id} className="flex gap-4 p-4 border border-brand-light-gray bg-white justify-between items-center bg-brand-beige/10">
                      <div className="flex gap-4 items-center">
                        <img src={post.image} alt={post.title} className="h-14 w-12 object-cover border" referrerPolicy="no-referrer" />
                        <div>
                          <span className="font-mono text-[0.55rem] text-brand-gold uppercase tracking-widest block font-bold">{post.category}</span>
                          <h4 className="font-serif text-sm font-semibold text-brand-charcoal leading-tight mt-0.5">{post.title}</h4>
                          <span className="font-sans text-[0.65rem] text-brand-gray">By {post.author_name}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => deleteBlogPost(post.id)}
                        className="clickable p-2 text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================ TABCARD 5: ESSAY DISCUSSIONS MODERATOR ================ */}
          {activeTab === 'comments' && (
            <div id="tab-comments" className="text-left flex flex-col gap-6">
              <h3 className="font-serif text-2xl font-light text-brand-charcoal border-b border-brand-light-gray pb-3">
                Essay Discussions & Commentary Moderation ({comments.length} commentaries)
              </h3>

              <div className="flex flex-col gap-4">
                {comments.map((comment) => {
                  const blogIdMatch = blogPosts.find(b => b.id === comment.post_id);
                  return (
                    <div key={comment.id} className="p-4 bg-brand-beige/35 border border-brand-light-gray flex flex-col gap-2">
                      <div className="flex justify-between items-baseline">
                        <div className="flex gap-2 items-baseline font-serif text-xs">
                          <strong className="text-brand-charcoal font-semibold">{comment.user_name}</strong>
                          <span className="text-brand-gray font-sans select-none">•</span>
                          <span className="text-brand-gray font-mono text-[0.65rem]">{comment.user_email}</span>
                        </div>
                        <div className="flex gap-1">
                          {!comment.is_approved && (
                            <button 
                              onClick={() => approveComment(comment.id)}
                              className="clickable text-[0.62rem] font-sans font-bold uppercase tracking-widest bg-emerald-700 text-white py-1 px-3.5"
                            >
                              Approve
                            </button>
                          )}
                          <button 
                            onClick={() => deleteComment(comment.id)}
                            className="clickable p-1 text-rose-600 hover:bg-rose-50 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="font-serif text-xs text-brand-charcoal/90 italic leading-relaxed">
                        "{comment.comment}"
                      </p>
                      <div className="font-mono text-[0.55rem] text-brand-gray/60 border-t border-brand-beige pt-2 mt-1 flex justify-between">
                        <span>POST ON: {blogIdMatch ? blogIdMatch.title : 'Deleted Post'}</span>
                        <span>{new Date(comment.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
                {comments.length === 0 && (
                  <p className="font-serif text-sm text-brand-gray italic text-center py-8 bg-brand-beige/50">No member commentaries exist on the journal yet.</p>
                )}
              </div>
            </div>
          )}

          {/* ================ TABCARD 6: PRODUCT REVIEWS MODERATOR ================ */}
          {activeTab === 'reviews' && (
            <div id="tab-reviews" className="text-left flex flex-col gap-6">
              <h3 className="font-serif text-2xl font-light text-brand-charcoal border-b border-brand-light-gray pb-3">
                Product Review stars & commentary moderation ({reviews.length} reviews)
              </h3>

              <div className="flex flex-col gap-4">
                {reviews.map((rev) => {
                  const productMatch = products.find(p => p.id === rev.product_id);
                  return (
                    <div key={rev.id} className="p-4 bg-brand-beige/35 border border-brand-light-gray flex flex-col gap-2">
                      <div className="flex justify-between items-baseline">
                        <div className="flex gap-2 items-baseline font-serif text-xs">
                          <strong className="text-brand-charcoal font-semibold">{rev.user_name}</strong>
                          <span className="text-brand-gray font-sans select-none">•</span>
                          <span className="text-brand-gray font-mono text-[0.65rem]">{rev.user_email}</span>
                        </div>
                        <div className="flex gap-1">
                          {!rev.is_approved && (
                            <button 
                              onClick={() => approveReview(rev.id)}
                              className="clickable text-[0.62rem] font-sans font-bold uppercase tracking-widest bg-emerald-700 text-white py-1 px-3.5"
                            >
                              Approve
                            </button>
                          )}
                          <button 
                            onClick={() => deleteReview(rev.id)}
                            className="clickable p-1 text-rose-600 hover:bg-rose-50 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="font-serif text-xs text-brand-charcoal/90 italic leading-relaxed">
                        "{rev.comment}"
                      </p>
                      <div className="font-mono text-[0.55rem] text-brand-gray/60 border-t border-brand-beige pt-2 mt-1 flex justify-between items-baseline">
                        <span>PRODUCT: {productMatch ? productMatch.name : 'Deleted Product'}</span>
                        <span>STARS: ★ {rev.rating}</span>
                        <span>{new Date(rev.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
                {reviews.length === 0 && (
                  <p className="font-serif text-sm text-brand-gray italic text-center py-8 bg-brand-beige/50">No customer product reviews exist on the system yet.</p>
                )}
              </div>
            </div>
          )}

          {/* ================ TABCARD 7: NEWSLETTER SUBSCRIBERS LIST ================ */}
          {activeTab === 'subscribers' && (
            <div id="tab-subscribers" className="text-left flex flex-col gap-6">
              <h3 className="font-serif text-2xl font-light text-brand-charcoal border-b border-brand-light-gray pb-3">
                Inner-Circle Subscribers & Lead emails ({subscribers.length} total)
              </h3>

              <div className="overflow-x-auto no-scrollbar border border-brand-light-gray">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-brand-beige border-b border-brand-light-gray font-sans uppercase font-bold text-[0.6rem] text-brand-gray">
                      <th className="p-3">Email Address</th>
                      <th className="p-3">Subscription timestamp</th>
                      <th className="p-3 text-right">Activity Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map(sub => (
                      <tr key={sub.id} className="border-b border-brand-light-gray bg-white hover:bg-brand-beige/25">
                        <td className="p-3 font-serif font-bold text-brand-charcoal text-xs">{sub.email}</td>
                        <td className="p-3 text-brand-gray font-mono text-[0.65rem]">{new Date(sub.subscribed_at).toLocaleString()}</td>
                        <td className="p-3 text-right">
                          <span className={`px-2.5 py-1 text-[0.6rem] uppercase tracking-widest font-bold rounded-full ${
                            sub.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {sub.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};
