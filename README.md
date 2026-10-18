# FoodApp – MERN Stack Food Ordering Application

## Overview

FoodApp is a full-stack food ordering web application built using the MERN stack. It allows users to browse restaurants, explore food items, manage a shopping cart, place orders, and track their order history. An admin dashboard provides functionality to view orders and update their delivery status.

## Features

### User Features

- User registration and login.
- Browse available restaurants and food items.
- Explore food categories.
- Add food items to the cart and update quantities.
- Proceed to checkout and place orders.
- View personal order history and order status.
- View account information and log out.

### Admin Features

- Access a dedicated order management dashboard.
- View customer orders and order details.
- Update order statuses, including Preparing, On the Way, and Delivered.
- Access admin functionality through role-based authorization.

## Tech Stack

**Frontend**

- React.js
- Vite
- React Router
- Axios
- Context API for state management
- CSS for responsive styling

**Backend**

- Node.js
- Express.js
- REST APIs
- JWT-based authentication
- Role-based authorization

**Database**

- MongoDB
- Mongoose

## Project Structure

```text
FoodApp/
├── Backend/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   └── package.json
├── .gitignore
└── README.md
```

_Note: Adjust the folder structure above if your actual project differs._

## Prerequisites

Make sure you have installed:

- Node.js and npm
- MongoDB, or access to a MongoDB Atlas database
- Git

## Getting Started

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd FoodApp
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

### 2. Set Up the Backend

```bash
cd Backend
npm install
```

Create a `.env` file in the Backend directory and add the environment variables required by your backend code.

Example:

```env
PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Use the exact variable names expected by your code. Never commit your actual database credentials or JWT secret.

Start the backend using the script defined in `Backend/package.json`. For example, if the start script is configured:

```bash
npm start
```

### 3. Set Up the Frontend

Open a second terminal:

```bash
cd Frontend
npm install
```

Configure the frontend API base URL to point to your running backend. If your project uses `VITE_API_URL`, configure it in the frontend environment file.

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed in the terminal.

## Environment Configuration

The application requires environment configuration for database access, authentication, and frontend-to-backend communication.

- Backend environment variables must match the names used in the backend code.
- The frontend API URL must point to the backend server.
- Keep `.env` files and all secrets out of version control.
- Provide your own environment values when running the project.

## Future Enhancements

- Online payment integration.
- Restaurant owner dashboard and menu management.
- Order notifications.
- Deployment and production monitoring.

## Author

Developed as a full-stack MERN project to practice frontend development, REST API design, authentication, database integration, and order management.
