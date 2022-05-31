package com.app.backend.controllers;

import java.net.URI;
import java.time.ZoneId;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.app.backend.models.FrontUser;
import com.app.backend.models.Role;
import com.app.backend.models.SignupData;
import com.app.backend.models.User;
import com.app.backend.services.UserService;

import lombok.Data;

@RestController
@RequestMapping("/api")
public class UserController {
	@Autowired
	private UserService userService;
	
	@GetMapping("/users/getUserId")
	public ResponseEntity<Long> getUserId(@RequestHeader (name="Authorization") String authorizationHeader) {
		User user = userService.getUserFromAuthorizationHeader(authorizationHeader);
		return ResponseEntity.ok().body(user.getId());
	}	
	
	@GetMapping("/users/hasAdminPrivilege")
	public ResponseEntity<Boolean> hasAdminPrivilege(@RequestHeader (name="Authorization") String authorizationHeader) {
		return ResponseEntity.ok().body(userService.hasAdminPrivilege(authorizationHeader));
	}
	
	@GetMapping("/users/isBlocked/{userId}")
	public ResponseEntity<Boolean> isBlocked(@PathVariable Long userId) {
		return ResponseEntity.ok().body(userService.isBlocked(userId));
	}
	
	@GetMapping("/users/getUserById/{userId}")
	public ResponseEntity<FrontUser> getUserById(@PathVariable Long userId) {
		User user = userService.getUserById(userId);
		FrontUser frontUser = new FrontUser(user.getId(), user.getFirstName(), user.getLastName(),
				user.getBrithdate().atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli(),
				user.getCity(), user.getCountry());
		return ResponseEntity.ok().body(frontUser);
	}
	
	@PostMapping("/users/signup")
	public ResponseEntity<?> signupUser(@RequestBody SignupData signupData) {
		URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/users/signup").toUriString());
		User savedUser = userService.signupUser(signupData);
		if (savedUser != null) {
			return ResponseEntity.created(uri).body(savedUser);
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Error("E-mail adresa je zauzeta!"));
		}	
	}
	
	@PostMapping("/users/changePassword")
	public ResponseEntity<?> changePassword(@RequestBody ChangePasswordData changePasswordData) {
		User changedUser = userService.changePassword(changePasswordData.getUserId(), changePasswordData.getOldPassword(), changePasswordData.getNewPassword());
		if (changedUser != null) {
			return ResponseEntity.ok().body(changedUser);
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Error("Nije dobra stara lozinka!"));
		}	
	}
	
	@PutMapping("/users/updateUser/{userId}")
	public ResponseEntity<?> updateUser(@PathVariable Long userId, @RequestBody ChangeUserData changeUserData) {
		User user = userService.getUserById(userId);
		User updatedUser = userService.updateUser(user, changeUserData.getFirstName(), changeUserData.getLastName(),
				changeUserData.getTimestamp(), changeUserData.getCity(), changeUserData.getCountry());
		return ResponseEntity.ok().body(updatedUser);
	}
	
	@GetMapping("/users/logout")
	public ResponseEntity<Boolean> logout(HttpServletRequest request, HttpServletResponse response) {
		return ResponseEntity.ok().body(userService.logoutUser(request, response));
	}	
	
	@PostMapping("/role/save")
	public ResponseEntity<Role> saveRole(@RequestBody Role role) {
		URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/role/save").toUriString());
		return ResponseEntity.created(uri).body(userService.saveRole(role));
	}
	
	@PostMapping("/role/addtouser")
	public ResponseEntity<?> addRoleToUser(@RequestBody RoleToUserForm form) {
		userService.addRoleToUser(form.getUsername(), form.getRoleName());
		return ResponseEntity.ok().build();
	}
}

@Data
class RoleToUserForm {
	private String username;
	private String roleName;
}

@Data
class ChangePasswordData {
	private Long userId;
	private String oldPassword;
	private String newPassword;
}

@Data
class ChangeUserData {
	private String firstName;
	private String lastName;
	private Long timestamp;
	private String city;
	private String country;
}
