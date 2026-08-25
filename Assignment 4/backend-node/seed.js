import sequelize from './config/db.js';
import { User, Subject, Marks, Attendance, FeeRecord, Notice } from './models/index.js';

const seedData = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await sequelize.authenticate();
    await sequelize.sync({ force: true }); // Clean slate for fresh rich enterprise structure

    console.log('Database synced. Seeding subjects across all 8 semesters...');

    // 1. Seed Comprehensive Subjects (Sem 1 - 8)
    const subjectsData = [
      // Semester 1
      { code: 'MATH101', name: 'Engineering Mathematics I', credits: 4, semester: 1, department: 'Computer Engineering', type: 'Core' },
      { code: 'PHY101', name: 'Engineering Physics & Quantum Mechanics', credits: 4, semester: 1, department: 'Computer Engineering', type: 'Core' },
      { code: 'BEE101', name: 'Basic Electrical & Electronics Engineering', credits: 3, semester: 1, department: 'Computer Engineering', type: 'Core' },
      { code: 'CS101', name: 'Problem Solving & Programming in C', credits: 4, semester: 1, department: 'Computer Engineering', type: 'Core' },
      { code: 'ENG101', name: 'Professional Communication Skills', credits: 2, semester: 1, department: 'Computer Engineering', type: 'Core' },

      // Semester 2
      { code: 'MATH201', name: 'Engineering Mathematics II', credits: 4, semester: 2, department: 'Computer Engineering', type: 'Core' },
      { code: 'CHEM201', name: 'Chemistry & Environmental Studies', credits: 3, semester: 2, department: 'Computer Engineering', type: 'Core' },
      { code: 'CS201', name: 'Object Oriented Programming with C++', credits: 4, semester: 2, department: 'Computer Engineering', type: 'Core' },
      { code: 'EC201', name: 'Digital Electronics & Logic Design', credits: 4, semester: 2, department: 'Computer Engineering', type: 'Core' },
      { code: 'MECH201', name: 'Engineering Graphics & 3D Modeling', credits: 3, semester: 2, department: 'Computer Engineering', type: 'Core' },

      // Semester 3
      { code: 'CS301', name: 'Discrete Mathematics & Graph Theory', credits: 4, semester: 3, department: 'Computer Engineering', type: 'Core' },
      { code: 'CS302', name: 'Data Structures & Algorithms', credits: 4, semester: 3, department: 'Computer Engineering', type: 'Core' },
      { code: 'CS303', name: 'Database Management Systems (DBMS)', credits: 4, semester: 3, department: 'Computer Engineering', type: 'Core' },
      { code: 'CS304', name: 'Computer Organization & Architecture', credits: 3, semester: 3, department: 'Computer Engineering', type: 'Core' },
      { code: 'CS305', name: 'Python Programming for Data Science', credits: 3, semester: 3, department: 'Computer Engineering', type: 'Core' },

      // Semester 4
      { code: 'CS401', name: 'Operating Systems & System Programming', credits: 4, semester: 4, department: 'Computer Engineering', type: 'Core' },
      { code: 'CS402', name: 'Design and Analysis of Algorithms (DAA)', credits: 4, semester: 4, department: 'Computer Engineering', type: 'Core' },
      { code: 'CS403', name: 'Formal Language & Automata Theory', credits: 4, semester: 4, department: 'Computer Engineering', type: 'Core' },
      { code: 'CS404', name: 'Software Engineering & Agile Methodologies', credits: 3, semester: 4, department: 'Computer Engineering', type: 'Core' },
      { code: 'CS405', name: 'Java Enterprise Development', credits: 3, semester: 4, department: 'Computer Engineering', type: 'Core' },

      // Semester 5
      { code: 'CS501', name: 'Computer Networks & Network Security', credits: 4, semester: 5, department: 'Computer Engineering', type: 'Core' },
      { code: 'CS502', name: 'Modern Web Technologies & React Stack', credits: 4, semester: 5, department: 'Computer Engineering', type: 'Core' },
      { code: 'CS503', name: 'Cloud Computing & Microservices Architecture', credits: 3, semester: 5, department: 'Computer Engineering', type: 'Core' },
      { code: 'CS504', name: 'Artificial Intelligence & Expert Systems', credits: 4, semester: 5, department: 'Computer Engineering', type: 'Professional Elective' },
      { code: 'CS505', name: 'Information & Cyber Security', credits: 3, semester: 5, department: 'Computer Engineering', type: 'Professional Elective' },

      // Semester 6
      { code: 'CS601', name: 'Machine Learning & Neural Networks', credits: 4, semester: 6, department: 'Computer Engineering', type: 'Core' },
      { code: 'CS602', name: 'Distributed Systems & High Performance Computing', credits: 4, semester: 6, department: 'Computer Engineering', type: 'Core' },
      { code: 'CS603', name: 'Big Data Analytics & Data Lakes', credits: 4, semester: 6, department: 'Computer Engineering', type: 'Core' },
      { code: 'CS604', name: 'Mobile Application Development with Flutter', credits: 3, semester: 6, department: 'Computer Engineering', type: 'Professional Elective' },
      { code: 'CS605', name: 'Full Stack Web Engineering & DevOps', credits: 4, semester: 6, department: 'Computer Engineering', type: 'Core' },

      // Semester 7
      { code: 'CS701', name: 'Deep Learning & Computer Vision', credits: 4, semester: 7, department: 'Computer Engineering', type: 'Core' },
      { code: 'CS702', name: 'Internet of Things (IoT) & Edge Computing', credits: 3, semester: 7, department: 'Computer Engineering', type: 'Core' },
      { code: 'CS703', name: 'Blockchain Technologies & Smart Contracts', credits: 3, semester: 7, department: 'Computer Engineering', type: 'Professional Elective' },
      { code: 'CS704', name: 'Major Capstone Project Stage I', credits: 4, semester: 7, department: 'Computer Engineering', type: 'Core' },

      // Semester 8
      { code: 'CS801', name: 'Natural Language Processing & Generative AI', credits: 4, semester: 8, department: 'Computer Engineering', type: 'Professional Elective' },
      { code: 'CS802', name: 'Quantum Computing & Algorithms', credits: 3, semester: 8, department: 'Computer Engineering', type: 'Open Elective' },
      { code: 'CS803', name: 'Industrial Internship & Capstone Project II', credits: 10, semester: 8, department: 'Computer Engineering', type: 'Core' }
    ];

    const createdSubjects = await Subject.bulkCreate(subjectsData);
    console.log(`Seeded ${createdSubjects.length} subjects.`);

    // 2. Seed Faculty & Admins
    console.log('Seeding Faculty and Admin accounts...');
    const staffData = [
      {
        prnNumber: 'ADMIN01',
        name: 'Prof. Vikramaditya Shinde',
        email: 'dean.academics@vit.edu',
        password: 'password123',
        role: 'ADMIN',
        department: 'Academic Administration',
        currentSemester: 6,
        batch: 'Faculty Staff',
        phone: '+91 94220 11223'
      },
      {
        prnNumber: 'FACULTY01',
        name: 'Dr. Rajesh Rao',
        email: 'rajesh.rao@vit.edu',
        password: 'password123',
        role: 'FACULTY',
        department: 'Computer Engineering',
        currentSemester: 6,
        batch: 'Department Head',
        phone: '+91 98231 44556'
      },
      {
        prnNumber: 'FACULTY02',
        name: 'Prof. Sunita Deshpande',
        email: 'sunita.deshpande@vit.edu',
        password: 'password123',
        role: 'FACULTY',
        department: 'Computer Engineering',
        currentSemester: 6,
        batch: 'Associate Professor',
        phone: '+91 98902 77889'
      }
    ];

    for (const staff of staffData) {
      await User.create(staff);
    }

    // 3. Seed 10 Realistic Students
    console.log('Seeding 10 Indian mock students with multi-semester records...');
    const studentsData = [
      { prnNumber: '12410733', name: 'Abhijeet Nardele', email: 'abhijeet.nardele24@vit.edu', password: 'password123', role: 'STUDENT', department: 'Computer Engineering', currentSemester: 4, batch: '2024-2028', phone: '+91 98000 00000', cgpa: 9.99 },
      { prnNumber: '23BCE0001', name: 'Aarav Sharma', email: 'aarav.sharma@vit.edu', password: 'password123', role: 'STUDENT', department: 'Computer Engineering', currentSemester: 6, batch: '2022-2026', phone: '+91 98111 22334', cgpa: 9.15 },
      { prnNumber: '23BCE0002', name: 'Ananya Iyer', email: 'ananya.iyer@vit.edu', password: 'password123', role: 'STUDENT', department: 'Computer Engineering', currentSemester: 6, batch: '2022-2026', phone: '+91 98222 33445', cgpa: 9.42 },
      { prnNumber: '23BCE0003', name: 'Rohan Deshmukh', email: 'rohan.deshmukh@vit.edu', password: 'password123', role: 'STUDENT', department: 'Computer Engineering', currentSemester: 6, batch: '2022-2026', phone: '+91 98333 44556', cgpa: 8.65 },
      { prnNumber: '23BCE0004', name: 'Priya Patil', email: 'priya.patil@vit.edu', password: 'password123', role: 'STUDENT', department: 'Computer Engineering', currentSemester: 6, batch: '2022-2026', phone: '+91 98444 55667', cgpa: 8.88 },
      { prnNumber: '23BCE0005', name: 'Siddharth Kulkarni', email: 'siddharth.k@vit.edu', password: 'password123', role: 'STUDENT', department: 'Computer Engineering', currentSemester: 6, batch: '2022-2026', phone: '+91 98555 66778', cgpa: 7.90 },
      { prnNumber: '23BCE0006', name: 'Tanvi Joshi', email: 'tanvi.joshi@vit.edu', password: 'password123', role: 'STUDENT', department: 'Computer Engineering', currentSemester: 6, batch: '2022-2026', phone: '+91 98666 77889', cgpa: 9.05 },
      { prnNumber: '23BCE0007', name: 'Aditya Verma', email: 'aditya.verma@vit.edu', password: 'password123', role: 'STUDENT', department: 'Computer Engineering', currentSemester: 6, batch: '2022-2026', phone: '+91 98777 88990', cgpa: 8.35 },
      { prnNumber: '23BCE0008', name: 'Sneha Nair', email: 'sneha.nair@vit.edu', password: 'password123', role: 'STUDENT', department: 'Computer Engineering', currentSemester: 6, batch: '2022-2026', phone: '+91 98888 99001', cgpa: 8.78 },
      { prnNumber: '23BCE0009', name: 'Varun Mehta', email: 'varun.mehta@vit.edu', password: 'password123', role: 'STUDENT', department: 'Computer Engineering', currentSemester: 6, batch: '2022-2026', phone: '+91 98999 00112', cgpa: 7.15 },
      { prnNumber: '23BCE0010', name: 'Ishita Gupta', email: 'ishita.gupta@vit.edu', password: 'password123', role: 'STUDENT', department: 'Computer Engineering', currentSemester: 6, batch: '2022-2026', phone: '+91 99000 11223', cgpa: 9.20 }
    ];

    const createdStudents = [];
    for (const student of studentsData) {
      const s = await User.create(student);
      createdStudents.push(s);
    }

    // 4. Seed Multi-Semester Marks & Attendance (Semesters 1 through 6)
    console.log('Seeding multi-semester academic records & attendance...');
    const allMarksToInsert = [];
    const allAttendanceToInsert = [];
    const allFeeRecordsToInsert = [];

    for (const student of createdStudents) {
      // Seed Semesters up to student's currentSemester
      for (let sem = 1; sem <= student.currentSemester; sem++) {
        const semSubjects = createdSubjects.filter(s => s.semester === sem);
        
        for (const sub of semSubjects) {
          // Marks
          const mseRaw = (Math.random() * 15 + 32).toFixed(2); // 32 to 47 out of 50
          const eseRaw = (Math.random() * 25 + 68).toFixed(2); // 68 to 93 out of 100
          const labRaw = (Math.random() * 6 + 18).toFixed(2);  // 18 to 24 out of 25

          allMarksToInsert.push({
            studentId: student.id,
            subjectId: sub.id,
            semester: sem,
            mse: mseRaw,
            ese: eseRaw,
            labWork: labRaw
          });

          // Attendance
          const conducted = Math.floor(Math.random() * 6 + 42); // 42-48
          const isLowAttendanceStudent = student.prnNumber === '23BCE0009' && (sub.code === 'CS602' || sub.code === 'CS604');
          const attended = isLowAttendanceStudent 
            ? Math.floor(conducted * 0.65) // 65% (Defaulter test)
            : Math.floor(conducted * (Math.random() * 0.18 + 0.80)); // 80% to 98%

          allAttendanceToInsert.push({
            studentId: student.id,
            subjectId: sub.id,
            semester: sem,
            totalConducted: conducted,
            totalAttended: attended
          });
        }

        // Fee Record for each semester
        allFeeRecordsToInsert.push({
          studentId: student.id,
          semester: sem,
          totalAmount: 85000.00,
          paidAmount: 85000.00,
          status: 'PAID',
          transactionId: `TXN-VIT-${sem}0${student.id}982`,
          paymentDate: `202${Math.floor(2 + (sem/2))}-0${((sem % 2 === 1) ? '7' : '1')}-15`,
          receiptNumber: `REC-202${Math.floor(2 + (sem/2))}-00${sem}${student.id}4`
        });
      }
    }

    await Marks.bulkCreate(allMarksToInsert);
    await Attendance.bulkCreate(allAttendanceToInsert);
    await FeeRecord.bulkCreate(allFeeRecordsToInsert);
    console.log(`Inserted ${allMarksToInsert.length} mark entries and ${allAttendanceToInsert.length} attendance records.`);

    // 5. Seed Official Notices
    console.log('Seeding official college notices...');
    const noticesData = [
      {
        title: 'Schedule for Summer 2026 End-Semester Examinations (ESE)',
        category: 'EXAM',
        content: 'The official timetable for Summer 2026 End-Semester Examinations across all B.Tech programs has been published. Digital Hall Tickets are now available in the Examination module for all eligible students who have cleared their tuition dues and maintained minimum 75% attendance.',
        author: 'Controller of Examinations',
        priority: 'URGENT',
        targetSemester: null,
        date: '2026-05-02'
      },
      {
        title: 'Final Seminar & Capstone Project Stage-I Report Submission',
        category: 'ACADEMIC',
        content: 'All Semester VI students of the Computer Engineering department are instructed to submit their final bound project documentation and software repositories to their assigned faculty mentors before May 20, 2026.',
        author: 'Dr. Rajesh Rao, HOD Computer Engineering',
        priority: 'HIGH',
        targetSemester: 6,
        date: '2026-04-28'
      },
      {
        title: 'Attendance Defaulter Review Meeting - Term II AY 2025-26',
        category: 'CIRCULAR',
        content: 'Students with aggregate attendance below 75% are required to report to the Department Academic Disciplinary Committee along with parents for remediation before examination hall tickets are released.',
        author: 'Dean of Student Welfare',
        priority: 'HIGH',
        targetSemester: null,
        date: '2026-04-25'
      },
      {
        title: 'Campus Placement Drive: Top Tier Tech Companies Visiting Next Week',
        category: 'PLACEMENT',
        content: 'Pre-placement talks and coding assessments for Microsoft, Google, Adobe, and Barclays will commence next Monday. Eligible students must update their academic resumes and verify their official CGPA on the portal.',
        author: 'Central Training & Placement Cell',
        priority: 'NORMAL',
        targetSemester: 6,
        date: '2026-04-18'
      },
      {
        title: 'Annual Inter-Collegiate Techno-Cultural Fest "MELANGE 2026"',
        category: 'EVENT',
        content: 'Get ready for Pune’s biggest college festival featuring over 50+ national hackathons, paper presentations, esports tournaments, and celebrity concerts. Register online on the portal.',
        author: 'VIT Student Council',
        priority: 'NORMAL',
        targetSemester: null,
        date: '2026-04-10'
      }
    ];

    await Notice.bulkCreate(noticesData);
    console.log(`Seeded ${noticesData.length} notices.`);

    console.log('----------------------------------------------------');
    console.log('🌟 ENTERPRISE DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('----------------------------------------------------');
    console.log('Credentials Summary:');
    console.log('Student: PRN: 23BCE0001 (Aarav Sharma), Password: password123');
    console.log('Student: PRN: 23BCE0002 (Ananya Iyer), Password: password123');
    console.log('Faculty: PRN: FACULTY01 (Dr. Rajesh Rao), Password: password123');
    console.log('Admin:   PRN: ADMIN01 (Prof. Vikramaditya), Password: password123');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

seedData();
