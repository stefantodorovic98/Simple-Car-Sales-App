package com.app.backend.services;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.app.backend.models.Brand;
import com.app.backend.models.Car;
import com.app.backend.models.Color;
import com.app.backend.models.FrontCar;
import com.app.backend.models.Fuel;
import com.app.backend.models.Model;
import com.app.backend.models.User;
import com.app.backend.repositories.BrandRepository;
import com.app.backend.repositories.CarRepository;
import com.app.backend.repositories.ColorRepository;
import com.app.backend.repositories.FuelRepository;
import com.app.backend.repositories.ModelRepository;
import com.app.backend.util.CarResponse;
import com.app.backend.util.CarUrlName;
import com.app.backend.util.FileUploadUtil;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class CarServiceImpl implements CarService {
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
	
	@SuppressWarnings("serial")
	private Map<String, String> mimeTypes = new HashMap<String, String>() {
		{
			put("image/png", "png");
			put("image/jpeg", "jpg");
			put("image/jpg", "jpg");
		}
	};

	@Override
	public Car addCar(MultipartFile image, String carData, User user) throws IOException {
		CarUrlName temp = new CarUrlName();
		getCarFileName(image, carData, temp);
		temp.getCar().setOwner(user);
		Car savedCar = carRepository.save(temp.getCar());
		saveImage(temp.getFileName(), image);
		log.info("Add car");
		return savedCar;
	}
	
	@Override
	public Car getCar(Long id) {
		log.info("Get car");
		return carRepository.getById(id);
	}
	
	@Override
	public CarResponse getCars(Integer page, Integer pagesize) {
		Pageable pageable = PageRequest.of(page, pagesize);
		Page<Car> cars = carRepository.findAll(pageable);
		CarResponse response = new CarResponse(); 
		response.setCars(cars.getContent());
		response.setCount(cars.getTotalElements());
		log.info("Get cars");
		return response;
	}

	@Override
	public CarResponse getMyCars(User user, Integer page, Integer pagesize) {
		Pageable pageable = PageRequest.of(page, pagesize);
		Page<Car> cars = carRepository.findByOwner(user, pageable);
		CarResponse response = new CarResponse();
		response.setCars(cars.getContent());
		response.setCount(cars.getTotalElements());
		log.info("Get my cars");
		return response;
	}
	
	@Override
	public Car updateCarImage(Long id, MultipartFile image, String carData, User user) throws IOException {
		CarUrlName temp = new CarUrlName();
		getCarFileName(image, carData, temp);
		Car c = carRepository.getById(id);
		Car newCar = temp.getCar();
		c.setTitle(newCar.getTitle());
		c.setBrand(newCar.getBrand());
		c.setModel(newCar.getModel());
		c.setPath(newCar.getPath());
		c.setMileage(newCar.getMileage());
		c.setRegistration(newCar.getRegistration());
		c.setPrice(newCar.getPrice());
		c.setFuel(newCar.getFuel());
		c.setColor(newCar.getColor());
		c.setPhone(newCar.getPhone());
		c.setContent(newCar.getContent());
		if (user.getId() != c.getOwner().getId()) return null;
		Car savedCar = carRepository.save(c);
		saveImage(temp.getFileName(), image);
		log.info("Update car image");
		return savedCar;
	}

	@Override
	public Car updateCarNoImage(Long id, FrontCar frontCar, User user) {
		Car c = carRepository.getById(id);
		if (user.getId() != c.getOwner().getId()) return null;
		c.setTitle(frontCar.getTitle());
		Brand brand = brandRepository.findByName(frontCar.getBrand());
		c.setBrand(brand);
		Model model = modelRepository.findByName(frontCar.getModel());
		c.setModel(model);
		c.setMileage(frontCar.getMileage());
		c.setRegistration(frontCar.getRegistration());
		c.setPrice(frontCar.getPrice());
		Fuel fuel = fuelRepository.findByName(frontCar.getFuel());
		c.setFuel(fuel);
		Color color = colorRepository.findByName(frontCar.getColor());
		c.setColor(color);
		c.setPhone(frontCar.getPhone());
		c.setContent(frontCar.getContent());
		Car savedCar = carRepository.save(c);
		log.info("Update car no image");
		return savedCar;
	}
	
	@Override
	public Long deleteCar(Long id, User user) {
		Car p = carRepository.getById(id);
		if (user.getId() != p.getOwner().getId()) return null;
		carRepository.deleteById(id);
		log.info("Delete car");
		return id;
	}
	
	private void getCarFileName(MultipartFile image, String carData, CarUrlName temp) throws IOException {
		Car car = getCarFromString(carData);
		temp.setCar(car);
		String name = StringUtils.cleanPath(image.getOriginalFilename());
		Tika tika = new Tika();
		String ext = mimeTypes.get(tika.detect(image.getBytes()));
		temp.setFileName(name + "-" + System.currentTimeMillis() + "." + ext);
		temp.getCar().setPath("http://localhost:8081/images/" + temp.getFileName());
	}
	
	private void saveImage(String fileName, MultipartFile image) throws IOException {
		String uploadDir = "images";
		FileUploadUtil.saveFile(uploadDir, fileName, image);
	}
	
	private Car getCarFromString(String carData) throws IOException {
		FrontCar frontCar = new ObjectMapper().readValue(carData, FrontCar.class);
		Car car = new Car();
		car.setId(frontCar.getId());
		car.setTitle(frontCar.getTitle());
		Brand brand = brandRepository.findByName(frontCar.getBrand());
		car.setBrand(brand);
		Model model = modelRepository.findByName(frontCar.getModel());
		car.setModel(model);
		car.setMileage(frontCar.getMileage());
		car.setRegistration(frontCar.getRegistration());
		car.setPrice(frontCar.getPrice());
		Fuel fuel = fuelRepository.findByName(frontCar.getFuel());
		car.setFuel(fuel);
		Color color = colorRepository.findByName(frontCar.getColor());
		car.setColor(color);
		log.info(frontCar.getPhone());
		car.setPhone(frontCar.getPhone());
		car.setContent(frontCar.getContent());
		return car;
	}
}
