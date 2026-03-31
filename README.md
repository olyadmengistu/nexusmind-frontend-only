# NexusMind - The Problem Solving Network

A collaborative platform where experts connect to solve challenges together, share knowledge, and build innovative solutions.

## 🚀 Overview

NexusMind is a modern web application built with React, TypeScript, and Firebase that enables:
- **Problem Sharing**: Users can post challenges and problems they're facing
- **Collaborative Solutions**: Community members can contribute solutions and vote on the best approaches
- **Expert Matching**: Connect with subject matter experts for specialized help
- **Real-time Communication**: Messaging and notifications for seamless collaboration
- **Video Content**: Share and view problem-solving videos and tutorials

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI framework with hooks and concurrent features
- **TypeScript** - Type-safe development experience
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing with hash-based navigation
- **Firebase SDK** - Authentication, Firestore database, and storage

### Backend
- **Firebase Functions** - Serverless API endpoints
- **Firestore** - NoSQL real-time database
- **Firebase Storage** - File and media storage
- **Firebase Auth** - User authentication and authorization

### Deployment
- **Vercel** - Frontend hosting and serverless functions
- **Firebase Hosting** - Static asset hosting
- **GitHub** - Version control and CI/CD

## 📁 Project Structure

```
nexusmind---the-problem-solving-network/
├── src/                          # Core application logic
│   ├── components/               # Reusable React components
│   │   ├── Feed.tsx             # Main feed component
│   │   ├── Navbar.tsx           # Navigation bar
│   │   ├── PostCard.tsx         # Individual post display
│   │   ├── VideoPlayer.tsx      # Video playback component
│   │   └── ...                  # Other UI components
│   ├── pages/                   # Page-level components
│   │   ├── Login.tsx            # Authentication page
│   │   ├── Profile.tsx          # User profile
│   │   ├── Messages.tsx         # Messaging interface
│   │   └── ...                  # Other pages
│   ├── types/                   # TypeScript type definitions
│   │   └── index.ts             # Core type definitions
│   ├── constants/               # Application constants
│   │   ├── index.ts             # General constants
│   │   └── mockData.ts          # Development mock data
│   ├── utils/                   # Utility functions
│   │   └── authService.ts       # Authentication helpers
│   ├── styles/                  # CSS and styling
│   │   ├── globals.css          # Global styles and variables
│   │   └── components.css       # Component-specific styles
│   ├── firebase.ts              # Firebase configuration
│   ├── NotificationContext.tsx  # Notification system
│   └── messageService.ts        # Messaging service
├── components/                   # Legacy components (being migrated)
├── pages/                       # Legacy pages (being migrated)
├── backend/                     # Backend API code
├── api/                         # Vercel serverless functions
├── public/                      # Static assets
└── docs/                        # Documentation files
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **Firebase project** with Authentication, Firestore, and Storage enabled
- **Vercel account** (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/nexusmind---the-problem-solving-network.git
   cd nexusmind---the-problem-solving-network
   ```

2. **Install dependencies**
   ```bash
   npm install
   npm run build:api
   ```

3. **Configure environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env.local
   
   # Update with your Firebase configuration
   # You can get these values from your Firebase project settings
   ```

4. **Run the development server**
   ```bash
   # Start the frontend development server
   npm run dev
   
   # In a separate terminal, start the backend API
   npm run dev:api
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## 🔧 Environment Variables

### Development (.env.local)
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# API Configuration
VITE_API_URL=http://localhost:3001/api
```

### Production (Vercel Dashboard)
```env
NODE_ENV=production
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=https://your-app-name.vercel.app/api
```

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Link your project
   vercel link
   
   # Deploy
   vercel --prod
   ```

2. **Configure Environment Variables**
   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Add all the production environment variables listed above

3. **Automatic Deployment**
   - Push to your main branch to trigger automatic deployment
   - Vercel will build and deploy both frontend and backend

### Firebase Configuration

1. **Enable Firebase Services**
   - Authentication (Email/Password, Google)
   - Firestore Database
   - Storage

2. **Configure Security Rules**
   - Update `firestore.rules` for database security
   - Update `storage.rules` for file storage security

3. **Update Firebase Config**
   - Copy your Firebase configuration to the environment variables

## 🧪 Testing

### Type Checking
```bash
npm run type-check
```

### Build Testing
```bash
npm run build
npm run preview
```

### Linting (if configured)
```bash
npm run lint
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking
- `npm run build:api` - Build backend dependencies
- `npm run dev:api` - Start backend development server
- `npm run build:full` - Build both backend and frontend
- `npm run vercel-build` - Vercel build command

## 🔧 Code Organization

### Component Architecture
- **Atomic Design**: Components organized by complexity (atoms, molecules, organisms)
- **Type Safety**: All components use TypeScript interfaces and props
- **Reusability**: Components designed for reuse across the application
- **Performance**: Components optimized with React.memo and lazy loading

### State Management
- **React Context**: Used for global state (notifications, user authentication)
- **Local State**: Component-level state with useState and useReducer
- **Firebase Real-time**: Live data synchronization with Firestore

### Styling Strategy
- **CSS Variables**: Consistent theming and design tokens
- **Component CSS**: Scoped styles for individual components
- **Responsive Design**: Mobile-first approach with breakpoints
- **Dark Mode**: Automatic dark theme support

## 🚀 Features

### Core Features
- **User Authentication**: Secure login/signup with Firebase
- **Problem Posting**: Share challenges with the community
- **Solution Sharing**: Contribute and vote on solutions
- **Real-time Updates**: Live notifications and messaging
- **Video Content**: Upload and view problem-solving videos
- **Expert Profiles**: Showcase expertise and reputation

### Advanced Features
- **Smart Matching**: AI-powered expert recommendations
- **Collaboration Tools**: Real-time editing and commenting
- **Analytics Dashboard**: Track engagement and impact
- **Mobile Responsive**: Optimized for all devices
- **Offline Support**: Progressive Web App capabilities

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Code Standards
- Use TypeScript for all new code
- Follow the existing component structure
- Add comments for complex logic
- Include error handling and loading states
- Test on multiple screen sizes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. **Check the documentation** in the `/docs` folder
2. **Search existing issues** on GitHub
3. **Create a new issue** with detailed information
4. **Join our community** for real-time support

## 🔄 Version History

- **v1.0.0** - Initial release with core features
- **v1.1.0** - Added video support and enhanced UI
- **v1.2.0** - Improved mobile experience and performance
- **v1.3.0** - Enhanced collaboration features

---

**Built with ❤️ by the NexusMind Team**
