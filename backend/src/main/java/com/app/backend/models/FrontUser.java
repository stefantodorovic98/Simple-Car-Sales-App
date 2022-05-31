package com.app.backend.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FrontUser {
	private Long id;
	private String firstName;
	private String lastName;
	private Long timestamp;
	private String city;
	private String country;
}
