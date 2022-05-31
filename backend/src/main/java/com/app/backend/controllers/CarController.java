package com.app.backend.controllers;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.app.backend.models.Car;
import com.app.backend.models.FrontCar;
import com.app.backend.models.User;
import com.app.backend.services.CarService;
import com.app.backend.services.UserService;
import com.app.backend.util.CarResponse;

import lombok.extern.slf4j.Slf4j;


@RestController
@RequestMapping("/api/cars")
@Slf4j
public class CarController {
	@Autowired
	private UserService userService;
	@Autowired
	private CarService carService;
	
	@PostMapping("/addCar")
	public ResponseEntity<?> addCar(@RequestParam(name = "image") MultipartFile image,
			@RequestParam(name = "car") String carData, @RequestHeader (name="Authorization") String authorizationHeader) {
		try {
			log.info(carData);
			User user = userService.getUserFromAuthorizationHeader(authorizationHeader);
			return ResponseEntity.ok().body(carService.addCar(image, carData, user));
		} catch (IOException ex) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Error("Greska na serveru!"));
		}
	}
	
	@GetMapping("/getCar/{id}")
	public ResponseEntity<Car> getCar(@PathVariable Long id) {
		return ResponseEntity.ok().body(carService.getCar(id));
	}
	
	@GetMapping("/getCars")
	public ResponseEntity<CarResponse> getCars(@RequestParam(value = "pagesize", required = false) Integer pagesize,
			@RequestParam(value = "page", required = false) Integer page) {
		return ResponseEntity.ok().body(carService.getCars(page, pagesize));
	}
	
	@GetMapping("/getMyCars/{id}")
	public ResponseEntity<CarResponse> getMyCars(@PathVariable Long id, @RequestParam(value = "pagesize", required = false) Integer pagesize,
			@RequestParam(value = "page", required = false) Integer page) {
		User user = userService.getUserById(id);
		return ResponseEntity.ok().body(carService.getMyCars(user, page, pagesize));
	}
	
	@PutMapping("/updateCarImage/{id}")
	public ResponseEntity<?> updatePostImage(@PathVariable Long id, @RequestParam(name = "image") MultipartFile image,
			@RequestParam(name = "car") String carData, @RequestHeader (name="Authorization") String authorizationHeader) {
		User user = userService.getUserFromAuthorizationHeader(authorizationHeader);
		try {
			Car savedCar = carService.updateCarImage(id, image, carData, user);
			if (savedCar != null) {
				return ResponseEntity.ok().body(savedCar);
			} else {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new Error("Niste autorizovani!"));
			}
		} catch (IOException ex) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Error("Greska na serveru!"));
		}
	}

	@PutMapping("/updateCarNoImage/{id}")
	public ResponseEntity<?> updatePostNoImage(@PathVariable Long id, @RequestBody FrontCar frontCar, @RequestHeader (name="Authorization") String authorizationHeader) {
		User user = userService.getUserFromAuthorizationHeader(authorizationHeader);
		Car savedCar = carService.updateCarNoImage(id, frontCar, user);
		if (savedCar != null) {
			return ResponseEntity.ok().body(savedCar);
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new Error("Niste autorizovani!"));
		} 
	}
	
	@DeleteMapping("/deleteCar/{id}")
	public ResponseEntity<?> deleteCar(@PathVariable Long id, @RequestHeader (name="Authorization") String authorizationHeader) {
		User user = userService.getUserFromAuthorizationHeader(authorizationHeader);
		Long deletedCarId = carService.deleteCar(id, user);
		if (deletedCarId != null) {
			return ResponseEntity.ok().body(deletedCarId);
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new Error("Niste autorizovani!"));
		}
	}
}
