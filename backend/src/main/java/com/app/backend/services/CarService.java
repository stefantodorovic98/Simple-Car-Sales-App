package com.app.backend.services;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

import com.app.backend.models.Car;
import com.app.backend.models.FrontCar;
import com.app.backend.models.User;
import com.app.backend.util.CarResponse;

public interface CarService {
	Car addCar(MultipartFile image, String carData, User user) throws IOException;
	Car getCar(Long id);
	CarResponse getCars(Integer page, Integer pagesize);
	CarResponse getMyCars(User user, Integer page, Integer pagesize);
	Car updateCarImage(Long id, MultipartFile image, String carData, User user) throws IOException;
	Car updateCarNoImage(Long id, FrontCar frontCar, User user);
	Long deleteCar(Long id, User user);
}
