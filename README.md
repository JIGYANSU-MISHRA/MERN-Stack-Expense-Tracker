# 💰 MERN Expense Tracker

A modern, full-stack expense tracking application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring beautiful charts, real-time analytics, and a responsive design.


## 🚀 Features

### 📊 Interactive Dashboard
- **Real-time Statistics**: Total expenses, transaction count, average per transaction, categories used
- **Beautiful Charts**:
  - Category distribution pie chart with color-coded segments
  - Monthly expenses bar chart showing spending trends
  - 30-day spending trend area chart for daily analysis
- **Recent Expenses**: Quick view of latest transactions with category badges

### 💳 Expense Management
- **Add Expenses**: Simple form with amount, category, description, and date
- **Edit Expenses**: Update existing expenses with full CRUD operations
- **Delete Expenses**: Remove expenses with confirmation dialog
- **Category System**: 8 predefined categories (Food, Transportation, Entertainment, Shopping, Bills, Healthcare, Education, Other)

### 🎨 Modern UI/UX
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Fade-in effects, hover animations, and transitions
- **Color-coded Categories**: Each category has its own color for easy identification

### 📱 Responsive Design
- Mobile-first approach
- Touch-friendly interface
- Adaptive layouts for all screen sizes
- Optimized for both portrait and landscape orientations

## 🛠️ Tech Stack

### Frontend
- **React 19.1.0** - Modern React with hooks and functional components
- **React Router DOM 7.6.2** - Client-side routing
- **Axios 1.10.0** - HTTP client for API calls
- **Recharts 3.0.0** - Beautiful and responsive charts
- **Lucide React 0.523.0** - Modern icon library
- **Tailwind CSS 3.4.0** - Utility-first CSS framework

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 4.21.2** - Web application framework
- **Mongoose 7.8.7** - MongoDB object modeling
- **CORS 2.8.5** - Cross-origin resource sharing
- **Body Parser 1.20.3** - Request body parsing
- **Dotenv 16.5.0** - Environment variable management

### Database
- **MongoDB** - NoSQL database (Atlas)

## 📋 Prerequisites

Before running this application, make sure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)
- **MongoDB** (local installation or MongoDB Atlas account)

## 🔧 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/expense-tracker-mern.git
cd expense-tracker-mern
```
### 2. Install Backend Dependencies
```bash
cd backend npm install
```
### 3. Install Frontend Dependencies
```bash
cd ../frontend npm install
```
### 4. Environment Setup
#### Backend Environment Variables
Create a `.env` file in the `backend` directory: 
```env
# MongoDB Connection (Choose one) MONGO_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/expense-tracker?retryWrites=true&w=majority
# OR for local MongoDB
# MONGO_URI=mongodb://localhost:27017/expense-tracker
# Server Configuration PORT=5001 NODE_ENV=development
```
## 🚀 Running the Application 

### Option 1: Run Both Servers Simultaneously 
#### Terminal 1 - Backend Server 
```bash
cd backend npm run dev
```
The backend will start on `http://localhost:5001` 
#### Terminal 2 - Frontend Server 
```
bash cd frontend npm start
```
The frontend will start on `http://localhost:3000` 

### Option 2: 
Run with Production Scripts 
#### Backend 
```bash
cd backend npm start
```
#### Frontend 
```bash 
cd frontend npm start
```

## 📱 How to Use 
### 1. **Dashboard Overview** 
- Visit `http://localhost:3000` to see the main dashboard
- View real-time statistics and charts
- See recent expenses and spending patterns
### 2. **Adding Expenses** 
- Click "Add Expense" button or navigate to `/add` - Fill in the form:
- **Amount**: Enter the expense amount
- **Category**: Select from 8 predefined categories
- **Description**: Add a brief description
- **Date**: Choose the expense date (defaults to today)
- Click "Save Expense" to add it to your tracker
### 3. **Managing Expenses**
- **View All**: Navigate to `/expenses` to see all transactions
- **Edit**: Click the edit icon on any expense
- **Delete**: Click the delete icon and confirm deletion
### 4. **Analyzing Data** 
- **Category Breakdown**: See how much you spend in each category
- **Monthly Trends**: Track your spending patterns over time
- **Daily Spending**: Monitor your 30-day spending trend


## Happy Expense Tracking!
  
