import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, BlogPost, Testimonial, Order, BlogComment, Review, 
  NewsletterSubscriber, UserProfile, CartItem, OrderStatus, OrderItem, Coupon, UserRole,
  SiteSettings, FounderProfile
} from '../types';
import { 
  getStoredProducts, saveProducts,
  getStoredBlogPosts, saveBlogPosts,
  getStoredTestimonials, saveTestimonials,
  getStoredOrders, saveOrders,
  getStoredComments, saveComments,
  getStoredReviews, saveReviews,
  getStoredSubscribers, saveSubscribers,
  getStoredWishlists, saveWishlists,
  getCurrentUser, setCurrentUser,
  getAuthUsers, saveAuthUsers
} from '../data/db';
import { isSupabaseConfigured } from '../data/supabaseClient';
import { supabaseService } from '../data/supabaseService';

const IS_BROWSER = typeof window !== 'undefined';

function getLocalStorageItem<T>(key: string, defaultValue: T): T {
  if (!IS_BROWSER) return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

function setLocalStorageItem<T>(key: string, value: T): void {
  if (!IS_BROWSER) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing localStorage key "${key}":`, error);
  }
}

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: 'current-settings',
  logo_url: '',
  favicon_url: '',
  brand_name: 'Fitins & Cute Collections',
  business_email: 'fumilayo@fitinscute.com',
  whatsapp_number: '+2348030000000',
  contact_address: 'Lekki Phase 1, Lagos, Nigeria',
  currency: 'USD',
  shipping_settings: 'Free Shipping worldwide for selected couture items',
  tax_settings: '7.5% Government VAT Applied',
  flutterwave_pub: 'FLWPUB_MOCK_1234567890',
  flutterwave_sec: 'FLWSEC_MOCK_0987654321',
  paystack_pub: 'PSTKPUB_MOCK_1234567890',
  paystack_sec: 'PSTKSEC_MOCK_0987654321',
  stripe_pub: 'STRIPEPUB_MOCK_1234567890',
  stripe_sec: 'STRIPESEC_MOCK_0987654321',
  homepage_title: 'Fitins & Cute | Elite Curated Wigs & Luxury Pret-A-Porter',
  homepage_description: 'Step into handpicked perfection formulated by style specialist Fumilayo Thomas.',
  social_sharing_image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800'
};

const DEFAULT_FOUNDER_PROFILE: FounderProfile = {
  id: 'current-founder',
  name: 'Fumilayo Thomas',
  bio: `Fumilayo Thomas is an internationally recognized fashion director, visual curator, and the creative engine behind **Fitins & Cute Collections**. With years of experience traversing the sartorial hubs of Lagos, London, and New York, she established the label on a simple yet revolutionary premise: that true luxury belongs to those who carry their culture and identity raw, without compromise.\n\nFumilayo's philosophy resides squarely at the intersection of modern luxury structures and classic African narratives. Understanding that human hair integrations are vital crowns of identity, she personally sources raw individual Vietnamese and Temple-Indian donor hair weaves to build our hallmark HD Swiss lace frontals.\n\nThis same integrity permeates our womenswear and menswear collections. She partners with multi-generational tailoring houses to sculpt traditional cashmeres, agbadas, and flowing silk silhouettes that bridge physical comfort with dramatic editorial weights.`,
  signature: 'Fumilayo Thomas',
  quote: 'Couture is not merely fabric stitched together; it is an intimate conversation of personal heritage, spatial geometry, and unwavering self-appreciation.',
  profile_image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
  social_links: {
    instagram: 'https://instagram.com/fitinscute',
    twitter: 'https://twitter.com/fitinscute',
    facebook: 'https://facebook.com/fitinscute',
    linkedin: 'https://linkedin.com/in/fitinscute'
  },
  updated_at: new Date().toISOString()
};

interface StoreContextType {
  products: Product[];
  blogPosts: BlogPost[];
  testimonials: Testimonial[];
  orders: Order[];
  reviews: Review[];
  comments: BlogComment[];
  subscribers: NewsletterSubscriber[];
  cart: CartItem[];
  wishlist: string[];
  currentUser: UserProfile | null;
  activeRole: 'admin' | 'editor' | 'customer';
  coupons: Coupon[];
  siteSettings: SiteSettings;
  founderProfile: FounderProfile;
  customers: UserProfile[];
  
  // Cart Actions
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  
  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  
  // Auth Actions
  signUp: (email: string, name: string, role?: 'admin' | 'editor' | 'customer') => Promise<UserProfile>;
  login: (email: string) => Promise<UserProfile>;
  logout: () => void;
  simulateRoleChange: (role: 'admin' | 'editor' | 'customer') => void;
  updateCustomerStatus: (id: string, status: 'active' | 'suspended') => Promise<void>;
  
  // Checkout & Orders
  createOrder: (shipping: {
    name: string;
    email: string;
    address: string;
    city: string;
    country: string;
    postalCode?: string;
    phone: string;
  }, total: number, discount: number, couponCode?: string, method?: string) => Promise<Order>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  
  // Product Management
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'rating'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  adjustInventory: (productId: string, amount: number) => Promise<void>;
  
  // Review Actions
  addReview: (productId: string, userName: string, userEmail: string, rating: number, comment: string) => Promise<void>;
  approveReview: (reviewId: string) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
  
  // Blog Actions
  addBlogPost: (post: Omit<BlogPost, 'id' | 'published_at' | 'read_time'>) => Promise<void>;
  updateBlogPost: (post: BlogPost) => Promise<void>;
  deleteBlogPost: (id: string) => Promise<void>;
  addComment: (postId: string, name: string, email: string, comment: string) => Promise<void>;
  approveComment: (commentId: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  
  // Subscribers
  subscribeNewsletter: (email: string) => Promise<{ success: boolean; message: string }>;
  unsubscribeNewsletter: (email: string) => Promise<void>;
  
  // Testimonials
  addTestimonial: (name: string, role: string, content: string, rating: number) => void;
  approveTestimonial: (id: string) => void;
  deleteTestimonial: (id: string) => void;

  // Configurations
  updateSiteSettings: (settings: SiteSettings) => Promise<void>;
  updateFounderProfile: (founder: FounderProfile) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [currentUser, setLocalCurrentUser] = useState<UserProfile | null>(null);
  const [activeRole, setActiveRole] = useState<'admin' | 'editor' | 'customer'>('customer');

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [founderProfile, setFounderProfile] = useState<FounderProfile>(DEFAULT_FOUNDER_PROFILE);
  const [customers, setCustomers] = useState<UserProfile[]>([]);

  const coupons: Coupon[] = [
    { code: 'FUMI10', discount_type: 'percent', discount_value: 10 },
    { code: 'LUXURY20', discount_type: 'percent', discount_value: 20 },
    { code: 'CUTE100', discount_type: 'fixed', discount_value: 100, min_spend: 500 },
    { code: 'WELCOME50', discount_type: 'fixed', discount_value: 50, min_spend: 200 }
  ];

  // Load Initial State from Local / Cache, then sync with live Supabase
  useEffect(() => {
    setProducts(getStoredProducts());
    setBlogPosts(getStoredBlogPosts());
    setTestimonials(getStoredTestimonials());
    setOrders(getStoredOrders());
    setReviews(getStoredReviews());
    setComments(getStoredComments());
    setSubscribers(getStoredSubscribers());
    setWishlist(getStoredWishlists());
    
    const localSettings = getLocalStorageItem<SiteSettings>('fc_site_settings', DEFAULT_SITE_SETTINGS);
    setSiteSettings(localSettings);

    const localFounder = getLocalStorageItem<FounderProfile>('fc_founder_profile', DEFAULT_FOUNDER_PROFILE);
    setFounderProfile(localFounder);

    const users = getAuthUsers();
    setCustomers(users);
    
    const user = getCurrentUser();
    if (user) {
      setLocalCurrentUser(user);
      setActiveRole(user.role);
    }

    // Load Cart from localStorage if in browser
    const savedCart = localStorage.getItem('fc_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (err) {
        console.error('Error loading cart:', err);
      }
    }

    // Pull from Supabase
    const syncWithSupabase = async () => {
      const dbProds = await supabaseService.fetchProducts();
      if (dbProds && dbProds.length > 0) {
        setProducts(dbProds);
        saveProducts(dbProds);
      }

      const dbBlogs = await supabaseService.fetchBlogPosts();
      if (dbBlogs && dbBlogs.length > 0) {
        setBlogPosts(dbBlogs);
        saveBlogPosts(dbBlogs);
      }

      const dbOrders = await supabaseService.fetchOrders();
      if (dbOrders && dbOrders.length > 0) {
        setOrders(dbOrders);
        saveOrders(dbOrders);
      }

      const dbComments = await supabaseService.fetchComments();
      if (dbComments && dbComments.length > 0) {
        setComments(dbComments);
        saveComments(dbComments);
      }

      const dbReviews = await supabaseService.fetchReviews();
      if (dbReviews && dbReviews.length > 0) {
        setReviews(dbReviews);
        saveReviews(dbReviews);
      }

      const dbSubs = await supabaseService.fetchSubscribers();
      if (dbSubs && dbSubs.length > 0) {
        setSubscribers(dbSubs);
        saveSubscribers(dbSubs);
      }

      const dbProfiles = await supabaseService.fetchProfiles();
      if (dbProfiles && dbProfiles.length > 0) {
        setCustomers(dbProfiles);
        saveAuthUsers(dbProfiles);
        
        // Refresh session
        if (user) {
          const matched = dbProfiles.find(p => p.email.toLowerCase() === user.email.toLowerCase());
          if (matched) {
            setLocalCurrentUser(matched);
            setActiveRole(matched.role);
            setCurrentUser(matched);
          }
        }
      }

      const dbSettings = await supabaseService.fetchSiteSettings();
      if (dbSettings) {
        setSiteSettings(dbSettings);
        setLocalStorageItem('fc_site_settings', dbSettings);
      }

      const dbFounder = await supabaseService.fetchFounderProfile();
      if (dbFounder) {
        setFounderProfile(dbFounder);
        setLocalStorageItem('fc_founder_profile', dbFounder);
      }
    };

    if (isSupabaseConfigured) {
      syncWithSupabase();
    }
  }, []);

  // Save Cart helper
  const saveCartToStorage = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem('fc_cart', JSON.stringify(updatedCart));
  };

  // --- CART OPERATIONS ---
  const addToCart = (product: Product, quantity = 1, size?: string, color?: string) => {
    const existingIndex = cart.findIndex(
      item => item.product.id === product.id && 
              item.selectedSize === size && 
              item.selectedColor === color
    );
    let updatedCart = [...cart];
    
    if (existingIndex > -1) {
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart.push({ product, quantity, selectedSize: size, selectedColor: color });
    }
    saveCartToStorage(updatedCart);
  };

  const removeFromCart = (productId: string, size?: string, color?: string) => {
    const updatedCart = cart.filter(
      item => !(item.product.id === productId && 
                item.selectedSize === size && 
                item.selectedColor === color)
    );
    saveCartToStorage(updatedCart);
  };

  const updateCartQuantity = (productId: string, quantity: number, size?: string, color?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    const updatedCart = cart.map(item => {
      if (item.product.id === productId && 
          item.selectedSize === size && 
          item.selectedColor === color) {
        return { ...item, quantity };
      }
      return item;
    });
    saveCartToStorage(updatedCart);
  };

  const clearCart = () => {
    saveCartToStorage([]);
  };

  // --- WISHLIST ---
  const toggleWishlist = (productId: string) => {
    let updatedWishlist = [...wishlist];
    if (updatedWishlist.includes(productId)) {
      updatedWishlist = updatedWishlist.filter(id => id !== productId);
    } else {
      updatedWishlist.push(productId);
    }
    setWishlist(updatedWishlist);
    saveWishlists(updatedWishlist);
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // --- AUTH ACTIONS ---
  const signUp = async (email: string, name: string, role: UserRole = 'customer'): Promise<UserProfile> => {
    const allUsers = [...customers];
    const existing = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    // Default avatars matching Admin / Editor / Customer specified rules
    let avatarUrl = `https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300`;
    if (role === 'admin' || role === 'editor') {
      avatarUrl = founderProfile.profile_image_url;
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email,
      name,
      role,
      avatar_url: avatarUrl,
      status: 'active',
      created_at: new Date().toISOString()
    };

    const updatedUsers = [...allUsers, newUser];
    setCustomers(updatedUsers);
    saveAuthUsers(updatedUsers);
    setLocalCurrentUser(newUser);
    setActiveRole(newUser.role);
    setCurrentUser(newUser);

    if (isSupabaseConfigured) {
      await supabaseService.upsertProfile(newUser);
    }

    return newUser;
  };

  const login = async (email: string): Promise<UserProfile> => {
    const allUsers = [...customers];
    const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      // Auto-create a customer account if not found for seamless experience!
      let prefilledRole: UserRole = 'customer';
      if (email.toLowerCase() === 'fumilayo@fitinscute.com' || email.toLowerCase() === 'babatundefunmilayo563@gmail.com') {
        prefilledRole = 'admin';
      }
      return await signUp(email, email.split('@')[0], prefilledRole);
    }

    if (user.status === 'suspended') {
      throw new Error('Your account has been temporarily suspended by Fumilayo Thomas.');
    }

    setLocalCurrentUser(user);
    setActiveRole(user.role);
    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    setLocalCurrentUser(null);
    setActiveRole('customer');
    setCurrentUser(null);
  };

  const simulateRoleChange = (role: 'admin' | 'editor' | 'customer') => {
    setActiveRole(role);
    if (currentUser) {
      const updatedUser = { ...currentUser, role };
      setLocalCurrentUser(updatedUser);
      setCurrentUser(updatedUser);
    }
  };

  const updateCustomerStatus = async (id: string, status: 'active' | 'suspended') => {
    const updated = customers.map(c => c.id === id ? { ...c, status } : c);
    setCustomers(updated);
    saveAuthUsers(updated);

    if (currentUser && currentUser.id === id) {
      const updatedUser = { ...currentUser, status };
      setLocalCurrentUser(updatedUser);
      setCurrentUser(updatedUser);
    }

    if (isSupabaseConfigured) {
      await supabaseService.updateProfileStatus(id, status);
    }
  };

  // --- ORDERS & CHECKOUT ---
  const createOrder = async (
    shipping: {
      name: string;
      email: string;
      address: string;
      city: string;
      country: string;
      postalCode?: string;
      phone: string;
    },
    total: number,
    discount: number,
    couponCode?: string,
    method = 'Flutterwave'
  ): Promise<Order> => {
    const orderId = `FLW-ORD-${Date.now()}`;
    const orderItems: OrderItem[] = cart.map(item => ({
      id: `oi-${Math.random().toString(36).substr(2, 9)}`,
      order_id: orderId,
      product_id: item.product.id,
      product_name: item.product.name,
      product_image: item.product.images[0],
      quantity: item.quantity,
      price: item.product.sale_price || item.product.price,
      selected_size: item.selectedSize,
      selected_color: item.selectedColor
    }));

    const newOrder: Order = {
      id: orderId,
      customer_name: shipping.name,
      customer_email: shipping.email,
      shipping_address: shipping.address,
      shipping_city: shipping.city,
      shipping_country: shipping.country,
      shipping_postal_code: shipping.postalCode,
      phone: shipping.phone,
      total_amount: total,
      status: 'paid', // Preloaded as paid as requested for this luxury experience
      coupon_code: couponCode,
      discount_amount: discount,
      payment_method: method,
      payment_reference: `FLW-TXM-${Math.random().toString(36).toUpperCase().substr(2, 10)}`,
      created_at: new Date().toISOString(),
      items: orderItems
    };

    // Deduct quantities in inventories
    const updatedProducts = products.map(prod => {
      const cartMatch = cart.find(item => item.product.id === prod.id);
      if (cartMatch) {
        return {
          ...prod,
          inventory: Math.max(0, prod.inventory - cartMatch.quantity)
        };
      }
      return prod;
    });

    setProducts(updatedProducts);
    saveProducts(updatedProducts);

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    saveOrders(updatedOrders);

    // Sync to Supabase
    if (isSupabaseConfigured) {
      await supabaseService.insertOrder(newOrder);
      // Update inventories in Supabase
      for (const item of cart) {
        const remainingStock = Math.max(0, item.product.inventory - item.quantity);
        await supabaseService.updateProduct({
          ...item.product,
          inventory: remainingStock
        });
      }
    }

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    const updated = orders.map(ord => ord.id === id ? { ...ord, status } : ord);
    setOrders(updated);
    saveOrders(updated);

    if (isSupabaseConfigured) {
      await supabaseService.updateOrderStatus(id, status);
    }
  };

  const deleteOrder = async (id: string) => {
    const updated = orders.filter(ord => ord.id !== id);
    setOrders(updated);
    saveOrders(updated);

    if (isSupabaseConfigured) {
      await supabaseService.deleteOrder(id);
    }
  };

  // --- PRODUCT MANAGEMENT ---
  const addProduct = async (p: Omit<Product, 'id' | 'created_at' | 'rating'>) => {
    const newProduct: Product = {
      ...p,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      created_at: new Date().toISOString()
    };
    const updated = [newProduct, ...products];
    setProducts(updated);
    saveProducts(updated);

    if (isSupabaseConfigured) {
      await supabaseService.insertProduct(newProduct);
    }
  };

  const updateProduct = async (p: Product) => {
    const updated = products.map(prod => prod.id === p.id ? p : prod);
    setProducts(updated);
    saveProducts(updated);

    if (isSupabaseConfigured) {
      await supabaseService.updateProduct(p);
    }
  };

  const deleteProduct = async (id: string) => {
    const updated = products.filter(prod => prod.id !== id);
    setProducts(updated);
    saveProducts(updated);

    if (isSupabaseConfigured) {
      await supabaseService.deleteProduct(id);
    }
  };

  const adjustInventory = async (productId: string, amount: number) => {
    const updated = products.map(prod => {
      if (prod.id === productId) {
        const remaining = Math.max(0, prod.inventory + amount);
        const copy = { ...prod, inventory: remaining };
        if (isSupabaseConfigured) {
          supabaseService.updateProduct(copy);
        }
        return copy;
      }
      return prod;
    });
    setProducts(updated);
    saveProducts(updated);
  };

  // --- REVIEWS ---
  const addReview = async (productId: string, userName: string, userEmail: string, rating: number, comment: string) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      product_id: productId,
      user_name: userName,
      user_email: userEmail,
      rating,
      comment,
      created_at: new Date().toISOString(),
      is_approved: true
    };
    const updated = [newRev, ...reviews];
    setReviews(updated);
    saveReviews(updated);

    // Recalculate product rating
    const pReviews = updated.filter(r => r.product_id === productId && r.is_approved);
    if (pReviews.length > 0) {
      const avg = pReviews.reduce((sum, r) => sum + r.rating, 0) / pReviews.length;
      const updatedProducts = products.map(prod => {
        if (prod.id === productId) {
          const updatedPiece = { ...prod, rating: parseFloat(avg.toFixed(1)) };
          if (isSupabaseConfigured) {
            supabaseService.updateProduct(updatedPiece);
          }
          return updatedPiece;
        }
        return prod;
      });
      setProducts(updatedProducts);
      saveProducts(updatedProducts);
    }

    if (isSupabaseConfigured) {
      await supabaseService.insertReview(newRev);
    }
  };

  const approveReview = async (reviewId: string) => {
    const updated = reviews.map(r => r.id === reviewId ? { ...r, is_approved: true } : r);
    setReviews(updated);
    saveReviews(updated);

    if (isSupabaseConfigured) {
      await supabaseService.approveReview(reviewId);
    }
  };

  const deleteReview = async (reviewId: string) => {
    const updated = reviews.filter(r => r.id !== reviewId);
    setReviews(updated);
    saveReviews(updated);

    if (isSupabaseConfigured) {
      await supabaseService.deleteReview(reviewId);
    }
  };

  // --- BLOGS ---
  const addBlogPost = async (bp: Omit<BlogPost, 'id' | 'published_at' | 'read_time'>) => {
    const newPost: BlogPost = {
      ...bp,
      id: `blog-${Date.now()}`,
      published_at: new Date().toISOString(),
      read_time: '4 min read'
    };
    const updated = [newPost, ...blogPosts];
    setBlogPosts(updated);
    saveBlogPosts(updated);

    if (isSupabaseConfigured) {
      await supabaseService.insertBlogPost(newPost);
    }
  };

  const updateBlogPost = async (bp: BlogPost) => {
    const updated = blogPosts.map(p => p.id === bp.id ? bp : p);
    setBlogPosts(updated);
    saveBlogPosts(updated);

    // Custom sync not bounded in basic instructions but supported
  };

  const deleteBlogPost = async (id: string) => {
    const updated = blogPosts.filter(p => p.id !== id);
    setBlogPosts(updated);
    saveBlogPosts(updated);

    if (isSupabaseConfigured) {
      await supabaseService.deleteBlogPost(id);
    }
  };

  const addComment = async (postId: string, name: string, email: string, comment: string) => {
    const newComment: BlogComment = {
      id: `comment-${Date.now()}`,
      post_id: postId,
      user_name: name,
      user_email: email,
      comment,
      created_at: new Date().toISOString(),
      is_approved: true
    };
    const updated = [newComment, ...comments];
    setComments(updated);
    saveComments(updated);

    if (isSupabaseConfigured) {
      await supabaseService.insertComment(newComment);
    }
  };

  const approveComment = async (commentId: string) => {
    const updated = comments.map(c => c.id === commentId ? { ...c, is_approved: true } : c);
    setComments(updated);
    saveComments(updated);

    if (isSupabaseConfigured) {
      await supabaseService.approveComment(commentId);
    }
  };

  const deleteComment = async (commentId: string) => {
    const updated = comments.filter(c => c.id !== commentId);
    setComments(updated);
    saveComments(updated);

    if (isSupabaseConfigured) {
      await supabaseService.deleteComment(commentId);
    }
  };

  // --- SUBSCRIBERS ---
  const subscribeNewsletter = async (email: string) => {
    const lowerEmail = email.toLowerCase().trim();
    if (!lowerEmail) {
      return { success: false, message: 'Please provide a valid email.' };
    }
    
    const exists = subscribers.some(s => s.email.toLowerCase() === lowerEmail && s.status === 'active');
    if (exists) {
      return { success: true, message: 'You are already subscribed to Fitins & Cute newsletters.' };
    }

    const newSub: NewsletterSubscriber = {
      id: `sub-${Date.now()}`,
      email: lowerEmail,
      subscribed_at: new Date().toISOString(),
      status: 'active'
    };

    const updated = [...subscribers, newSub];
    setSubscribers(updated);
    saveSubscribers(updated);

    if (isSupabaseConfigured) {
      await supabaseService.upsertSubscriber(newSub);
    }

    return { success: true, message: 'Thank you for joining our exclusive inner circle.' };
  };

  const unsubscribeNewsletter = async (email: string) => {
    const updated = subscribers.map(s => s.email.toLowerCase() === email.toLowerCase() ? { ...s, status: 'unsubscribed' as const } : s);
    setSubscribers(updated);
    saveSubscribers(updated);

    if (isSupabaseConfigured) {
      const matched = updated.find(s => s.email.toLowerCase() === email.toLowerCase());
      if (matched) {
        await supabaseService.upsertSubscriber(matched);
      }
    }
  };

  // --- TESTIMONIALS ---
  const addTestimonial = (name: string, role: string, content: string, rating: number) => {
    const newTest: Testimonial = {
      id: `test-${Date.now()}`,
      name,
      role,
      content,
      rating,
      created_at: new Date().toISOString(),
      is_approved: true
    };
    const updated = [newTest, ...testimonials];
    setTestimonials(updated);
    saveTestimonials(updated);
  };

  const approveTestimonial = (id: string) => {
    const updated = testimonials.map(t => t.id === id ? { ...t, is_approved: true } : t);
    setTestimonials(updated);
    saveTestimonials(updated);
  };

  const deleteTestimonial = (id: string) => {
    const updated = testimonials.filter(t => t.id !== id);
    setTestimonials(updated);
    saveTestimonials(updated);
  };

  // --- CONFIG / SETTINGS UPDATE ACTIONS ---
  const updateSiteSettings = async (settings: SiteSettings) => {
    setSiteSettings(settings);
    setLocalStorageItem('fc_site_settings', settings);

    if (isSupabaseConfigured) {
      await supabaseService.upsertSiteSettings(settings);
    }
  };

  const updateFounderProfile = async (founder: FounderProfile) => {
    setFounderProfile(founder);
    setLocalStorageItem('fc_founder_profile', founder);

    // Sync Founder photo into profile cards if needed
    // Update all matching Auth users
    const updatedUsers = customers.map(u => {
      if (u.role === 'admin' && u.name.toLowerCase().includes('thomas')) {
        return {
          ...u,
          name: founder.name,
          avatar_url: founder.profile_image_url
        };
      }
      return u;
    });
    setCustomers(updatedUsers);
    saveAuthUsers(updatedUsers);

    // Reflect on current user if Admin
    if (currentUser && currentUser.role === 'admin') {
      const updatedUser = {
        ...currentUser,
        name: founder.name,
        avatar_url: founder.profile_image_url
      };
      setLocalCurrentUser(updatedUser);
      setCurrentUser(updatedUser);
    }

    if (isSupabaseConfigured) {
      await supabaseService.upsertFounderProfile(founder);
    }
  };

  return (
    <StoreContext.Provider value={{
      products,
      blogPosts,
      testimonials,
      orders,
      reviews,
      comments,
      subscribers,
      cart,
      wishlist,
      currentUser,
      activeRole,
      coupons,
      siteSettings,
      founderProfile,
      customers,
      
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      
      toggleWishlist,
      isInWishlist,
      
      signUp,
      login,
      logout,
      simulateRoleChange,
      updateCustomerStatus,
      
      createOrder,
      updateOrderStatus,
      deleteOrder,
      
      addProduct,
      updateProduct,
      deleteProduct,
      adjustInventory,
      
      addReview,
      approveReview,
      deleteReview,
      
      addBlogPost,
      updateBlogPost,
      deleteBlogPost,
      addComment,
      approveComment,
      deleteComment,
      
      subscribeNewsletter,
      unsubscribeNewsletter,
      
      addTestimonial,
      approveTestimonial,
      deleteTestimonial,

      updateSiteSettings,
      updateFounderProfile
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
