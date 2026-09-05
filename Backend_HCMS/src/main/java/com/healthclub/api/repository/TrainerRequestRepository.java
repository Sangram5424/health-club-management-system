/*
 * Repository Flow: Service -> Spring Data JPA repository -> Hibernate -> database table.
 * Derived query methods here keep database access clean and reusable.
 */
// Short flow: Spring Data converts method names into SQL through Hibernate.
package com.healthclub.api.repository;

import com.healthclub.api.model.RequestStatus;
import com.healthclub.api.model.TrainerRequest;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainerRequestRepository extends JpaRepository<TrainerRequest, Long> {
    List<TrainerRequest> findByTrainer_IdAndStatus(Long trainerId, RequestStatus status);
    List<TrainerRequest> findByMember_Id(Long memberId);
}
