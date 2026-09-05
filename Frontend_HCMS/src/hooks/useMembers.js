/*
 * File Path: src/hooks/useMembers.js
 * Hook: Custom Member Management Hook
 * Easy Explanation: Manages member directory state, creation, updates, deletion, workout plans, and diet plans.
 */
import { useState } from 'react';
import { membersApi } from '../services/api.js';

export function useMembers() {
  const [memberList, setMemberList] = useState([]);

  /**
   * Method: addMember
   * API Request: POST /api/members
   */
  const addMember = async (memberData, refetch) => {
    try {
      const created = await membersApi.create({
        fullName: memberData.name,
        email: memberData.email,
        phone: memberData.phone,
        plan: memberData.plan,
        trainer: memberData.trainer,
        renewal: memberData.renewal,
        status: memberData.status,
        gender: memberData.gender,
        address: memberData.address,
        emergencyContact: memberData.emergencyContact,
        healthGoal: memberData.healthGoal,
        dateOfBirth: memberData.dateOfBirth
      });
      if (refetch) await refetch();
      return created;
    } catch (err) {
      console.error('Add member failed:', err);
    }
  };

  /**
   * Method: updateMember
   * API Request: PUT /api/members/{id}
   */
  const updateMember = async (id, updates, refetch) => {
    try {
      const targetId = typeof id === 'number' ? id : memberList.find((m) => m.id === id || m.name === id)?.id || id;
      const updated = await membersApi.update(targetId, {
        fullName: updates.name,
        email: updates.email,
        phone: updates.phone,
        plan: updates.plan,
        trainer: updates.trainer,
        renewal: updates.renewal,
        status: updates.status,
        gender: updates.gender,
        address: updates.address,
        emergencyContact: updates.emergencyContact,
        healthGoal: updates.healthGoal,
        dateOfBirth: updates.dateOfBirth
      });
      if (refetch) await refetch();
      return updated;
    } catch (err) {
      console.error('Update member failed:', err);
    }
  };

  /**
   * Method: deleteMember
   * API Request: DELETE /api/members/{id}
   */
  const deleteMember = async (id, refetch) => {
    try {
      await membersApi.delete(id);
      if (refetch) await refetch();
    } catch (err) {
      console.error('Delete member failed:', err);
    }
  };

  /**
   * Method: updateMemberWorkoutPlan
   * API Request: PUT /api/members/{id}/workout-plan
   */
  const updateMemberWorkoutPlan = async (memberNameOrId, dayKey, dayPlan, refetch) => {
    const targetMember = memberList.find((m) => m.name === memberNameOrId || m.id === memberNameOrId || m.email === memberNameOrId);
    if (targetMember) {
      try {
        await membersApi.updateWorkoutPlan(targetMember.id, dayKey, dayPlan);
        if (refetch) await refetch();
      } catch (err) {
        console.error('Update workout plan failed:', err);
      }
    }
  };

  /**
   * Method: updateMemberDietPlan
   * API Request: PUT /api/members/{id}/diet-plan
   */
  const updateMemberDietPlan = async (memberNameOrId, dietPlan, refetch) => {
    const targetMember = memberList.find((m) => m.name === memberNameOrId || m.id === memberNameOrId || m.email === memberNameOrId);
    if (targetMember) {
      try {
        await membersApi.updateDietPlan(targetMember.id, dietPlan);
        if (refetch) await refetch();
      } catch (err) {
        console.error('Update diet plan failed:', err);
      }
    }
  };

  return {
    memberList,
    setMemberList,
    addMember,
    updateMember,
    deleteMember,
    updateMemberWorkoutPlan,
    updateMemberDietPlan
  };
}
