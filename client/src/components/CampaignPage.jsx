import { useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const INSTAGRAM_URL = import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com/yourhandle';

export default function CampaignPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const ref = searchParams.get('ref') || 'direct';
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [leadId, setLeadId] = useState(null);
  const [form, setForm] = useState({ name: '', mobile: '', answer: '' });

  const campaignTitle = useMemo(() => slug?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()), [slug]);

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const validateStepOne = () => {
    if (!form.name.trim()) return 'Name is required';
    if (!form.mobile.trim()) return 'Mobile number is required';
    if (!/^[0-9]{10,15}$/.test(form.mobile.trim())) return 'Enter a valid mobile number';
    return '';
  };

  const validateStepTwo = () => {
    if (!form.answer.trim()) return 'Please answer the question';
    return '';
  };

  const questionOptions = [
    "Unique 360° Business & Media Ecosystem",
    "One-Stop Solution for Travel & Tech",
    "First-of-its-kind Podcast + Solutions hub",
    "Unmatched Inauguration Day Rewards"
  ];

  const handleStepOne = (e) => {
    e.preventDefault();
    const msg = validateStepOne();
    if (msg) return setError(msg);
    setError('');
    setStep(2);
  };

  const selectOption = (opt) => {
    updateField('answer', opt);
    setError('');
  };

  const handleInstagramClick = async () => {
    if (!leadId) return;
    try {
      await fetch(`${API_URL}/leads/${leadId}/instagram`, { method: 'PATCH' });
    } catch (err) {
      console.error('Failed to log insta click:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const msg = validateStepTwo();
    if (msg) return setError(msg);
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          mobile: form.mobile.trim(),
          answer: form.answer.trim(),
          campaignSlug: slug,
          ref,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Submission failed');
      
      setLeadId(data.id);
      setStep(3);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <section className="campaign-card">
        <div className="eyebrow">A New Venture Is Starting</div>
        <h1>{campaignTitle || 'Business Solutions'}</h1>
        <p className="intro">Join us for the inauguration! Share your thoughts and follow us for an exclusive gift.</p>

        <div className="progress-row" aria-label="Form progress">
          <span className={step >= 1 ? 'dot active' : 'dot'} />
          <span className={step >= 2 ? 'dot active' : 'dot'} />
          <span className={step >= 3 ? 'dot active' : 'dot'} />
        </div>

        {step === 1 && (
          <form onSubmit={handleStepOne} className="form-stack">
            <label>
              <span>Full Name</span>
              <input
                type="text"
                placeholder="Enter your name"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
              />
            </label>

            <label>
              <span>Mobile Number</span>
              <input
                type="tel"
                inputMode="numeric"
                placeholder="Enter your mobile number"
                value={form.mobile}
                onChange={(e) => updateField('mobile', e.target.value.replace(/\D/g, ''))}
              />
            </label>

            {error ? <p className="error-text">{error}</p> : null}

            <button type="submit" className="primary-btn">Next: Your Thoughts</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="form-stack">
            <div className="question-prompt">
              <span>What do you think makes our venture different from others?</span>
            </div>
            
            <div className="choice-grid">
              {questionOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`choice-card ${form.answer === opt ? 'selected' : ''}`}
                  onClick={() => selectOption(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>

            <div className="button-row">
              <button type="button" className="secondary-btn" onClick={() => setStep(1)}>Back</button>
              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? 'Confirming...' : 'Final Step'}
              </button>
            </div>

            {error ? <p className="error-text">{error}</p> : null}
          </form>
        )}

        {step === 3 && (
          <div className="success-box animate-in">
            <div className="success-badge">Reserved for Gift</div>
            <h2>See you at Inaugration, {form.name.split(' ')[0]}!</h2>
            <p>To be eligible for your exclusive gift, you <strong>must</strong> be following our Instagram profile.</p>
            <a 
              className="primary-btn link-btn instagram-btn" 
              href={INSTAGRAM_URL} 
              target="_blank" 
              rel="noreferrer noopener"
              onClick={handleInstagramClick}
            >
              Follow us on Instagram
            </a>
            <p className="note">Bring this confirmation to the inauguration day!</p>
          </div>
        )}

        <p className="meta-text">Source: {ref}</p>
      </section>
    </main>
  );
}
