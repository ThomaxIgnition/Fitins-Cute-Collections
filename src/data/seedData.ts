import { Product, BlogPost, Testimonial } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // --- PREMIUM HAIR ---
  {
    id: 'hair-1',
    name: 'Fumi HD Full Lace Frontal Wig',
    description: 'Our signature HD full lace frontal wig, constructed with 100% premium raw Vietnamese wave hair. Unmatched natural hairline scalp illusion, ultra-thin Swiss lace, and 250% density for maximum volume and luxurious sway. Can be dyed, heat-styled, and parted in any direction.',
    price: 850,
    sale_price: 790,
    main_category: 'hair',
    subcategory: 'Wigs',
    images: [
      'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1605497746445-97d1b0a9ebd2?auto=format&fit=crop&q=80&w=800'
    ],
    features: [
      'Raw single-donor Vietnamese hair',
      'Real HD Swiss lace (invisible melt)',
      'Pre-plucked natural hairline with baby hair',
      '250% heavy density',
      'Secure adjustable combs and elastic band'
    ],
    sizes: ['20 inch', '24 inch', '30 inch'],
    colors: ['Natural Black (1B)', 'Chocolate Brown Highlights', 'Jet Black'],
    inventory: 15,
    is_featured: true,
    is_bestseller: true,
    is_new: false,
    rating: 4.9,
    created_at: '2026-05-15T08:00:00Z'
  },
  {
    id: 'hair-2',
    name: 'Sleek Bone Straight Human Hair Weave',
    description: 'Luxury double-drawn European human hair bundles. Silky to the touch, perfectly aligned cuticles from root to tip, preventing any tangling or shedding. Renders a flawless glass hair finish when flat ironed.',
    price: 320,
    main_category: 'hair',
    subcategory: 'Weaves',
    images: [
      'https://images.unsplash.com/photo-1595959183077-51578557b7f5?auto=format&fit=crop&q=80&w=800'
    ],
    features: [
      '100% Remy Double Drawn Human Hair',
      'Intact cuticle flow for no-tangle longevity',
      'Thick from root to tips',
      'Can lift to level 10 blonde easily'
    ],
    sizes: ['18 inch bundle', '22 inch bundle', '26 inch bundle'],
    colors: ['Natural Obsidian', 'Soft Dark Brown'],
    inventory: 40,
    is_featured: true,
    is_bestseller: false,
    is_new: true,
    rating: 4.7,
    created_at: '2026-05-20T10:00:00Z'
  },
  {
    id: 'hair-3',
    name: 'Fumilayo Knotless Micro-Braid Lace Wig',
    description: 'Skip the 10 hours in the salon chair. This masterfully hand-braided knotless micro-braid lace wig features premium lightweight synthetic fibers woven onto a complete full Swiss lace base. Moves and parts perfectly like genuine scalp-braided hair.',
    price: 490,
    main_category: 'hair',
    subcategory: 'Braided Hair',
    images: [
      'https://images.unsplash.com/photo-1605497746445-97d1b0a9ebd2?auto=format&fit=crop&q=80&w=800'
    ],
    features: [
      'Individually hand-braided by master artisans',
      'Full density frontal scalp simulation',
      'Ultra-light weight luxury fiber mix',
      'Length reaches 36 inches for stunning statement styling'
    ],
    sizes: ['One Size (Adjustable)'],
    colors: ['Warm Bronze Mix', 'Natural Dark Black', '#2/33 Highlight Blend'],
    inventory: 8,
    is_featured: false,
    is_bestseller: true,
    is_new: false,
    rating: 4.8,
    created_at: '2026-05-10T12:00:00Z'
  },
  {
    id: 'hair-4',
    name: 'Luxe Restoring Argan & Biotin Serum',
    description: 'An ultra-light, non-greasy hair nourishment and heat-protection serum curated specifically for human hair wigs and luxury bundles. Enriched with cold-pressed Moroccan argan oil, silk proteins, and liquid biotin to restore vibrant bounce and glass-like shine.',
    price: 45,
    main_category: 'hair',
    subcategory: 'Hair Care',
    images: [
      'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=800'
    ],
    features: [
      'Thermal Shield up to 450°F',
      'Sulfate-free, paraben-free luxury formulation',
      'Instantly tames flyaways and seals lace knots',
      'Gentle lavender and cashmere scent profile'
    ],
    sizes: ['150 ml'],
    colors: ['Clear Serum'],
    inventory: 120,
    is_featured: false,
    is_bestseller: false,
    is_new: true,
    rating: 5.0,
    created_at: '2026-05-25T14:00:00Z'
  },
  {
    id: 'hair-5',
    name: 'Mulberry Silk Editorial Hair Preservation Wrap',
    description: 'Crafted from 100% biological 22-Momme mulberry silk. Protects lace, prevents front styling disruption, and safeguards your curls during recovery sleep or transit. Tailored with a wide elasticized non-slip grip band for all-night luxury placement.',
    price: 65,
    main_category: 'hair',
    subcategory: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800'
    ],
    features: [
      '100% Pure Mulberry Silk (Grade 6A)',
      'Friction-free hair hydration preserve',
      'Generous room for voluminous wigs/braids',
      'Sleek double-layered design'
    ],
    sizes: ['Standard Luxe fit'],
    colors: ['Champagne Gold', 'Crème de la Crème', 'Noir Black'],
    inventory: 80,
    is_featured: false,
    is_bestseller: false,
    is_new: false,
    rating: 4.6,
    created_at: '2026-05-01T11:00:00Z'
  },

  // --- WOMEN'S FASHION ---
  {
    id: 'women-1',
    name: 'Aurelia Silk Draped Column Gown',
    description: 'A masterpiece of classic tailoring. Cut on the bias from heavyweight sand-washed silk, this column gown cascades gracefully across the feminine form, featuring a subtle cowl neckline, open portrait back, and a delicate puddle train. Perfect for red-carpet, premium affairs.',
    price: 520,
    sale_price: 480,
    main_category: 'women',
    subcategory: 'Dresses',
    images: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800'
    ],
    features: [
      '100% mulberry silk crepe',
      'Fully lined with premium habotai silk',
      'Delicate self-tie crossover back straps',
      'Hidden lateral invisible zipper closure'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Parchment Crème', 'Sultry Emerald', 'Midnight Black'],
    inventory: 12,
    is_featured: true,
    is_bestseller: true,
    is_new: false,
    rating: 4.9,
    created_at: '2026-05-18T09:00:00Z'
  },
  {
    id: 'women-2',
    name: 'Asymmetric Knit Halter Top',
    description: 'A contemporary knit statement. Knitted from ultra-soft fine-gauge viscose-silk blend yarn, presenting a sculptural asymmetric neck cutout and dynamic ribbed line direction. Form-fitting and breathable.',
    price: 140,
    main_category: 'women',
    subcategory: 'Tops',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800'
    ],
    features: [
      'Sculptural high halter drape wrap',
      'Premium stretch rib retention stability',
      'Seamless flatlock edges for supreme comfort'
    ],
    sizes: ['S', 'M', 'L'],
    colors: ['Sandstone', 'Noir Black'],
    inventory: 24,
    is_featured: false,
    is_bestseller: true,
    is_new: true,
    rating: 4.5,
    created_at: '2026-05-22T08:30:00Z'
  },
  {
    id: 'women-3',
    name: 'Linen Oasis Resort Wide-Leg Set',
    description: 'Elegant luxury coordinated leisurewear. Crafted from certified organic Belgian linen, this two-piece set includes a relaxed, unstructured drop-shoulder short button-down and coordinating high-waisted fluid pleated wide-leg trousers.',
    price: 290,
    main_category: 'women',
    subcategory: 'Sets',
    images: [
      'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&q=80&w=800'
    ],
    features: [
      '100% Organic Belgian Flax Linen',
      'Includes fluid button-down and deep pleated trousers',
      'Elastic adjustable back waist for exact custom hold'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Oatmeal', 'Sage Green', 'Pure Alabaster White'],
    inventory: 18,
    is_featured: true,
    is_bestseller: false,
    is_new: true,
    rating: 4.8,
    created_at: '2026-05-19T11:00:00Z'
  },
  {
    id: 'women-4',
    name: 'Chunky Sculptural Gold Link Necklace',
    description: 'A gorgeous brass-based necklace dipped twice in genuine 24-karat gold with a custom texturized vintage brushed finish. Interlocking heavy custom-cast links complete with a luxurious statement toggle clasp.',
    price: 180,
    main_category: 'women',
    subcategory: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800'
    ],
    features: [
      'Hypoallergenic brass body with nickel-free luxury gold plating',
      'Artisanal hand-hammered details on each link',
      'Adjustable toggle sizing rings'
    ],
    sizes: ['One Size (45cm length)'],
    colors: ['Vintage Brushed 24K Gold'],
    inventory: 45,
    is_featured: false,
    is_bestseller: false,
    is_new: false,
    rating: 4.7,
    created_at: '2026-05-05T07:15:00Z'
  },

  // --- MEN'S FASHION ---
  {
    id: 'men-1',
    name: 'Handcrafted Cashmere & Silk Agbada Set',
    description: 'An absolute editorial tribute to modern heritage. A three-piece traditional luxury Agbada set, meticulously constructed from ultra-premium cashmere wool and Italian wild silk fibers. Captures structural drapes and features subtle tone-on-tone geometric Yoruba structural embroidery.',
    price: 780,
    sale_price: 720,
    main_category: 'men',
    subcategory: 'Traditional Wear',
    images: [
      'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800'
    ],
    features: [
      'Custom blended Cashmere and fine raw Italian silk',
      'Includes outer Agbada robe, inner tunic shirt, and slim trousers',
      'Hand-stitched geometric lineage embroidery'
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Midnight Royal Indigo', 'Sleek Charcoal Black', 'Imperial Alabaster'],
    inventory: 6,
    is_featured: true,
    is_bestseller: true,
    is_new: true,
    rating: 5.0,
    created_at: '2026-05-24T15:00:00Z'
  },
  {
    id: 'men-2',
    name: 'Heavyweight Flax Linen Resort Shirt',
    description: 'Immaculate relaxed utility. Cut from premium high-density European flax linen, featuring comfortable dropped shoulders, a classic flat open camp collar, and premium organic mother-of-pearl structural buttons.',
    price: 165,
    main_category: 'men',
    subcategory: 'Shirts',
    images: [
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=800'
    ],
    features: [
      'Pure premium heavyweight European linen',
      'Subtle flat double-stitch construction',
      'Bio-washed for ultra-soft wear contact'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Optic Off-White', 'Deep Navy Blue', 'Sandshell Beige'],
    inventory: 35,
    is_featured: false,
    is_bestseller: true,
    is_new: false,
    rating: 4.8,
    created_at: '2026-05-12T09:00:00Z'
  },
  {
    id: 'men-3',
    name: 'Tailored Minimal pleated trousers',
    description: 'Designed with modern lines and structured drape. Relaxed through the thigh with a sharp front pinch pleat, tapering slightly towards a clean cuff pooling length. Crafted from organic Italian twilled wool-gauze blend.',
    price: 260,
    main_category: 'men',
    subcategory: 'Casual Wear',
    images: [
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=800'
    ],
    features: [
      'Wool and organic cotton micro-twill',
      'Tailored internal split waistband for easy future alteration',
      'Premium YKK zip closure with triple internal extension tab'
    ],
    sizes: ['30', '32', '34', '36'],
    colors: ['Taupe Grey', 'Ink Black', 'Earthy Olive'],
    inventory: 20,
    is_featured: true,
    is_bestseller: false,
    is_new: true,
    rating: 4.6,
    created_at: '2026-05-21T10:30:00Z'
  },
  {
    id: 'men-4',
    name: 'Woven Calfskin Leather Slide Sandals',
    description: 'Expertly assembled in Florence, Italy. Individual bands of vegetable-tanned full-grain calfskin leather are hand-interwoven across a sculpted comfortable leather footbed. Features durable, low-profile rubber outsoles for editorial city comfort.',
    price: 245,
    main_category: 'men',
    subcategory: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800'
    ],
    features: [
      '100% full-grain calfskin Italian leather',
      'Hand-woven breathable alignment crossing',
      'Anatomically contoured shock-absorbent midsole'
    ],
    sizes: ['41', '42', '43', '44', '45'],
    colors: ['Cognac Tan', 'Onyx Black'],
    inventory: 15,
    is_featured: false,
    is_bestseller: false,
    is_new: false,
    rating: 4.7,
    created_at: '2026-05-08T11:45:00Z'
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'An Editorial Guide to Raw Hair Care: Wigs & Extensions',
    slug: 'raw-hair-care-guide',
    summary: 'Master the delicate art of sustaining high-grade Raw Vietnamese and Indonesian hair. From optimal temperature selection to moisture saturation rituals, our master wig stylist details everything.',
    content: `When you invest in raw, single-donor human hair extensions or high-density HD lace frontal wigs, you possess some of the most premium craftsmanship globally. However, unlike hair attached to the scalp, extensions do not receive natural oils or physiological moisture supply. Ensuring its longevity rests completely in your hair maintenance routine.

### 1. The Gentle Clarifying Cleansing Ceremony
We highly advise washing your raw hair units only once every fortnight, or after 10 high-impact wears. 
* Use strictly lukewarm water. Hot water expands the cuticle, releasing natural proteins and risking immediate dry frizz.
* Opt only for sulfate-free, low-PH nourishing clarifying shampoos.
* Gently massage the shampoo downwards, from root alignment to structural end. Never scrunch or swirl the wet unit, which disrupts the aligned cuticle flow.

### 2. Moisture Saturation and the Co-Wash Rule
Never skip high-moisture conditioners. For ultra-premium results:
* Coat the damp fibers heavily with an Argan and Botanical rich mask.
* Comb gently through with a wide-tooth comb starting strictly from the tips upwards.
* Seal inside a satin preservation wrap, allowing the fibers to saturate for at least 60 minutes.
* Rinse completely with cold water to lock down the cuticle layer, capturing that brilliant reflective glass hair outcome.

### 3. Thermal Discipline
Raw hair responds to styling identical to your personal hair, meaning heat damage is irreversible. Always coat damp fibers with Fumi Luxe Heat Protection Serum before any flat iron or curling wand application. Restricting your heat styling tools below 360°F will keep the protective layers robust and healthy.

Invest in Mulberry Silk nightwear covers to reduce micro-friction, and you will enjoy several years of unparalleled, majestic bounce.`,
    author_name: 'Fumilayo Thomas',
    author_role: 'Founder & Style Curator',
    category: 'Hair Care',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800',
    published_at: '2026-05-28T14:30:00Z',
    is_featured: true,
    read_time: '6 min read'
  },
  {
    id: 'blog-2',
    title: 'Sculpting Modern Luxury: Visual Space vs. Bold Accents',
    slug: 'sculpting-modern-luxury',
    summary: 'Exploring how contemporary luxury fashion merges spacious minimalist neutrals with deep cultural silhouettes.',
    content: `Luxury used to find its voice purely in over-decorated patterns and heavy golden logotypes. Today, global visual sophistication is anchored firmly in structural honesty and spatial breathing room. 

When curated carefully, a simple high-waisted organic linen trousers set coupled with a highly texturized statement Agbada robe creates a magnetic, unforgettable style polarity. It is not about how many elements you pack into a single visual silhouette, but the absolute craft and geometry of the pieces you choose.

### The Power of Neutrals
Parchment crème, sandstone, oatmeal, and deep charcoal. These colors contain silence, and silence is the ultimate modern luxury. By structuring your base silhouette around silent neutrals, you allow your natural identity, structural makeup, and accessories to stand in high-contrast focus.

### Integrating Culture Cleanly
We take profound honor in blending modern tailored shapes with rich, traditional African patterns. Integrating a structured Nigerian Cashmere Agbada set inside sleek contemporary tailoring is an experience of pure heritage curation. Respecting traditional shapes with luxury Italian cashmere fabric is how Fitins & Cute Collections pushes editorial boundaries forward.`,
    author_name: 'Fumilayo Thomas',
    author_role: 'Founder & Style Curator',
    category: 'Fashion & Style',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800',
    published_at: '2026-05-20T10:00:00Z',
    is_featured: false,
    read_time: '4 min read'
  },
  {
    id: 'blog-3',
    title: 'The Editorial Edit: Crafting a Timeless Travel Capsule',
    slug: 'timeless-travel-capsule',
    summary: 'A curated checklist for jet-setting in total luxury with under five perfectly balanced fashion, hair, and cosmetic pieces.',
    content: `Elegant travel is an art. It demands versatility that transitions effortlessly from first-class lounges to high-fashion dinners with zero wardrobe adjustments. Structuring a travel capsule requires selecting premium materials that refuse to crease and high-performance hair units that require zero heat setup on arrival.

### The Golden Travel Pieces
* **The Silk column dress**: Sand-washed silk compresses to almost nothing, yet unfurls into a red-carpet-worthy, sensuous silhouette with a quick shower steam.
* **The Organic Linen Set**: The ultimate comfortable, breathable statement. Looks beautifully artistic in its natural rumpled premium fiber texture.
* **The Pre-styled HD Braid Wig**: Zero styling tools required. Our micro-braid lace wigs allow complete active freedom while maintaining a crisp, pristine, high-fashion scalp illusion.
* **Sculptural Vintage Gold links**: Two gold links can dress up a casual crewneck shirt immediately, making jewelry the champion of weight-to-style efficiency.`,
    author_name: 'Fumilayo Thomas',
    author_role: 'Founder & Style Curator',
    category: 'Lifestyle',
    image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&q=80&w=800',
    published_at: '2026-05-15T09:12:00Z',
    is_featured: false,
    read_time: '5 min read'
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Hadiza Bello',
    role: 'Creative Director, Studio 19',
    content: 'The HD lace wig from Fitins & Cute Collections is simply peerless. I work in video production where digital high-definition camera lenses reveal everything—and this lace melts flawlessly into the skin. Incredible density and authentic hair flow.',
    rating: 5,
    created_at: '2026-05-12T10:00:00Z',
    is_approved: true
  },
  {
    id: 'test-2',
    name: 'Adebayo Adeleke',
    role: 'Sartorial Expert & Collector',
    content: 'The structured Cashmere and Italian Silk Agbada set was the talk of the gala night. The geometric lineage embroidery and weight of the fabric are evidence of masterful haute couture tailoring. Absolute luxury!',
    rating: 5,
    created_at: '2026-05-18T14:40:00Z',
    is_approved: true
  },
  {
    id: 'test-3',
    name: 'Evelyn Sterling',
    role: 'International Consultant',
    content: 'Fumilayo has created a portal into genuine modern luxury. The linen sets and argan serum have become absolute signature staples of my global travel wardrobe. The customer service matches the premium product tier perfectly.',
    rating: 5,
    created_at: '2026-05-22T09:15:00Z',
    is_approved: true
  }
];
