package com.app.backend.models;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	private String firstName;
	private String lastName;
	@JsonIgnore
	private String username;
	@JsonIgnore
	private String password;
	@JsonIgnore
	private LocalDate brithdate;
	private String city;
	private String country;
	private Boolean banned;
	@ManyToMany(fetch = FetchType.EAGER)
	@JsonIgnore
	private Collection<Role> roles = new ArrayList<>();
}
