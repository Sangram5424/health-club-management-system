/*
 * File Path: health-club-api/src/main/java/com/healthclub/api/controller/PlanController.java
 * Controller: PlanController (Base Endpoint Path: /api/plans)
 * Easy Explanation: Spring Boot REST Controller handling health club membership plan creation, modifications, and deletion.
 */
package com.healthclub.api.controller;

import com.healthclub.api.dto.ApiResponse;
import com.healthclub.api.dto.PlanDtos.PlanRequest;
import com.healthclub.api.dto.PlanDtos.PlanResponse;
import com.healthclub.api.service.PlanService;
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
@RequestMapping("/api/plans")
public class PlanController {
    private final PlanService service;

    public PlanController(PlanService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<List<PlanResponse>> all() {
        return ApiResponse.success("Membership plans retrieved successfully.", service.findAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<PlanResponse> one(@PathVariable("id") Long id) {
        return ApiResponse.success("Membership plan retrieved successfully.", service.findById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<PlanResponse> create(@RequestBody PlanRequest request) {
        PlanResponse created = service.create(request);
        return ApiResponse.created("Membership plan created successfully.", created);
    }

    @PutMapping("/{id}")
    public ApiResponse<PlanResponse> update(@PathVariable("id") Long id, @RequestBody PlanRequest request) {
        PlanResponse updated = service.update(id, request);
        return ApiResponse.updated("Membership plan updated successfully.", updated);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable("id") Long id) {
        service.delete(id);
        return ApiResponse.deleted("Membership plan with ID " + id + " deleted successfully.");
    }
}
