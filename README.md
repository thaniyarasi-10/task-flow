# TaskSpace - Beautiful Task Management

A modern, collaborative task management application built with React, TypeScript, and Supabase.

## Features

### 🎯 Task Management
- Create, edit, and delete tasks
- Set priorities (Low, Medium, High)
- Track status (To Do, In Progress, Completed)
- Set due dates with calendar integration
- Rich task descriptions

### 👥 Collaboration
- **Gmail Email Integration**: Share tasks via professional Gmail emails
- Real-time task sharing with team members
- Personal messages with shared tasks
- Beautiful HTML email templates

### 📊 Dashboard & Analytics
- Comprehensive task overview
- Progress tracking and completion rates
- Advanced filtering and sorting
- Calendar view with task visualization
- Responsive design for all devices

### 👤 Enhanced Profile Management
- **Complete Profile Editing**: Full name, bio, job title, company
- **Contact Information**: Phone, location, website
- **Avatar Upload**: Profile picture with preview
- **Professional Display**: Job title, company, location
- **Real-time Updates**: Instant profile refresh

### 🎨 Modern UI/UX
- Beautiful, intuitive interface
- Dark/Light theme support
- Smooth animations and transitions
- Mobile-responsive design
- Professional color schemes

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Email**: Gmail API integration with fallback services
- **UI Components**: Radix UI, Framer Motion
- **State Management**: React Query, Custom Hooks
- **Build Tool**: Vite

## Email Integration

### Gmail API Setup
The application supports sending task sharing emails via Gmail API:

1. **Gmail API Credentials** (Environment Variables):
   ```
   GMAIL_API_KEY=your_gmail_api_key
   GMAIL_CLIENT_ID=your_gmail_client_id
   GMAIL_CLIENT_SECRET=your_gmail_client_secret
   GMAIL_REFRESH_TOKEN=your_gmail_refresh_token
   ```

2. **Fallback Services**:
   - Resend API (if Gmail not configured)
   - Email simulation (for development)

3. **Features**:
   - Professional HTML email templates
   - Task details with priority and status
   - Personal messages from sender
   - Responsive email design
   - Error handling and retry logic

## Profile Management

### Enhanced Profile Features
- **Basic Information**: Full name, bio, job title, company
- **Contact Details**: Phone number, location, website
- **Avatar Management**: Upload and preview profile pictures
- **Professional Display**: Job title and company integration
- **Real-time Updates**: Instant profile synchronization

### Profile Fields
```typescript
interface Profile {
  full_name: string
  bio: string
  phone: string
  location: string
  job_title: string
  company: string
  website: string
  avatar_url: string
}
```

## Database Schema

### Tables
- **profiles**: Enhanced user profile information
- **tasks**: Task management with full CRUD operations
- **shared_tasks**: Task sharing and collaboration

### Security
- Row Level Security (RLS) enabled
- User-specific data access
- Secure file uploads
- Authentication-based permissions

## Getting Started

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Set up Supabase project**
4. **Configure environment variables**
5. **Run development server**: `npm run dev`

## Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Gmail API (Optional)
GMAIL_API_KEY=your_gmail_api_key
GMAIL_CLIENT_ID=your_gmail_client_id
GMAIL_CLIENT_SECRET=your_gmail_client_secret
GMAIL_REFRESH_TOKEN=your_gmail_refresh_token

# Fallback Email Service (Optional)
RESEND_API_KEY=your_resend_api_key
```

## Key Features Implemented

### ✅ Gmail Email Integration
- Professional email templates
- Gmail API integration
- Fallback email services
- Error handling and logging

### ✅ Enhanced Profile Management
- Complete profile editing modal
- Avatar upload with preview
- Professional information fields
- Real-time profile updates

### ✅ Task Management
- Full CRUD operations
- Advanced filtering and sorting
- Calendar integration
- Real-time updates

### ✅ Collaboration
- Task sharing via email
- Personal messages
- Professional email templates
- Database persistence

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details