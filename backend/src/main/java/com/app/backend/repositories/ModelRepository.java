package com.app.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.backend.models.Brand;
import com.app.backend.models.Model;

public interface ModelRepository extends JpaRepository<Model, Long> {
	Model findByName(String name);
	List<Model> findByBrand(Brand brand);
}
