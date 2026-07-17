import React, { createContext, useState, useEffect, useCallback } from 'react';
import {
  login as apiLogin,
  getCurrentSession,
  logout as apiLogout,
} from '../services/authService';
import { getAccessToken } from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [currentClinic, setCurrentClinic] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  const applySession = (sessionData) => {
    console.log('📝 Applying session:', sessionData);
    
    // Handle different response formats
    const userData = sessionData?.user || sessionData;
    const role = userData?.user_type || userData?.role || null;
    const clinic = sessionData?.clinic || 
                   (userData?.clinic_id ? { id: userData.clinic_id } : null);

    setIsAuthenticated(true);
    setUser(userData);
    setUserType(role);
    setCurrentClinic(clinic);

    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userType', role || '');
    if (clinic) {
      localStorage.setItem('currentClinic', JSON.stringify(clinic));
    } else {
      localStorage.removeItem('currentClinic');
    }
  };

  const clearSession = () => {
    apiLogout();
    setIsAuthenticated(false);
    setUser(null);
    setCurrentClinic(null);
    setUserType(null);
  };

  const refreshSession = useCallback(async () => {
    try {
      const session = await getCurrentSession();
      applySession(session);
      return session;
    } catch (error) {
      console.error('Refresh session error:', error);
      clearSession();
      throw error;
    }
  }, []);

  useEffect(() => {
    const restoreSession = async () => {
      const token = getAccessToken();
      const cachedUser = localStorage.getItem('user');

      console.log('🔄 Restoring session...');
      console.log('📌 Token exists:', !!token);
      console.log('📌 Cached user exists:', !!cachedUser);

      if (!token || !cachedUser) {
        setLoading(false);
        return;
      }

      try {
        const session = await getCurrentSession();
        applySession(session);
        console.log('✅ Session restored successfully');
      } catch (error) {
        console.error('❌ Session restore error:', error);
        clearSession();
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email, password) => {
    try {
      console.log('🔐 AuthContext: Login attempt');
      const data = await apiLogin(email, password);
      
      console.log('✅ Login response data:', data);
      
      // Apply session with the response data
      applySession(data);
      
      const userData = data?.user || data;
      const userType = userData?.user_type || userData?.role || null;
      
      console.log('👤 User logged in:', userData);
      
      return { 
        userType: userType, 
        clinic: data?.clinic || null 
      };
    } catch (error) {
      console.error('❌ AuthContext login error:', error);
      throw error;
    }
  };

  const logout = () => {
    clearSession();
  };

  const isSuperAdmin = () => userType === 'super_admin';
  const isClinicAdmin = () => userType === 'clinic_admin';

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        currentClinic,
        userType,
        loading,
        login,
        logout,
        refreshSession,
        isSuperAdmin,
        isClinicAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
