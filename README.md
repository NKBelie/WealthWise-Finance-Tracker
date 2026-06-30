# WealthWise - Smart Personal Finance Tracker

![Project Status](https://img.shields.io/badge/Status-In%20Development-yellow)
![License](https://img.shields.io/badge/License-MIT-blue)
![Node Version](https://img.shields.io/badge/Node.js-18+-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue)

A comprehensive PERN Stack (PostgreSQL, Express.js, React, Node.js) web application for personal finance management, developed as part of the Codveda Full-Stack Development Internship program.

## 🎯 Project Overview

WealthWise is a production-quality web application that empowers users to take control of their personal finances through:

- **Secure User Management**: Registration, authentication, and profile management
- **Income & Expense Tracking**: Comprehensive transaction management with categorization
- **Budget Planning**: Create and monitor budgets with real-time updates
- **Financial Analytics**: Interactive dashboards and spending analysis
- **Real-time Notifications**: Live updates using Socket.io
- **Modern APIs**: Both REST and GraphQL implementations

## 🛠️ Technology Stack

### Frontend
- **React 18** with Vite for fast development
- **React Router** for client-side routing
- **Axios** for HTTP requests
- **Tailwind CSS** for responsive styling
- **Chart.js/Recharts** for data visualization

### Backend
- **Node.js 18+** runtime environment
- **Express.js** web framework
- **JWT** for secure authentication
- **bcrypt** for password hashing
- **Socket.io** for real-time communication
- **Apollo Server** for GraphQL implementation

### Database
- **PostgreSQL 15+** relational database
- **pg** PostgreSQL client for Node.js
- Optimized queries and indexing

### Development Tools
- **Git & GitHub** for version control
- **Postman** for API testing
- **VS Code** as primary IDE
- **nodemon** for development server

## 📚 Internship Structure

This project is organized according to the Codveda Full-Stack Development Internship roadmap:

```
wealthwise-finance-tracker/
├── level-1-basic/           # Foundation: REST API, HTML/CSS/JS
├── level-2-intermediate/    # React Frontend, Authentication, PostgreSQL
├── level-3-advanced/       # Full PERN Stack, Socket.io, GraphQL
├── docs/                   # Comprehensive documentation
├── README.md              # Project overview (this file)
├── LICENSE                # MIT License
└── .gitignore            # Git ignore rules
```

### Level 1 - Basic Implementation
- [x] Task 1: Development Environment Setup
- [x] Task 2: Express.js REST API with CRUD operations
- [ ] Task 3: Vanilla HTML/CSS/JavaScript frontend

### Level 2 - Intermediate Features
- [ ] Task 1: React frontend with Vite and modern hooks
- [ ] Task 2: JWT authentication and authorization system
- [ ] Task 3: PostgreSQL database integration with relationships

### Level 3 - Advanced Implementation
- [ ] Task 1: Complete PERN Stack integration with deployment
- [ ] Task 2: Real-time communication using Socket.io
- [ ] Task 3: GraphQL API with Apollo Server

## 🚀 Quick Start

### Prerequisites
Ensure you have the following installed:
- Node.js 18 or higher
- PostgreSQL 15 or higher
- Git
- A code editor (VS Code recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wealthwise-finance-tracker
   ```

2. **Install dependencies**
   ```bash
   # For Level 1 REST API
   cd level-1-basic/task-2-rest-api
   npm install
   
   # For Level 2 React Frontend (when available)
   cd ../../level-2-intermediate/task-1-react-frontend
   npm install
   ```

3. **Setup PostgreSQL Database**
   ```bash
   # Create database
   createdb wealthwise_db
   
   # Run migrations (check specific level documentation)
   npm run migrate
   ```

4. **Configure Environment Variables**
   ```bash
   # Copy and customize environment file
   cp .env.example .env
   # Edit .env with your database credentials and secrets
   ```

5. **Start Development Server**
   ```bash
   # Backend API
   npm run dev
   
   # Frontend (when available)
   npm run start
   ```

## 🏗️ API Endpoints

### Authentication
```
POST   /api/auth/register    # User registration
POST   /api/auth/login       # User login
POST   /api/auth/refresh     # Refresh JWT token
```

### User Management
```
GET    /api/users           # Get all users
GET    /api/users/:id       # Get user by ID
PUT    /api/users/:id       # Update user
DELETE /api/users/:id       # Delete user
```

### Financial Data
```
GET    /api/transactions    # Get all transactions
POST   /api/transactions    # Create transaction
PUT    /api/transactions/:id # Update transaction
DELETE /api/transactions/:id # Delete transaction
```

### Budget Management
```
GET    /api/budgets         # Get user budgets
POST   /api/budgets         # Create budget
PUT    /api/budgets/:id     # Update budget
DELETE /api/budgets/:id     # Delete budget
```

*For complete API documentation, see [docs/api-documentation.md](docs/api-documentation.md)*

## 🎨 Features

### Core Functionality
- [x] User registration and authentication
- [x] Income and expense tracking
- [x] Transaction categorization
- [ ] Budget creation and monitoring
- [ ] Financial dashboard with charts
- [ ] Spending analysis and reports
- [ ] Real-time notifications
- [ ] Data export functionality

### Technical Features
- [x] RESTful API design
- [x] Input validation and sanitization
- [x] Error handling middleware
- [x] Database relationships and constraints
- [ ] JWT-based authentication
- [ ] Real-time updates with Socket.io
- [ ] GraphQL API implementation
- [ ] Responsive web design
- [ ] Performance optimization

## 🧪 Testing

### API Testing
```bash
# Run API tests
npm test

# Test with Postman
# Import collection from postman/ directory
```

### Frontend Testing
```bash
# Run React component tests
npm run test:frontend

# Run E2E tests
npm run test:e2e
```

## 📖 Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[Installation Guide](docs/installation.md)**: Step-by-step setup instructions
- **[API Documentation](docs/api-documentation.md)**: Complete API reference
- **[Database Schema](docs/database-schema.md)**: ERD and table structures
- **[Development Guide](docs/development.md)**: Coding standards and practices
- **[Deployment Guide](docs/deployment.md)**: Production deployment steps

## 🔐 Security

This project implements industry-standard security practices:

- **Authentication**: JWT tokens with refresh mechanism
- **Password Security**: bcrypt hashing with salt rounds
- **Input Validation**: Joi schema validation for all inputs
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Input sanitization and CSP headers
- **CORS Configuration**: Proper cross-origin resource sharing
- **Rate Limiting**: API endpoint protection

## 🚀 Deployment

### Development
```bash
npm run dev          # Start development server
npm run dev:watch    # Start with auto-reload
```

### Production
```bash
npm run build        # Build production assets
npm start           # Start production server
```

### Docker (Optional)
```bash
docker-compose up   # Start all services
```

## 🤝 Contributing

This project is part of an internship program. For contribution guidelines, please refer to:

1. Follow the established coding standards
2. Write comprehensive tests for new features
3. Update documentation for any changes
4. Follow the Git workflow with meaningful commit messages
5. Ensure all checks pass before submitting

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎓 Learning Objectives

This internship project demonstrates proficiency in:

- **Full-Stack Development**: End-to-end application development
- **Modern JavaScript**: ES6+, async/await, modern frameworks
- **Database Design**: Relational modeling and optimization
- **API Development**: RESTful and GraphQL implementations
- **Authentication & Security**: JWT, bcrypt, input validation
- **Real-time Features**: Socket.io implementation
- **Version Control**: Git workflows and collaboration
- **Testing**: Unit, integration, and E2E testing
- **Deployment**: Production deployment and DevOps practices
- **Documentation**: Technical writing and API documentation

## 📞 Support

For questions, issues, or internship-related queries:

- Create an issue in this repository
- Review the documentation in the `docs/` directory
- Check existing issues for similar problems

---

**Built with ❤️ as part of the Codveda Full-Stack Development Internship Program**

*Last Updated: $(date)*