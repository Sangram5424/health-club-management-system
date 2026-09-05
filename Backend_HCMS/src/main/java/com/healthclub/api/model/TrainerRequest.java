/*
 * File Path: health-club-api/src/main/java/com/healthclub/api/model/TrainerRequest.java
 * Entity: TrainerRequest (table: trainer_requests)
 * Description: JPA Entity representing member-initiated requests for personal trainer assignment with status tracking (PENDING, ACCEPTED, REJECTED).
 * Frontend Integration: Maps to TrainerRequest objects handled in MemberDashboardView, TrainerDashboardView, and AdminDashboardView via /api/trainer-requests.
 */
package com.healthclub.api.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "trainer_requests")
public class TrainerRequest extends BaseEntity {
    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private MemberProfile member;

    @ManyToOne
    @JoinColumn(name = "trainer_id", nullable = false)
    private TrainerProfile trainer;

    private String goal;

    @Enumerated(EnumType.STRING)
    private RequestStatus status = RequestStatus.PENDING;

    private LocalDateTime requestedAt = LocalDateTime.now();
    private LocalDateTime decidedAt;
}
