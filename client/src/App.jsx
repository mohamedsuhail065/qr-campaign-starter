import { Routes, Route, Navigate } from 'react-router-dom';
import CampaignPage from './components/CampaignPage.jsx';
import QrAdminPage from './components/QrAdminPage.jsx';
import LeadsAdminPage from './components/LeadsAdminPage.jsx';
import AdminLoginPage from './components/AdminLoginPage.jsx';
import AuthGuard from './components/AuthGuard.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/campaign/${import.meta.env.VITE_CAMPAIGN_SLUG || 'summer-offer'}`} replace />} />
      <Route path="/campaign/:slug" element={<CampaignPage />} />
      
      {/* Public Admin Routes */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected Admin Routes */}
      <Route element={<AuthGuard />}>
        <Route path="/admin/qr" element={<QrAdminPage />} />
        <Route path="/admin/leads" element={<LeadsAdminPage />} />
      </Route>
    </Routes>
  );
}
