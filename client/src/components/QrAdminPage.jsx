import QRCode from 'react-qr-code';
import { useMemo, useState } from 'react';

export default function QrAdminPage() {
  const [slug, setSlug] = useState('summer-offer');
  const [ref, setRef] = useState('poster-a');
  const origin = window.location.origin;

  const url = useMemo(() => `${origin}/campaign/${slug}?ref=${encodeURIComponent(ref)}`, [origin, slug, ref]);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  const downloadQRCode = () => {
    const svg = document.getElementById('qr-code-svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = "#0a0a0b"; // Match theme bg
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `qr-${slug}-${ref}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const handleShare = async () => {
    const svg = document.getElementById('qr-code-svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = async () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = "#0a0a0b";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob(async (blob) => {
        const file = new File([blob], 'qr-code.png', { type: 'image/png' });
        
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'Campaign QR',
              text: 'Scan to join our campaign!',
            });
          } catch (err) {
            console.log('Share failed:', err);
          }
        } else {
          // Fallback to sharing URL or downloading
          downloadQRCode();
        }
      });
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <main className="page-shell">
      <section className="campaign-card animate-in">
        <div className="eyebrow">Admin Hub</div>
        <h1>Campaign QR</h1>
        <p className="intro">Generate, download, and share high-quality QR codes.</p>
        <a href="/admin/leads" style={{ color: 'var(--primary)', fontSize: '14px', textDecoration: 'none', display: 'inline-block', marginBottom: '20px' }}>
          View Participated Users →
        </a>

        <div className="form-stack">
          <label>
            <span>Campaign Slug</span>
            <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. summer-launch" />
          </label>
          <label>
            <span>Reference Tag</span>
            <input value={ref} onChange={(e) => setRef(e.target.value)} placeholder="e.g. poster-a" />
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', margin: '32px 0' }}>
          <div className="qr-box">
            <QRCode 
              id="qr-code-svg"
              value={url} 
              size={200} 
              bgColor="transparent"
              fgColor="#ffffff"
            />
          </div>
        </div>

        <div style={{ display: 'grid', gap: '12px' }}>
          <div className="button-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <button onClick={handleCopy} className="secondary-btn">
              Copy Link
            </button>
            <button onClick={downloadQRCode} className="secondary-btn">
              Download PNG
            </button>
          </div>
          <button onClick={handleShare} className="primary-btn">
            Share QR Image
          </button>
        </div>

        <p className="url-preview" style={{ fontSize: '12px', marginTop: '24px', opacity: 0.5 }}>{url}</p>
      </section>
    </main>
  );
}
