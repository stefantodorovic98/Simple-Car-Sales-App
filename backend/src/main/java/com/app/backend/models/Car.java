package com.app.backend.models;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Car {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	private String title;
	@ManyToOne(fetch = FetchType.EAGER)
	private Brand brand;
	@ManyToOne(fetch = FetchType.EAGER)
	private Model model;
	private Long mileage;
	private Long registration;
	private Long price;
	@ManyToOne(fetch = FetchType.EAGER)
	private Fuel fuel;
	@ManyToOne(fetch = FetchType.EAGER)
	private Color color;
	private String phone;
	private String content;
	private String path;
	@ManyToOne(fetch = FetchType.EAGER)
	private User owner;
}
