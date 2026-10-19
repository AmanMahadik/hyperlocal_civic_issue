import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('pcmc_token') || null);
  const [loading, setLoading] = useState(true);

  const { isLoaded: clerkLoaded, isSignedIn, user: clerkUser } = useUser();
  const { signOut } = useClerk();

  // Synchronize Clerk user with backend DB & obtain API JWT token
  useEffect(() => {
    const syncClerkUser = async () => {
      if (!clerkLoaded) return;

      if (isSignedIn && clerkUser) {
        try {
          const email = clerkUser.primaryEmailAddress?.emailAddress;
          const name = clerkUser.fullName || clerkUser.firstName || email?.split('@')[0];
          const phone = clerkUser.primaryPhoneNumber?.phoneNumber || '';

          const res = await api.post('/auth/clerk-sync', {
            clerkId: clerkUser.id,
            email,
            name,
            phone,
            role: clerkUser.publicMetadata?.role || (email?.endsWith('@pcmc.gov.in') ? 'admin' : 'citizen')
          });

          if (res.data.success) {
            const { user: userData, token: jwtToken } = res.data.data;
            localStorage.setItem('pcmc_token', jwtToken);
            setToken(jwtToken);
            setUser(userData);
          }
        } catch (err) {
          console.error('Failed to sync Clerk user with backend:', err);
        } finally {
          setLoading(false);
        }
      } else {
        // When signed out of Clerk, clear token & local state
        localStorage.removeItem('pcmc_token');
        setToken(null);
        setUser(null);
        setLoading(false);
      }
    };

    syncClerkUser();
  }, [clerkLoaded, isSignedIn, clerkUser]);

  const logout = async () => {
    localStorage.removeItem('pcmc_token');
    setToken(null);
    setUser(null);
    try {
      await signOut();
    } catch (e) {
      console.error(e);
    }
  };

  const isAdmin = user && (user.role === 'admin' || user.role === 'superadmin');

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading: loading || !clerkLoaded,
        isAdmin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
