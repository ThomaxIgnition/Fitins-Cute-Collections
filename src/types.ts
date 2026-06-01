export type UserRole = 'admin' | 'editor' | 'customer';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export type MainCategory = 'hair' | 'women' | 'men';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sale_price?: number;
  main_category: MainCategory;
  subcategory: string; // e.g. "Wigs", "Dresses", "Shirts"
  images: string[];
  features?: string[];
  sizes?: string[];
  colors?: string[];
  inventory: number;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new: boolean;
  rating: number;
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_name: string;
  user_email: string;
  rating: number;
  comment: string;
  created_at: string;
  is_approved: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  selected_size?: string;
  selected_color?: string;
}

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  shipping_city: string;
  shipping_country: string;
  shipping_postal_code?: string;
  phone: string;
  total_amount: number;
  status: OrderStatus;
  coupon_code?: string;
  discount_amount: number;
  payment_method: string;
  payment_reference?: string;
  created_at: string;
  items: OrderItem[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  author_name: string;
  author_role: string;
  category: string; // e.g. "Fashion", "Beauty Tips", "Hair Care"
  image: string;
  published_at: string;
  is_featured: boolean;
  read_time: string;
}

export interface BlogComment {
  id: string;
  post_id: string;
  user_name: string;
  user_email: string;
  comment: string;
  created_at: string;
  is_approved: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar?: string;
  rating: number;
  created_at: string;
  is_approved: boolean;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
  status: 'active' | 'unsubscribed';
}

export interface Coupon {
  code: string;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  min_spend?: number;
}
