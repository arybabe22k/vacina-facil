package com.vacinafacil.auth;

import java.time.LocalDateTime;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import com.vacinafacil.authConfig.JwtServiceGenerator;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor 
public class LoginService {

	private final loginRepository repository;
	
	private final JwtServiceGenerator jwtService;
	
	private final AuthenticationManager authenticationManager;
	 
	private final PasswordEncoder passwordEncoder;
	
	
	
   @Transactional 
	public String logar(@Valid Login login) {
	    Usuario user = repository.findByUsername(login.getUsername())
	            .orElseThrow(() ->  new RuntimeException("Usuário não encontrado"));
     
	    // Verifica se a conta está bloqueada
	    if (user.getTentativasLogin() == 5) {   
	        throw new RuntimeException("Conta bloqueada devido a múltiplas tentativas de login");
	    }   
	    if(!user.isAccountNonLocked()) {
	    	  throw new RuntimeException("Conta bloqueada");
	    }
	    if(!user.isEnabled()) {
	    	throw new RuntimeException("Conta desativada solicite um administrador");
	    }
          try {
	        // Tenta autenticar (gerar token)
	        String token = this.gerarToken(login);
	       
	        user.setTentativasLogin(0);   
	         
	        user.setUltimoAcesso(LocalDateTime.now());
	        this.repository.save(user);  
	        
	        return token;
	    } catch (Exception e) {
	   
	        user.incrementarTentativasLogin();
	        this.repository.save(user);
	        
	        throw new RuntimeException("Credenciais inválidas");
	    }
	} 

@Transactional 
public String gerarToken(@Valid Login login) {
    try { 
        // Autenticação com tratamento de erro
    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            login.getUsername(),
            login.getPassword()
        )    
    );
    
    //  Buscar usuário 
		Usuario user = repository.findByUsername(login.getUsername())
		    .orElseThrow(() -> new UsernameNotFoundException(
		        "Usuário não encontrado: " + login.getUsername()));
		
		// Validar se o usuário está ativo
		if (!user.isEnabled()) {
		    throw new DisabledException("Usuário desativado: " + login.getUsername());
		}
		//validar se o usuario esta bloqueada
		else if(user.getContaBloqueada()==true) {
		 throw new DisabledException("Conta bloqueada porfavor entre em Contato com o administrador: "+login.getUsername());	
		} 
		 
		// Gerar token JWT
		    String jwtToken = jwtService.generateToken(user);
		    
		    return jwtToken;
		    
		} catch (BadCredentialsException e) {
		   
		    throw new BadCredentialsException("Credenciais inválidas para usuário: " + login.getUsername());
		} catch (DisabledException e) {
		    throw new DisabledException("Conta desativada: " + login.getUsername());
		} catch (LockedException e) {
		    throw new LockedException("Conta bloqueada: " + login.getUsername());
		}
	}
}
