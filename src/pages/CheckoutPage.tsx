import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, CreditCard, Ticket, CheckCircle2, ShieldCheck, RefreshCw, X, AlertCircle } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, coupons, createOrder, clearCart } = useStore();

  const [shipping, setShipping] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    country: 'Nigeria', // Prefers local Flutterwave currencies
    postalCode: '',
    phone: '',
    billingSame: true
  });

  const [billing, setBilling] = useState({
    name: '',
    address: '',
    city: '',
    country: 'Nigeria'
  });

  // Coupons
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; type: 'percent' | 'fixed'; value: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  // Payment states
  const [isPaying, setIsPaying] = useState(false);
  const [paymentPhase, setPaymentPhase] = useState<'idle' | 'portal' | 'submitting' | 'authorized'>('idle');
  const [paymentError, setPaymentError] = useState('');
  const [createdOrderSummary, setCreatedOrderSummary] = useState<any | null>(null);

  // Card form simulation
  const [cardNum, setCardNum] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const cartSubtotal = cart.reduce((sum, item) => {
    const price = item.product.sale_price || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  // Validate coupon logic
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    
    const coup = coupons.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase());
    if (!coup) {
      setCouponError('This coupon is invalid or expired.');
      return;
    }

    if (coup.min_spend && cartSubtotal < coup.min_spend) {
      setCouponError(`This coupon requires a minimum spend of $${coup.min_spend} USD.`);
      return;
    }

    setAppliedCoupon({
      code: coup.code,
      type: coup.discount_type,
      value: coup.discount_value
    });
    setCouponCode('');
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  // Calculations
  const discountAmount = appliedCoupon 
    ? (appliedCoupon.type === 'percent' 
        ? parseFloat(((cartSubtotal * appliedCoupon.value) / 100).toFixed(2)) 
        : appliedCoupon.value)
    : 0;

  const totalAmount = Math.max(0, parseFloat((cartSubtotal - discountAmount).toFixed(2)));

  // Core checkout trigger
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    // Open specialized Flutterwave simulation overlay!
    setPaymentPhase('portal');
  };

  // Flutterwave Simulated Gateway Payment Actions
  const handleFlutterwavePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError('');
    
    if (cardNum.replace(/\s/g, '').length < 16) {
      setPaymentError('Please enter a valid 16-digit card number.');
      return;
    }

    setPaymentPhase('submitting');
    
    // Simulating secure transactional delay
    setTimeout(async () => {
      try {
        const orderResult = await createOrder(
          shipping,
          totalAmount,
          discountAmount,
          appliedCoupon?.code || undefined,
          'Flutterwave Online Card Gateway'
        );
        
        setCreatedOrderSummary(orderResult);
        setPaymentPhase('authorized');
      } catch (err: any) {
        setPaymentError('The transaction was declined by the card-issuing institution.');
        setPaymentPhase('portal');
      }
    }, 2500);
  };

  // Receipt visual block
  if (paymentPhase === 'authorized' && createdOrderSummary) {
    return (
      <div id="receipt-container" className="bg-brand-beige min-h-screen py-16 px-4">
        <div className="mx-auto max-w-2xl bg-white border border-brand-light-gray p-8 text-center text-brand-charcoal">
          
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-emerald-600 fill-emerald-50" />
          </div>

          <span className="font-mono text-xs tracking-[0.25em] uppercase text-emerald-600 font-bold block mb-2">
            TRANSACTION AUTHORIZED BY FLUTTERWAVE
          </span>
          <h1 className="font-serif text-3xl font-light text-brand-charcoal mb-2">
            Payment Completed Successfully
          </h1>
          <p className="font-serif text-xs text-brand-gray max-w-md mx-auto leading-relaxed font-light mb-8">
            Your premium order is authorized and secured. Our design atelier has commenced preparing your order. An confirmation receipt has been transmitted to your email.
          </p>

          <div className="bg-brand-beige p-6 text-left border border-brand-light-gray mb-8">
            <h4 className="font-sans text-xs tracking-wider uppercase font-bold text-brand-gray border-b border-brand-light-gray pb-2 mb-4">
              Couture Receipt Summarizer
            </h4>
            
            <div className="grid grid-cols-2 gap-4 font-mono text-[0.7rem] text-brand-charcoal mb-6">
              <div><strong>ORDER ID:</strong> {createdOrderSummary.id}</div>
              <div><strong>FLW REFERENCE:</strong> {createdOrderSummary.payment_reference}</div>
              <div><strong>DATE:</strong> {new Date(createdOrderSummary.created_at).toLocaleString()}</div>
              <div><strong>PAYMENT GATEWAY:</strong> Flutterwave Secured</div>
            </div>

            <div className="border-t border-brand-light-gray pt-4 mb-4">
              <h5 className="font-sans text-[0.62rem] uppercase text-brand-gray font-bold tracking-widest mb-3">SHIPPED ADDRESS TO:</h5>
              <p className="font-serif text-xs font-light leading-snug">
                {createdOrderSummary.customer_name}<br />
                {createdOrderSummary.shipping_address}<br />
                {createdOrderSummary.shipping_city}, {createdOrderSummary.shipping_country}<br />
                Phone: {createdOrderSummary.phone}
              </p>
            </div>

            <div className="border-t border-brand-light-gray pt-4">
              <h5 className="font-sans text-[0.62rem] uppercase text-brand-gray font-bold tracking-widest mb-3">ACQUIRED SILHOUETTES:</h5>
              <div className="flex flex-col gap-3">
                {createdOrderSummary.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="font-serif max-w-sm line-clamp-1">
                      {item.product_name} <span className="font-sans text-[0.65rem] text-brand-gray">({item.quantity}x)</span>
                    </span>
                    <span className="font-serif font-bold">${item.price * item.quantity} USD</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-brand-light-gray pt-4 mt-4 flex justify-between items-baseline font-serif text-sm font-bold text-brand-charcoal">
              <span>Gross Total Charge</span>
              <span className="text-xl text-brand-gold">${createdOrderSummary.total_amount} USD</span>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button 
              onClick={() => navigate('/home')}
              className="clickable bg-brand-charcoal text-white font-sans text-xs tracking-widest uppercase py-3.5 px-8 font-bold hover:bg-brand-gray"
            >
              Continue Curating Style
            </button>
            <button 
              onClick={() => navigate('/fashion-lifestyle')}
              className="clickable bg-white border border-brand-charcoal text-brand-charcoal font-sans text-xs tracking-widest uppercase py-3.5 px-6 font-bold hover:bg-brand-beige"
            >
              Read Design essays
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div id="checkout-page" className="bg-brand-beige min-h-screen py-12 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        
        <div className="mb-10 text-center lg:text-left">
          <span className="font-mono text-xs tracking-[0.25em] uppercase text-brand-gold font-bold">SECURED ENCRYPTED GATEWAY</span>
          <h1 className="font-serif text-3xl font-light text-brand-charcoal mt-1">Conclude Your Couture Order</h1>
        </div>

        {cart.length === 0 ? (
          <div className="text-center bg-white border border-brand-light-gray p-12">
            <p className="font-serif text-lg text-brand-gray italic mb-4">No couture selections are active in your shopping bag.</p>
            <button 
              onClick={() => navigate('/home')}
              className="clickable font-sans text-xs uppercase bg-brand-charcoal text-white tracking-widest py-3 px-8 font-semibold"
            >
              Browse Collections Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT FIELD: Shipping & billing profiles form (7 cols) */}
            <form onSubmit={handleCheckoutSubmit} className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Shipping Box */}
              <div className="bg-white p-6 border border-brand-light-gray">
                <h3 className="font-serif text-lg font-bold text-brand-charcoal border-b border-brand-light-gray pb-3 mb-4">
                  1. Luxury Shipping Profile
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-sans text-[0.62rem] tracking-widest uppercase text-brand-gray font-bold">Recipient Full Name</label>
                    <input 
                      type="text" 
                      placeholder="Hadiza Bello" 
                      value={shipping.name}
                      onChange={(e) => setShipping({ ...shipping, name: e.target.value })}
                      className="border border-brand-light-gray bg-brand-beige p-2.5 text-xs outline-none"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-sans text-[0.62rem] tracking-widest uppercase text-brand-gray font-bold">Notification Email</label>
                    <input 
                      type="email" 
                      placeholder="email@example.com" 
                      value={shipping.email}
                      onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                      className="border border-brand-light-gray bg-brand-beige p-2.5 text-xs outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1 mb-4">
                  <label className="font-sans text-[0.62rem] tracking-widest uppercase text-brand-gray font-bold">Physical Shipping Address</label>
                  <input 
                    type="text" 
                    placeholder="Penthouse A, Victoria Crest Residence" 
                    value={shipping.address}
                    onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                    className="border border-brand-light-gray bg-brand-beige p-2.5 text-xs outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-sans text-[0.62rem] tracking-widest uppercase text-brand-gray font-bold">City / Territory</label>
                    <input 
                      type="text" 
                      placeholder="Lagos Ward" 
                      value={shipping.city}
                      onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                      className="border border-brand-light-gray bg-brand-beige p-2.5 text-xs outline-none"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-sans text-[0.62rem] tracking-widest uppercase text-brand-gray font-bold">Postal Code</label>
                    <input 
                      type="text" 
                      placeholder="101221" 
                      value={shipping.postalCode}
                      onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                      className="border border-brand-light-gray bg-brand-beige p-2.5 text-xs outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-sans text-[0.62rem] tracking-widest uppercase text-brand-gray font-bold">Destination Country</label>
                    <select 
                      value={shipping.country}
                      onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                      className="border border-brand-light-gray bg-brand-beige p-2.5 text-xs outline-none clickable uppercase font-medium"
                    >
                      <option value="Nigeria">Nigeria (NGN)</option>
                      <option value="United Kingdom">United Kingdom (GBP)</option>
                      <option value="United States">United States (USD)</option>
                      <option value="Ghana">Ghana (GHS)</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1 mb-4">
                  <label className="font-sans text-[0.62rem] tracking-widest uppercase text-brand-gray font-bold">Contact Phone Number (Courier Sync)</label>
                  <input 
                    type="tel" 
                    placeholder="+234 803 123 4567" 
                    value={shipping.phone}
                    onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                    className="border border-brand-light-gray bg-brand-beige p-2.5 text-xs outline-none"
                    required
                  />
                </div>

                <div className="flex items-center gap-2 mt-4 font-sans text-xs">
                  <input 
                    type="checkbox" 
                    id="billingSame"
                    checked={shipping.billingSame}
                    onChange={(e) => setShipping({ ...shipping, billingSame: e.target.checked })}
                    className="clickable"
                  />
                  <label htmlFor="billingSame" className="clickable select-none">Billing coordinates match shipping address</label>
                </div>
              </div>

              {/* Billing Box (conditional on same billing) */}
              {!shipping.billingSame && (
                <div className="bg-white p-6 border border-brand-light-gray">
                  <h3 className="font-serif text-lg font-bold text-brand-charcoal border-b border-brand-light-gray pb-3 mb-4">
                    2. Billing Coordinates
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col gap-1">
                      <label className="font-sans text-[0.62rem] tracking-widest uppercase text-brand-gray font-bold">Cardholder Full Name</label>
                      <input 
                        type="text" 
                        placeholder="Hadiza Bello" 
                        value={billing.name}
                        onChange={(e) => setBilling({ ...billing, name: e.target.value })}
                        className="border border-brand-light-gray bg-brand-beige p-2.5 text-xs outline-none"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-sans text-[0.62rem] tracking-widest uppercase text-brand-gray font-bold">Street address</label>
                      <input 
                        type="text" 
                        placeholder="Suite 40, Broad Street" 
                        value={billing.address}
                        onChange={(e) => setBilling({ ...billing, address: e.target.value })}
                        className="border border-brand-light-gray bg-brand-beige p-2.5 text-xs outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <button 
                type="submit"
                className="clickable w-full bg-brand-charcoal hover:bg-brand-gray text-white font-sans text-xs uppercase tracking-widest py-4.5 font-bold shadow-md"
              >
                Authorise Payment With Flutterwave Gateway
              </button>
            </form>

            {/* RIGHT SIDE: Subtotal review panel (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Selections review box */}
              <div className="bg-white p-6 border border-brand-light-gray">
                <h3 className="font-serif text-lg font-bold text-brand-charcoal border-b border-brand-light-gray pb-3 mb-4 flex justify-between items-baseline">
                  <span>Acquisitions</span>
                  <span className="font-sans text-[0.65rem] tracking-widest uppercase text-brand-gray">({cart.length} unique)</span>
                </h3>

                <div className="flex flex-col gap-3 max-h-72 overflow-y-auto no-scrollbar mb-4 border-b border-brand-light-gray pb-4">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex gap-3 justify-between items-center text-xs p-1.5 hover:bg-brand-beige">
                      <div className="flex gap-3 items-center">
                        <img src={item.product.images[0]} alt={item.product.name} className="h-12 w-10 object-cover border border-brand-light-gray shrink-0" referrerPolicy="no-referrer" />
                        <div>
                          <h4 className="font-serif font-bold text-brand-charcoal line-clamp-1 leading-snug">{item.product.name}</h4>
                          <span className="font-sans text-[0.62rem] text-brand-gray uppercase tracking-wider block mt-0.5">
                            QTY: {item.quantity} {item.selectedSize ? `• SIZE: ${item.selectedSize}` : ''}
                          </span>
                        </div>
                      </div>
                      <span className="font-serif font-bold text-brand-charcoal">${(item.product.sale_price || item.product.price) * item.quantity} USD</span>
                    </div>
                  ))}
                </div>

                {/* Coupon application form */}
                <form onSubmit={handleApplyCoupon} className="flex gap-2 mb-4">
                  <input 
                    type="text" 
                    placeholder="COUPON (FUMI10, LUXURY20)..." 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-grow border border-brand-light-gray p-2.5 text-xs bg-brand-beige uppercase outline-none focus:border-brand-gold font-mono font-bold"
                  />
                  <button 
                    type="submit"
                    className="clickable bg-brand-charcoal hover:bg-brand-gray text-white text-[0.65rem] font-sans font-bold uppercase tracking-widest py-2.5 px-4"
                  >
                    Apply code
                  </button>
                </form>

                {couponError && (
                  <p className="text-rose-600 text-[0.7rem] font-medium leading-none mb-3 text-center">{couponError}</p>
                )}

                {appliedCoupon && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-2.5 rounded mb-4 flex justify-between items-center font-mono">
                    <span>ACTIVE: <strong>{appliedCoupon.code}</strong> (-{appliedCoupon.type === 'percent' ? `${appliedCoupon.value}%` : `$${appliedCoupon.value} USD`})</span>
                    <button type="button" onClick={handleRemoveCoupon} className="clickable text-rose-600 hover:font-bold">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* Pricing Summarizers */}
                <div className="flex flex-col gap-2 font-serif text-sm text-brand-charcoal pt-2">
                  <div className="flex justify-between items-baseline">
                    <span className="font-sans text-[0.65rem] tracking-widest text-brand-gray uppercase">Silhouettes Subtotal</span>
                    <span>${cartSubtotal} USD</span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between items-baseline text-emerald-600">
                      <span className="font-sans text-[0.65rem] tracking-widest uppercase">Coupon Deduction</span>
                      <span>-${discountAmount} USD</span>
                    </div>
                  )}

                  <div className="flex justify-between items-baseline text-brand-gold font-bold">
                    <span className="font-sans text-[0.65rem] tracking-widest uppercase font-semibold text-brand-gray">Atelier DHL Courier</span>
                    <span>COMPLIMENTARY</span>
                  </div>

                  <div className="border-t border-brand-light-gray pt-3 mt-2 flex justify-between items-baseline font-bold text-base text-brand-charcoal">
                    <span className="font-sans text-[0.65rem] tracking-widest uppercase font-bold text-brand-gray">Atelier Charge Gross</span>
                    <span className="text-lg text-brand-charcoal">${totalAmount} USD</span>
                  </div>
                </div>

                <div className="mt-6 p-4 border border-brand-light-gray bg-brand-beige flex items-start gap-2 text-[0.65rem] text-brand-gray leading-relaxed">
                  <ShieldCheck className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
                  <span>Couture orders cleared via secured Flutterwave standard authorizations. Raw lace frontals and premium garments are backed by certified authentic heritage assurances.</span>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>

      {/* FLUTTERWAVE GATEWAY HIGH FIDELITY SIMULATION OVERLAY */}
      {paymentPhase === 'portal' && (
        <div id="flutterwave-payment-overlay" className="fixed inset-0 z-[250] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/75" />
          
          <div className="relative w-full max-w-md bg-[#f4f4f4] rounded-lg shadow-2xl z-10 overflow-hidden border border-brand-light-gray text-left">
            
            {/* Flutterwave Header Branded Segment */}
            <div className="bg-[#f5a623] text-white p-5 flex justify-between items-center font-mono">
              <div className="flex flex-col">
                <span className="text-[0.6rem] tracking-[0.25em] uppercase font-bold opacity-80">SECURED PAY PORTAL</span>
                <span className="text-sm font-bold tracking-widest">FLUTTERWAVE MERCHANT</span>
              </div>
              <button 
                onClick={() => setPaymentPhase('idle')}
                className="clickable p-1 hover:bg-white/15 rounded text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Merchant info block */}
            <div className="bg-white p-4 border-b border-brand-light-gray flex justify-between items-baseline">
              <div className="flex flex-col">
                <span className="font-serif text-[0.65rem] uppercase tracking-widest text-[#555555]">MERCHANT RECIPIENT</span>
                <span className="font-serif text-sm font-bold text-brand-charcoal">Fitins & Cute Collections</span>
              </div>
              <div className="text-right">
                <span className="font-serif text-[0.65rem] uppercase tracking-widest text-[#555555]">PAYMENT SUM CHARGE</span>
                <span className="font-mono text-base font-bold text-[#f5a623] block leading-none">${totalAmount} USD</span>
              </div>
            </div>

            {/* Secure card credentials form */}
            <form onSubmit={handleFlutterwavePaymentSubmit} className="p-6 bg-white flex flex-col gap-4">
              
              {paymentError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-2.5 text-center font-semibold rounded flex items-center gap-1">
                  <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" /> {paymentError}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[0.62rem] tracking-widest uppercase text-brand-gray font-bold">16-Digit Card Number</label>
                <div className="flex border border-brand-light-gray rounded bg-brand-beige">
                  <input 
                    type="text"
                    maxLength={19}
                    placeholder="4000 1234 5678 9010"
                    value={cardNum}
                    onChange={(e) => {
                      // Automatically insert spacing to look extremely authentic!
                      const val = e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
                      setCardNum(val);
                    }}
                    className="w-full bg-none outline-none font-mono text-xs p-3"
                    required
                  />
                  <span className="p-3 bg-brand-light-gray text-[0.62rem] font-bold text-brand-gray rounded-r flex items-center">CREDIT</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[0.62rem] tracking-widest uppercase text-brand-gray font-bold">Expiry Date</label>
                  <input 
                    type="text" 
                    maxLength={5}
                    placeholder="MM/YY" 
                    value={cardExpiry}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.length === 2 && !val.includes('/')) {
                        setCardExpiry(val + '/');
                      } else {
                        setCardExpiry(val);
                      }
                    }}
                    className="border border-brand-light-gray rounded bg-brand-beige font-mono text-xs p-3 outline-none"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[0.62rem] tracking-widest uppercase text-brand-gray font-bold">CVV Pin</label>
                  <input 
                    type="password" 
                    maxLength={3}
                    placeholder="XXX" 
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="border border-brand-light-gray rounded bg-brand-beige font-mono text-xs p-3 outline-none text-center"
                    required
                  />
                </div>
              </div>

              {/* Secure Trust indicators */}
              <div className="flex items-center gap-1.5 bg-brand-beige p-3 text-[0.62rem] text-brand-gray font-sans py-2.5 rounded border border-brand-light-gray/60 leading-relaxed font-light">
                <ShieldCheck className="h-4 w-4 text-[#f5a623] shrink-0" />
                <span>Encrypted 256-bit validation socket. Transactions are immediate. Verified by VISA and Mastercard SecureCode.</span>
              </div>

              <button 
                type="submit"
                className="clickable w-full bg-[#f5a623] hover:bg-[#d98b18] text-white font-mono text-xs tracking-widest uppercase py-3.5 font-bold shadow-md rounded flex items-center justify-center gap-2 mt-2"
              >
                <CreditCard className="h-4 w-4" /> Complete Authorized Charge of ${totalAmount} USD
              </button>
            </form>

            <div className="bg-[#f4f4f4] text-center p-3 text-[0.55rem] font-mono text-brand-gray tracking-wider uppercase border-t border-brand-light-gray">
              POWERED BY FLUTTERWAVE GATEWAY v4.5 • AI STUDIO SECURITY
            </div>

          </div>
        </div>
      )}

      {/* SECURE SUBMITTING SPINNER OVERLAY */}
      {paymentPhase === 'submitting' && (
        <div id="submitting-spinner" className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" />
          <div className="relative text-center text-white flex flex-col items-center gap-4">
            <RefreshCw className="h-12 w-12 text-brand-gold animate-spin" />
            <span className="font-mono text-xs tracking-[0.25em] uppercase text-brand-gold font-bold">AUTHORISING WITH BANK SECURITY SOC...</span>
            <p className="font-serif text-sm text-brand-beige/80 max-w-xs font-light">
              Secure payment token verified by Flutterwave is processing. Stand by, do not close or refresh this tab.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
