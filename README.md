# Music Rehearsal Scheduler

A comprehensive web application designed to streamline the process of scheduling and managing band rehearsals. This application helps bands and music groups coordinate rehearsal times, track attendance, send automated reminders, and suggest optimal rehearsal times based on member availability patterns.

## Key Features

- **User and Band Management**
  - User registration and profile management
  - Band/group creation and member invitation system
  - Role-based permissions (admin, member, guest)

- **Calendar and Scheduling**
  - Visual calendar interface with month, week, and day views
  - Recurring event creation
  - Integration with external calendars (Google, Apple, Outlook)
  - Availability polling system

- **Attendance Tracking**
  - RSVP functionality for each event
  - Attendance history and analytics
  - Substitute musician management

- **Smart Scheduling**
  - Automated optimal time suggestions based on historical availability
  - Conflict detection and resolution
  - Venue availability integration

- **Communication Tools**
  - In-app messaging and comments
  - Email and SMS notifications
  - Customizable reminder system

- **Resource Management**
  - Equipment tracking and assignments
  - Rehearsal space booking integration
  - Setlist management and sharing

## Technology Stack

### Frontend
- React.js with Next.js for server-side rendering
- Material-UI for consistent design components
- Redux for application state
- FullCalendar.js for interactive calendar views
- Formik with Yup validation

### Backend
- Node.js with Express
- MongoDB for flexible schema design
- JWT with OAuth integration for social logins
- SendGrid for email notifications
- Twilio for text reminders
- Google Calendar API, Apple Calendar API

### Infrastructure
- AWS or Vercel for web application
- MongoDB Atlas
- GitHub Actions for CI/CD
- Sentry for error tracking
- Google Analytics

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (v4 or higher)

### Installation

1. Clone the repository
```bash
git clone https://github.com/dxaginfo/music-rehearsal-scheduler-2025.git
cd music-rehearsal-scheduler-2025
```

2. Install dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Set up environment variables
```bash
# In the server directory, create a .env file with the following variables
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SENDGRID_API_KEY=your_sendgrid_api_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

4. Start the development servers
```bash
# Start the backend server
cd server
npm run dev

# In a separate terminal, start the frontend server
cd client
npm run dev
```

5. Access the application at http://localhost:3000

## Contributing

We welcome contributions to the Music Rehearsal Scheduler project! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- The developers of the React, Node.js, and MongoDB ecosystems
- The music community for inspiring this project
- All contributors who have helped shape this application