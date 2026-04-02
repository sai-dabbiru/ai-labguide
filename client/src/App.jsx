import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext.jsx';
import Sidebar from './components/Sidebar.jsx';
import Toast from './components/Toast.jsx';
import LoginPage from './pages/LoginPage.jsx';
import HomePage from './pages/HomePage.jsx';
import LabView from './pages/LabView.jsx';
import { FeaturesPage, CommandsPage, ScoreboardPage } from './pages/ReferencePage.jsx';
import './styles/index.css';

function AppShell() {
  const { user } = useApp();

  if (!user) return <LoginPage />;

  return (
    <div className="shell">
      <Sidebar />
      <div className="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lab/:id" element={<LabView />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/commands" element={<CommandsPage />} />
          <Route path="/scoreboard" element={<ScoreboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AppProvider>
  );
}
