/*
 * File Path: src/hooks/usePlans.js
 * Hook: Custom Membership Plan Management Hook
 * Easy Explanation: Manages membership plan state, plan creation, editing, pricing updates, and soft-deletion.
 */
import { useState } from 'react';
import { plansApi } from '../services/api.js';
import { splitFeatures } from '../utils/dashboardHelpers.js';

export function usePlans() {
  const [planList, setPlanList] = useState([]);

  /**
   * Method: addPlan
   * API Request: POST /api/plans
   */
  const addPlan = async (planData, refetch) => {
    try {
      const created = await plansApi.create({
        name: planData.name,
        price: planData.price,
        duration: planData.duration,
        features: splitFeatures(planData.features)
      });
      if (refetch) await refetch();
      return created;
    } catch (err) {
      console.error('Add plan failed:', err);
    }
  };

  /**
   * Method: updatePlan
   * API Request: PUT /api/plans/{id}
   */
  const updatePlan = async (identifier, updates, refetch) => {
    try {
      const plan = planList.find((p) => p.id === identifier || p.name === identifier);
      if (!plan) return;
      const updated = await plansApi.update(plan.id, {
        name: updates.name,
        price: updates.price,
        duration: updates.duration,
        features: updates.features !== undefined ? splitFeatures(updates.features) : plan.features,
        active: updates.active !== undefined ? updates.active : plan.active
      });
      if (refetch) await refetch();
      return updated;
    } catch (err) {
      console.error('Update plan failed:', err);
    }
  };

  /**
   * Method: deletePlan
   * API Request: DELETE /api/plans/{id}
   */
  const deletePlan = async (identifier, refetch) => {
    try {
      const plan = planList.find((p) => p.id === identifier || p.name === identifier);
      if (!plan) return;
      await plansApi.delete(plan.id);
      if (refetch) await refetch();
    } catch (err) {
      console.error('Delete plan failed:', err);
    }
  };

  return {
    planList,
    setPlanList,
    addPlan,
    updatePlan,
    deletePlan
  };
}
