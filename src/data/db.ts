import { Product, BlogPost, Testimonial, Order, BlogComment, Review, NewsletterSubscriber, UserProfile, UserRole } from '../types';
import { INITIAL_PRODUCTS, INITIAL_BLOG_POSTS, INITIAL_TESTIMONIALS } from './seedData';

// Safe checking for browser environment
const IS_BROWSER = typeof window !== 'undefined';

const getLocalStorageItem = <T>(key: string, defaultValue: T): T => {
  if (!IS_BROWSER) return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

const setLocalStorageItem = <T>(key: string, value: T): void => {
  if (!IS_BROWSER) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing localStorage key "${key}":`, error);
  }
};

// --- INITIALIZE STORAGE DATA ---
export const getStoredProducts = (): Product[] => {
  return getLocalStorageItem<Product[]>('fc_products', INITIAL_PRODUCTS);
};

export const saveProducts = (products: Product[]): void => {
  setLocalStorageItem('fc_products', products);
};

export const getStoredBlogPosts = (): BlogPost[] => {
  return getLocalStorageItem<BlogPost[]>('fc_blog_posts', INITIAL_BLOG_POSTS);
};

export const saveBlogPosts = (posts: BlogPost[]): void => {
  setLocalStorageItem('fc_blog_posts', posts);
};

export const getStoredTestimonials = (): Testimonial[] => {
  return getLocalStorageItem<Testimonial[]>('fc_testimonials', INITIAL_TESTIMONIALS);
};

export const saveTestimonials = (testimonials: Testimonial[]): void => {
  setLocalStorageItem('fc_testimonials', testimonials);
};

export const getStoredOrders = (): Order[] => {
  return getLocalStorageItem<Order[]>('fc_orders', []);
};

export const saveOrders = (orders: Order[]): void => {
  setLocalStorageItem('fc_orders', orders);
};

export const getStoredComments = (): BlogComment[] => {
  const defaultComments: BlogComment[] = [
    {
      id: 'comment-1',
      post_id: 'blog-1',
      user_name: 'Chioma Obi',
      user_email: 'chioma@example.com',
      comment: 'This is an absolute lifesaver guide! My raw frontal units used to get so dry. Setting my flat irons to 340°F and sealing it with the mulberry silk wrap completely restored its original bounce and silkiness. Thank you Fumilayo!',
      created_at: '2026-05-29T10:15:00Z',
      is_approved: true
    },
    {
      id: 'comment-2',
      post_id: 'blog-1',
      user_name: 'Zainab Musa',
      user_email: 'zainab@example.com',
      comment: 'Is the Luxe Restoring Argan & Biotin Serum safe to use on custom blonde highlighted wigs as well, or does it shift color tone?',
      created_at: '2026-05-30T11:00:00Z',
      is_approved: true
    },
    {
      id: 'comment-3',
      post_id: 'blog-2',
      user_name: 'Tobi Lawson',
      user_email: 'tobi@example.com',
      comment: 'As a sartorial enthusiast, I absolutely vibe with your concept of visual space and silence. The combination of simple linen sets under rich traditional robes feels extremely modern and premium.',
      created_at: '2026-05-22T08:00:00Z',
      is_approved: true
    }
  ];
  return getLocalStorageItem<BlogComment[]>('fc_comments', defaultComments);
};

export const saveComments = (comments: BlogComment[]): void => {
  setLocalStorageItem('fc_comments', comments);
};

export const getStoredReviews = (): Review[] => {
  const defaultReviews: Review[] = [
    {
      id: 'rev-1',
      product_id: 'hair-1',
      user_name: 'Chioma Obi',
      user_email: 'chioma@example.com',
      rating: 5,
      comment: 'I am in complete awe of this frontal wig. The HD Swiss lace completely integrated on my skin, and the raw hair is thick, rich, and moves like healthy growth. It is worth every single cent.',
      created_at: '2026-05-26T12:00:00Z',
      is_approved: true
    },
    {
      id: 'rev-2',
      product_id: 'women-1',
      user_name: 'Beatrice Vance',
      user_email: 'beatrice@example.com',
      rating: 5,
      comment: 'The cowl drape on the back of this Silk Column Gown is haute couture level. It feels luxurious, heavy, and very elegant. The Alabaster color looks incredibly premium.',
      created_at: '2026-05-28T15:30:00Z',
      is_approved: true
    },
    {
      id: 'rev-3',
      product_id: 'men-1',
      user_name: 'Deji Alao',
      user_email: 'deji@example.com',
      rating: 5,
      comment: 'An exquisite Agbada set. The cashmere wool is light and structured, breathable enough for warmer climates, and the silk accents show superb attention to detail. This is now my absolute favorite special event outfit.',
      created_at: '2026-05-29T09:10:00Z',
      is_approved: true
    }
  ];
  return getLocalStorageItem<Review[]>('fc_reviews', defaultReviews);
};

export const saveReviews = (reviews: Review[]): void => {
  setLocalStorageItem('fc_reviews', reviews);
};

export const getStoredSubscribers = (): NewsletterSubscriber[] => {
  return getLocalStorageItem<NewsletterSubscriber[]>('fc_subscribers', [
    { id: 'sub-1', email: 'guest@example.com', subscribed_at: '2026-05-20T08:00:00Z', status: 'active' },
    { id: 'sub-2', email: 'editor_hub@example.com', subscribed_at: '2026-05-22T10:30:00Z', status: 'active' }
  ]);
};

export const saveSubscribers = (subs: NewsletterSubscriber[]): void => {
  setLocalStorageItem('fc_subscribers', subs);
};

export const getStoredWishlists = (): string[] => {
  return getLocalStorageItem<string[]>('fc_wishlist', []);
};

export const saveWishlists = (productIds: string[]): void => {
  setLocalStorageItem('fc_wishlist', productIds);
};

// --- AUTH SYSTEM ---
// Admin user seeded by default
const DEFAULT_AUTH_USERS: UserProfile[] = [
  {
    id: 'auth-1',
    email: 'fumilayo@fitinscute.com',
    name: 'Fumilayo Thomas',
    role: 'admin',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    status: 'active',
    created_at: '2026-05-01T00:00:00Z'
  },
  {
    id: 'auth-2',
    email: 'editor@fitinscute.com',
    name: 'Tunde Jacobs',
    role: 'editor',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    status: 'active',
    created_at: '2026-05-02T00:00:00Z'
  }
];

export const getAuthUsers = (): UserProfile[] => {
  return getLocalStorageItem<UserProfile[]>('fc_auth_users', DEFAULT_AUTH_USERS);
};

export const saveAuthUsers = (users: UserProfile[]): void => {
  setLocalStorageItem('fc_auth_users', users);
};

export const getCurrentUser = (): UserProfile | null => {
  // Check if active session exists in localStorage
  return getLocalStorageItem<UserProfile | null>('fc_current_user', null);
};

export const setCurrentUser = (user: UserProfile | null): void => {
  setLocalStorageItem<UserProfile | null>('fc_current_user', user);
};
