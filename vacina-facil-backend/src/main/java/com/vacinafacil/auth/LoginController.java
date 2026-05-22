package com.vacinafacil.auth;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/")
@CrossOrigin("*")
@RequiredArgsConstructor 
public class LoginController {

	  private final LoginService loginService;
	  private final PasswordEncoder passwordEncoder;
 
	  

	    @PostMapping("/login")
	    public ResponseEntity<?> logar(@RequestBody Login login) {
	    try { 
	        String token = loginService.logar(login);
	         return ResponseEntity.ok(token); 
 
	    } catch (Exception e) { 
	        Map<String, String> error = new HashMap<>();
	        error.put("error", e.getMessage());
	        return ResponseEntity.badRequest().body(error);
	    }        
	    }   
}
