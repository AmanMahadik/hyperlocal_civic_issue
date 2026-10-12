import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ReportIssue from './pages/ReportIssue';
import IssueDetail from './pages/IssueDetail';
import MyReports from './pages/MyReports';
import VerificationQueue from './pages/admin/VerificationQueue';
import AdminDashboard from './pages/admin/AdminDashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/report" element={<ReportIssue />} />
              <Route path="/issues/:id" element={<IssueDetail />} />
              <Route path="/my-reports" element={<MyReports />} />
              <Route path="/admin/queue" element={<VerificationQueue />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
          </main>
          <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4">
              © {new Date().getFullYear()} Hyperlocal Civic Issue Reporter • Pimpri-Chinchwad Municipal Corporation (PCMC)
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
