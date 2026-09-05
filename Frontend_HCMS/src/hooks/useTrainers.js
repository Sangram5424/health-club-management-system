/*
 * File Path: src/hooks/useTrainers.js
 * Hook: Custom Trainer Management Hook
 * Easy Explanation: Manages trainer directory state, trainer profiles, creation, updates, and deletion.
 */
import { useState } from 'react';
import { trainersApi } from '../services/api.js';

export function useTrainers() {
  const [trainerList, setTrainerList] = useState([]);

  /**
   * Method: addTrainer
   * API Request: POST /api/trainers
   */
  const addTrainer = async (trainerData, refetch) => {
    try {
      const created = await trainersApi.create({
        fullName: trainerData.name,
        email: trainerData.email,
        phone: trainerData.phone,
        specialty: trainerData.specialty,
        experience: trainerData.experience,
        certifications: trainerData.certifications
      });
      if (refetch) await refetch();
      return created;
    } catch (err) {
      console.error('Add trainer failed:', err);
    }
  };

  /**
   * Method: updateTrainer
   * API Request: PUT /api/trainers/{id}
   */
  const updateTrainer = async (id, updates, refetch) => {
    try {
      const targetId = typeof id === 'number' ? id : trainerList.find((t) => t.id === id || t.name === id)?.id || id;
      const updated = await trainersApi.update(targetId, {
        fullName: updates.name,
        email: updates.email,
        phone: updates.phone,
        specialty: updates.specialty,
        experience: updates.experience,
        certifications: updates.certifications
      });
      if (refetch) await refetch();
      return updated;
    } catch (err) {
      console.error('Update trainer failed:', err);
    }
  };

  /**
   * Method: deleteTrainer
   * API Request: DELETE /api/trainers/{id}
   */
  const deleteTrainer = async (id, refetch) => {
    try {
      await trainersApi.delete(id);
      if (refetch) await refetch();
    } catch (err) {
      console.error('Delete trainer failed:', err);
    }
  };

  const getDynamicTrainerProfile = (role, userEmail) => {
    if (role === 'trainer') {
      return (
        trainerList.find((t) => t.email?.toLowerCase() === userEmail?.toLowerCase()) ||
        trainerList[0] || {
          name: 'Trainer',
          specialty: 'Fitness',
          experience: '5+ Yrs',
          certifications: 'Certified Trainer',
          sessions: 0,
          rating: 4.5
        }
      );
    }
    return (
      trainerList[0] || {
        name: 'Trainer',
        specialty: 'Fitness',
        experience: '5+ Yrs',
        certifications: 'Certified Trainer',
        sessions: 0,
        rating: 4.5
      }
    );
  };

  return {
    trainerList,
    setTrainerList,
    addTrainer,
    updateTrainer,
    deleteTrainer,
    getDynamicTrainerProfile
  };
}
