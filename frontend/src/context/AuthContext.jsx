import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authApi from '../api/auth.api.js';
import organizationApi from '../api/organization.api.js';

const AuthContext = createContext(null);

const STORAGE_ACTIVE_ORG_KEY = 'threadline_active_org_id';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [activeOrg, setActiveOrg] = useState(null);
  const [activeRole, setActiveRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const resolveActiveOrg = useCallback((orgList) => {
    if (!orgList || orgList.length === 0) {
      setActiveOrg(null);
      setActiveRole(null);
      localStorage.removeItem(STORAGE_ACTIVE_ORG_KEY);
      return;
    }

    const savedOrgId = localStorage.getItem(STORAGE_ACTIVE_ORG_KEY);
    const matched = orgList.find((item) => item.organization._id === savedOrgId);

    if (matched) {
      setActiveOrg(matched.organization);
      setActiveRole(matched.role);
    } else {
      setActiveOrg(orgList[0].organization);
      setActiveRole(orgList[0].role);
      localStorage.setItem(STORAGE_ACTIVE_ORG_KEY, orgList[0].organization._id);
    }
  }, []);

  const refreshAuth = useCallback(async () => {
    try {
      const res = await authApi.getMe();
      if (res.success && res.data) {
        setUser(res.data.user);
        setOrganizations(res.data.organizations || []);
        resolveActiveOrg(res.data.organizations || []);
      } else {
        setUser(null);
        setOrganizations([]);
        setActiveOrg(null);
        setActiveRole(null);
      }
    } catch {
      setUser(null);
      setOrganizations([]);
      setActiveOrg(null);
      setActiveRole(null);
    } finally {
      setLoading(false);
    }
  }, [resolveActiveOrg]);

  useEffect(() => {
    refreshAuth();

    const handleUnauthorized = () => {
      setUser(null);
      setOrganizations([]);
      setActiveOrg(null);
      setActiveRole(null);
      localStorage.removeItem(STORAGE_ACTIVE_ORG_KEY);
    };

    window.addEventListener('threadline:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('threadline:unauthorized', handleUnauthorized);
    };
  }, [refreshAuth]);

  const switchOrg = useCallback((orgId) => {
    const target = organizations.find((item) => item.organization._id === orgId);
    if (target) {
      setActiveOrg(target.organization);
      setActiveRole(target.role);
      localStorage.setItem(STORAGE_ACTIVE_ORG_KEY, target.organization._id);
    }
  }, [organizations]);

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    if (res.success) {
      await refreshAuth();
    }
    return res;
  };

  const register = async (data) => {
    const res = await authApi.register(data);
    if (res.success) {
      await refreshAuth();
    }
    return res;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      setOrganizations([]);
      setActiveOrg(null);
      setActiveRole(null);
      localStorage.removeItem(STORAGE_ACTIVE_ORG_KEY);
    }
  };

  const createOrganization = async (data) => {
    const res = await organizationApi.create(data);
    if (res.success && res.data?.organization) {
      localStorage.setItem(STORAGE_ACTIVE_ORG_KEY, res.data.organization._id);
      await refreshAuth();
    }
    return res;
  };

  const value = {
    user,
    organizations,
    activeOrg,
    activeRole,
    loading,
    login,
    register,
    logout,
    switchOrg,
    createOrganization,
    refreshAuth,
    isAuthenticated: Boolean(user),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
