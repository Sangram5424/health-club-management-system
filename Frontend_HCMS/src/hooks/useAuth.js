/*
 * File Path: src/hooks/useAuth.js
 * Hook: Custom Auth Management Hook
 * Easy Explanation: Manages user authentication state, register/signup, JWT login, and password reset actions.
 */
import { authApi } from '../services/api.js';

export function useAuth() {
  /**
   * Method: signup
   * API Request: POST /api/auth/register
   */
  const signup = async (data, refetch) => {
    try {
      const response = await authApi.register({
        fullName: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: data.role ? data.role.toUpperCase() : 'MEMBER',
        healthGoal: data.goal || data.healthGoal,
        specialty: data.specialty,
        experience: data.experience,
        certifications: data.certifications,
        address: data.address,
        emergencyContact: data.emergencyContact,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth
      });
      if (refetch) await refetch();
      return { ok: true, message: 'Signup successful. Please login.', response };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Signup failed.';
      return { ok: false, message: msg };
    }
  };

  /**
   * Method: login
   * API Request: POST /api/auth/login
   */
  const login = async ({ role: loginRole, email, password }, refetch) => {
    try {
      const response = await authApi.login({ email, password, role: loginRole.toUpperCase() });
      if (response && response.token) {
        localStorage.setItem('hcms_token', response.token);
        localStorage.setItem('hcms_user', JSON.stringify(response));
        if (refetch) await refetch();
        return { ok: true, token: response.token, user: response };
      }
      return { ok: false, message: 'Invalid credentials.' };
    } catch (err) {
      console.error('Login error:', err);
      return { ok: false, message: err.response?.data?.message || 'Login failed. Invalid credentials.' };
    }
  };

  /**
   * Method: emailExists
   */
  const emailExists = ({ role: resetRole, email }, memberList = [], trainerList = []) => {
    if (resetRole === 'member') return memberList.some((m) => m.email?.toLowerCase() === email.toLowerCase());
    if (resetRole === 'trainer') return trainerList.some((t) => t.email?.toLowerCase() === email.toLowerCase());
    return true;
  };

  /**
   * Method: resetPassword
   * API Request: POST /api/auth/reset-password
   */
  const resetPassword = async ({ role: resetRole, email, password }) => {
    try {
      await authApi.resetPassword({ role: resetRole.toUpperCase(), email, password });
      return true;
    } catch {
      return false;
    }
  };

  return {
    signup,
    login,
    emailExists,
    resetPassword
  };
}
