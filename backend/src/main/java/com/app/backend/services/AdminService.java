package com.app.backend.services;

import java.util.List;

import com.app.backend.models.Brand;
import com.app.backend.models.Color;
import com.app.backend.models.Fuel;
import com.app.backend.models.Model;
import com.app.backend.models.User;

public interface AdminService {
	User blockUser(Long userId);
	User unblockUser(Long userId);
	List<User> getUsers(User user);
	Long adminDeleteCar(Long carId);
	List<Brand> getBrands();
	Brand saveBrand(String brandName);
	Long deleteBrand(String brandName);
	List<Model> getModels(String brandName);
	Model addModelToBrand(String brandName, String modelName);
	Long deleteModelFromBrand(String brandName, String modelName);
	List<Fuel> getFuelTypes();
	Fuel saveFuel(String fuelType);
	Long deleteFuel(String fuelType);
	List<Color> getColors();
	Color saveColor(String colorName);
	Long deleteColor(String colorName);
}
