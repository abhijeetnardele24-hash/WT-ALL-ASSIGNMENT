package com.vit.result.config;

import com.vit.result.entity.Marks;
import com.vit.result.entity.Student;
import com.vit.result.entity.Subject;
import com.vit.result.repository.MarksRepository;
import com.vit.result.repository.StudentRepository;
import com.vit.result.repository.SubjectRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final MarksRepository marksRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(StudentRepository studentRepository, SubjectRepository subjectRepository,
                      MarksRepository marksRepository, PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.subjectRepository = subjectRepository;
        this.marksRepository = marksRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (subjectRepository.count() == 0) {
            logger.info("Seeding data...");

            // 1. Seed Subjects
            List<Subject> subjects = new ArrayList<>();
            subjects.add(createSubject("CS3212", "PCC: Design and Analysis of Algorithm", 4));
            subjects.add(createSubject("CS3213", "PCC: Computer Networks", 3));
            subjects.add(createSubject("CS3111", "PEC1: Web Technologies", 4));
            subjects.add(createSubject("CS3112", "PEC1: Mainframe Technology", 4));
            subjectRepository.saveAll(subjects);
            
            // 2. Seed Students and Marks
            String defaultPassword = "Vit@1234";
            String hashedPassword = passwordEncoder.encode(defaultPassword);
            Random random = new Random();

            System.out.println("==========================================================");
            System.out.println("                   GENERATED CREDENTIALS                  ");
            System.out.println("==========================================================");
            System.out.println(String.format("%-15s | %-15s | %-10s", "PRN Number", "Password", "Role"));
            System.out.println("----------------------------------------------------------");

            for (int i = 1; i <= 10; i++) {
                String prn = String.format("23BCE%04d", i);
                Student student = new Student();
                student.setPrnNumber(prn);
                student.setName("Student " + i);
                student.setEmail("student" + i + "@vit.edu");
                student.setPasswordHash(hashedPassword);
                student.setRole("STUDENT");
                student = studentRepository.save(student);

                System.out.println(String.format("%-15s | %-15s | %-10s", prn, defaultPassword, student.getRole()));

                // Seed marks for each subject
                for (Subject subject : subjects) {
                    Marks marks = new Marks();
                    marks.setStudent(student);
                    marks.setSubject(subject);
                    
                    // MSE: 0-50, ESE: 0-100
                    // Let's make the marks somewhat realistic (e.g., MSE between 20 and 50, ESE between 40 and 100)
                    double mseValue = 20 + (30 * random.nextDouble());
                    double eseValue = 40 + (60 * random.nextDouble());
                    
                    marks.setMse(BigDecimal.valueOf(mseValue));
                    marks.setEse(BigDecimal.valueOf(eseValue));
                    
                    marksRepository.save(marks);
                }
            }

            // Also seed one faculty admin
            Student faculty = new Student();
            faculty.setPrnNumber("FACULTY01");
            faculty.setName("Admin Faculty");
            faculty.setPasswordHash(hashedPassword);
            faculty.setRole("FACULTY");
            studentRepository.save(faculty);
            
            System.out.println(String.format("%-15s | %-15s | %-10s", "FACULTY01", defaultPassword, "FACULTY"));
            System.out.println("==========================================================");
            logger.info("Data seeding completed.");
        } else {
            logger.info("Database is already seeded.");
        }
    }

    private Subject createSubject(String code, String name, int credits) {
        Subject subject = new Subject();
        subject.setCode(code);
        subject.setName(name);
        subject.setCredits(credits);
        return subject;
    }
}
