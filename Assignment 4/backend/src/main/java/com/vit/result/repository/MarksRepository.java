package com.vit.result.repository;

import com.vit.result.entity.Marks;
import com.vit.result.entity.Student;
import com.vit.result.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MarksRepository extends JpaRepository<Marks, Long> {
    List<Marks> findByStudent(Student student);
    Optional<Marks> findByStudentAndSubject(Student student, Subject subject);
}
