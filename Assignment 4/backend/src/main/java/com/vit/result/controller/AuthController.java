package com.vit.result.controller;

import com.vit.result.dto.AuthResponse;
import com.vit.result.dto.LoginRequest;
import com.vit.result.entity.Student;
import com.vit.result.repository.StudentRepository;
import com.vit.result.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final StudentRepository studentRepository;

    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil, StudentRepository studentRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.studentRepository = studentRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getPrnNumber(), request.getPassword())
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            Student student = studentRepository.findByPrnNumber(request.getPrnNumber()).orElseThrow();
            
            String token = jwtUtil.generateToken(userDetails, student.getRole());
            
            return ResponseEntity.ok(new AuthResponse(token, student.getPrnNumber(), student.getName(), student.getRole()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid PRN or Password");
        }
    }
}
