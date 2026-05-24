import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';

export default function AddSecondhand() {
  const navigate = useNavigate();

  const [name,        setName]        = useState('');
  const [description, setDescription] = useState('');
  const [expiryDate,  setExpiryDate]  = useState('');
  const [file,        setFile]        = useState(null);
  const [preview,     setPreview]     = useState('');
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');

  const fileHandler = (e) => {
    const picked = e.target.files[0];
    if (!picked) return;
    const reader = new FileReader();
    reader.readAsDataURL(picked);
    reader.onloadend = () => {
      setPreview(reader.result);
      setFile(picked);
    };
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!name || !expiryDate) return setError('Name and expiry date are required.');
    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name',        name);
      formData.append('description', description);
      formData.append('expiryDate',  expiryDate);
      if (file) formData.append('image', file);

      await api.post('/secondhand/add-product', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/secondhand');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to list product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="as-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,400&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        :root{
          --forest:#1a3a2a;--moss:#2d5a3d;
          --lime:#b5e048;--lime-pale:#e8f5d8;--cream:#f5f0e8;
          --cream-dk:#ede8de;--stone:#8a8a7a;--white:#fff;
          --red:#e05252;--red-pale:#fdf0f0;
          --font-display:'Fraunces',serif;
          --font-body:'DM Sans',system-ui,sans-serif;
          --shadow:0 2px 12px rgba(26,58,42,.08);
        }
        body{font-family:var(--font-body);background:var(--cream);}
        .as-page{min-height:100vh;background:var(--cream);}

        .as-shell{
          max-width:560px;margin:0 auto;padding:2rem 1.25rem 5rem;
        }

        /* back link */
        .as-back{
          display:inline-flex;align-items:center;gap:.4rem;
          font-size:.85rem;font-weight:600;color:var(--moss);
          text-decoration:none;margin-bottom:1.25rem;
          transition:color .2s;
        }
        .as-back:hover{color:var(--forest);}

        /* card */
        .as-card{
          background:var(--white);border:1.5px solid var(--cream-dk);
          border-radius:1.25rem;padding:2rem;
          box-shadow:var(--shadow);
        }
        .as-title{
          font-family:var(--font-display);font-size:1.5rem;
          font-weight:700;color:var(--forest);margin-bottom:1.5rem;
        }

        /* error */
        .as-error{
          background:var(--red-pale);color:var(--red);
          border-radius:.75rem;padding:.75rem 1rem;
          margin-bottom:1rem;font-size:.875rem;
        }

        /* form */
        .as-form{display:flex;flex-direction:column;gap:1.1rem;}
        .as-field label{
          display:block;font-size:.83rem;font-weight:600;
          color:var(--forest);margin-bottom:.35rem;
        }
        .as-input,.as-textarea{
          width:100%;padding:.65rem .9rem;
          border:1.5px solid var(--cream-dk);border-radius:.75rem;
          font-size:.875rem;font-family:var(--font-body);
          background:#fafaf8;outline:none;
          transition:border-color .2s;
        }
        .as-input:focus,.as-textarea:focus{border-color:var(--moss);}
        .as-textarea{resize:vertical;}

        /* file upload zone */
        .as-upload-zone{
          border:2px dashed var(--cream-dk);border-radius:.75rem;
          padding:1.5rem;text-align:center;cursor:pointer;
          transition:border-color .2s,background .2s;
          position:relative;background:#fafaf8;
        }
        .as-upload-zone:hover{border-color:var(--moss);background:var(--lime-pale);}
        .as-upload-zone input{
          position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%;
        }
        .as-upload-icon{font-size:2rem;margin-bottom:.4rem;}
        .as-upload-text{font-size:.83rem;color:var(--stone);font-weight:500;}
        .as-upload-hint{font-size:.75rem;color:var(--stone);margin-top:.2rem;opacity:.7;}

        /* preview */
        .as-preview{
          border-radius:.75rem;overflow:hidden;
          border:1.5px solid var(--cream-dk);position:relative;
        }
        .as-preview img{width:100%;max-height:240px;object-fit:cover;display:block;}
        .as-preview-remove{
          position:absolute;top:.5rem;right:.5rem;
          background:rgba(0,0,0,.55);color:#fff;border:none;
          border-radius:9999px;width:26px;height:26px;
          font-size:.8rem;cursor:pointer;display:flex;
          align-items:center;justify-content:center;
        }

        /* submit */
        .as-submit{
          padding:.75rem;border-radius:9999px;border:none;
          background:var(--forest);color:var(--lime);
          font-family:var(--font-body);font-size:.95rem;font-weight:700;
          cursor:pointer;transition:background .2s;
          display:flex;align-items:center;justify-content:center;gap:.5rem;
        }
        .as-submit:hover:not(:disabled){background:var(--moss);}
        .as-submit:disabled{opacity:.6;cursor:not-allowed;}

        /* spinner dots (reuse same pattern as SecondhandGoods) */
        .ldot{
          width:7px;height:7px;border-radius:50%;
          background:var(--lime);opacity:.6;
          animation:ldot 1.2s ease infinite;
        }
        .ldot:nth-child(2){animation-delay:.15s}
        .ldot:nth-child(3){animation-delay:.3s}
        @keyframes ldot{
          40%{opacity:1;transform:translateY(-4px)}
          0%,80%,100%{opacity:.6;transform:none}
        }

        /* tip strip */
        .as-tips{
          display:flex;flex-direction:column;gap:.6rem;
          margin-top:1.25rem;padding:1rem 1.25rem;
          background:var(--lime-pale);border-radius:1rem;
          border:1.5px solid #d4edae;
        }
        .as-tip{font-size:.78rem;color:var(--moss);display:flex;gap:.5rem;}
        .as-tip b{color:var(--forest);}
      `}</style>

      <Navbar />

      <div className="as-shell">
        <Link to="/secondhand" className="as-back">← Back to Marketplace</Link>

        <div className="as-card">
          <h2 className="as-title">📦 List a Product</h2>

          {error && <div className="as-error">{error}</div>}

          <form className="as-form" onSubmit={submitHandler}>

            {/* Name */}
            <div className="as-field">
              <label>Product Name *</label>
              <input
                className="as-input"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Barely used water bottle"
                required
              />
            </div>

            {/* Description */}
            <div className="as-field">
              <label>Description</label>
              <textarea
                className="as-textarea"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Condition, usage, why you're selling..."
                rows={3}
              />
            </div>

            {/* Expiry Date */}
            <div className="as-field">
              <label>Listing Expiry Date *</label>
              <input
                className="as-input"
                type="date"
                value={expiryDate}
                onChange={e => setExpiryDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {/* Image Upload */}
            <div className="as-field">
              <label>Product Image</label>
              {preview ? (
                <div className="as-preview">
                  <img src={preview} alt="Preview" />
                  <button
                    type="button"
                    className="as-preview-remove"
                    onClick={() => { setPreview(''); setFile(null); }}
                  >✕</button>
                </div>
              ) : (
                <div className="as-upload-zone">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={fileHandler}
                  />
                  <div className="as-upload-icon">🖼️</div>
                  <p className="as-upload-text">Click or drag an image here</p>
                  <p className="as-upload-hint">JPG, PNG, WEBP — max 5 MB</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="as-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="ldot"/><div className="ldot"/><div className="ldot"/>
                </>
              ) : '✅ List Product'}
            </button>
          </form>

          {/* Tips */}
          <div className="as-tips">
            <div className="as-tip">🌿 <span><b>Earn 10 EcoCreds</b> automatically when your item sells.</span></div>
            <div className="as-tip">⏱ <span>Listing <b>auto-expires</b> on the date you set.</span></div>
            <div className="as-tip">📷 <span>Clear images get <b>more buyers</b> — good lighting helps!</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}