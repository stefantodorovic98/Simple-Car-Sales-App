package com.app.backend.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.backend.models.Brand;
import com.app.backend.models.Car;
import com.app.backend.models.Color;
import com.app.backend.models.Fuel;
import com.app.backend.models.Model;
import com.app.backend.models.User;
import com.app.backend.repositories.BrandRepository;
import com.app.backend.repositories.CarRepository;
import com.app.backend.repositories.ColorRepository;
import com.app.backend.repositories.FuelRepository;
import com.app.backend.repositories.ModelRepository;
import com.app.backend.repositories.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AdminServiceImpl implements AdminService {
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private CarRepository carRepository;
	@Autowired
	private BrandRepository brandRepository;
	@Autowired
	private ModelRepository modelRepository;
	@Autowired
	private FuelRepository fuelRepository;
	@Autowired
	private ColorRepository colorRepository;
	
	@Override
	public User blockUser(Long userId) {
		log.info("Block user");
		User user = userRepository.getById(userId);
		user.setBanned(true);
		return userRepository.save(user);
	}

	@Override
	public User unblockUser(Long userId) {
		log.info("Unblock user");
		User user = userRepository.getById(userId);
		user.setBanned(false);
		return userRepository.save(user);
	}
	
	@Override
	public List<User> getUsers(User user) {
		log.info("Fetching all users");
		List<User> users = userRepository.findAll();
		List<User> returnUsers = new ArrayList<>();
		users.forEach(currentUser -> {
			if (currentUser.getId() != user.getId()) {
				returnUsers.add(currentUser);
			}
		});
		return returnUsers;
	}
	
	@Override
	public Long adminDeleteCar(Long carId) {
		carRepository.deleteById(carId);
		log.info("Admin delete car");
		return carId;
	}

	@Override
	public List<Brand> getBrands() {
		log.info("Get brands");
		return brandRepository.findAll();
	}
	
	@Override
	public Brand saveBrand(String brandName) {
		Brand brand = brandRepository.findByName(brandName);
		if (brand != null) return null;
		log.info("Saving new brand {} to the database", brandName);
		return brandRepository.save(new Brand(null, brandName));
	}
	
	@Override
	public Long deleteBrand(String brandName) {
		Brand brand = brandRepository.findByName(brandName);
//		List<Car> cars = carRepository.findByBrand(brand);
		List<Model> models = modelRepository.findByBrand(brand);
//		if(cars.size() > 0 || models.size() > 0) return null;
		if (models.size() > 0) return null;
		Long id = brand.getId();
		brandRepository.deleteById(id);
		log.info("Delete a brand");
		return id;
	}

	@Override
	public List<Model> getModels(String brandName) {
		Brand brand = brandRepository.findByName(brandName);
		log.info("Get models for brand {}", brandName);
		return modelRepository.findByBrand(brand);
	}
	
	@Override
	public Model addModelToBrand(String brandName, String modelName) {
		Model modelCheck = modelRepository.findByName(modelName);
		if (modelCheck != null) return null;
		modelRepository.save(new Model(null, modelName, null));
		Brand brand = brandRepository.findByName(brandName);
		Model model = modelRepository.findByName(modelName);
		model.setBrand(brand);
		log.info("Adding model {} to brand {}", modelName, brandName);
		return modelRepository.save(model);
	}
	
	@Override
	public Long deleteModelFromBrand(String brandName, String modelName) {
		Model model = modelRepository.findByName(modelName);
		List<Car> cars = carRepository.findByModel(model);
		log.info("Brisanje modela {} iz brenda {} ", modelName, brandName );
		if (cars.size() > 0) return null;
		Long id = model.getId();
		modelRepository.deleteById(id);
		log.info("Delete a model");
		return id;
	}
	
	@Override
	public List<Fuel> getFuelTypes() {
		log.info("Get fuel types");
		return fuelRepository.findAll();
	}

	@Override
	public Fuel saveFuel(String fuelType) {
		Fuel fuel = fuelRepository.findByName(fuelType);
		if (fuel != null) return null;
		log.info("Saving fuel {} to the database", fuelType);
		return fuelRepository.save(new Fuel(null, fuelType));
	}
	
	@Override
	public Long deleteFuel(String fuelType) {
		Fuel fuel = fuelRepository.findByName(fuelType);
		List<Car> cars = carRepository.findByFuel(fuel);
		if (cars.size() > 0) return null;
		Long id = fuel.getId();
		fuelRepository.deleteById(id);
		log.info("Delete a fuel type");
		return id;
	}
	
	@Override
	public List<Color> getColors() {
		log.info("Get colors");
		return colorRepository.findAll();
	}

	@Override
	public Color saveColor(String colorName) {
		Color color = colorRepository.findByName(colorName);
		if (color != null) return null;
		log.info("Saving new color {} to the database", colorName);
		return colorRepository.save(new Color(null, colorName));
	}
	
	@Override
	public Long deleteColor(String colorName) {
		Color color = colorRepository.findByName(colorName);
		List<Car> cars = carRepository.findByColor(color);
		if (cars.size() > 0) return null;
		Long id = color.getId();
		colorRepository.deleteById(id);
		log.info("Delete a color");
		return id;
	}	
}
