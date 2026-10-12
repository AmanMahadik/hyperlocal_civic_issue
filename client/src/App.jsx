import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ReportIssue from './pages/ReportIssue';
import TrackComplaint from './pages/TrackComplaint';
import PublicDashboard from './pages/PublicDashboard';
import About from './pages/About';
import IssueDetail from './pages/IssueDetail';
import MyReports from './pages/MyReports';
import VerificationQueue from './pages/admin/VerificationQueue';
import AdminDashboard from './pages/admin/AdminDashboard';

export default function App() {
  return (
    <AccessibilityProvider>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-[#F4F6F9] text-[#202936] flex flex-col font-sans">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/report" element={<ReportIssue />} />
                  <Route path="/track" element={<TrackComplaint />} />
                  <Route path="/dashboard" element={<PublicDashboard />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/issues/:id" element={<IssueDetail />} />
                  <Route path="/my-reports" element={<MyReports />} />
                  <Route path="/admin/queue" element={<VerificationQueue />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </AccessibilityProvider>
  );
}
