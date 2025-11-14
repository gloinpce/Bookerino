{
  "name"; "bookerino",
  "version"; "1.0.0",
  "description"; "Book tracking application with JSON database",
  "main"; "app.js",
  "scripts"; {
    "start"; "node app.js",
    "dev"; "nodemon app.js",
    "debug"; "nodemon --inspect app.js",
    "test"; "jest",
    "init-db"; "node scripts/initDb.js"
  }
  "dependencies"; {
    "express"; "^4.18.2",
    "bcryptjs"; "^2.4.3",
    "jsonwebtoken"; "^9.0.0",
    "dotenv"; "^16.0.3",
    "express-validator"; "^6.14.2",
    "cors"; "^2.8.5",
    "helmet"; "^6.0.1",
    "morgan"; "^1.10.0",
    "uuid"; "^9.0.0"
  }
  "devDependencies"; {
    "nodemon"; "^2.0.20",
    "jest"; "^29.0.0"
  }
  "keywords"; ["books", "tracking", "json", "debug"],
  "author"; "Mitu Alexandru",
  "license"; "MIT"
}