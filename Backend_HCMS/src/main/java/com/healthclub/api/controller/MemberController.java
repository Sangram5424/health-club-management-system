/*
 * File Path: health-club-api/src/main/java/com/healthclub/api/controller/MemberController.java
 * Controller: MemberController (Base Endpoint Path: /api/members)
 * Easy Explanation: Spring Boot REST Controller exposing endpoints for member profile management, plan purchases, and workout/diet updates.
 */
package com.healthclub.api.controller;

import com.healthclub.api.dto.ApiResponse;
import com.healthclub.api.dto.MemberDtos.DietPlanUpdateRequest;
import com.healthclub.api.dto.MemberDtos.MemberRequest;
import com.healthclub.api.dto.MemberDtos.MemberResponse;
import com.healthclub.api.dto.MemberDtos.PurchasePlanRequest;
import com.healthclub.api.dto.MemberDtos.WorkoutPlanUpdateRequest;
import com.healthclub.api.service.MemberService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/members")
public class MemberController {
    private final MemberService service;

    public MemberController(MemberService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<List<MemberResponse>> all() {
        return ApiResponse.success("Member profiles retrieved successfully.", service.findAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<MemberResponse> one(@PathVariable("id") Long id) {
        return ApiResponse.success("Member profile retrieved successfully.", service.findById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<MemberResponse> create(@RequestBody MemberRequest request) {
        MemberResponse created = service.create(request);
        return ApiResponse.created("Member profile created successfully.", created);
    }

    @PutMapping("/{id}")
    public ApiResponse<MemberResponse> update(@PathVariable("id") Long id, @RequestBody MemberRequest request) {
        MemberResponse updated = service.update(id, request);
        return ApiResponse.updated("Member profile updated successfully.", updated);
    }

    @PutMapping("/{id}/workout-plan")
    public ApiResponse<MemberResponse> updateWorkoutPlan(@PathVariable("id") Long id, @RequestBody WorkoutPlanUpdateRequest request) {
        MemberResponse updated = service.updateWorkoutPlan(id, request);
        return ApiResponse.updated("Member workout plan updated successfully.", updated);
    }

    @PutMapping("/{id}/diet-plan")
    public ApiResponse<MemberResponse> updateDietPlan(@PathVariable("id") Long id, @RequestBody DietPlanUpdateRequest request) {
        MemberResponse updated = service.updateDietPlan(id, request);
        return ApiResponse.updated("Member diet plan updated successfully.", updated);
    }

    @PostMapping("/{id}/purchase-plan")
    public ApiResponse<MemberResponse> purchasePlan(@PathVariable("id") Long id, @RequestBody PurchasePlanRequest request) {
        MemberResponse updated = service.purchasePlan(id, request);
        return ApiResponse.updated("Membership plan purchased and activated successfully.", updated);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable("id") Long id) {
        service.delete(id);
        return ApiResponse.deleted("Member profile with ID " + id + " deleted successfully.");
    }
}
