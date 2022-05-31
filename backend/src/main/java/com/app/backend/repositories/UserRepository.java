package com.app.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.backend.models.User;

public interface UserRepository extends JpaRepository<User, Long> {
	User findByUsername(String username);
}
