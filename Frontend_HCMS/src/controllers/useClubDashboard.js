/*
 * File: src/controllers/useClubDashboard.js
 * Type: Main Controller Hook
 *
 * Purpose:
 * This hook is the main controller of the Health Club Management System.
 * It combines all smaller hooks (Auth, Members, Trainers, Plans,
 * Payments, Trainer Requests, and Profile) into one place.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { roleNavigation } from '../models/clubData.js';
import { membersApi, paymentsApi, plansApi, trainerRequestsApi, trainersApi } from '../services/api.js';
import { useAuth } from '../hooks/useAuth.js';
import { useMembers } from '../hooks/useMembers.js';
import { useTrainers } from '../hooks/useTrainers.js';
import { usePlans } from '../hooks/usePlans.js';
import { usePayments } from '../hooks/usePayments.js';
import { useTrainerRequests } from '../hooks/useTrainerRequests.js';
import { useProfile } from '../hooks/useProfile.js';
import { buildDefaultMemberProfile, dateDiffDays } from '../utils/dashboardHelpers.js';

export function useClubDashboard(role, userEmail) {
  // Domain Hooks Composition
  const auth = useAuth();
  const members = useMembers();
  const trainers = useTrainers();
  const plans = usePlans();
  const payments = usePayments();
  const requests = useTrainerRequests();
  const profile = useProfile();

  // Loading & Error States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Method: fetchAllData
   * Easy Explanation: Coordinates parallel GET calls across microservice domain REST APIs.
   * Only fetches protected endpoints if a valid JWT token exists in memory.
   */
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('hcms_token');
    const hasToken = Boolean(token);

    try {
      const [membersData, trainersData, plansData, requestsData, paymentsData] = await Promise.all([
        hasToken ? membersApi.getAll().catch(() => []) : Promise.resolve([]),
        trainersApi.getAll().catch(() => []),
        plansApi.getAll().catch(() => []),
        hasToken ? trainerRequestsApi.getAll().catch(() => []) : Promise.resolve([]),
        hasToken && role === 'admin' ? paymentsApi.getAdminPayments().catch(() => []) : Promise.resolve([])
      ]);

      const safeMembers = Array.isArray(membersData) ? membersData : [];
      const safeTrainers = Array.isArray(trainersData) ? trainersData : [];
      const safePlans = Array.isArray(plansData) ? plansData : [];
      const safeRequests = Array.isArray(requestsData) ? requestsData : [];
      const safePayments = Array.isArray(paymentsData) ? paymentsData : [];

      members.setMemberList(safeMembers);
      trainers.setTrainerList(safeTrainers);
      plans.setPlanList(safePlans);
      requests.setRequestList(safeRequests);
      payments.setPaymentList(safePayments);

      if (userEmail) {
        const matched = safeMembers.find((m) => m.email?.toLowerCase() === userEmail?.toLowerCase());
        if (matched) {
          profile.setMemberProfile(buildDefaultMemberProfile(matched));
          if (role !== 'admin' && hasToken) {
            const memberPays = await paymentsApi.getMemberPayments(matched.id).catch(() => []);
            payments.setPaymentList(Array.isArray(memberPays) ? memberPays : []);
          }
        } else {
          profile.setMemberProfile((prev) => ({ ...prev, email: userEmail }));
        }
      }
    } catch (err) {
      console.error('Failed to load data from backend:', err);
      setError('Failed to connect to backend server. Make sure Spring Boot API is running on port 8081 or API Gateway on port 8085.');
    } finally {
      setLoading(false);
    }
  }, [userEmail, role]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const navigationItems = roleNavigation[role] || roleNavigation.admin;

  // Safe Fallback Lists
  const memberList = Array.isArray(members?.memberList) ? members.memberList : [];
  const trainerList = Array.isArray(trainers?.trainerList) ? trainers.trainerList : [];
  const planList = Array.isArray(plans?.planList) ? plans.planList : [];
  const requestList = Array.isArray(requests?.requestList) ? requests.requestList : [];
  const paymentList = Array.isArray(payments?.paymentList) ? payments.paymentList : [];

  const stats = useMemo(() => [
    { label: 'Total Members', value: memberList.length },
    { label: 'Active Trainers', value: trainerList.length },
    { label: 'Subscription Plans', value: planList.length }
  ], [memberList.length, trainerList.length, planList.length]);

  return {
    loading,
    error,
    users: [],
    // Auth Operations
    signup: (data) => auth.signup(data, fetchAllData),
    login: (credentials) => auth.login(credentials, fetchAllData),
    emailExists: (query) => auth.emailExists(query, memberList, trainerList),
    resetPassword: auth.resetPassword,
    // Navigation & Overview Stats
    navigationItems,
    stats,
    // Domain State Lists
    members: memberList,
    trainers: trainerList,
    plans: planList,
    requests: requestList,
    payments: paymentList,
    // Member Profile & Dynamic Roles
    memberProfile: profile.memberProfile,
    remainingPlanDays: dateDiffDays(profile.memberProfile.nextRenewal),
    trainerProfile: trainers.getDynamicTrainerProfile(role, userEmail),
    // Member Mutations
    addMember: (data) => members.addMember(data, fetchAllData),
    updateMember: (id, updates) => members.updateMember(id, updates, fetchAllData),
    deleteMember: (id) => members.deleteMember(id, fetchAllData),
    updateMemberWorkoutPlan: (name, key, plan) => members.updateMemberWorkoutPlan(name, key, plan, fetchAllData),
    updateMemberDietPlan: (name, plan) => members.updateMemberDietPlan(name, plan, fetchAllData),
    // Trainer Mutations
    addTrainer: (data) => trainers.addTrainer(data, fetchAllData),
    updateTrainer: (id, updates) => trainers.updateTrainer(id, updates, fetchAllData),
    deleteTrainer: (id) => trainers.deleteTrainer(id, fetchAllData),
    // Membership Plan Mutations
    addPlan: (data) => plans.addPlan(data, fetchAllData),
    updatePlan: (id, updates) => plans.updatePlan(id, updates, fetchAllData),
    deletePlan: (id) => plans.deletePlan(id, fetchAllData),
    // Payment Operations
    purchasePlan: (plan) => payments.purchasePlan(plan, memberList, profile.memberProfile, fetchAllData),
    initiateRazorpayPayment: (plan) => payments.initiateRazorpayPayment(plan, memberList, profile.memberProfile, fetchAllData),
    // Profile & Trainer Request Operations
    updateMemberProfile: (updates) => profile.updateMemberProfile(updates, memberList, (id, u) => members.updateMember(id, u, fetchAllData)),
    requestTrainer: (name, goal) => requests.requestTrainer(name, goal, memberList, trainerList, profile.memberProfile, fetchAllData),
    updateTrainerRequest: (id, status) => requests.updateTrainerRequest(id, status, fetchAllData),
    refetch: fetchAllData
  };
}
