package com.app.backend.services;

import java.time.Instant;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collection;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Service;

import com.app.backend.models.Role;
import com.app.backend.models.SignupData;
import com.app.backend.models.User;
import com.app.backend.repositories.RoleRepository;
import com.app.backend.repositories.UserRepository;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class UserServiceImpl implements UserService, UserDetailsService {
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private RoleRepository roleRepository;
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userRepository.findByUsername(username);
		if (user == null) {
			log.error("User not found in the database");
			throw new UsernameNotFoundException("User not found in the database");
		} else {
			log.info("User found in the database: {}", username);
			Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
			user.getRoles().forEach(role -> authorities.add(new SimpleGrantedAuthority(role.getName())));
			return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), authorities);
		}
	}
	
	@Override
	public boolean hasAdminPrivilege(String authorizationHeader) {
		String token = authorizationHeader.substring("Bearer ".length());
		Algorithm algorithm = Algorithm.HMAC256("secret".getBytes());
		JWTVerifier verifier = JWT.require(algorithm).build();
		DecodedJWT decodedJWT = verifier.verify(token);
		String[] roles = decodedJWT.getClaim("roles").asArray(String.class);
		boolean hasPrivilege = false;
		for (int i = 0; i < roles.length; i++) {
			if ("ROLE_ADMIN".equals(roles[i])) {
				hasPrivilege = true;
			}
		}
		return hasPrivilege;
	}
	
	@Override
	public boolean isBlocked(Long userId) {
		return userRepository.getById(userId).getBanned();
	}
	
	@Override
	public User getUserById(Long id) {
		log.info("Fetching user by id");
		return userRepository.getById(id);
	}
	
	@Override
	public User getUser(String username) {
		log.info("Fetching user {}", username);
		return userRepository.findByUsername(username);
	}
	
	@Override
	public User getUserFromAuthorizationHeader(String authorizationHeader) {
		String token = authorizationHeader.substring("Bearer ".length());
		Algorithm algorithm = Algorithm.HMAC256("secret".getBytes());
		JWTVerifier verifier = JWT.require(algorithm).build();
		DecodedJWT decodedJWT = verifier.verify(token);
		String username = decodedJWT.getSubject();
		return getUser(username);
	}
	
	@Override
	public User signupUser(SignupData signupData) {
		log.info("Signup user {}", signupData.getFirstName());
		User user = getUser(signupData.getUsername());
		if (user != null) return null;
		user = new User();
		user.setFirstName(signupData.getFirstName());
		user.setLastName(signupData.getLastName());
		user.setUsername(signupData.getUsername());
		user.setPassword(signupData.getPassword());
		user.setBrithdate(Instant.ofEpochMilli(signupData.getTimestamp()).atZone(ZoneId.systemDefault()).toLocalDate());
		user.setCity(signupData.getCity());
		user.setCountry(signupData.getCountry());
		user.setBanned(false);
		User savedUser = saveUser(user);
		addRoleToUser(savedUser.getUsername(), "ROLE_USER");
		return savedUser;
	}
	
	@Override
	public User changePassword(Long userId, String oldPassword, String newPassword) {
		User user = getUserById(userId);
		if (passwordEncoder.matches(oldPassword, user.getPassword())) {
			log.info("Password is changed");
			user.setPassword(passwordEncoder.encode(newPassword));
			return userRepository.save(user);
		}
		log.info("Password isn't changed");
		return null;
	}
	
	@Override
	public User updateUser(User user, String firstName, String lastName, Long timestamp, String city, String country) {
		log.info("Update user data");
		user.setFirstName(firstName);
		user.setLastName(lastName);
		user.setBrithdate(Instant.ofEpochMilli(timestamp).atZone(ZoneId.systemDefault()).toLocalDate());
		user.setCity(city);
		user.setCountry(country);
		return userRepository.save(user);
	}	

	@Override
	public Boolean logoutUser(HttpServletRequest request, HttpServletResponse response) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		SecurityContextLogoutHandler handler = null;
		if (auth != null) {
			handler = new SecurityContextLogoutHandler();
			handler.logout(request, response, auth);
		}
		return handler.isInvalidateHttpSession();
	}
	
	@Override
	public User saveUser(User user) {
		log.info("Saving new user {} to the database", user.getFirstName());
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		return userRepository.save(user);
	}

	@Override
	public Role saveRole(Role role) {
		log.info("Saving new role {} to the database", role.getName());
		return roleRepository.save(role);
	}

	@Override
	public void addRoleToUser(String username, String roleName) {
		log.info("Adding role {} to user {}", roleName, username);
		User user = userRepository.findByUsername(username);
		Role role = roleRepository.findByName(roleName);
		user.getRoles().add(role);
		userRepository.save(user);
	}
}
