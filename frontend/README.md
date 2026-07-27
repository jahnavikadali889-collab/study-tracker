📚 Study Tracker

A full-stack web application that helps students track their daily study activities, monitor progress, upload study notes, receive smart suggestions, and generate personalized AI-based study plans.

🚀 Live Application

Frontend:
https://study-tracker-xvls0iqbn-jahnavikadali889-8503s-projects.vercel.app
Backend API:
https://study-tracker-backend-tocq.onrender.com

📌 Project Overview

Study Tracker is a full-stack productivity and learning management web application designed to help students build consistent study habits.
Users can securely create an account, record their daily study hours, analyse their progress using charts, upload study notes, receive intelligent study suggestions, and generate personalized study plans based on their learning goals, available daily hours, study duration, and skill level.

💼 Business Value

The application provides value by helping students:

Build consistent study habits

Track daily learning activities

Understand their study performance visually

Identify subjects that need more attention

Organize study notes and files

Create structured and personalized learning plans

This platform can be extended into a complete student productivity and learning management platform.

✨ Key Features

🔐 Authentication

User Signup

User Login

Secure password hashing using bcrypt

JWT-based authentication

Protected API routes

📊 Study Tracking

Add study records

Track subject-wise study hours

Record study dates

Edit study records

Delete study records

📈 Data Visualization

Bar Chart for study hours

Pie Chart for subject-wise study distribution

Total subjects count

Total study hours calculation

💡 Smart Suggestions

The application analyses study records and provides suggestions based on the user's study activity.
Examples:

Identifies subjects receiving less study time

Encourages consistency

Provides positive feedback for balanced study habits

📁 Study Notes Upload

Upload study files

View uploaded files

Delete uploaded files

File storage using Multer

🤖 AI Study Plan Generator

Users can generate personalized study plans by providing:

Subject

Daily study hours

Study duration

Learning goal

Current skill level

The system generates a structured day-by-day study plan with topics, study hours, and learning tasks.

🛠️ Technology Stack

Frontend

React.js

React Router

Axios

Tailwind CSS

Chart.js

React Chart.js 2

Backend

Node.js

Express.js

MongoDB

Mongoose

JWT

bcrypt.js

Multer

CORS

Deployment

Vercel — Frontend Deployment

Render — Backend Deployment

MongoDB Atlas — Database

CI/CD

GitHub

GitHub Actions

Automated workflow-based deployment

🏗️ System Architecture

                    ┌─────────────────────┐
                    │      User           │
                    │  Browser / Mobile   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │      Vercel         │
                    └──────────┬──────────┘
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │  Node.js + Express  │
                    │       Render        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  MongoDB Database   │
                    │    MongoDB Atlas    │
                    └─────────────────────┘ 

📂 Project Structure

STUDY-TRACKER/
│
├── backend/
│   ├── .github/
│   │   └── workflows/
│   │
│   ├── models/
│   │   ├── File.js
│   │   ├── Study.js
│   │   └── User.js
│   │
│   ├── node_modules/
│   ├── uploads/
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   └── tailwind.config.js
│
└── README.md ✅

🔗 API Endpoints

Authentication

MethodEndpointDescriptionPOST/signupCreate a new userPOST/loginAuthenticate user and generate JWT 

Study Tracking

MethodEndpointDescriptionPOST/add-studyAdd a study recordGET/get-studyGet authenticated user's study recordsPUT/update-study/:idUpdate a study recordDELETE/delete-study/:idDelete a study record 

Suggestions

MethodEndpointDescriptionGET/suggestionGet personalized study suggestions 

File Management

MethodEndpointDescriptionPOST/uploadUpload a study fileGET/filesGet uploaded filesDELETE/delete-file/:filenameDelete an uploaded file 

AI Study Plan

MethodEndpointDescriptionPOST/generate-study-planGenerate a personalized study plan 

⚙️ Local Installation

1. Clone the Repository

git clone YOUR_GITHUB_REPOSITORY_URL cd study-tracker 

2. Install Frontend Dependencies

cd frontend npm install 

3. Install Backend Dependencies

cd ../backend npm install 

4. Start the Backend

node server.js 

5. Start the Frontend

cd ../frontend npm start 

🔐 Environment Variables

For production environments, sensitive values such as database credentials and JWT secrets should be stored using environment variables.
Example:
MONGO_URI=your_mongodb_connection_string JWT_SECRET=your_jwt_secret PORT=5000 

🔄 CI/CD Pipeline

The project uses GitHub-based CI/CD automation.

Workflow

Developer 
   ↓ 
Code Changes 
   ↓ 
Git Commit 
   ↓ 
Git Push to GitHub 
   ↓ 
CI/CD Workflow 
   ↓ 
Build and Validation 
   ↓ 
Deployment 
   ↓ 
Live Application 
The CI/CD workflow helps automate the software delivery process and reduces manual deployment effort.

🌐 Deployment

Frontend

The React frontend is deployed on Vercel.

Backend

The Node.js and Express backend is deployed on Render.

Database

MongoDB Atlas is used as the cloud database.

🔒 Security

The application implements:

JWT authentication

Password hashing with bcrypt

Protected API routes

User-specific study data access

CORS configuration

Token-based authorization

🚀 Future Enhancements

Possible future improvements include:

Real AI API integration

Email notifications

Study reminders

Calendar integration

Advanced analytics

Mobile application

Admin dashboard

Social learning features

Real-time collaboration

Cloud-based file storage

👩‍💻 Author

Jahnavi Kadali
MCA Student | Full-Stack Web Developer
Interested in React.js, Node.js, MongoDB, AI-powered applications, and modern web development.