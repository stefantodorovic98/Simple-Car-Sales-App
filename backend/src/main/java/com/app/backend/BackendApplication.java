package com.app.backend;

import java.time.LocalDate;
import java.time.Month;
import java.util.ArrayList;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.app.backend.models.Role;
import com.app.backend.models.User;
import com.app.backend.services.AdminService;
import com.app.backend.services.UserService;


@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}
	
	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
	
	@Bean
	CommandLineRunner run(UserService userService, AdminService adminService) {
		return args -> {
			userService.saveRole(new Role(null, "ROLE_USER"));
			userService.saveRole(new Role(null, "ROLE_ADMIN"));
			
			userService.saveUser(new User(null, "Admin", "Admin", "admin@mail.com", "1234",
					LocalDate.of(1999, Month.FEBRUARY, 16), "Beograd", "Srbija", false, new ArrayList<>()));
			userService.saveUser(new User(null, "Petar", "Petrovic", "petar@mail.com", "1234",
					LocalDate.of(1994, Month.OCTOBER, 21), "Beograd", "Srbija", false, new ArrayList<>()));
			userService.saveUser(new User(null, "Marko", "Markovic", "marko@mail.com", "1234",
					LocalDate.of(2001, Month.JANUARY, 3), "Novi Sad", "Srbija", false, new ArrayList<>()));
			
			userService.addRoleToUser("admin@mail.com", "ROLE_ADMIN");
			userService.addRoleToUser("admin@mail.com", "ROLE_USER");
			userService.addRoleToUser("petar@mail.com", "ROLE_USER");
			userService.addRoleToUser("marko@mail.com", "ROLE_USER");
			
			String[] fuelNames = {"Dizel", "Benzin", "Plin", "Hibrid", "Elektro"};
			for(String fuelName: fuelNames) {
				adminService.saveFuel(fuelName);
			}
			
			String[] colorNames = {"Crna", "Bela", "Siva", "Crvena", "Plava", "Zelena"};
			for(String colorName: colorNames) {
				adminService.saveColor(colorName);
			}
			
			String[] carBrands = {"Audi", "BMW", "Citroen", "Fiat", "Ford", "Hyundai", "Kia", "Mazda", "Mercedes-Benz",
					"Nissan", "Opel", "Peugeot", "Renault", "Skoda", "Toyota", "Volkswagen", "Volvo"};
			for(String brand: carBrands) {
				adminService.saveBrand(brand);
			}
			
			String[] audiModels = {"TT", "100", "200", "80", "90", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8",
					"Q2", "Q3", "Q5", "Q7", "Q8", "S2", "S3", "S4", "S5", "S6", "S7", "S8"};
			for(String model: audiModels) {
				adminService.addModelToBrand("Audi", model);
			}
			
			String[] bmwModels = {"Z1", "Z3", "Z4", "Z8", "M1", "M3", "M5", "M6", "X5", "X6", "116", "118", "120",
					"218", "220", "316", "318", "320", "518", "520", "628", "630", "728", "730"};
			for(String model: bmwModels) {
				adminService.addModelToBrand("BMW", model);
			}
			
			String[] citroenModels = {"Berlingo", "C1", "C2", "C3", "C4", "C5", "C6", "C8", "Cactus"};
			for(String model: citroenModels) {
				adminService.addModelToBrand("Citroen", model);
			}
			
			String[] fiatModels = {"500", "500L", "Bravo", "Croma", "Marea", "Multipla", "Panda", "Punto", "Stilo", "Tipo"};
			for(String model: fiatModels) {
				adminService.addModelToBrand( "Fiat", model);
			}
			
			String[] fordModels = {"Escort", "Explorer", "Fiesta", "Focus", "Galaxy", "Kuga", "Mondeo", "Mustang", "Sierra", "Taurus"};
			for(String model: fordModels) {
				adminService.addModelToBrand("Ford", model);
			}
			
			String[] hyundaiModels = {"Elantra", "i10", "i20", "i30", "i40", "i50", "ix20", "ix35", "ix55", "Tucson"};
			for(String model: hyundaiModels) {
				adminService.addModelToBrand("Hyundai", model);
			}
			
			String[] kiaModels = {"Ceed", "Roadster", "Sorento", "Sportage"};
			for(String model: kiaModels) {
				adminService.addModelToBrand("Kia", model);
			}
			
			String[] mazdaModels = {"323", "626", "929", "CX-3", "CX-30", "CX-5", "CX-7", "CX-9", "MX-3", "MX-5", "MX-6",
					"RX-6", "RX-7", "RX-8"};
			for(String model: mazdaModels) {
				adminService.addModelToBrand("Mazda", model);
			}
			
			String[] mercedesModels = {"A 180", "A 190", "A 200", "B 180", "B 200", "C 180", "C 200", "C 220", "CLC 180",
					"CLC 200", "CLK 200", "CLK 220", "CLS 250", "CLS 280", "E 200", "E 220", "G 230", "G 250", "S 350", "S 400"};
			for(String model: mercedesModels) {
				adminService.addModelToBrand("Mercedes-Benz", model);
			}
			
			String[] nissanModels = {"Almera", "Altima", "GT-R", "Juke", "Micra", "Murano", "Navara", "Pathfinder",
					"Qashqai", "Skyline", "Terrano", "X-Trail"};
			for(String model: nissanModels) {
				adminService.addModelToBrand("Nissan", model);
			}
			
			String[] opelModels = {"Ascona", "Astra", "Corsa", "Crossland X", "GT", "Insignia", "Kadett", "Meriva", "Mokka",
					"Omega", "Speedster", "Tigra", "Vectra", "Vivaro", "Zafira"};
			for(String model: opelModels) {
				adminService.addModelToBrand("Opel", model);
			}
			
			String[] peugeotModels = {"1007", "104", "106", "107", "2008", "205", "206", "207", "208", "3008", "305", "306",
					"301", "307", "308", "4007", "4008", "405", "406", "407", "5008", "505", "508", "607", "Boxer"};
			for(String model: peugeotModels) {
				adminService.addModelToBrand("Peugeot", model);
			}
			
			String[] renaultModels = {"Clio", "Espace", "Fluence", "Kadjar", "Kangoo", "Laguna", "Megane", "Scenic", "Talisman",
					"Thalia", "Twingo"};
			for(String model: renaultModels) {
				adminService.addModelToBrand("Renault", model);
			}
			
			String[] skodaModels = {"Fabia", "Felicia", "Kamiq", "Kodiaq", "Octavia", "Rapid", "Superb", "Yeti"};
			for(String model: skodaModels) {
				adminService.addModelToBrand("Skoda", model);
			}
			
			String[] toyotaModels = {"Auris", "Avensis", "Aygo", "Celica", "Corolla", "Highlander", "Land Cruiser", "Prius",
					"RAV 4", "Verso", "Yaris"};
			for(String model: toyotaModels) {
				adminService.addModelToBrand("Toyota", model);
			}
			
			String[] volkswagenModels = {"Amarok", "Arteon", "Beetle", "Bora", "Caddy", "Eos", "Golf", "Jetta", "Lupo", "Passat",
					"Polo", "Scirocco", "Sharan", "T-Cross", "T-Roc", "Tiguan", "Touareg", "Touran", "Vento"};
			for(String model: volkswagenModels) {
				adminService.addModelToBrand("Volkswagen", model);
			}
			
			String[] volvoModels = {"C30, C70", "S40", "S60", "S70", "S80", "S90", "V40", "V50", "V60", "V70", "V90", "XC40",
					"XC60", "XC70", "XC90"};
			for(String model: volvoModels) {
				adminService.addModelToBrand("Volvo", model);
			}
		};
	}

}
