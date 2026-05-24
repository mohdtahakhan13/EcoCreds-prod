// // src/pages/Cart.jsx
// import React, { useEffect, useState } from 'react';
// import Navbar from '../components/Navbar';
// import api from '../utils/api';
// import { Link } from 'react-router-dom';

// export default function Cart() {
//   const [cart, setCart] = useState([]);
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [totalCO2, setTotalCO2] = useState(0);
//   const [totalCO2Saved, setTotalCO2Saved] = useState(0);
//   const [totalEcoCreds, setTotalEcoCreds] = useState(0);
//   const [userData, setUserData] = useState(null);

//   useEffect(() => {
//     const c = JSON.parse(localStorage.getItem('cart') || '[]');
//     setCart(c);
//     computeTotals(c);
//     fetchUserData();
//   }, []);

//   const fetchUserData = async () => {
//     try {
//       const res = await api.get('/auth/me');
//       setUserData(res.data);
//     } catch (error) {
//       console.error('Failed to fetch user data');
//     }
//   };

//   // Enhanced EcoCred points calculation formula
//   const calculateEcoCreds = (co2Saved, price, usedAlternative) => {
//     const co2Points = co2Saved * 3; // 3 points per kg CO2 saved
//     const purchasePoints = Math.floor(price / 100); // 1 point per 100 rupees
//     const alternativeBonus = usedAlternative ? 5 : 0; // +5 bonus points for eco alternatives
//     return co2Points + purchasePoints + alternativeBonus;
//   };

//   const computeTotals = (items) => {
//     let tp = 0, co2 = 0, saved = 0, creds = 0;
//     items.forEach(it => {
//       const quantity = it.qty || 1;
//       tp += it.price * quantity;
//       co2 += (it.carbonFootprint || 0) * quantity;
//       saved += (it.co2Savings || 0) * quantity;
//       creds += calculateEcoCreds(it.co2Savings || 0, it.price, it.usedAlternative) * quantity;
//     });
//     setTotalPrice(tp);
//     setTotalCO2(co2);
//     setTotalCO2Saved(saved);
//     setTotalEcoCreds(Math.round(creds)); // Round to whole number
//   };

//   const updateQuantity = (index, newQty) => {
//     if (newQty < 1) return;
    
//     const updatedCart = [...cart];
//     updatedCart[index].qty = newQty;
//     setCart(updatedCart);
//     localStorage.setItem('cart', JSON.stringify(updatedCart));
//     computeTotals(updatedCart);
//   };

//   const removeItem = (index) => {
//     const updatedCart = cart.filter((_, i) => i !== index);
//     setCart(updatedCart);
//     localStorage.setItem('cart', JSON.stringify(updatedCart));
//     computeTotals(updatedCart);
//   };

//   const checkout = async () => {
//     if (!localStorage.getItem('token')) {
//       alert('Please login to checkout');
//       return;
//     }
//     try {
//       // Create Razorpay order
//       const res = await api.post('/payments/create-order', { amount: totalPrice });
//       const rOrder = res.data;
      
//       // Create our order in database
//       const orderRes = await api.post('/cart/create-order', {
//         items: cart,
//         totalPrice,
//         totalCO2,
//         totalCO2Saved,
//         ecoCredsEarned: totalEcoCreds
//       });
//       const ourOrder = orderRes.data;

//       const options = {
//         key:  import.meta.env.VITE_RAZORPAY_KEY,
//         amount: rOrder.amount,
//         currency: rOrder.currency,
//         name: 'EcoCred',
//         description: 'Sustainable Shopping Order',
//         order_id: rOrder.id,
//         handler: async function (response) {
//           try {
//             await api.post('/payments/verify', {
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//               ourOrderId: ourOrder._id
//             });
            
//             alert(`Payment successful! You earned ${totalEcoCreds} EcoCred points!`);
//             localStorage.removeItem('cart');
            
//             // Add a small delay to ensure backend updates are complete
//             setTimeout(() => {
//               window.location.href = '/dashboard';
//             }, 1000);
            
//           } catch (error) {
//             console.error('Payment verification error:', error);
//             alert('Payment successful but there was an issue updating your points. Please contact support.');
//           }
//         },
//         prefill: {
//           name: userData?.user?.name || '',
//           email: userData?.user?.email || '',
//         },
//         theme: {
//           color: '#10B981'
//         }
//       };
      
//       const rzp = new window.Razorpay(options);
//       rzp.open();
      
//       // Handle payment failure
//       rzp.on('payment.failed', function (response) {
//         alert('Payment failed. Please try again.');
//         console.error('Payment failed:', response.error);
//       });
      
//     } catch (err) {
//       console.error('Checkout error:', err);
//       alert('Checkout failed. Please try again.');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
//       <Navbar user={userData?.user} />
      
//       <div className="max-w-4xl mx-auto p-6">
//         <div className="flex justify-between items-center mb-8">
//           <h2 className="text-3xl font-bold text-gray-900">Your Cart</h2>
//           <Link 
//             to="/products" 
//             className="text-green-600 hover:text-green-700 font-semibold"
//           >
//             ← Continue Shopping
//           </Link>
//         </div>

//         {cart.length === 0 ? (
//           <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
//             <div className="text-6xl mb-4">🛒</div>
//             <h3 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h3>
//             <p className="text-gray-600 mb-6">Start adding some sustainable products to your cart!</p>
//             <Link 
//               to="/products" 
//               className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300"
//             >
//               Browse Products
//             </Link>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Cart Items */}
//             <div className="lg:col-span-2 space-y-4">
//               {cart.map((item, index) => {
//                 const itemEcoCreds = calculateEcoCreds(item.co2Savings || 0, item.price, item.usedAlternative) * (item.qty || 1);
                
//                 return (
//                   <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
//                     <div className="flex justify-between items-start">
//                       <div className="flex-1">
//                         <h4 className="font-semibold text-lg text-gray-900 mb-2">{item.name}</h4>
                        
//                         {item.usedAlternative && (
//                           <div className="inline-flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold mb-2">
//                             🌱 Eco Alternative (+5 bonus points)
//                           </div>
//                         )}
                        
//                         <div className="grid grid-cols-2 gap-4 text-sm mb-3">
//                           <div>
//                             <p className="text-gray-500">Price</p>
//                             <p className="font-semibold">₹{item.price}</p>
//                           </div>
//                           <div>
//                             <p className="text-gray-500">CO₂ Footprint</p>
//                             <p className="font-semibold">{item.carbonFootprint?.toFixed(2) || '0.00'} kg</p>
//                           </div>
//                         </div>
                        
//                         {item.co2Savings > 0 && (
//                           <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
//                             <p className="text-green-700 font-semibold text-sm">
//                               🎉 Saving {item.co2Savings.toFixed(2)} kg CO₂
//                             </p>
//                           </div>
//                         )}

//                         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
//                           <p className="text-yellow-700 font-semibold text-sm">
//                             💰 Earns {itemEcoCreds} EcoCred points
//                           </p>
//                         </div>
//                       </div>
                      
//                       <div className="flex flex-col items-end space-y-3">
//                         {/* Quantity Controls */}
//                         <div className="flex items-center space-x-2">
//                           <button 
//                             onClick={() => updateQuantity(index, (item.qty || 1) - 1)}
//                             className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
//                           >
//                             -
//                           </button>
//                           <span className="font-semibold w-8 text-center">{item.qty || 1}</span>
//                           <button 
//                             onClick={() => updateQuantity(index, (item.qty || 1) + 1)}
//                             className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
//                           >
//                             +
//                           </button>
//                         </div>
                        
//                         <button 
//                           onClick={() => removeItem(index)}
//                           className="text-red-500 hover:text-red-700 text-sm font-semibold"
//                         >
//                           Remove
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Order Summary */}
//             <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100 h-fit">
//               <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
              
//               <div className="space-y-4 mb-6">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Subtotal</span>
//                   <span className="font-semibold">₹{totalPrice.toFixed(2)}</span>
//                 </div>
                
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Total CO₂</span>
//                   <span className="font-semibold">{totalCO2.toFixed(2)} kg</span>
//                 </div>
                
//                 {totalCO2Saved > 0 && (
//                   <div className="flex justify-between bg-green-50 p-3 rounded-lg">
//                     <span className="text-green-700 font-semibold">CO₂ Saved</span>
//                     <span className="text-green-700 font-semibold">-{totalCO2Saved.toFixed(2)} kg</span>
//                   </div>
//                 )}
                
//                 <div className="flex justify-between bg-yellow-50 p-3 rounded-lg border border-yellow-200">
//                   <span className="text-yellow-700 font-semibold">EcoCreds Earned</span>
//                   <span className="text-yellow-700 font-semibold">+{totalEcoCreds} points</span>
//                 </div>
                
//                 <div className="border-t pt-4">
//                   <div className="flex justify-between text-lg font-bold">
//                     <span>Total Amount</span>
//                     <span>₹{totalPrice.toFixed(2)}</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
//                 <h4 className="font-semibold text-blue-800 mb-2">🎁 EcoCred Points Breakdown</h4>
//                 <ul className="text-sm text-blue-700 space-y-1">
//                   <li>• 3 points per kg CO₂ saved</li>
//                   <li>• 1 point per ₹100 spent</li>
//                   <li>• +5 bonus points for eco alternatives</li>
//                 </ul>
//               </div>

//               <button 
//                 onClick={checkout}
//                 className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-semibold text-lg transition duration-300 shadow-lg"
//               >
//                 Proceed to Checkout
//               </button>

//               <p className="text-center text-gray-500 text-sm mt-4">
//                 Your points will be added immediately after payment
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// src/pages/Cart.jsx
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const calcCreds = (co2Saved, price, usedAlt) =>
  (co2Saved * 3) + Math.floor(price / 100) + (usedAlt ? 5 : 0);

export default function Cart() {
  const [cart,          setCart]          = useState([]);
  const [totalPrice,    setTotalPrice]    = useState(0);
  const [totalCO2,      setTotalCO2]      = useState(0);
  const [totalCO2Saved, setTotalCO2Saved] = useState(0);
  const [totalCreds,    setTotalCreds]    = useState(0);
  const [userData,      setUserData]      = useState(null);

  useEffect(() => {
    const c = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(c); computeTotals(c);
    api.get('/auth/me').then(r => setUserData(r.data)).catch(()=>{});
  }, []);

  const computeTotals = (items) => {
    let tp=0, co2=0, saved=0, creds=0;
    items.forEach(it => {
      const q = it.qty || 1;
      tp    += it.price * q;
      co2   += (it.carbonFootprint || 0) * q;
      saved += (it.co2Savings || 0) * q;
      creds += calcCreds(it.co2Savings||0, it.price, it.usedAlternative) * q;
    });
    setTotalPrice(tp); setTotalCO2(co2);
    setTotalCO2Saved(saved); setTotalCreds(Math.round(creds));
  };

  const updateQty = (i, newQty) => {
    if (newQty < 1) return;
    const c = [...cart]; c[i].qty = newQty;
    setCart(c); localStorage.setItem('cart', JSON.stringify(c)); computeTotals(c);
  };

  const removeItem = (i) => {
    const c = cart.filter((_,idx) => idx !== i);
    setCart(c); localStorage.setItem('cart', JSON.stringify(c)); computeTotals(c);
  };

  const checkout = async () => {
    if (!localStorage.getItem('token')) { alert('Please login to checkout'); return; }
    try {
      const res   = await api.post('/payments/create-order', { amount: totalPrice });
      const rOrder= res.data;
      const oRes  = await api.post('/cart/create-order', {
        items: cart, totalPrice, totalCO2, totalCO2Saved, ecoCredsEarned: totalCreds,
      });
      const ourOrder = oRes.data;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: rOrder.amount, currency: rOrder.currency,
        name: 'EcoCred', description: 'Sustainable Shopping',
        order_id: rOrder.id,
        handler: async (response) => {
          try {
            await api.post('/payments/verify', {
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              ourOrderId:          ourOrder._id,
            });
            alert(`Payment successful! You earned ${totalCreds} EcoCred points!`);
            localStorage.removeItem('cart');
            setTimeout(() => { window.location.href = '/dashboard'; }, 1000);
          } catch { alert('Payment successful but there was an issue updating points.'); }
        },
        prefill: { name: userData?.user?.name||'', email: userData?.user?.email||'' },
        theme: { color: '#2d5a3d' },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
      rzp.on('payment.failed', () => alert('Payment failed. Please try again.'));
    } catch { alert('Checkout failed. Please try again.'); }
  };

  return (
    <div className="eco-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        :root{
          --forest:#1a3a2a;--moss:#2d5a3d;--moss-light:#3d7a52;
          --lime:#b5e048;--lime-pale:#e8f5d8;--cream:#f5f0e8;
          --cream-dk:#ede8de;--stone:#8a8a7a;--stone-lt:#b0b0a0;--white:#fff;
          --amber:#f5a623;--amber-pale:#fff8e6;--red:#e05252;
          --font-display:'Fraunces',serif;--font-body:'DM Sans',system-ui,sans-serif;
          --shadow:0 2px 12px rgba(26,58,42,.08);--shadow-lg:0 8px 32px rgba(26,58,42,.12);
        }
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:var(--font-body);background:var(--cream);}
        .eco-page{min-height:100vh;background:var(--cream);}
        .shell{max-width:1100px;margin:0 auto;padding:2rem 1.25rem 5rem;}

        .page-header{
          display:flex;align-items:center;justify-content:space-between;
          margin-bottom:1.75rem;flex-wrap:wrap;gap:.75rem;
        }
        .page-title{
          font-family:var(--font-display);font-size:clamp(1.5rem,3vw,2rem);
          font-weight:700;color:var(--forest);
        }
        .back-link{
          font-size:.875rem;font-weight:600;color:var(--moss);
          text-decoration:none;display:flex;align-items:center;gap:.3rem;
        }
        .back-link:hover{text-decoration:underline;}

        /* cart layout */
        .cart-layout{display:grid;grid-template-columns:1fr 340px;gap:1.25rem;align-items:start;}
        @media(max-width:800px){.cart-layout{grid-template-columns:1fr;}}

        /* item card */
        .item-card{
          background:var(--white);border:1.5px solid var(--cream-dk);
          border-radius:1.1rem;padding:1.25rem;margin-bottom:.85rem;
          box-shadow:var(--shadow);
        }
        .item-top{display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;}
        .item-name{
          font-family:var(--font-display);font-size:1.05rem;font-weight:600;
          color:var(--forest);margin-bottom:.5rem;
        }
        .alt-pill{
          display:inline-flex;align-items:center;gap:.3rem;
          background:var(--lime-pale);color:var(--moss);
          font-size:.72rem;font-weight:700;
          padding:.2rem .65rem;border-radius:9999px;
          text-transform:uppercase;letter-spacing:.05em;
          margin-bottom:.5rem;
        }
        .item-meta{
          display:grid;grid-template-columns:1fr 1fr;gap:.65rem;
          margin-bottom:.65rem;
        }
        .meta-box{
          background:var(--cream);border-radius:.65rem;
          padding:.6rem .8rem;
        }
        .meta-label{font-size:.72rem;color:var(--stone);text-transform:uppercase;letter-spacing:.06em;}
        .meta-value{font-size:.9rem;font-weight:600;color:var(--forest);}
        .savings-strip{
          background:var(--lime-pale);border-radius:.65rem;
          padding:.6rem .8rem;margin-bottom:.6rem;
          font-size:.83rem;font-weight:600;color:var(--moss);
        }
        .cred-strip{
          background:var(--amber-pale);border-radius:.65rem;
          padding:.6rem .8rem;
          font-size:.83rem;font-weight:600;color:#7a5c00;
        }

        /* qty controls */
        .qty-col{display:flex;flex-direction:column;align-items:flex-end;gap:.75rem;flex-shrink:0;}
        .qty-ctrl{display:flex;align-items:center;gap:.5rem;}
        .qty-btn{
          width:30px;height:30px;border-radius:50%;
          background:var(--cream);border:1.5px solid var(--cream-dk);
          font-size:1rem;font-weight:700;cursor:pointer;
          display:flex;align-items:center;justify-content:center;
          color:var(--forest);transition:background .15s;
        }
        .qty-btn:hover{background:var(--cream-dk);}
        .qty-num{font-weight:700;font-size:.95rem;width:24px;text-align:center;}
        .remove-btn{
          font-size:.8rem;font-weight:600;color:var(--red);
          background:none;border:none;cursor:pointer;transition:opacity .15s;
        }
        .remove-btn:hover{opacity:.7;}

        /* summary card */
        .summary-card{
          background:var(--white);border:1.5px solid var(--cream-dk);
          border-radius:1.1rem;padding:1.5rem;
          box-shadow:var(--shadow);
          position:sticky;top:80px;
        }
        .summary-title{
          font-family:var(--font-display);font-size:1.1rem;font-weight:700;
          color:var(--forest);margin-bottom:1.1rem;
        }
        .sum-row{
          display:flex;justify-content:space-between;
          font-size:.875rem;padding:.45rem 0;
          border-bottom:1px solid var(--cream-dk);
        }
        .sum-row:last-of-type{border-bottom:none;}
        .sum-row__label{color:var(--stone);}
        .sum-row__val{font-weight:600;color:var(--forest);}
        .sum-row--green .sum-row__label,.sum-row--green .sum-row__val{color:var(--moss);}
        .sum-row--amber .sum-row__label,.sum-row--amber .sum-row__val{color:#7a5c00;}
        .sum-total{
          display:flex;justify-content:space-between;align-items:center;
          padding:1rem 0 .75rem;margin-top:.5rem;
          border-top:2px solid var(--cream-dk);
        }
        .sum-total__label{font-weight:700;font-size:1rem;color:var(--forest);}
        .sum-total__val{
          font-family:var(--font-display);font-size:1.25rem;
          font-weight:700;color:var(--forest);
        }
        .cred-info{
          background:var(--lime-pale);border-radius:.75rem;
          padding:.9rem 1rem;margin:1rem 0;font-size:.8rem;color:var(--moss);
        }
        .cred-info p{margin-bottom:.25rem;}
        .cred-info p:last-child{margin-bottom:0;}
        .checkout-btn{
          width:100%;padding:.9rem;border-radius:.85rem;
          background:var(--forest);color:var(--lime);
          font-family:var(--font-body);font-size:1rem;font-weight:700;
          border:none;cursor:pointer;
          transition:background .2s,transform .15s;
          margin-bottom:.75rem;
        }
        .checkout-btn:hover{background:var(--moss);transform:translateY(-1px);}
        .checkout-note{font-size:.78rem;text-align:center;color:var(--stone-lt);}

        /* empty cart */
        .cart-empty{
          background:var(--white);border:1.5px solid var(--cream-dk);
          border-radius:1.35rem;padding:4rem 2rem;
          text-align:center;box-shadow:var(--shadow);
        }
        .cart-empty__icon{font-size:4rem;margin-bottom:1rem;}
        .cart-empty__title{
          font-family:var(--font-display);font-size:1.5rem;
          font-weight:700;color:var(--forest);margin-bottom:.5rem;
        }
        .cart-empty__sub{font-size:.9rem;color:var(--stone);margin-bottom:1.5rem;}
        .link-btn{
          display:inline-flex;align-items:center;gap:.4rem;
          padding:.65rem 1.4rem;border-radius:9999px;
          font-family:var(--font-body);font-size:.875rem;font-weight:600;
          text-decoration:none;background:var(--forest);color:var(--lime);
          transition:background .2s;
        }
        .link-btn:hover{background:var(--moss);}
      `}</style>

      <Navbar user={userData?.user}/>

      <div className="shell">
        <div className="page-header">
          <h1 className="page-title">Your Cart 🛒</h1>
          <Link to="/products" className="back-link">← Continue Shopping</Link>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty__icon">🛒</div>
            <h2 className="cart-empty__title">Your cart is empty</h2>
            <p className="cart-empty__sub">Start adding some sustainable products!</p>
            <Link to="/products" className="link-btn">Browse Products</Link>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Items */}
            <div>
              {cart.map((item, i) => {
                const qty   = item.qty || 1;
                const creds = calcCreds(item.co2Savings||0, item.price, item.usedAlternative) * qty;
                return (
                  <div key={i} className="item-card">
                    <div className="item-top">
                      <div style={{flex:1}}>
                        <h3 className="item-name">{item.name}</h3>
                        {item.usedAlternative && (
                          <div className="alt-pill">🌿 Eco Alternative (+5 bonus pts)</div>
                        )}
                        <div className="item-meta">
                          <div className="meta-box">
                            <p className="meta-label">Price</p>
                            <p className="meta-value">₹{(item.price*qty).toLocaleString('en-IN')}</p>
                          </div>
                          <div className="meta-box">
                            <p className="meta-label">CO₂ Footprint</p>
                            <p className="meta-value">{((item.carbonFootprint||0)*qty).toFixed(2)} kg</p>
                          </div>
                        </div>
                        {item.co2Savings > 0 && (
                          <div className="savings-strip">
                            🎉 Saving {(item.co2Savings*qty).toFixed(2)} kg CO₂ with this choice!
                          </div>
                        )}
                        <div className="cred-strip">
                          💰 Earns {Math.round(creds)} EcoCred points
                        </div>
                      </div>

                      <div className="qty-col">
                        <div className="qty-ctrl">
                          <button className="qty-btn" onClick={()=>updateQty(i,(qty-1))}>−</button>
                          <span className="qty-num">{qty}</span>
                          <button className="qty-btn" onClick={()=>updateQty(i,(qty+1))}>+</button>
                        </div>
                        <button className="remove-btn" onClick={()=>removeItem(i)}>Remove</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="summary-card">
              <h2 className="summary-title">Order Summary</h2>
              <div>
                <div className="sum-row">
                  <span className="sum-row__label">Subtotal</span>
                  <span className="sum-row__val">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="sum-row">
                  <span className="sum-row__label">Total CO₂</span>
                  <span className="sum-row__val">{totalCO2.toFixed(2)} kg</span>
                </div>
                {totalCO2Saved > 0 && (
                  <div className="sum-row sum-row--green">
                    <span className="sum-row__label">CO₂ Saved 🌿</span>
                    <span className="sum-row__val">−{totalCO2Saved.toFixed(2)} kg</span>
                  </div>
                )}
                <div className="sum-row sum-row--amber">
                  <span className="sum-row__label">EcoCreds Earned</span>
                  <span className="sum-row__val">+{totalCreds} pts</span>
                </div>
              </div>
              <div className="sum-total">
                <span className="sum-total__label">Total</span>
                <span className="sum-total__val">₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="cred-info">
                <p>🌱 3 pts per kg CO₂ saved</p>
                <p>💳 1 pt per ₹100 spent</p>
                <p>♻️ +5 bonus pts for eco alternatives</p>
              </div>
              <button className="checkout-btn" onClick={checkout}>
                Proceed to Checkout →
              </button>
              <p className="checkout-note">Points added immediately after payment</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}