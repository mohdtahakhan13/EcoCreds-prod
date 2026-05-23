// import React, { useState } from "react";
// import axios from "axios";
// import { setToken } from "../utils/auth";

// export default function Signup() {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     gender: "",
//     dob: "",
//     nationality: "",
//   });
//   const [err, setErr] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const submit = async (e) => {
//     e.preventDefault();
//     setErr("");

//     try {
//       const res = await axios.post("http://localhost:5000/api/auth/signup", form);
//       setToken(res.data.token);
//       window.location.href = "/dashboard";
//     } catch (error) {
//       setErr(error?.response?.data?.message || "Signup failed");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center py-12">
//       <div className="max-w-md w-full mx-4">
//         <div className="bg-white rounded-2xl shadow-xl p-8">
//           <div className="text-center mb-8">
//             <div className="flex justify-center mb-4">
//               <span className="text-3xl font-bold text-green-600">🌿 EcoCred</span>
//             </div>
//             <h2 className="text-3xl font-bold text-gray-900 mb-2">Join EcoCred</h2>
//             <p className="text-gray-600">Start your sustainable shopping journey</p>
//           </div>

//           {err && (
//             <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
//               {err}
//             </div>
//           )}

//           <form onSubmit={submit} className="space-y-4">
//             <div>
//               <input
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 placeholder="Full name"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
//                 required
//               />
//             </div>

//             <div>
//               <input
//                 name="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 placeholder="Email address"
//                 type="email"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
//                 required
//               />
//             </div>

//             <div>
//               <div className="relative">
//                 <input
//                   name="password"
//                   value={form.password}
//                   onChange={handleChange}
//                   placeholder="Password"
//                   type={showPassword ? "text" : "password"}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300 pr-12"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={togglePasswordVisibility}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
//                 >
//                   {showPassword ? (
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L9 9m4.242 4.242L15 15m-6-6l4.242-4.242M9.878 9.878l-4.242 4.242" />
//                     </svg>
//                   ) : (
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                     </svg>
//                   )}
//                 </button>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <select
//                 name="gender"
//                 value={form.gender}
//                 onChange={handleChange}
//                 className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
//               >
//                 <option value="">Gender</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//                 <option value="Other">Other</option>
//               </select>

//               <input
//                 name="dob"
//                 value={form.dob}
//                 onChange={handleChange}
//                 type="date"
//                 className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
//               />
//             </div>

//             <div>
//               <input
//                 name="nationality"
//                 value={form.nationality}
//                 onChange={handleChange}
//                 placeholder="Nationality"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
//               />
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-300 shadow-lg mt-4"
//             >
//               Create Account
//             </button>
//           </form>

//           <div className="mt-6 text-center">
//             <p className="text-gray-600">
//               Already have an account?{" "}
//               <a href="/login" className="text-green-600 font-semibold hover:text-green-700">
//                 Sign in here
//               </a>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// src/pages/Signup.jsx
import React, { useState } from "react";
import api from "../utils/api";
import { setToken } from "../utils/auth";

const STEPS = ['Account', 'Personal', 'Done'];

export default function Signup() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name:"", email:"", password:"", gender:"", dob:"", nationality:"",
  });
  const [err,     setErr]     = useState("");
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const nextStep = e => {
    e.preventDefault(); setErr("");
    if (step === 0) {
      if (!form.name || !form.email || !form.password) { setErr("Please fill all fields."); return; }
      if (form.password.length < 6) { setErr("Password must be at least 6 characters."); return; }
    }
    setStep(s => s + 1);
  };

  const submit = async e => {
    e.preventDefault(); setErr(""); setLoading(true);
    try {
      const res = await api.post("/auth/signup", form);
      setToken(res.data.token);
      setStep(2);
      setTimeout(() => { window.location.href = "/dashboard"; }, 1200);
    } catch (error) {
      setErr(error?.response?.data?.message || "Signup failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,400&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        :root{
          --forest:#1a3a2a;--moss:#2d5a3d;--lime:#b5e048;--lime-pale:#e8f5d8;
          --cream:#f5f0e8;--cream-dk:#ede8de;--stone:#8a8a7a;--stone-lt:#b0b0a0;
          --white:#fff;--red:#e05252;--red-pale:#fdf0f0;
        }
        body{font-family:'DM Sans',system-ui,sans-serif;background:var(--cream);}

        .auth-root{min-height:100vh;display:grid;grid-template-columns:1fr 1fr;}
        @media(max-width:760px){.auth-root{grid-template-columns:1fr;}}

        .auth-left{
          background:var(--forest);display:flex;flex-direction:column;
          justify-content:center;align-items:flex-start;
          padding:3rem 3.5rem;
          background-image:radial-gradient(ellipse at 80% 20%,rgba(181,224,72,.1) 0%,transparent 55%);
        }
        @media(max-width:760px){.auth-left{display:none;}}
        .auth-left__brand{
          font-family:'Fraunces',serif;font-size:1.4rem;font-weight:700;
          color:var(--lime);margin-bottom:3rem;
          display:flex;align-items:center;gap:.5rem;
        }
        .auth-left__title{
          font-family:'Fraunces',serif;
          font-size:clamp(2rem,3.5vw,2.75rem);font-weight:700;
          color:var(--white);line-height:1.15;letter-spacing:-.02em;margin-bottom:1rem;
        }
        .auth-left__title em{color:var(--lime);font-style:italic;}
        .auth-left__sub{font-size:.95rem;color:rgba(255,255,255,.55);line-height:1.65;max-width:340px;}
        .auth-left__pills{display:flex;flex-direction:column;gap:.65rem;margin-top:2.5rem;}
        .auth-pill{
          display:flex;align-items:center;gap:.65rem;
          background:rgba(181,224,72,.1);border:1px solid rgba(181,224,72,.2);
          border-radius:.75rem;padding:.7rem 1rem;
          font-size:.85rem;color:rgba(255,255,255,.8);
        }
        .auth-pill span{font-size:1.1rem;}

        .auth-right{
          display:flex;flex-direction:column;
          justify-content:center;align-items:center;
          padding:2.5rem 1.5rem;background:var(--cream);
        }
        .auth-card{
          width:100%;max-width:440px;
          background:var(--white);
          border:1.5px solid var(--cream-dk);border-radius:1.35rem;
          padding:2.25rem;
          box-shadow:0 8px 32px rgba(26,58,42,.08);
        }
        .auth-card__mobile-brand{
          display:none;font-family:'Fraunces',serif;font-size:1.1rem;
          font-weight:700;color:var(--forest);margin-bottom:1.25rem;
        }
        @media(max-width:760px){.auth-card__mobile-brand{display:flex;align-items:center;gap:.4rem;}}

        /* stepper */
        .stepper{display:flex;align-items:center;gap:0;margin-bottom:1.75rem;}
        .step-item{display:flex;align-items:center;gap:0;flex:1;}
        .step-item:last-child{flex:0;}
        .step-dot{
          width:28px;height:28px;border-radius:50%;flex-shrink:0;
          display:flex;align-items:center;justify-content:center;
          font-size:.75rem;font-weight:700;
          transition:all .25s;
        }
        .step-dot--done{background:var(--lime);color:var(--forest);}
        .step-dot--active{background:var(--forest);color:var(--lime);}
        .step-dot--idle{background:var(--cream-dk);color:var(--stone);}
        .step-line{flex:1;height:2px;background:var(--cream-dk);margin:0 .35rem;transition:background .25s;}
        .step-line--done{background:var(--lime);}
        .step-label{
          font-size:.7rem;font-weight:600;text-transform:uppercase;letter-spacing:.06em;
          color:var(--stone);margin-top:.3rem;text-align:center;
        }
        .step-col{display:flex;flex-direction:column;align-items:center;}

        .auth-card__title{
          font-family:'Fraunces',serif;font-size:1.5rem;font-weight:700;
          color:var(--forest);margin-bottom:.3rem;
        }
        .auth-card__sub{font-size:.875rem;color:var(--stone);margin-bottom:1.5rem;}

        .auth-err{
          background:var(--red-pale);border:1px solid rgba(224,82,82,.3);
          color:var(--red);border-radius:.65rem;padding:.75rem 1rem;
          font-size:.875rem;margin-bottom:1.25rem;
        }

        .field{margin-bottom:1rem;}
        .field label{
          display:block;font-size:.78rem;font-weight:600;
          text-transform:uppercase;letter-spacing:.06em;
          color:var(--stone);margin-bottom:.4rem;
        }
        .auth-input{
          width:100%;padding:.75rem 1rem;
          border:1.5px solid var(--cream-dk);border-radius:.75rem;
          font-family:'DM Sans',system-ui,sans-serif;font-size:.95rem;
          color:var(--forest);background:var(--cream);
          outline:none;transition:border-color .2s,background .2s;
          appearance:none;
        }
        .auth-input:focus{border-color:var(--moss);background:var(--white);}
        .auth-input.has-icon{padding-right:2.75rem;}
        .input-wrap{position:relative;}
        .eye-btn{
          position:absolute;right:.85rem;top:50%;transform:translateY(-50%);
          background:none;border:none;cursor:pointer;
          color:var(--stone-lt);padding:0;display:flex;align-items:center;
          transition:color .15s;
        }
        .eye-btn:hover{color:var(--forest);}

        .field-row{display:grid;grid-template-columns:1fr 1fr;gap:.75rem;}

        .btn-row{display:flex;gap:.65rem;margin-top:.5rem;}
        .auth-submit{
          flex:1;padding:.82rem;border-radius:.85rem;
          background:var(--forest);color:var(--lime);
          font-family:'DM Sans',system-ui,sans-serif;
          font-size:.92rem;font-weight:700;border:none;cursor:pointer;
          transition:background .2s,transform .15s;
          display:flex;align-items:center;justify-content:center;gap:.45rem;
        }
        .auth-submit:hover:not(:disabled){background:var(--moss);transform:translateY(-1px);}
        .auth-submit:disabled{opacity:.6;cursor:not-allowed;}
        .auth-back{
          padding:.82rem 1.25rem;border-radius:.85rem;
          background:transparent;color:var(--stone);
          border:1.5px solid var(--cream-dk);
          font-family:'DM Sans',system-ui,sans-serif;
          font-size:.92rem;font-weight:600;cursor:pointer;
          transition:all .15s;
        }
        .auth-back:hover{background:var(--cream);color:var(--forest);}

        .auth-spinner{
          width:13px;height:13px;border-radius:50%;
          border:2px solid var(--lime);border-top-color:transparent;
          animation:sp .7s linear infinite;
        }
        @keyframes sp{to{transform:rotate(360deg)}}

        .auth-footer{
          text-align:center;margin-top:1.25rem;
          font-size:.875rem;color:var(--stone);
        }
        .auth-footer a{color:var(--moss);font-weight:600;text-decoration:none;}
        .auth-footer a:hover{text-decoration:underline;}

        /* success */
        .auth-success{
          text-align:center;padding:1rem 0;
          animation:fadeIn .4s ease;
        }
        @keyframes fadeIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:none}}
        .auth-success__icon{font-size:3.5rem;margin-bottom:1rem;}
        .auth-success__title{
          font-family:'Fraunces',serif;font-size:1.5rem;font-weight:700;
          color:var(--forest);margin-bottom:.5rem;
        }
        .auth-success__sub{font-size:.9rem;color:var(--stone);}
      `}</style>

      {/* Left */}
      <div className="auth-left">
        <div className="auth-left__brand"><span>🌿</span> EcoCred</div>
        <h1 className="auth-left__title">Start your<br/><em>green journey</em><br/>today.</h1>
        <p className="auth-left__sub">
          Join thousands of conscious shoppers who use EcoCred to make
          every purchase count for the planet.
        </p>
        <div className="auth-left__pills">
          {[
            ['🌱','EcoScore every product instantly'],
            ['🔄','Find greener alternatives in seconds'],
            ['🏆','Earn & redeem EcoCred rewards'],
          ].map(([icon, text]) => (
            <div key={text} className="auth-pill"><span>{icon}</span>{text}</div>
          ))}
        </div>
      </div>

      {/* Right */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card__mobile-brand"><span>🌿</span> EcoCred</div>

          {/* Stepper */}
          <div className="stepper">
            {STEPS.map((label, i) => (
              <div key={label} className="step-item">
                <div className="step-col">
                  <div className={`step-dot ${i < step ? 'step-dot--done' : i === step ? 'step-dot--active' : 'step-dot--idle'}`}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span className="step-label">{label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`step-line ${i < step ? 'step-line--done' : ''}`} />
                )}
              </div>
            ))}
          </div>

          {step === 2 ? (
            <div className="auth-success">
              <div className="auth-success__icon">🎉</div>
              <h2 className="auth-success__title">You're all set!</h2>
              <p className="auth-success__sub">Redirecting to your dashboard…</p>
            </div>
          ) : (
            <>
              <h2 className="auth-card__title">
                {step === 0 ? 'Create account' : 'Tell us about you'}
              </h2>
              <p className="auth-card__sub">
                {step === 0 ? 'Step 1 of 2 — account details' : 'Step 2 of 2 — optional but helpful'}
              </p>

              {err && <div className="auth-err">⚠ {err}</div>}

              {step === 0 && (
                <form onSubmit={nextStep}>
                  <div className="field">
                    <label>Full name</label>
                    <input className="auth-input" name="name" value={form.name}
                      onChange={handleChange} placeholder="Priya Sharma" required />
                  </div>
                  <div className="field">
                    <label>Email address</label>
                    <input className="auth-input" name="email" type="email" value={form.email}
                      onChange={handleChange} placeholder="priya@example.com" required />
                  </div>
                  <div className="field">
                    <label>Password</label>
                    <div className="input-wrap">
                      <input className="auth-input has-icon" name="password"
                        type={showPw ? "text" : "password"} value={form.password}
                        onChange={handleChange} placeholder="Min 6 characters" required />
                      <button type="button" className="eye-btn" onClick={() => setShowPw(p => !p)}>
                        {showPw
                          ? <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                          : <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        }
                      </button>
                    </div>
                  </div>
                  <button type="submit" className="auth-submit">Continue →</button>
                </form>
              )}

              {step === 1 && (
                <form onSubmit={submit}>
                  <div className="field-row">
                    <div className="field">
                      <label>Gender</label>
                      <select className="auth-input" name="gender" value={form.gender} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="field">
                      <label>Date of birth</label>
                      <input className="auth-input" name="dob" type="date"
                        value={form.dob} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="field">
                    <label>Nationality</label>
                    <input className="auth-input" name="nationality" value={form.nationality}
                      onChange={handleChange} placeholder="e.g. Indian" />
                  </div>
                  <div className="btn-row">
                    <button type="button" className="auth-back" onClick={() => setStep(0)}>← Back</button>
                    <button type="submit" className="auth-submit" disabled={loading}>
                      {loading ? <><span className="auth-spinner"/> Creating…</> : 'Create Account 🌿'}
                    </button>
                  </div>
                </form>
              )}

              <p className="auth-footer">
                Already have an account? <a href="/login">Sign in</a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}