package com.vit.result;

import com.vit.result.model.StudentResult;
import com.vit.result.service.StudentResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private StudentResultService service;

    @Override
    public void run(String... args) throws Exception {
        // Check if database is empty to avoid duplicating data on multiple restarts
        if (service.getAllResults().isEmpty()) {
            
            // Student 1 (Excellent)
            StudentResult s1 = new StudentResult();
            s1.setStudentName("Abhijeet Nardele");
            s1.setRollNumber("VIT001");
            s1.setSub1Mse(28.0); s1.setSub1Ese(65.0);
            s1.setSub2Mse(27.0); s1.setSub2Ese(68.0);
            s1.setSub3Mse(29.0); s1.setSub3Ese(66.0);
            s1.setSub4Mse(25.0); s1.setSub4Ese(62.0);
            service.saveResult(s1);

            // Student 2 (Very Good)
            StudentResult s2 = new StudentResult();
            s2.setStudentName("John Doe");
            s2.setRollNumber("VIT002");
            s2.setSub1Mse(22.0); s2.setSub1Ese(50.0);
            s2.setSub2Mse(24.0); s2.setSub2Ese(55.0);
            s2.setSub3Mse(21.0); s2.setSub3Ese(52.0);
            s2.setSub4Mse(25.0); s2.setSub4Ese(58.0);
            service.saveResult(s2);

            // Student 3 (Average)
            StudentResult s3 = new StudentResult();
            s3.setStudentName("Jane Smith");
            s3.setRollNumber("VIT003");
            s3.setSub1Mse(15.0); s3.setSub1Ese(35.0);
            s3.setSub2Mse(18.0); s3.setSub2Ese(40.0);
            s3.setSub3Mse(14.0); s3.setSub3Ese(38.0);
            s3.setSub4Mse(16.0); s3.setSub4Ese(42.0);
            service.saveResult(s3);

            // Student 4 (Pass)
            StudentResult s4 = new StudentResult();
            s4.setStudentName("Alex Johnson");
            s4.setRollNumber("VIT004");
            s4.setSub1Mse(12.0); s4.setSub1Ese(28.0);
            s4.setSub2Mse(14.0); s4.setSub2Ese(30.0);
            s4.setSub3Mse(10.0); s4.setSub3Ese(29.0);
            s4.setSub4Mse(15.0); s4.setSub4Ese(32.0);
            service.saveResult(s4);

            // Student 5 (Fail)
            StudentResult s5 = new StudentResult();
            s5.setStudentName("Michael Brown");
            s5.setRollNumber("VIT005");
            s5.setSub1Mse(8.0); s5.setSub1Ese(20.0);
            s5.setSub2Mse(10.0); s5.setSub2Ese(25.0);
            s5.setSub3Mse(5.0); s5.setSub3Ese(18.0);
            s5.setSub4Mse(9.0); s5.setSub4Ese(22.0);
            service.saveResult(s5);

            System.out.println("✅ 5 Fake Student Records have been successfully injected into the database!");
        }
    }
}
