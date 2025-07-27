# Bangladesh MCQ Checker - Educational Quiz Platform

## Overview

Bangladesh MCQ Checker is a client-side educational quiz application designed for students to practice multiple-choice questions across various subjects. The platform features an interactive interface with 12 different subjects, timed quizzes, and immediate feedback on answers. The application is built using vanilla HTML, CSS, and JavaScript with a focus on simplicity and educational effectiveness.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application follows a traditional client-side architecture with static file serving:
- **Static HTML Pages**: Individual pages for homepage and each subject quiz
- **Modular CSS**: Single stylesheet with responsive design and subject-specific theming
- **Vanilla JavaScript**: Three main JavaScript modules handling different aspects of functionality
- **JSON Data Storage**: Quiz questions stored in structured JSON files for each subject

### File Organization
```
├── index.html (Homepage with subject selection)
├── css/styles.css (Global styling and themes)
├── js/
│   ├── navigation.js (Homepage interactions and animations)
│   ├── quiz.js (Quiz logic and question management)
│   └── timer.js (Countdown timer functionality)
├── data/ (JSON files for each subject's questions)
└── subjects/ (Individual HTML pages for each quiz)
```

## Key Components

### 1. Homepage Navigation System
- **Purpose**: Provides subject selection and navigation
- **Implementation**: Interactive cards with hover effects and smooth transitions
- **Features**: Subject-specific theming and icons using Font Awesome

### 2. Quiz Management System
- **Core Functionality**: Handles question loading, answer tracking, and scoring
- **Question Flow**: Sequential navigation with previous/next controls
- **Answer Validation**: Immediate feedback with explanations
- **Progress Tracking**: Visual progress bar and current score display

### 3. Timer System
- **Duration**: 15-minute countdown timer for each quiz
- **Warnings**: Visual alerts at 5 minutes and 2 minutes remaining
- **Auto-submission**: Automatically submits quiz when time expires
- **Visual Feedback**: Timer color changes based on remaining time

### 4. Results Display
- **Score Calculation**: Percentage-based scoring with detailed breakdown
- **Visual Answer Review**: Interactive modal showing correct answers in green, incorrect answers in red
- **Detailed Explanations**: Each question includes explanations for learning
- **Restart Functionality**: Option to retake the quiz
- **Review Button**: Dedicated button to reopen answer review after quiz completion

## Data Flow

1. **Quiz Initialization**: 
   - Load subject-specific JSON data via fetch API
   - Initialize timer and question counter
   - Set up event listeners for user interactions

2. **Question Display**:
   - Render current question with multiple choice options
   - Update progress indicators and navigation controls
   - Handle user answer selection and validation

3. **Answer Processing**:
   - Store user answers in memory
   - Provide immediate feedback with explanations
   - Update score and progress tracking

4. **Quiz Completion**:
   - Calculate final score and statistics
   - Display comprehensive results screen
   - Provide option to restart or return to homepage

## External Dependencies

### Third-Party Libraries
- **Google Fonts**: Inter font family for typography
- **Font Awesome 6.4.0**: Icons for UI elements and subject identification
- **No JavaScript Libraries**: Pure vanilla JavaScript implementation

### Content Delivery Networks (CDNs)
- Google Fonts API for web font delivery
- Cloudflare CDN for Font Awesome icon library

## Deployment Strategy

### Static Site Hosting
The application is designed for static site deployment with the following characteristics:

- **No Backend Required**: All functionality runs client-side
- **File-based Data**: JSON files serve as the data source
- **Cross-browser Compatibility**: Uses standard web APIs
- **Mobile Responsive**: CSS Grid and Flexbox for responsive layouts

### Hosting Options
- **GitHub Pages**: Suitable for static hosting
- **Netlify/Vercel**: Easy deployment with build optimization
- **Traditional Web Hosting**: Can be served from any web server
- **Local Development**: Can run directly from file system during development

### Performance Considerations
- **Lightweight**: No heavy frameworks or libraries
- **Fast Loading**: Minimal external dependencies
- **Offline Capable**: All resources can be cached for offline use
- **SEO Friendly**: Semantic HTML structure with proper meta tags

The architecture prioritizes simplicity, maintainability, and educational effectiveness while ensuring the application remains lightweight and fast-loading for students across different devices and internet speeds.