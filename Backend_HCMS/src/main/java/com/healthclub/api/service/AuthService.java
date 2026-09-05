/*
 * File Path: health-club-api/src/main/java/com/healthclub/api/service/AuthService.java
 * Package: com.healthclub.api.service
 * Description: Service managing user authentication, registration, JWT token generation, and password resets.
 * Automatic Profile Provisioning: Automatically creates a MemberProfile or TrainerProfile upon user signup.
 */
package com.healthclub.api.service;

import com.healthclub.api.dto.AuthDtos.AuthResponse;
import com.healthclub.api.dto.AuthDtos.LoginRequest;
import com.healthclub.api.dto.AuthDtos.RegisterRequest;
import com.healthclub.api.dto.AuthDtos.ResetPasswordRequest;
import com.healthclub.api.exception.ResourceNotFoundException;
import com.healthclub.api.model.MemberProfile;
import com.healthclub.api.model.Role;
import com.healthclub.api.model.RoleName;
import com.healthclub.api.model.TrainerProfile;
import com.healthclub.api.model.User;
import com.healthclub.api.repository.MemberProfileRepository;
import com.healthclub.api.repository.RoleRepository;
import com.healthclub.api.repository.TrainerProfileRepository;
import com.healthclub.api.repository.UserRepository;
import com.healthclub.api.security.JwtService;
import java.time.LocalDate;
import java.util.List;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final MemberProfileRepository memberProfileRepository;
    private final TrainerProfileRepository trainerProfileRepository;

    public AuthService(
        AuthenticationManager authenticationManager,
        JwtService jwtService,
        PasswordEncoder passwordEncoder,
        RoleRepository roleRepository,
        UserRepository userRepository,
        MemberProfileRepository memberProfileRepository,
        TrainerProfileRepository trainerProfileRepository
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.memberProfileRepository = memberProfileRepository;
        this.trainerProfileRepository = trainerProfileRepository;
    }

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        } catch (Exception e) {
            throw new BadCredentialsException("Invalid email or password credentials.");
        }

        User user = userRepository.findByEmail(request.email())
            .orElseThrow(() -> new BadCredentialsException("User account not found with email: " + request.email()));

        if (request.role() != null && !request.role().isBlank()) {
            String reqRole = request.role().trim().toUpperCase();
            boolean hasRole = user.getRoles().stream()
                .anyMatch(r -> r.getName().name().equalsIgnoreCase(reqRole) || r.getName().name().equalsIgnoreCase("ROLE_" + reqRole));
            if (!hasRole) {
                throw new BadCredentialsException("Selected role (" + request.role() + ") does not match your registered account role.");
            }
        }

        List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
            .map(role -> {
                String roleName = role.getName().name();
                return new SimpleGrantedAuthority(roleName.startsWith("ROLE_") ? roleName : "ROLE_" + roleName);
            })
            .toList();

        org.springframework.security.core.userdetails.User userDetails = new org.springframework.security.core.userdetails.User(
            user.getEmail(),
            user.getPasswordHash(),
            authorities
        );

        String token = jwtService.generateToken(userDetails);
        return response(user, token);
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already exists");
        }
        RoleName roleName;
        try {
            roleName = RoleName.valueOf((request.role() == null ? "MEMBER" : request.role()).trim().toUpperCase());
        } catch (Exception e) {
            roleName = RoleName.MEMBER;
        }
        Role role = roleRepository.findByName(roleName).orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        User user = new User();
        user.setFullName(request.fullName());
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setPhone(request.phone());
        user.getRoles().add(role);
        User savedUser = userRepository.save(user);

        // Automatically provision corresponding profile
        if (roleName == RoleName.MEMBER) {
            MemberProfile member = new MemberProfile();
            member.setUser(savedUser);
            member.setPlanName("None");
            member.setTrainerName("Not Assigned");
            member.setRenewalDate(null);
            member.setStatus("Pending");
            String goal = request.healthGoal() != null && !request.healthGoal().isBlank()
                ? request.healthGoal()
                : (request.specialty() != null ? request.specialty() : "General Fitness");
            member.setHealthGoal(goal);
            if (request.address() != null) member.setAddress(request.address());
            if (request.emergencyContact() != null) member.setEmergencyContact(request.emergencyContact());
            if (request.gender() != null) member.setGender(request.gender());
            if (request.dateOfBirth() != null && !request.dateOfBirth().isBlank()) {
                try {
                    member.setDateOfBirth(LocalDate.parse(request.dateOfBirth()));
                } catch (Exception ignored) {}
            }
            memberProfileRepository.save(member);
        } else if (roleName == RoleName.TRAINER) {
            TrainerProfile trainer = new TrainerProfile();
            trainer.setUser(savedUser);
            trainer.setSpecialty(request.specialty() != null ? request.specialty() : "General Fitness Specialist");
            trainer.setExperience(request.experience() != null ? request.experience() : "3+ Years Experience");
            trainer.setCertifications(request.certifications() != null ? request.certifications() : "Certified Personal Trainer");
            trainer.setSessions(0);
            trainer.setRating(4.5);
            trainerProfileRepository.save(trainer);
        }

        List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + roleName.name()));
        org.springframework.security.core.userdetails.User userDetails = new org.springframework.security.core.userdetails.User(
            savedUser.getEmail(),
            savedUser.getPasswordHash(),
            authorities
        );

        return response(savedUser, jwtService.generateToken(userDetails));
    }

    @Transactional
    public boolean resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.email())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        userRepository.save(user);
        return true;
    }

    private AuthResponse response(User user, String token) {
        List<String> roles = user.getRoles().stream().map(role -> role.getName().name()).toList();
        String primaryRole = roles.isEmpty() ? "MEMBER" : roles.get(0);
        return new AuthResponse(token, "Bearer", primaryRole, user.getEmail(), user.getFullName(), roles);
    }
}
