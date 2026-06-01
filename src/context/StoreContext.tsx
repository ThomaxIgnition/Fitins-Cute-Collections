import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, BlogPost, Testimonial, Order, BlogComment, Review, 
  NewsletterSubscriber, UserProfile, CartItem, OrderStatus, OrderItem, Coupon, UserRole
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
import { supabase, isSupabaseConfigured } from '../data/supabaseClient';

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
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  deleteOrder: (id: string) => void;
  
  // Product Management
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'rating'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  adjustInventory: (productId: string, amount: number) => void;
  
  // Review Actions
  addReview: (productId: string, userName: string, userEmail: string, rating: number, comment: string) => void;
  approveReview: (reviewId: string) => void;
  deleteReview: (reviewId: string) => void;
  
  // Blog Actions
  addBlogPost: (post: Omit<BlogPost, 'id' | 'published_at' | 'read_time'>) => void;
  updateBlogPost: (post: BlogPost) => void;
  deleteBlogPost: (id: string) => void;
  addComment: (postId: string, name: string, email: string, comment: string) => void;
  approveComment: (commentId: string) => void;
  deleteComment: (commentId: string) => void;
  
  // Subscribers
  subscribeNewsletter: (email: string) => { success: boolean; message: string };
  unsubscribeNewsletter: (email: string) => void;
  
  // Testimonials
  addTestimonial: (name: string, role: string, content: string, rating: number) => void;
  approveTestimonial: (id: string) => void;
  deleteTestimonial: (id: string) => void;
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

  const coupons: Coupon[] = [
    { code: 'FUMI10', discount_type: 'percent', discount_value: 10 },
    { code: 'LUXURY20', discount_type: 'percent', discount_value: 20 },
    { code: 'CUTE100', discount_type: 'fixed', discount_value: 100, min_spend: 500 },
    { code: 'WELCOME50', discount_type: 'fixed', discount_value: 50, min_spend: 200 }
  ];

  // Load Initial State from DB / LocalStorage
  useEffect(() => {
    setProducts(getStoredProducts());
    setBlogPosts(getStoredBlogPosts());
    setTestimonials(getStoredTestimonials());
    setOrders(getStoredOrders());
    setReviews(getStoredReviews());
    setComments(getStoredComments());
    setSubscribers(getStoredSubscribers());
    setWishlist(getStoredWishlists());
    
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
    const allUsers = getAuthUsers();
    const existing = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email,
      name,
      role,
      avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300`,
      created_at: new Date().toISOString()
    };

    const updatedUsers = [...allUsers, newUser];
    saveAuthUsers(updatedUsers);
    setLocalCurrentUser(newUser);
    setActiveRole(newUser.role);
    setCurrentUser(newUser);
    return newUser;
  };

  const login = async (email: string): Promise<UserProfile> => {
    const allUsers = getAuthUsers();
    const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      // Auto-create a customer account if not found for seamless experience!
      return await signUp(email, email.split('@')[0], 'customer');
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

  // --- ORDERS & CHECKOUT (incorporates Flutterwave logs) ---
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
    const orderItems: OrderItem[] = cart.map(item => ({
      id: `oi-${Math.random().toString(36).substr(2, 9)}`,
      order_id: `ord-${Date.now()}`,
      product_id: item.product.id,
      product_name: item.product.name,
      product_image: item.product.images[0],
      quantity: item.quantity,
      price: item.product.sale_price || item.product.price,
      selected_size: item.selectedSize,
      selected_color: item.selectedColor
    }));

    const newOrder: Order = {
      id: `FLW-ORD-${Date.now()}`,
      customer_name: shipping.name,
      customer_email: shipping.email,
      shipping_address: shipping.address,
      shipping_city: shipping.city,
      shipping_country: shipping.country,
      shipping_postal_code: shipping.postalCode,
      phone: shipping.phone,
      total_amount: total,
      status: 'paid', // Immediately authorized as requested
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

    // Clear cart after order placed
    clearCart();

    return newOrder;
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    const updated = orders.map(ord => ord.id === id ? { ...ord, status } : ord);
    setOrders(updated);
    saveOrders(updated);
  };

  const deleteOrder = (id: string) => {
    const updated = orders.filter(ord => ord.id !== id);
    setOrders(updated);
    saveOrders(updated);
  };

  // --- PRODUCT MANAGEMENT ---
  const addProduct = (p: Omit<Product, 'id' | 'created_at' | 'rating'>) => {
    const newProduct: Product = {
      ...p,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      created_at: new Date().toISOString()
    };
    const updated = [newProduct, ...products];
    setProducts(updated);
    saveProducts(updated);
  };

  const updateProduct = (p: Product) => {
    const updated = products.map(prod => prod.id === p.id ? p : prod);
    setProducts(updated);
    saveProducts(updated);
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter(prod => prod.id !== id);
    setProducts(updated);
    saveProducts(updated);
  };

  const adjustInventory = (productId: string, amount: number) => {
    const updated = products.map(prod => {
      if (prod.id === productId) {
        return { ...prod, inventory: Math.max(0, prod.inventory + amount) };
      }
      return prod;
    });
    setProducts(updated);
    saveProducts(updated);
  };

  // --- REVIEWS ---
  const addReview = (productId: string, userName: string, userEmail: string, rating: number, comment: string) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      product_id: productId,
      user_name: userName,
      user_email: userEmail,
      rating,
      comment,
      created_at: new Date().toISOString(),
      is_approved: true // Auto approves for flawless mock demo UX!
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
          return { ...prod, rating: parseFloat(avg.toFixed(1)) };
        }
        return prod;
      });
      setProducts(updatedProducts);
      saveProducts(updatedProducts);
    }
  };

  const approveReview = (reviewId: string) => {
    const updated = reviews.map(r => r.id === reviewId ? { ...r, is_approved: true } : r);
    setReviews(updated);
    saveReviews(updated);
  };

  const deleteReview = (reviewId: string) => {
    const updated = reviews.filter(r => r.id !== reviewId);
    setReviews(updated);
    saveReviews(updated);
  };

  // --- BLOGS ---
  const addBlogPost = (bp: Omit<BlogPost, 'id' | 'published_at' | 'read_time'>) => {
    const newPost: BlogPost = {
      ...bp,
      id: `blog-${Date.now()}`,
      published_at: new Date().toISOString(),
      read_time: '4 min read'
    };
    const updated = [newPost, ...blogPosts];
    setBlogPosts(updated);
    saveBlogPosts(updated);
  };

  const updateBlogPost = (bp: BlogPost) => {
    const updated = blogPosts.map(p => p.id === bp.id ? bp : p);
    setBlogPosts(updated);
    saveBlogPosts(updated);
  };

  const deleteBlogPost = (id: string) => {
    const updated = blogPosts.filter(p => p.id !== id);
    setBlogPosts(updated);
    saveBlogPosts(updated);
  };

  const addComment = (postId: string, name: string, email: string, comment: string) => {
    const newComment: BlogComment = {
      id: `comment-${Date.now()}`,
      post_id: postId,
      user_name: name,
      user_email: email,
      comment,
      created_at: new Date().toISOString(),
      is_approved: true // Auto approves for flawless mock demo UX!
    };
    const updated = [newComment, ...comments];
    setComments(updated);
    saveComments(updated);
  };

  const approveComment = (commentId: string) => {
    const updated = comments.map(c => c.id === commentId ? { ...c, is_approved: true } : c);
    setComments(updated);
    saveComments(updated);
  };

  const deleteComment = (commentId: string) => {
    const updated = comments.filter(c => c.id !== commentId);
    setComments(updated);
    saveComments(updated);
  };

  // --- SUBSCRIBERS ---
  const subscribeNewsletter = (email: string) => {
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
    return { success: true, message: 'Thank you for joining our exclusive inner circle.' };
  };

  const unsubscribeNewsletter = (email: string) => {
    const updated = subscribers.map(s => s.email.toLowerCase() === email.toLowerCase() ? { ...s, status: 'unsubscribed' as const } : s);
    setSubscribers(updated);
    saveSubscribers(updated);
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
      is_approved: true // Auto approves for flawless demo UX
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
      deleteTestimonial
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
