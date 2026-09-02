# 📚 Online Book Store

A full-stack responsive online bookstore built with Node.js, Express, and MongoDB.

## Features
- Home, Login, Registration, and Catalogue pages
- Secure authentication (bcrypt + JWT stored in httpOnly cookie)
- Search & filter book catalogue
- Fully responsive UI (Mobile, Tablet, Desktop)

## Tech Stack
Node.js · Express.js · MongoDB · Mongoose · EJS · JWT · bcrypt

## Folder Structure
```
online-bookstore/
├── config/
│   └── db.js
├── models/
│   ├── User.js
│   └── Book.js
├── controllers/
│   ├── authController.js
│   └── bookController.js
├── middleware/
│   └── authMiddleware.js
├── routes/
│   ├── authRoutes.js
│   └── bookRoutes.js
├── views/
│   ├── partials/
│   │   ├── navbar.ejs
│   │   └── footer.ejs
│   ├── home.ejs
│   ├── login.ejs
│   ├── register.ejs
│   └── catalogue.ejs
├── public/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── main.js
├── seed.js
├── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Setup Instructions
1. Clone repo
2. `npm install`
3. Create `.env` from `.env.example`
4. Make sure MongoDB is running locally or set a MongoDB Atlas URI in `.env`
5. `node seed.js` to populate sample data
6. `npm run dev`
7. Visit `http://localhost:3000`

## Environment Variables
| Key | Description |
|---|---|
| MONGO_URI | MongoDB connection string |
| JWT_SECRET | Secret for signing JWTs |
| PORT | Server port |

## Screenshots
> Note: Screenshots can be added here after deploying or running locally.
* **Home Page**: Landing page with hero banner and featured books.
* **Catalogue Page**: Grid of books with search and filter functionality.
* **Login/Register**: Secure authentication forms with validation.

## Author
[Your Name], [Course/Subject Name], [College]
