package com.app.backend.controllers;

import java.net.URI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.app.backend.models.Brand;
import com.app.backend.models.Color;
import com.app.backend.models.Fuel;
import com.app.backend.models.Model;
import com.app.backend.models.User;
import com.app.backend.services.AdminService;
import com.app.backend.services.UserService;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/admin")
@Slf4j
public class AdminController {
	@Autowired
	private AdminService adminService;
	@Autowired
	private UserService userService;
	
	@GetMapping("/blockUser/{userId}")
	public ResponseEntity<?> blockUser(@PathVariable Long userId, @RequestHeader (name="Authorization") String authorizationHeader) {
		if (!userService.hasAdminPrivilege(authorizationHeader)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new Error("Niste administrator!"));
		}
		return ResponseEntity.ok().body(adminService.blockUser(userId));
	}
	
	@GetMapping("/unblockUser/{userId}")
	public ResponseEntity<?> unblockUser(@PathVariable Long userId, @RequestHeader (name="Authorization") String authorizationHeader) {
		if (!userService.hasAdminPrivilege(authorizationHeader)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new Error("Niste administrator!"));
		}
		return ResponseEntity.ok().body(adminService.unblockUser(userId));
	}
	
	@GetMapping("/getUsers")
	public ResponseEntity<?> getUsers(@RequestHeader (name="Authorization") String authorizationHeader) {
		if (!userService.hasAdminPrivilege(authorizationHeader)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new Error("Niste administrator!"));
		}
		User user = userService.getUserFromAuthorizationHeader(authorizationHeader);
		return ResponseEntity.ok().body(adminService.getUsers(user));
	}	
	
	@DeleteMapping("/adminDeleteCar/{carId}")
	public ResponseEntity<?> adminDeleteCar(@PathVariable Long carId, @RequestHeader (name="Authorization") String authorizationHeader) {
		if (!userService.hasAdminPrivilege(authorizationHeader)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new Error("Niste administrator!"));
		}
		Long deletedCarId = adminService.adminDeleteCar(carId);
		return ResponseEntity.ok().body(deletedCarId);
	}
	
	@GetMapping("/getBrands")
	public ResponseEntity<?> getBrands() {
		return ResponseEntity.ok().body(adminService.getBrands());
	}
	
	@PostMapping("/addBrand")
	public ResponseEntity<?> addBrand(@RequestBody String brandName) {
		URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/admin/addBrand").toUriString());
		Brand savedBrand = adminService.saveBrand(brandName);
		if (savedBrand != null) {
			return ResponseEntity.created(uri).body(savedBrand);
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Error("Vec postoji marka automobila!"));
		}
	}
	
	@DeleteMapping("/deleteBrand/{brandName}")
	public ResponseEntity<?> deleteBrand(@PathVariable String brandName) {
		Long deletedBrandId = adminService.deleteBrand(brandName);
		if (deletedBrandId != null) {
			return ResponseEntity.ok().body(deletedBrandId);
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Error("Postoje modeli tog brenda!"));
		}
	}
	
	@GetMapping("/getModels/{brandName}")
	public ResponseEntity<?> getModels(@PathVariable String brandName) {
		return ResponseEntity.ok().body(adminService.getModels(brandName));
	}
	
	@PostMapping("/addModel")
	public ResponseEntity<?> addModel(@RequestBody ModelData modelData) {
		URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/admin/addModel").toUriString());
		Model savedModel = adminService.addModelToBrand(modelData.getBrandName(), modelData.getModelName());
		if (savedModel != null) {
			return ResponseEntity.created(uri).body(savedModel);
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Error("Vec postoji model automobila!"));
		}
	}
	
	@DeleteMapping("/deleteModel/{brandName}/{modelName}")
	public ResponseEntity<?> deleteModel(@PathVariable("brandName") String brandName, @PathVariable("modelName") String modelName) {
		log.info(brandName + "    " + modelName);
		Long deletedModelId = adminService.deleteModelFromBrand(brandName, modelName);
		if (deletedModelId != null) {
			return ResponseEntity.ok().body(deletedModelId);
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Error("Postoje oglasi tog modela!"));
		}
	}
	
	@GetMapping("/getFuelTypes")
	public ResponseEntity<?> getFuelTypes() {
		return ResponseEntity.ok().body(adminService.getFuelTypes());
	}
	
	@PostMapping("/addFuelType")
	public ResponseEntity<?> addFuelType(@RequestBody String fuelType) {
		URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/admin/addFuelType").toUriString());
		Fuel savedFuel = adminService.saveFuel(fuelType);
		if (savedFuel != null) {
			return ResponseEntity.created(uri).body(savedFuel);
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Error("Vec postoji tip goriva!"));
		}
	}
	
	@DeleteMapping("/deleteFuelType/{fuelType}")
	public ResponseEntity<?> deleteFuelType(@PathVariable String fuelType) {
		Long deletedFuelId = adminService.deleteFuel(fuelType);
		if (deletedFuelId != null) {
			return ResponseEntity.ok().body(deletedFuelId);
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Error("Postoje oglasi sa tim tipom goriva!"));
		}
	}
	
	@GetMapping("/getColors")
	public ResponseEntity<?> getColors() {
		return ResponseEntity.ok().body(adminService.getColors());
	}
	
	@PostMapping("/addColor")
	public ResponseEntity<?> addColor(@RequestBody String colorName) {
		URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/admin/addColor").toUriString());
		Color savedColor = adminService.saveColor(colorName);
		if (savedColor != null) {
			return ResponseEntity.created(uri).body(savedColor);
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Error("Vec postoji boja!"));
		}
	}
	
	@DeleteMapping("/deleteColor/{colorName}")
	public ResponseEntity<?> deleteColor(@PathVariable String colorName) {
		Long deletedColorId = adminService.deleteColor(colorName);
		if (deletedColorId != null) {
			return ResponseEntity.ok().body(deletedColorId);
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Error("Postoje oglasi sa tom bojom!"));
		}
	}
}

@Data
class ModelData {
	private String brandName;
	private String modelName;
}

