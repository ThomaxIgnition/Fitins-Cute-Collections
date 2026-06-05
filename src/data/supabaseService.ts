import { supabase, isSupabaseConfigured } from './supabaseClient';
import { 
  Product, BlogPost, Order, BlogComment, Review, 
  NewsletterSubscriber, UserProfile, SiteSettings, FounderProfile 
} from '../types';

// Fallback handlers
const handleDBError = (action: string, error: any) => {
  console.warn(`Supabase database warning during [${action}]:`, error.message || error);
  return null;
};

export const supabaseService = {
  // --- PROFILES / CUSTOMERS ---
  async fetchProfiles(): Promise<UserProfile[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      if (error) throw error;
      return (data || []).map(row => ({
        id: row.id,
        email: row.email,
        name: row.first_name || row.last_name ? `${row.first_name || ''} ${row.last_name || ''}`.trim() : row.email.split('@')[0],
        role: row.role || 'customer',
        avatar_url: row.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
        status: row.status || 'active',
        created_at: row.created_at || new Date().toISOString()
      }));
    } catch (err) {
      return handleDBError('fetchProfiles', err);
    }
  },

  async upsertProfile(profile: UserProfile): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const parts = profile.name.split(' ');
      const first_name = parts[0] || '';
      const last_name = parts.slice(1).join(' ') || '';

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: profile.id,
          role: profile.role,
          first_name,
          last_name,
          email: profile.email,
          avatar_url: profile.avatar_url,
          status: profile.status,
          created_at: profile.created_at
        });
      if (error) throw error;
      return true;
    } catch (err) {
      handleDBError('upsertProfile', err);
      return false;
    }
  },

  async updateProfileStatus(id: string, status: 'active' | 'suspended'): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      handleDBError('updateProfileStatus', err);
      return false;
    }
  },

  // --- PRODUCTS ---
  async fetchProducts(): Promise<Product[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      if (error) throw error;
      return (data || []).map(row => ({
        id: row.id,
        name: row.name,
        description: row.description,
        price: Number(row.price),
        sale_price: row.sale_price ? Number(row.sale_price) : undefined,
        main_category: row.category || 'hair',
        subcategory: row.subcategory || '',
        images: [row.image_url || 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800'],
        features: row.features || [],
        sizes: row.sizes || ['Standard'],
        colors: row.colors || ['Natural Black'],
        inventory: Number(row.inventory ?? 10),
        is_featured: row.is_featured ?? true,
        is_bestseller: row.is_bestseller ?? false,
        is_new: row.is_new ?? true,
        rating: Number(row.rating ?? 5.0),
        created_at: row.created_at || new Date().toISOString()
      }));
    } catch (err) {
      return handleDBError('fetchProducts', err);
    }
  },

  async insertProduct(p: Product): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase
        .from('products')
        .insert({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          sale_price: p.sale_price || null,
          category: p.main_category,
          subcategory: p.subcategory,
          inventory: p.inventory,
          image_url: p.images[0] || '',
          features: p.features,
          sizes: p.sizes,
          colors: p.colors,
          is_featured: p.is_featured,
          is_bestseller: p.is_bestseller,
          is_new: p.is_new,
          rating: p.rating,
          created_at: p.created_at
        });
      if (error) throw error;
      return true;
    } catch (err) {
      handleDBError('insertProduct', err);
      return false;
    }
  },

  async updateProduct(p: Product): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: p.name,
          description: p.description,
          price: p.price,
          sale_price: p.sale_price || null,
          category: p.main_category,
          subcategory: p.subcategory,
          inventory: p.inventory,
          image_url: p.images[0] || '',
          features: p.features,
          sizes: p.sizes,
          colors: p.colors,
          is_featured: p.is_featured,
          is_bestseller: p.is_bestseller,
          is_new: p.is_new,
          rating: p.rating
        })
        .eq('id', p.id);
      if (error) throw error;
      return true;
    } catch (err) {
      handleDBError('updateProduct', err);
      return false;
    }
  },

  async deleteProduct(id: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      handleDBError('deleteProduct', err);
      return false;
    }
  },

  // --- ORDERS & ORDER ITEMS ---
  async fetchOrders(): Promise<Order[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data: dbOrders, error: orderError } = await supabase
        .from('orders')
        .select('*');
      if (orderError) throw orderError;

      const { data: dbItems, error: itemsError } = await supabase
        .from('order_items')
        .select('*');
      if (itemsError) throw itemsError;

      return (dbOrders || []).map(row => {
        const matchingItems = (dbItems || []).filter(it => it.order_id === row.id);
        return {
          id: row.id,
          customer_name: row.customer_name || 'Customer',
          customer_email: row.customer_email || 'customer@example.com',
          shipping_address: row.shipping_address || 'Atelier pickup',
          shipping_city: row.shipping_city || 'Lagos',
          shipping_country: row.shipping_country || 'Nigeria',
          shipping_postal_code: row.shipping_postal_code || '',
          phone: row.phone || '',
          total_amount: Number(row.total_amount || 0),
          status: row.status || 'paid',
          coupon_code: row.coupon_code || '',
          discount_amount: Number(row.discount_amount || 0),
          payment_method: row.payment_method || 'Online Card',
          payment_reference: row.payment_reference || '',
          created_at: row.created_at || new Date().toISOString(),
          items: matchingItems.map(it => ({
            id: it.id,
            order_id: it.order_id,
            product_id: it.product_id,
            product_name: it.product_name || 'Couture Design',
            product_image: it.product_image || 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800',
            quantity: Number(it.quantity || 1),
            price: Number(it.price || 0)
          }))
        };
      });
    } catch (err) {
      return handleDBError('fetchOrders', err);
    }
  },

  async insertOrder(o: Order): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      // 1. Insert parent order
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          id: o.id,
          customer_id: o.customer_email, // Using email or sub-id
          customer_name: o.customer_name,
          customer_email: o.customer_email,
          shipping_address: o.shipping_address,
          shipping_city: o.shipping_city,
          shipping_country: o.shipping_country,
          shipping_postal_code: o.shipping_postal_code || null,
          phone: o.phone,
          total_amount: o.total_amount,
          status: o.status,
          coupon_code: o.coupon_code || null,
          discount_amount: o.discount_amount || 0,
          payment_method: o.payment_method,
          payment_reference: o.payment_reference || null,
          created_at: o.created_at
        });
      if (orderError) throw orderError;

      // 2. Insert items
      if (o.items && o.items.length > 0) {
        const itemInserts = o.items.map(it => ({
          id: it.id,
          order_id: o.id,
          product_id: it.product_id,
          product_name: it.product_name,
          product_image: it.product_image,
          quantity: it.quantity,
          price: it.price
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(itemInserts);
        if (itemsError) throw itemsError;
      }
      return true;
    } catch (err) {
      handleDBError('insertOrder', err);
      return false;
    }
  },

  async updateOrderStatus(id: string, status: any): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      handleDBError('updateOrderStatus', err);
      return false;
    }
  },

  async deleteOrder(id: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      // Delete order items first due to cascade reference
      await supabase
        .from('order_items')
        .delete()
        .eq('order_id', id);

      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      handleDBError('deleteOrder', err);
      return false;
    }
  },

  // --- BLOG / JOURNAL POSTS ---
  async fetchBlogPosts(): Promise<BlogPost[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*');
      if (error) throw error;
      return (data || []).map(row => ({
        id: row.id,
        title: row.title,
        content: row.content,
        slug: row.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        summary: row.summary || row.content.slice(0, 150) + '...',
        category: row.category || 'Fashion & Lifestyle',
        image: row.featured_image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800',
        author_name: row.author_name || 'Fumilayo Thomas',
        author_role: row.author_role || 'Founder & Chief Curator',
        published_at: row.created_at || new Date().toISOString(),
        is_featured: row.is_featured ?? true,
        read_time: row.read_time || '4 min read'
      }));
    } catch (err) {
      return handleDBError('fetchBlogPosts', err);
    }
  },

  async insertBlogPost(bp: BlogPost): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase
        .from('blog_posts')
        .insert({
          id: bp.id,
          title: bp.title,
          content: bp.content,
          author_id: 'Fumilayo Thomas',
          author_name: bp.author_name,
          author_role: bp.author_role,
          category: bp.category,
          featured_image: bp.image,
          summary: bp.summary,
          is_featured: bp.is_featured,
          read_time: bp.read_time,
          created_at: bp.published_at
        });
      if (error) throw error;
      return true;
    } catch (err) {
      handleDBError('insertBlogPost', err);
      return false;
    }
  },

  async deleteBlogPost(id: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      handleDBError('deleteBlogPost', err);
      return false;
    }
  },

  // --- COMMENTS ---
  async fetchComments(): Promise<BlogComment[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*');
      if (error) throw error;
      return (data || []).map(row => ({
        id: row.id,
        post_id: row.post_id,
        user_name: row.customer_name || 'Curator Visitor',
        user_email: row.customer_id || 'guest@fitinscute.com',
        comment: row.content,
        is_approved: row.status === 'approved' || row.status === true || row.status === 'true',
        created_at: row.created_at || new Date().toISOString()
      }));
    } catch (err) {
      return handleDBError('fetchComments', err);
    }
  },

  async insertComment(c: BlogComment): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          id: c.id,
          post_id: c.post_id,
          customer_id: c.user_email,
          customer_name: c.user_name,
          content: c.comment,
          status: c.is_approved ? 'approved' : 'pending',
          created_at: c.created_at
        });
      if (error) throw error;
      return true;
    } catch (err) {
      handleDBError('insertComment', err);
      return false;
    }
  },

  async approveComment(id: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase
        .from('comments')
        .update({ status: 'approved' })
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      handleDBError('approveComment', err);
      return false;
    }
  },

  async deleteComment(id: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      handleDBError('deleteComment', err);
      return false;
    }
  },

  // --- REVIEWS ---
  async fetchReviews(): Promise<Review[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*');
      if (error) throw error;
      return (data || []).map(row => ({
        id: row.id,
        product_id: row.product_id,
        user_name: row.customer_name || 'Anonymous Collector',
        user_email: row.customer_id || 'anonymous@collectors.com',
        rating: Number(row.rating || 5),
        comment: row.review,
        is_approved: row.status === 'approved' || row.is_approved !== false,
        created_at: row.created_at || new Date().toISOString()
      }));
    } catch (err) {
      return handleDBError('fetchReviews', err);
    }
  },

  async insertReview(r: Review): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          id: r.id,
          product_id: r.product_id,
          customer_id: r.user_email,
          customer_name: r.user_name,
          rating: r.rating,
          review: r.comment,
          status: r.is_approved ? 'approved' : 'pending',
          created_at: r.created_at
        });
      if (error) throw error;
      return true;
    } catch (err) {
      handleDBError('insertReview', err);
      return false;
    }
  },

  async approveReview(id: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ status: 'approved' })
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      handleDBError('approveReview', err);
      return false;
    }
  },

  async deleteReview(id: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      handleDBError('deleteReview', err);
      return false;
    }
  },

  // --- NEWSLETTER SUBSCRIBERS ---
  async fetchSubscribers(): Promise<NewsletterSubscriber[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*');
      if (error) throw error;
      return (data || []).map(row => ({
        id: row.id,
        email: row.email,
        subscribed_at: row.created_at || new Date().toISOString(),
        status: row.status || 'active'
      }));
    } catch (err) {
      return handleDBError('fetchSubscribers', err);
    }
  },

  async upsertSubscriber(s: NewsletterSubscriber): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .upsert({
          id: s.id,
          email: s.email,
          status: s.status,
          created_at: s.subscribed_at
        });
      if (error) throw error;
      return true;
    } catch (err) {
      handleDBError('upsertSubscriber', err);
      return false;
    }
  },

  // --- SITE SETTINGS ---
  async fetchSiteSettings(): Promise<SiteSettings | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      if (error) throw error;
      if (data && data.length > 0) {
        const row = data[0];
        return {
          id: row.id,
          logo_url: row.logo_url || '',
          favicon_url: row.favicon_url || '',
          brand_name: row.brand_name || 'Fitins & Cute Collections',
          business_email: row.business_email || 'fumilayo@fitinscute.com',
          whatsapp_number: row.whatsapp_number || '+2348030000000',
          contact_address: row.contact_address || 'Lekki Phase 1, Lagos, Nigeria',
          currency: row.currency || 'USD',
          shipping_settings: typeof row.shipping_settings === 'object' ? JSON.stringify(row.shipping_settings) : row.shipping_settings || 'Free Shipping worldwide',
          tax_settings: typeof row.tax_settings === 'object' ? JSON.stringify(row.tax_settings) : row.tax_settings || '7.5% Vat applied',
          flutterwave_pub: row.flutterwave_pub || '',
          flutterwave_sec: row.flutterwave_sec || '',
          paystack_pub: row.paystack_pub || '',
          paystack_sec: row.paystack_sec || '',
          stripe_pub: row.stripe_pub || '',
          stripe_sec: row.stripe_sec || '',
          homepage_title: row.homepage_title || 'Fitins & Cute | Elite Curated Wigs & Luxury Pret-A-Porter',
          homepage_description: row.homepage_description || 'Step into handpicked perfection formulated by style specialist Fumilayo Thomas.',
          social_sharing_image: row.social_sharing_image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800'
        };
      }
      return null;
    } catch (err) {
      handleDBError('fetchSiteSettings', err);
      return null;
    }
  },

  async upsertSiteSettings(settings: SiteSettings): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          id: settings.id || 'current-settings',
          logo_url: settings.logo_url,
          favicon_url: settings.favicon_url,
          brand_name: settings.brand_name || 'Fitins & Cute Collections',
          business_email: settings.business_email,
          whatsapp_number: settings.whatsapp_number,
          contact_address: settings.contact_address || '',
          currency: settings.currency,
          shipping_settings: settings.shipping_settings,
          tax_settings: settings.tax_settings,
          flutterwave_pub: settings.flutterwave_pub || '',
          flutterwave_sec: settings.flutterwave_sec || '',
          paystack_pub: settings.paystack_pub || '',
          paystack_sec: settings.paystack_sec || '',
          stripe_pub: settings.stripe_pub || '',
          stripe_sec: settings.stripe_sec || '',
          homepage_title: settings.homepage_title || '',
          homepage_description: settings.homepage_description || '',
          social_sharing_image: settings.social_sharing_image || ''
        });
      if (error) throw error;
      return true;
    } catch (err) {
      handleDBError('upsertSiteSettings', err);
      return false;
    }
  },

  // --- FOUNDER PROFILE ---
  async fetchFounderProfile(): Promise<FounderProfile | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('founder_profile')
        .select('*');
      if (error) throw error;
      if (data && data.length > 0) {
        const row = data[0];
        let parsedLinks = { instagram: '', twitter: '', facebook: '', linkedin: '' };
        if (row.social_links) {
          try {
            parsedLinks = typeof row.social_links === 'string' ? JSON.parse(row.social_links) : row.social_links;
          } catch (e) {
            // keep default
          }
        }
        return {
          id: row.id,
          name: row.name || 'Fumilayo Thomas',
          bio: row.bio || 'Fumilayo Thomas is an internationally recognized fashion director, visual curator, and founder of Fitins & Cute Collections.',
          signature: row.signature || 'Fumilayo Thomas',
          quote: row.quote || 'Couture is not merely fabric stitched together; it is an intimate conversation of personal heritage, spatial geometry, and unwavering self-appreciation.',
          profile_image_url: row.profile_image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
          social_links: parsedLinks,
          updated_at: row.updated_at || new Date().toISOString()
        };
      }
      return null;
    } catch (err) {
      handleDBError('fetchFounderProfile', err);
      return null;
    }
  },

  async upsertFounderProfile(founder: FounderProfile): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase
        .from('founder_profile')
        .upsert({
          id: founder.id || 'current-founder',
          name: founder.name,
          bio: founder.bio,
          signature: founder.signature,
          quote: founder.quote,
          profile_image_url: founder.profile_image_url,
          social_links: typeof founder.social_links === 'object' ? JSON.stringify(founder.social_links) : founder.social_links,
          updated_at: new Date().toISOString()
        });
      if (error) throw error;
      return true;
    } catch (err) {
      handleDBError('upsertFounderProfile', err);
      return false;
    }
  }
};
