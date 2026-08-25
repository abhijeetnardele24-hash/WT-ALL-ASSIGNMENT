package com.vit.result.controller;

import com.vit.result.entity.Student;
import com.vit.result.repository.StudentRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentRepository studentRepository;

    public StudentController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('STUDENT', 'FACULTY')")
    public Student getMe(Authentication authentication) {
        String prnNumber = authentication.getName();
        return studentRepository.findByPrnNumber(prnNumber)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }
}
