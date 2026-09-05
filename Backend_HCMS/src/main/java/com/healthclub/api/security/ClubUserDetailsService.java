/*
 * Security Flow: Login creates JWT -> requests send Bearer token -> filter validates token -> role rules allow access.
 * These classes keep authentication separate from business controllers.
 */
package com.healthclub.api.security;

import com.healthclub.api.model.UserStatus;
import com.healthclub.api.repository.UserRepository;
import java.util.List;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class ClubUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    public ClubUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        com.healthclub.api.model.User user = userRepository.findByEmail(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));

        List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
            .map(role -> {
                String roleName = role.getName().name();
                return new SimpleGrantedAuthority(roleName.startsWith("ROLE_") ? roleName : "ROLE_" + roleName);
            })
            .toList();

        boolean isDisabled = user.getStatus() != null && user.getStatus() == UserStatus.INACTIVE;

        return new User(
            user.getEmail(),
            user.getPasswordHash(),
            !isDisabled,
            true,
            true,
            true,
            authorities
        );
    }
}
