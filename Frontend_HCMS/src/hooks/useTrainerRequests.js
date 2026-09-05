/*
 * File Path: src/hooks/useTrainerRequests.js
 * Hook: Custom Trainer Assignment Request Management Hook
 * Easy Explanation: Handles trainer assignment requests, state lists, and approval/rejection operations.
 */
import { useState } from 'react';
import { trainerRequestsApi } from '../services/api.js';

export function useTrainerRequests() {
  const [requestList, setRequestList] = useState([]);

  /**
   * Method: requestTrainer
   * API Request: POST /api/trainer-requests
   */
  const requestTrainer = async (trainerName, goal, memberList, trainerList, memberProfile, refetch) => {
    const targetTrainer = trainerList.find((t) => t.name === trainerName);
    const matchedMember = memberList.find((m) => m.email?.toLowerCase() === memberProfile.email?.toLowerCase()) || memberList[0];
    try {
      await trainerRequestsApi.create({
        memberId: matchedMember?.id,
        trainerId: targetTrainer?.id,
        memberName: memberProfile.name,
        trainerName,
        goal
      });
      if (refetch) await refetch();
    } catch (err) {
      console.error('Trainer request failed:', err);
    }
  };

  /**
   * Method: updateTrainerRequest
   * API Request: PUT /api/trainer-requests/{id}/status
   */
  const updateTrainerRequest = async (id, status, refetch) => {
    try {
      await trainerRequestsApi.updateStatus(id, status);
      if (refetch) await refetch();
    } catch (err) {
      console.error('Update trainer request failed:', err);
    }
  };

  return {
    requestList,
    setRequestList,
    requestTrainer,
    updateTrainerRequest
  };
}
