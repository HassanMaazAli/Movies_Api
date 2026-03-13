🎬 Movie App – NestJS + MySQL + Python Microservice
A full‑stack movie API built with NestJS, MySQL, and TypeORM, featuring JWT authentication, movie search, ratings, user profile management, and a separate Python microservice for personalised movie recommendations. This project demonstrates modern backend development practices: modular architecture, stateless authentication, database integration, inter‑service communication, and environment‑based configuration.

✨ Features
User Authentication – Signup with name, city, date of birth, email, password; login with email/password returns JWT access token; password hashing with bcrypt.

Movie Management – Pre‑seeded movies (Inception, Matrix, etc.); search movies by title (case‑insensitive, partial match); add new movies (authenticated users).

Rating System – Users can rate movies (1‑5 stars); one rating per user per movie (update allowed); average rating calculated automatically.

User Profile – Update own profile (name, city, date of birth, email); change password (requires old password).

Admin Capabilities – Role‑based guard (admin role); admin can update any user’s profile via dedicated endpoint.

Microservice Integration – Separate Python (FastAPI) service generates movie recommendations; NestJS calls the Python service via HTTP and returns enriched movie data; graceful fallback if microservice is unavailable.

Modular Architecture – Clean separation into UserModule, MovieModule, AuthModule, RecommendationModule; global validation pipe with class-validator; environment variables managed via @nestjs/config.

Database – MySQL with TypeORM (synchronisation enabled for development); entities: User, Movie, MovieRating (optional Genre).

🛠 Tech Stack
Backend Framework: NestJS (Node.js)

Database: MySQL + TypeORM

Authentication: JWT (using @nestjs/jwt + passport-jwt)

Validation: class-validator + class-transformer

HTTP Client: @nestjs/axios (Axios) for microservice calls

Python Microservice: FastAPI + Uvicorn

Testing: Thunder Client / Postman

📋 Prerequisites
Node.js (v18 or later)

npm (v9 or later)

MySQL (v8 recommended)

Python (v3.8 or later) – for the microservice

Git

🚀 Installation
1. Clone the repository
bash
git clone https://github.com/yourusername/movie-app.git
cd movie-app
2. Install backend dependencies
bash
npm install
3. Set up the MySQL database
Create a database (e.g., movie_app).

Update the database credentials in the next step.

4. Configure environment variables
Create a .env file in the project root:

env
# JWT
JWT_SECRET=your_super_secret_key

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=yourpassword
DB_DATABASE=movie_app

# Python microservice URL
PYTHON_SERVICE_URL=http://localhost:5000
5. Run the NestJS application
bash
npm run start:dev
The server will start on http://localhost:3000.
TypeORM synchronisation will create the tables automatically.

🐍 Python Microservice Setup
The recommendation engine runs as a separate service. You can place it in any folder outside the NestJS project.

1. Create a new folder for the microservice
bash
mkdir movie-recommendation-service
cd movie-recommendation-service
2. Create a virtual environment (optional but recommended)
bash
python -m venv venv
# Activate it:
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate
3. Install dependencies
bash
pip install fastapi uvicorn
4. Create main.py
python
from fastapi import FastAPI
import random

app = FastAPI()

def get_recommendations(user_id: int):
    # Dummy: return 5 random movie IDs between 1 and 20
    random.seed(user_id)
    return random.sample(range(1, 21), 5)

@app.get("/recommend/{user_id}")
async def recommend(user_id: int):
    movies = get_recommendations(user_id)
    return {"user_id": user_id, "recommendations": movies}
5. Run the microservice
bash
uvicorn main:app --reload --port 5000
The service will be available at http://localhost:5000.

Note: Keep this terminal open while testing the recommendations endpoint.

📡 API Endpoints
All endpoints are prefixed with http://localhost:3000.

Authentication
Method	Endpoint	Description	Auth Required
POST	/user/signup	Register a new user	❌
POST	/user/login	Login → get JWT token	❌
Signup – Request Body
json
{
  "name": "John Doe",
  "city": "New York",
  "dateOfBirth": "1990-01-01",
  "email": "john@example.com",
  "password": "123456"
}
Login – Request Body / Response
json
{
  "email": "john@example.com",
  "password": "123456"
}
json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
Movies
Method	Endpoint	Description	Auth Required
GET	/movie	List / search movies	❌
POST	/movie	Add a new movie	✅ (JWT)
POST	/movie/:id/rate	Rate a movie (1-5)	✅ (JWT)
GET	/movie/recommendations	Get personalised recommendations	✅ (JWT)
Search – Query Parameter
?title=inception (optional)

Add Movie – Request Body
json
{
  "title": "The Dark Knight",
  "description": "Batman fights the Joker",
  "releaseYear": 2008
}
Rate Movie – Request Body
json
{
  "value": 5
}
User Profile (Protected)
Method	Endpoint	Description	Auth Required
PATCH	/user/profile	Update own profile	✅ (JWT)
PATCH	/user/change-password	Change password	✅ (JWT)
PATCH	/user/admin/:id	Update any user (admin only)	✅ (JWT + admin role)
Update Profile – Request Body (partial)
json
{
  "city": "Los Angeles",
  "name": "John Updated"
}
Change Password – Request Body
json
{
  "oldPassword": "123456",
  "newPassword": "newpass123"
}
🧪 Testing with Thunder Client / Postman
Signup a new user.

Login to obtain a JWT token.

Include the token in the Authorization header for protected routes:

text
Authorization: Bearer <your_token>
Test public endpoints (movie search, list) without token.

Test the recommendations endpoint – it will call the Python microservice and return movies.

📁 Project Structure
text
movie-app/
├── src/
│   ├── auth/               # JWT strategy, guards, auth module
│   ├── user/               # User entity, DTOs, controller, service
│   ├── movie/              # Movie & rating entities, DTOs, controller, service
│   ├── recommendation/     # Service to call Python microservice
│   ├── app.module.ts       # Root module with TypeORM and ConfigModule
│   └── main.ts             # Entry point (ValidationPipe, etc.)
├── .env                    # Environment variables
├── package.json
└── README.md
🤝 Contributing
Contributions, issues, and feature requests are welcome!
Feel free to check the issues page.

📄 License
This project is MIT licensed.
