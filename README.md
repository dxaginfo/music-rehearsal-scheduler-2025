# Music Rehearsal Scheduler

A comprehensive web application for scheduling band rehearsals, sending reminders, tracking attendance, and suggesting optimal rehearsal times based on member availability.

## Features

- **User Authentication System** - Secure login with role-based access
- **Band/Group Management** - Create and manage multiple bands with different members
- **Availability Polling** - Find the best rehearsal times that work for everyone
- **Schedule Management** - Create one-time or recurring rehearsals
- **Smart Scheduling** - Algorithm suggests optimal rehearsal times based on member availability
- **Notification System** - Email and in-app reminders for upcoming rehearsals
- **Attendance Tracking** - Keep records of who attends each rehearsal
- **Location Management** - Save and organize rehearsal venues
- **Rehearsal Notes** - Share agendas and track progress
- **Calendar Integration** - Sync with Google Calendar, Apple Calendar, and Outlook

## Technology Stack

### Frontend
- React.js with TypeScript
- Redux for state management
- Material-UI components
- FullCalendar.js for calendar visualization
- Formik with Yup validation
- Axios for API requests

### Backend
- Node.js with Express
- JWT authentication with OAuth integration
- Prisma ORM
- PostgreSQL database
- Redis for caching
- RESTful API with Swagger documentation

### DevOps
- Docker containerization
- GitHub Actions for CI/CD
- AWS deployment (ECS, RDS, S3)
- New Relic/Datadog monitoring

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or Yarn
- Docker and Docker Compose
- PostgreSQL
- Redis

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/dxaginfo/music-rehearsal-scheduler-2025.git
   cd music-rehearsal-scheduler-2025
   ```

2. Install dependencies:
   ```
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up environment variables:
   ```
   # Backend .env file
   cp backend/.env.example backend/.env
   # Edit the .env file with your database credentials and other configurations

   # Frontend .env file
   cp frontend/.env.example frontend/.env
   ```

4. Start the development servers:
   ```
   # Start backend server
   cd backend
   npm run dev

   # Start frontend server
   cd ../frontend
   npm start
   ```

5. Access the application:
   - Backend API: http://localhost:4000
   - Frontend: http://localhost:3000

### Docker Deployment

1. Build and start the containers:
   ```
   docker-compose up -d
   ```

2. Access the application at http://localhost:3000

## Project Structure

```
music-rehearsal-scheduler/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Prisma models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   └── index.js         # Entry point
│   ├── prisma/              # Prisma schema and migrations
│   └── tests/               # Backend tests
├── frontend/                # React frontend
│   ├── public/              # Static files
│   ├── src/
│   │   ├── assets/          # Images, fonts, etc.
│   │   ├── components/      # Reusable components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   ├── redux/           # Redux store configuration
│   │   ├── services/        # API service calls
│   │   ├── styles/          # Global styles
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   └── App.tsx          # Root component
│   └── tests/               # Frontend tests
├── docker/                  # Docker configuration
├── .github/                 # GitHub Actions workflows
├── docs/                    # Documentation
└── README.md                # Project overview
```

## API Documentation

API documentation is available at `/api/docs` when running the backend server.

## Database Schema

The application uses a PostgreSQL database with the following main tables:

- Users - User accounts and authentication
- Bands - Band/group information
- BandMembers - Relationship between users and bands
- Rehearsals - Scheduled rehearsals
- Attendance - Attendance records for rehearsals
- Locations - Rehearsal venues
- AvailabilityPolls - Polls for determining availability
- RehearsalNotes - Notes and agendas for rehearsals

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Project Link: [https://github.com/dxaginfo/music-rehearsal-scheduler-2025](https://github.com/dxaginfo/music-rehearsal-scheduler-2025)