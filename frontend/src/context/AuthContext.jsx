import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_USERS } from '../data/mockData';
import { getThemeForRole } from '../utils/theme';

const AuthContext = createContext(null);

const STORAGE_KEY = 'swastik_auth_user';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const exists = DEMO_USERS.find((u) => u.id === parsed.id);
        if (exists) return exists;
      }
    } catch {
      // fallback
    }
    // Default to Super Admin Vikramaditya Singhania
    return DEMO_USERS[0];
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!currentUser);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      setIsAuthenticated(false);
    }
  }, [currentUser]);

  // Login handler
  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const cleanEmail = email.trim().toLowerCase();
        const user = DEMO_USERS.find((u) => u.email.toLowerCase() === cleanEmail);

        if (user) {
          // In demo mode, accept any non-empty password
          if (password && password.length >= 3) {
            setCurrentUser(user);
            resolve(user);
          } else {
            reject(new Error('Password must be at least 3 characters.'));
          }
        } else {
          reject(new Error('Invalid email or user account not found. Try one of the demo accounts.'));
        }
      }, 400);
    });
  };

  // Quick switch demo role
  const switchDemoRole = (roleKey) => {
    const target = DEMO_USERS.find((u) => u.role === roleKey);
    if (target) {
      setCurrentUser(target);
    }
  };

  // Switch to specific user ID
  const switchUser = (userId) => {
    const target = DEMO_USERS.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
    }
  };

  // Logout handler
  const logout = () => {
    setCurrentUser(null);
  };

  // Role booleans
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const isCompanyAdmin = currentUser?.role === 'company_admin';
  const isEmployee = currentUser?.role === 'employee';
  const isSalesperson = currentUser?.role === 'salesperson';

  // Check if current user has access to a specific company's records
  const canAccessCompany = (targetCompanyId) => {
    if (!currentUser) return false;
    if (currentUser.role === 'super_admin') return true;
    return currentUser.companyId === targetCompanyId;
  };

  // Theme object for currently active role
  const theme = getThemeForRole(currentUser?.role || 'super_admin');

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        theme,
        login,
        logout,
        switchDemoRole,
        switchUser,
        isSuperAdmin,
        isCompanyAdmin,
        isEmployee,
        isSalesperson,
        canAccessCompany,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
