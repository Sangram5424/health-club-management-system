/*
 * Repository Flow: Service -> Spring Data JPA repository -> Hibernate -> database table.
 * Derived query methods here keep database access clean and reusable.
 */
// Short flow: Spring Data converts method names into SQL through Hibernate.
package com.healthclub.api.repository;

import com.healthclub.api.model.TrainerAssignment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainerAssignmentRepository extends JpaRepository<TrainerAssignment, Long> {
    List<TrainerAssignment> findByTrainer_Id(Long trainerId);
    List<TrainerAssignment> findByMember_Id(Long memberId);
}
