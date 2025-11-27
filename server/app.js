require("dotenv").config();

const http = require("http");
const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

const requestHandler = async (req, res) => {
  try {
    const result = await sql`SELECT version()`;
    const { version } = result[0];
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(version);
  } catch (error) {
    console.error("Database query error:", error);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Database connection error");
  }
};

const port = process.env.PORT || 3000;
http.createServer(requestHandler).listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Database: neondb`);
  console.log(`Role: neondb_owner`);
});
