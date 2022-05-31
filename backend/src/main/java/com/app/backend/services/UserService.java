package com.app.backend.services;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.app.backend.models.Role;
import com.app.backend.models.SignupData;
import com.app.backend.models.User;

public interface UserService {
	boolean hasAdminPrivilege(String authorizationHeader);
	boolean isBlocked(Long userId);
	User getUserById(Long id);
	User getUser(String username);
	User getUserFromAuthorizationHeader(String authorizationHeader);	
	User signupUser(SignupData signupData);
	User changePassword(Long userId, String oldPassword, String newPassword);
	User updateUser(User user, String firstName, String lastName, Long timestamp, String city, String country);
	Boolean logoutUser(HttpServletRequest request, HttpServletResponse response);
	User saveUser(User user);
	Role saveRole(Role role);
	void addRoleToUser(String username, String roleName);
}
