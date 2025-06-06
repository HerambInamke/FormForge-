# Multi-Step Form Application

A responsive multi-step form application with client-side validation, form state management, and backend integration.

## 🌟 Features

### Form Structure
- **Multi-page form flow** with 4 pages:
  1. Personal Information
  2. Educational Status
  3. Projects
  4. Summary

### User Interface
- **Modern UI/UX** with clean design patterns
- **Custom Tailwind CSS theme** with consistent color scheme:
  - Primary: Indigo-600 (#4F46E5)
  - Secondary: Gray-50 (#F9FAFB)
  - Accent: Cyan-500 (#06B6D4)
- **Micro-interactions** and animations for enhanced user experience
- **Responsive design** that works on all device sizes

### Form Components
- **Interactive Progress Indicator** showing step completion status
- **Dynamic Form Fields** with conditional rendering
- **Custom Form Elements**:
  - Enhanced radio buttons
  - Styled input fields with error states
  - Dynamic project entries with add/remove functionality

### Form Validation
- **Comprehensive validation** using Zod schema validation library
- **Field-level error messages** with clear visual feedback
- **Conditional validation** based on user selections

### State Management
- **Form context** to maintain state across multiple steps
- **Data persistence** between page navigations and refreshes
- **Authentication integration** showing logged-in user details

### Backend Integration
- **API endpoints** for saving and retrieving form data
- **JWT authentication** for secure API access
- **Dashboard view** for displaying submitted forms

## 🛠️ Technical Implementation

### Frontend Stack
- **React** for component-based UI
- **React Router** for page navigation
- **React Hook Form** for form state management
- **Zod** for form validation schemas
- **Tailwind CSS** for styling

### Key Components
- **ProgressIndicator**: Visual indicator of form completion
- **FormInput**: Reusable input component with validation
- **Card**: Container component for consistent styling
- **Button**: Styled button component with loading states

### Form Validation Schemas
- **Page 1 Schema**: Validates personal information (name, email, address)
- **Page 2 Schema**: Validates educational status with conditional fields
- **Page 3 Schema**: Validates project information with array validation

### Data Flow
1. User inputs data on each form page
2. Client-side validation occurs on submission
3. Data is stored in form context and sent to backend
4. On successful submission, user is navigated to next step
5. Complete submissions are viewable on dashboard

## 🚀 Recent Improvements

- ✅ Fixed routing configuration for proper form navigation
- ✅ Enhanced input fields with helpful placeholders
- ✅ Improved radio button implementation on Educational Status page
- ✅ Simplified Projects page with essential fields and GitHub link
- ✅ Added dynamic entry system for multiple projects
- ✅ Redesigned progress indicator for better visibility
- ✅ Fixed submission state handling across all form pages
- ✅ Added user email display on all pages for context
- ✅ Implemented proper error handling and loading states

## 💾 Data Storage

- All form submissions are securely stored in a MongoDB database
- Each submission includes data from all form pages (Personal Information, Educational Status, Projects)
- Data is associated with user accounts through JWT authentication
- Submissions can be retrieved and displayed on the dashboard
- The database structure organizes submissions by user ID for efficient retrieval
- Form data is stored in a structured format that preserves all relationships between form sections

## 🔧 Backend Structure

The server-side code has been organized and optimized for better performance and maintainability:

### Models
- **User**: Stores user authentication details and references to form data
- **FormData**: Stores all form submissions with references to user IDs
- **Form**: Legacy model retained for backward compatibility

### Routes
- **/api/auth**: Handles user authentication (signup, login)
- **/api/form**: Manages form data operations:
  - GET /api/form/submissions: Retrieves all submissions for the current user
  - GET /api/form/data: Gets all form data for the current user
  - POST /api/form/data: Unified endpoint for saving form data for any page
  - GET /api/form/data/:submissionId: Gets a specific submission by ID
  - Legacy endpoints are maintained for backward compatibility

### Middleware
- **auth.js**: Handles JWT token verification and user authentication

### Unified Form Endpoint

The application now implements a streamlined unified form endpoint for handling all form submissions:

#### Key Features
- **Single-Endpoint Architecture**: All form data is processed through `/api/form/data`
- **Page Identification**: Submissions include a `page` parameter to identify which section of the form is being saved
- **Intelligent Data Storage**: Server determines how to store data based on the page identifier
- **Complete Multi-page Support**: Special handling for 'submit' actions to process the entire form

#### Request Format
```json
{
  "page": "page1" | "page2" | "page3" | "submit",
  "data": { ... page data ... }
}
```

#### Benefits
- Simplified client-server communication
- Consistent data handling across all form pages
- Better error handling and validation
- Support for both incremental saves and complete submissions
- Improved maintainability with centralized form processing logic

### Security Features
- JWT authentication for secure API access
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- CORS configuration for secure client-server communication

## 📋 Usage

1. Log in with your credentials
2. Navigate through form pages completing each section
3. Review your information on the summary page
4. Submit your completed form
5. View all submissions on the dashboard

## 💻 Development

### Prerequisites
- Node.js
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

### Project Structure
- **client/**: Frontend React application
  - **src/components/**: Reusable UI components
  - **src/context/**: React context providers
  - **src/validations/**: Zod validation schemas
- **server/**: Backend API (not detailed in this README)
