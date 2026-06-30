# Level 1 - Basic Implementation

This directory contains the foundational implementation tasks for the WealthWise Finance Tracker project as part of the Codveda Full-Stack Development Internship.

## Overview

Level 1 focuses on establishing the core development environment and building fundamental components using vanilla technologies before progressing to modern frameworks.

## Learning Objectives

- Master development environment setup and configuration
- Understand REST API design principles and implementation
- Practice vanilla web development (HTML, CSS, JavaScript)
- Learn proper project structure and organization
- Implement CRUD operations with PostgreSQL
- Apply MVC architectural patterns
- Develop API testing and documentation skills

## Tasks Structure

### Task 1: Setup Development Environment ✅
**Status:** Completed  
**Objective:** Establish complete development environment with all necessary tools

**Deliverables:**
- [x] Node.js 18+ installation and configuration
- [x] PostgreSQL 15+ setup and configuration
- [x] Git repository initialization
- [x] Project structure organization
- [x] Development tools configuration
- [x] Initial documentation setup

**Key Files:**
- `README.md` - Project overview and setup instructions
- `.gitignore` - Git ignore rules for Node.js projects
- `LICENSE` - MIT license for the project

---

### Task 2: Build Simple REST API
**Status:** In Progress  
**Objective:** Create Express.js REST API with CRUD operations

**Features to Implement:**
- [ ] Express.js server setup with middleware
- [ ] CRUD operations for Users, Transactions, and Budgets
- [ ] MVC architecture implementation
- [ ] Input validation and error handling
- [ ] PostgreSQL database integration
- [ ] API documentation with Postman collection
- [ ] Environment configuration management

**API Endpoints:**
```
Users:
GET    /api/users
POST   /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id

Transactions:
GET    /api/transactions
POST   /api/transactions
GET    /api/transactions/:id
PUT    /api/transactions/:id
DELETE /api/transactions/:id

Budgets:
GET    /api/budgets
POST   /api/budgets
GET    /api/budgets/:id
PUT    /api/budgets/:id
DELETE /api/budgets/:id
```

---

### Task 3: HTML, CSS & JavaScript Frontend
**Status:** Pending  
**Objective:** Create responsive frontend using vanilla web technologies

**Features to Implement:**
- [ ] Responsive HTML5 structure
- [ ] Modern CSS3 styling with Flexbox/Grid
- [ ] Vanilla JavaScript for interactivity
- [ ] Fetch API integration with backend
- [ ] Dynamic content rendering
- [ ] Form validation and user feedback
- [ ] Mobile-responsive navigation
- [ ] Basic state management

**Pages to Create:**
- Landing page with project overview
- User registration and login forms
- Dashboard with financial summary
- Transaction management interface
- Budget planning and monitoring
- Reports and analytics view

## Prerequisites

Before starting Level 1 tasks, ensure you have:

- **Node.js 18+** - JavaScript runtime environment
- **PostgreSQL 15+** - Relational database system
- **Git** - Version control system
- **VS Code** - Code editor (recommended)
- **Postman** - API testing tool
- Basic understanding of HTML, CSS, JavaScript
- Familiarity with command line interface
- Understanding of HTTP methods and status codes

## Getting Started

1. **Environment Verification**
   ```bash
   node --version    # Should show v18.x.x or higher
   npm --version     # Should show npm version
   psql --version    # Should show PostgreSQL version
   git --version     # Should show Git version
   ```

2. **Project Setup**
   ```bash
   cd level-1-basic
   # Follow individual task README files for specific setup
   ```

3. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb wealthwise_db
   
   # Verify connection
   psql -d wealthwise_db -c "SELECT version();"
   ```

## Folder Structure

```
level-1-basic/
├── task-1-setup/              # Development environment setup
│   ├── installation-guides/   # Step-by-step installation instructions
│   ├── configurations/        # Configuration files and templates
│   └── verification-scripts/  # Scripts to verify setup
│
├── task-2-rest-api/          # Express.js REST API implementation
│   ├── src/                  # Source code
│   │   ├── controllers/      # Request handlers
│   │   ├── models/           # Data models
│   │   ├── routes/           # Route definitions
│   │   ├── middleware/       # Custom middleware
│   │   ├── config/           # Configuration files
│   │   └── utils/            # Utility functions
│   ├── database/             # Database scripts and migrations
│   ├── tests/                # API tests
│   ├── docs/                 # API documentation
│   └── postman/              # Postman collections
│
├── task-3-frontend/          # Vanilla HTML/CSS/JS frontend
│   ├── src/                  # Source files
│   │   ├── assets/           # Static assets (images, fonts)
│   │   ├── css/              # Stylesheets
│   │   ├── js/               # JavaScript files
│   │   └── pages/            # HTML pages
│   ├── docs/                 # Frontend documentation
│   └── tests/                # Frontend tests
│
└── README.md                 # This file
```

## Development Workflow

For each task in Level 1:

1. **Planning Phase**
   - Review task requirements
   - Design solution architecture
   - Plan implementation steps

2. **Implementation Phase**
   - Set up task-specific environment
   - Implement features step by step
   - Test each component thoroughly

3. **Documentation Phase**
   - Document code and APIs
   - Create user guides
   - Update README files

4. **Review Phase**
   - Code review and refactoring
   - Performance optimization
   - Security validation

## Quality Standards

All Level 1 implementations must meet:

- **Code Quality**: Clean, readable, and well-commented code
- **Architecture**: Proper MVC separation and modular design
- **Security**: Input validation and basic security measures
- **Testing**: Comprehensive testing with multiple scenarios
- **Documentation**: Clear documentation for setup and usage
- **Performance**: Efficient code with reasonable response times

## Common Commands

```bash
# Start development servers
npm run dev              # Start API server with nodemon
npm start               # Start production server

# Database operations
npm run db:create       # Create database tables
npm run db:seed         # Insert sample data
npm run db:reset        # Reset database to initial state

# Testing
npm test               # Run all tests
npm run test:api       # Run API tests only
npm run test:coverage  # Generate test coverage report

# Development tools
npm run lint           # Check code style
npm run format         # Format code automatically
```

## Resources

### Documentation
- [Node.js Official Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/guide/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [MDN Web Docs](https://developer.mozilla.org/) for HTML/CSS/JS

### Tools
- [Postman](https://www.postman.com/) for API testing
- [pgAdmin](https://www.pgadmin.org/) for database management
- [VS Code Extensions](https://marketplace.visualstudio.com/vscode) for development

### Best Practices
- [REST API Design Guidelines](https://restfulapi.net/)
- [JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Git Commit Message Conventions](https://www.conventionalcommits.org/)

## Next Steps

Upon completion of Level 1:
1. All tasks should be fully functional and tested
2. Documentation should be comprehensive and up-to-date
3. Code should be committed to version control with meaningful messages
4. Ready to proceed to Level 2 - Intermediate Implementation

---

**Note:** Each task directory contains its own detailed README with specific implementation instructions, code examples, and testing procedures.