package com.app.backend.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FrontCar {
	private Long id;
	private String title;
	private String brand;
	private String model;
	private Long mileage;
	private Long registration;
	private Long price;
	private String fuel;
	private String color;
	private String phone;
	private String content;
	private String path;
	private Long owner_id;
}
