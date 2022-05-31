package com.app.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.backend.models.Color;

public interface ColorRepository extends JpaRepository<Color, Long> {
	Color findByName(String name);
}
