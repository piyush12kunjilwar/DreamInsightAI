# DreamScape: AI-Powered Dream Interpretation & Sleep Analysis

DreamScape is a web application that helps users track, analyze, and interpret their dreams while monitoring sleep quality using AI-powered insights.

## Features

- 🌙 **Dream Journal**: Record and store your dreams
- 🤖 **AI Dream Interpretation**: Get intelligent interpretations of your dreams using GPT-4
- 📊 **Sleep Quality Tracking**: Monitor your sleep patterns and quality
- 📈 **Sleep Analysis**: Receive personalized insights about your sleep habits
- 🔒 **Secure Authentication**: User accounts with encrypted password storage

## Tech Stack

- **Frontend**: React, TailwindCSS, shadcn/ui
- **Backend**: Express.js, Passport.js
- **AI Integration**: OpenAI GPT-4
- **Data Storage**: In-memory database (development)
- **Authentication**: Session-based with Passport.js

## Getting Started

### Prerequisites

- Node.js 20 or higher
- OpenAI API key

### Environment Variables

The following environment variables are required:

```env
OPENAI_API_KEY=your-openai-api-key
SESSION_SECRET=your-session-secret
```

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## Usage

1. **Register/Login**: Create an account or log in to your existing account
2. **Record Dreams**: Write down your dreams in the dream journal
3. **Track Sleep**: Log your sleep duration and quality
4. **View Insights**: Get AI-powered interpretations of your dreams and sleep analysis

## Future Features

- 📱 IoT sensor integration for sleep tracking
- 🧠 Real-time EEG data analysis
- 🤖 Advanced AI model training with TensorFlow
- 📱 Mobile app development with React Native

## Project Structure

```
├── client/             # Frontend React application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── lib/        # Utility functions
│   │   └── pages/      # Application pages
├── server/             # Backend Express application
│   ├── auth.ts         # Authentication setup
│   ├── openai.ts       # OpenAI integration
│   ├── routes.ts       # API routes
│   └── storage.ts      # Data storage implementation
└── shared/             # Shared TypeScript types
    └── schema.ts       # Database schema and types
```

## Security

- Passwords are hashed using scrypt with per-user salt
- Session-based authentication with secure cookies
- Rate limiting on API endpoints
- Input validation using Zod schemas

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
