# Transaction Fraud Detection System

A Gemini AI-powered platform that monitors blockchain transactions and detects potential fraud in real-time. Built with Next.js, Django, and MongoDB.

## 🌟 Features

- Real-time transaction analysis using Gemini AI
- Interactive UI with Framer Motion animations
- Dark mode support
- Detailed risk assessment reports
- MongoDB integration for transaction storage
- RESTful API with Django backend

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Django 4.2, Python 3.8+
- **Database**: MongoDB
- **AI**: Google Gemini AI

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18.17 or later
- Python 3.8 or later
- MongoDB 6.0 or later
- Git

## 🚀 Step-by-Step Installation

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd transaction-fraud-detection
```

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Install required packages
npm install framer-motion react-markdown
```

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# For Windows:
venv\Scripts\activate
# For macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install django
pip install djangorestframework
pip install django-cors-headers
pip install pymongo
pip install python-dotenv
pip install google-generativeai
```

### 4. Environment Configuration

Create a `.env` file in the backend directory:

```env
DJANGO_SECRET_KEY=your_secret_key_here
DEBUG=True
MONGODB_URI=mongodb://localhost:27017/
MONGODB_DB=fraud_detection
GEMINI_API_KEY=your_gemini_api_key_here
```

### 5. MongoDB Setup

1. Download and install MongoDB Community Edition from [MongoDB website](https://www.mongodb.com/try/download/community)

2. Start MongoDB service:
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

3. Verify MongoDB is running:
```bash
mongosh
```

## 🎯 Running the Application

### 1. Start Backend Server

```bash
# Make sure you're in the backend directory with virtual environment activated
python manage.py runserver
```
The backend will be available at `http://localhost:8000`

### 2. Start Frontend Development Server

```bash
# In a new terminal, from the project root
npm run dev
```
The frontend will be available at `http://localhost:3000`

## 🔍 Troubleshooting Common Issues

### MongoDB Connection Issues
- Error: "MongoDB connection failed"
  ```bash
  # Check if MongoDB is running
  # Windows
  net start MongoDB
  # macOS
  brew services list
  # Linux
  sudo systemctl status mongod
  ```

### Backend Issues
- Error: "ModuleNotFoundError"
  ```bash
  # Ensure virtual environment is activated and dependencies are installed
  pip install -r requirements.txt
  ```

### Frontend Issues
- Error: "Module not found"
  ```bash
  # Reinstall node modules
  rm -rf node_modules
  npm install
  ```

## 📝 API Endpoints

- `POST http://localhost:8000/api/transaction` - Submit transaction for analysis
- `GET http://localhost:8000/api/status/{transaction_id}` - Get analysis status
- `GET http://localhost:8000/api/health` - Check system health

## 🧪 Testing the Setup

1. Start both servers (frontend and backend)
2. Open `http://localhost:3000` in your browser
3. Click "Test Backend Connection" to verify backend connectivity
4. Try submitting a test transaction using the form

## 📚 Project Structure

```
transaction-fraud-detection/
├── src/                    # Frontend source code
│   ├── app/               # Next.js pages
│   ├── components/        # React components
│   └── globals.css        # Global styles
├── backend/               # Django backend
│   ├── api/              # API endpoints
│   ├── fraud_detection/  # Django settings
│   └── requirements.txt  # Python dependencies
├── package.json          # Node.js dependencies
└── README.md            # Documentation
```

## 🤝 Need Help?

If you encounter any issues:
1. Check the console logs in your browser
2. Check the terminal running the servers
3. Verify all environment variables are set correctly
4. Ensure MongoDB is running and accessible

## 📄 License

This project is licensed under the MIT License.
