package com.app.backend.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.app.backend.models.Brand;
import com.app.backend.models.Car;
import com.app.backend.models.Color;
import com.app.backend.models.Fuel;
import com.app.backend.models.Model;
import com.app.backend.models.User;

public interface CarRepository extends JpaRepository<Car, Long> {
	Page<Car> findByOwner(User owner, Pageable pageable);
	List<Car> findByBrand(Brand brand);
	List<Car> findByModel(Model model);
	List<Car> findByFuel(Fuel fuel);
	List<Car> findByColor(Color color);
}
