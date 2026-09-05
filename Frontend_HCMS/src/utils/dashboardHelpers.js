/*
 * File Path: src/utils/dashboardHelpers.js
 * Utility: Dashboard Date & Object Formatting Helpers
 * Easy Explanation: Pure helper functions for date calculation, feature parsing, and default profile construction.
 */
import { defaultDietPlan, defaultWorkoutPlan } from '../models/clubData.js';

// Helper: Returns current date as string "YYYY-MM-DD"
export const today = () => new Date().toISOString().slice(0, 10);

// Helper: Calculates remaining days until renewal date
export const dateDiffDays = (futureDate) => {
  if (!futureDate) return 0;
  return Math.max(0, Math.ceil((new Date(futureDate) - new Date()) / 86400000));
};

// Helper: Constructs default member profile object
export const buildDefaultMemberProfile = (memberData) => ({
  id: memberData?.id || 1,
  name: memberData?.name || 'Club Member',
  email: memberData?.email || '',
  phone: memberData?.phone || '',
  plan: memberData?.plan || 'None',
  trainer: memberData?.trainer || 'Not Assigned',
  nextRenewal: memberData?.renewal || null,
  status: memberData?.status || 'Pending',
  mobile: memberData?.phone || '',
  workoutPlan: memberData?.workoutPlan || defaultWorkoutPlan,
  dietPlan: memberData?.dietPlan || defaultDietPlan,
  purchase: null
});

// Helper: Splits feature list inputs
export const splitFeatures = (value) => {
  if (Array.isArray(value)) return value;
  return String(value || '').split(',').map((item) => item.trim()).filter(Boolean);
};
