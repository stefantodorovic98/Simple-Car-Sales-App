package com.app.backend.util;

import java.util.List;

import com.app.backend.models.Car;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarResponse {
	private List<Car> cars;
	private Long count;
}
