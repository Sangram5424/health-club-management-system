/*
 * File Path: src/hooks/useProfile.js
 * Hook: Custom Member Profile Management Hook
 * Easy Explanation: Manages logged-in member profile state, health goals, workout schedules, and profile updates.
 */
import { useState } from 'react';
import { buildDefaultMemberProfile } from '../utils/dashboardHelpers.js';

export function useProfile() {
  const [memberProfile, setMemberProfile] = useState(() => buildDefaultMemberProfile(null));

  /**
   * Method: updateMemberProfile
   */
  const updateMemberProfile = async (updates, memberList, updateMemberFn) => {
    const matchedMember = memberList.find(
      (m) => m.email?.toLowerCase() === memberProfile.email?.toLowerCase() || m.id === memberProfile.id
    );
    if (matchedMember && updateMemberFn) {
      await updateMemberFn(matchedMember.id, updates);
    }
    setMemberProfile((current) => ({ ...current, ...updates }));
  };

  return {
    memberProfile,
    setMemberProfile,
    updateMemberProfile
  };
}
