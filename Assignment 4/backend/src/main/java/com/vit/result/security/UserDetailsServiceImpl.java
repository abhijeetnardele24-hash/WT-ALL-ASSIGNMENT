package com.vit.result.security;

import com.vit.result.entity.Student;
import com.vit.result.repository.StudentRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final StudentRepository studentRepository;

    public UserDetailsServiceImpl(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String prnNumber) throws UsernameNotFoundException {
        Student student = studentRepository.findByPrnNumber(prnNumber)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with PRN: " + prnNumber));

        return new User(
                student.getPrnNumber(),
                student.getPasswordHash(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + student.getRole()))
        );
    }
}
