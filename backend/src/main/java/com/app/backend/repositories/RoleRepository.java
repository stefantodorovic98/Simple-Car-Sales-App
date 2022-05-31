package com.app.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.backend.models.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {
	Role findByName(String name);
}
