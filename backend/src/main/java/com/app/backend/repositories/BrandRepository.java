package com.app.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.backend.models.Brand;

public interface BrandRepository extends JpaRepository<Brand, Long> {
	Brand findByName(String name);
}
