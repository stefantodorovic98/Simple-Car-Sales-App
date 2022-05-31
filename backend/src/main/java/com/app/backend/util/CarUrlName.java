package com.app.backend.util;

import com.app.backend.models.Car;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarUrlName {
	private Car car;
	private String fileName;
}
