package com.app.backend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService; 
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.app.backend.filters.CustomAuthenticationFilter;
import com.app.backend.filters.CustomAuthorizationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
	@Autowired
	private UserDetailsService userDetailsService;
	@Autowired
	private PasswordEncoder passwordEncoder;

	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder);
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		CustomAuthenticationFilter customAuthenticationFilter = new CustomAuthenticationFilter(authenticationManagerBean());
		customAuthenticationFilter.setFilterProcessesUrl("/api/users/login");
		http.csrf().disable();
		http.cors();
		http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
		http.authorizeRequests().antMatchers("/api/users/login/**", "/api/users/signup/**",  "/error").permitAll();
		http.authorizeRequests().antMatchers(HttpMethod.GET, "/api/users/logout/**").permitAll();
		http.authorizeRequests().antMatchers(HttpMethod.GET, "/api/users/getUserId/**", "/api/users/hasAdminPrivilege",
				"/api/users/getUserById/**").hasAnyAuthority("ROLE_USER");
		http.authorizeRequests().antMatchers(HttpMethod.POST, "/api/users/changePassword/**").hasAnyAuthority("ROLE_USER");
		http.authorizeRequests().antMatchers(HttpMethod.PUT, "/api/users/updateUser/**").hasAnyAuthority("ROLE_USER");
		http.authorizeRequests().antMatchers(HttpMethod.GET, "/api/users/allUsers/**", "/api/role/save/**",
				"/api/role/addtouser/**").hasAnyAuthority("ROLE_ADMIN");
		http.authorizeRequests().antMatchers(HttpMethod.POST, "/api/cars/addCar/**").hasAnyAuthority("ROLE_USER");
		http.authorizeRequests().antMatchers(HttpMethod.GET, "/api/cars/getCar/**", "/api/cars/getCars/**",
				"/api/cars/getMyCars/**", "/images/**").permitAll();
		http.authorizeRequests().antMatchers(HttpMethod.PUT, "/api/cars/updateCarImage/**", "/api/cars/updateCarNoImage/**").hasAnyAuthority("ROLE_USER");
		http.authorizeRequests().antMatchers(HttpMethod.DELETE, "/api/cars/deleteCar/**").hasAnyAuthority("ROLE_USER");
		http.authorizeRequests().antMatchers(HttpMethod.GET, "/api/admin/getUsers/**", "/api/admin/blockUser/**", "/api/admin/unblockUser/**").hasAnyAuthority("ROLE_ADMIN");
		http.authorizeRequests().antMatchers(HttpMethod.GET, "/api/admin/getBrands/**", "/api/admin/getModels/**",
				"/api/admin/getFuelTypes/**", "/api/admin/getColors/**").hasAnyAuthority("ROLE_USER");
		http.authorizeRequests().antMatchers(HttpMethod.POST, "/api/admin/addBrand/**", "/api/admin/addModel/**",
				"/api/admin/addFuelType/**", "/api/admin/addColor/**").hasAnyAuthority("ROLE_ADMIN");
		http.authorizeRequests().antMatchers(HttpMethod.DELETE, "/api/admin/deleteBrand/**", "/api/admin/deleteModel/**",
				"/api/admin/deleteFuelType/**", "/api/admin/deleteColor/**").hasAnyAuthority("ROLE_ADMIN");
		http.authorizeRequests().anyRequest().authenticated();
		http.addFilter(customAuthenticationFilter);
		http.addFilterBefore(new CustomAuthorizationFilter(), UsernamePasswordAuthenticationFilter.class);
		    
	}
	
	@Bean
	@Override
	public AuthenticationManager authenticationManagerBean() throws Exception {
		return super.authenticationManagerBean();
	}

}
