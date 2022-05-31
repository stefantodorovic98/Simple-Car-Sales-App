package com.app.backend.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignupData {
	String firstName;
	String lastName;
	String username;
	String password;
	Long timestamp;
	String city;
	String country;
}
