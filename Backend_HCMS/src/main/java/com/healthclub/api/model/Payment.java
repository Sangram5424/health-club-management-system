/*
 * File Path: health-club-api/src/main/java/com/healthclub/api/model/Payment.java
 * Description: JPA Entity representing Razorpay payment transactions, order IDs, payment signatures, and status logs.
 */
package com.healthclub.api.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "payments")
public class Payment extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String razorpayOrderId;

    @Column(length = 100)
    private String razorpayPaymentId;

    @Column(length = 255)
    private String razorpaySignature;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal amount;

    @Column(nullable = false, length = 10)
    private String currency = "INR";

    @Column(nullable = false, length = 30)
    private String paymentStatus = "CREATED"; // CREATED, SUCCESS, FAILED

    private LocalDateTime paymentDate;

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private MemberProfile member;

    @ManyToOne
    @JoinColumn(name = "plan_id", nullable = false)
    private MembershipPlan subscriptionPlan;

    @ManyToOne
    @JoinColumn(name = "subscription_id")
    private MemberSubscription subscription;

    @PrePersist
    void onCreate() {
        if (paymentDate == null) {
            paymentDate = LocalDateTime.now();
        }
    }
}
