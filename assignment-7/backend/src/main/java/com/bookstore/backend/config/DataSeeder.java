package com.bookstore.backend.config;

import com.bookstore.backend.model.Book;
import com.bookstore.backend.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private BookRepository bookRepository;

    @Override
    public void run(String... args) throws Exception {
        if (bookRepository.count() == 0) {
            System.out.println("Seeding database with initial books...");
            
            Book book1 = new Book();
            book1.setTitle("The Great Gatsby");
            book1.setAuthor("F. Scott Fitzgerald");
            book1.setPrice(15.99);
            book1.setImageUrl("https://upload.wikimedia.org/wikipedia/commons/7/7a/The_Great_Gatsby_Cover_1925_Retouched.jpg");
            
            Book book2 = new Book();
            book2.setTitle("1984");
            book2.setAuthor("George Orwell");
            book2.setPrice(12.50);
            book2.setImageUrl("https://m.media-amazon.com/images/I/71kxa1-0mfL.jpg");
            
            Book book3 = new Book();
            book3.setTitle("To Kill a Mockingbird");
            book3.setAuthor("Harper Lee");
            book3.setPrice(18.00);
            book3.setImageUrl("https://m.media-amazon.com/images/I/81gepf1eMqL.jpg");

            bookRepository.save(book1);
            bookRepository.save(book2);
            bookRepository.save(book3);
            
            System.out.println("Database seeded successfully!");
        }
    }
}
