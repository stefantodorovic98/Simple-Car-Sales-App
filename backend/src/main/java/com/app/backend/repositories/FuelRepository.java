package com.app.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.backend.models.Fuel;

public interface FuelRepository extends JpaRepository<Fuel, Long> {
	Fuel findByName(String name);
}
