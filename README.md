# TaskSpace - Beautiful Task Management

A modern, collaborative task management application built with React, TypeScript, and Supabase.

## Features

### 🎯 Task Management
- Create, edit, and delete tasks
- Set priorities (Low, Medium, High)
- Track status (To Do, In Progress, Completed)
- Set due dates with calendar integration
- Rich task descriptions

### 📧 Email Integration & Task Sharing
- **Professional Email Sharing**: Share tasks via email with beautiful HTML templates
- **Multiple Email Services**: Supports Resend, SMTP, and EmailJS
- **Real-time Notifications**: Instant email notifications when tasks are shared
- **Personal Messages**: Add custom messages when sharing tasks
- **Email Templates**: Professional, responsive email designs

### 👥 Collaboration
- Real-time task sharing with team members
- Personal messages with shared tasks
- Beautiful HTML email templates
- Task collaboration tracking

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
- **Email Services**: Resend, SMTP, EmailJS
- **UI Components**: Radix UI, Framer Motion
- **State Management**: React Query, Custom Hooks
- **Build Tool**: Vite

## Email Configuration

### Option 1: Resend (Recommended)
The most reliable email service with excellent deliverability:

1. **Sign up at [Resend](https://resend.com)**
2. **Get your API key**
3. **Set environment variable**:
   ```env
   RESEND_API_KEY=your_resend_api_key
   ```

### Option 2: SMTP (Gmail/Outlook)
Use your existing email provider:

1. **Enable 2-factor authentication**
2. **Generate an app password**
3. **Set environment variables**:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=your_email@gmail.com
   SMTP_PASSWORD=your_app_password
   ```

### Option 3: EmailJS
Simple email service for basic needs:

1. **Sign up at [EmailJS](https://www.emailjs.com)**
2. **Create a service and template**
3. **Set environment variables**:
   ```env
   EMAILJS_SERVICE_ID=your_service_id
   EMAILJS_TEMPLATE_ID=your_template_id
   EMAILJS_USER_ID=your_user_id
   ```

### Email Features
- **Professional HTML Templates**: Beautiful, responsive email designs
- **Task Details**: Complete task information with priority and status
- **Personal Messages**: Custom messages from the sender
- **Responsive Design**: Emails look great on all devices
- **Multiple Fallbacks**: Automatic fallback between email services

## Getting Started

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Set up Supabase project**
4. **Configure email service** (see Email Configuration above)
5. **Set environment variables** (copy `.env.example` to `.env`)
6. **Run development server**: `npm run dev`

## Environment Variables

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Email Service (Choose one)
RESEND_API_KEY=your_resend_api_key

# OR SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# OR EmailJS
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
EMAILJS_USER_ID=your_user_id
```

## Email Setup Instructions

### For Resend (Recommended):
1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add `RESEND_API_KEY=your_key` to your `.env` file

### For Gmail SMTP:
1. Enable 2-factor authentication on your Gmail account
2. Generate an app password: Google Account → Security → App passwords
3. Use the app password (not your regular password) in the SMTP_PASSWORD field

### For EmailJS:
1. Go to [emailjs.com](https://www.emailjs.com)
2. Create a service (Gmail, Outlook, etc.)
3. Create an email template
4. Get your Service ID, Template ID, and User ID

## Database Schema

### Tables
- **profiles**: Enhanced user profile information with professional fields
- **tasks**: Task management with full CRUD operations
- **shared_tasks**: Task sharing and collaboration tracking

### Security
- Row Level Security (RLS) enabled
- User-specific data access
- Secure file uploads
- Authentication-based permissions

## Key Features Implemented

### ✅ Professional Email Integration
- Multiple email service support (Resend, SMTP, EmailJS)
- Beautiful HTML email templates
- Automatic fallback between services
- Detailed email logging and error handling

### ✅ Enhanced Profile Management
- Complete profile editing modal
- Avatar upload with preview
- Professional information fields
- Real-time profile updates

### ✅ Advanced Task Management
- Full CRUD operations
- Advanced filtering and sorting
- Calendar integration with persistent data
- Real-time updates and synchronization

### ✅ Task Collaboration
- Email-based task sharing
- Personal messages with shared tasks
- Professional email templates
- Database persistence for shared tasks

## Troubleshooting Email Issues

### If emails aren't sending:

1. **Check your environment variables** - Make sure they're properly set
2. **Verify email service credentials** - Test with a simple email first
3. **Check the browser console** - Look for detailed error messages
4. **Try different email services** - The app will automatically fallback
5. **Check spam folders** - Emails might be filtered

### Email Service Status:
- The app will show which email service was used in the success message
- If all services fail, it will simulate the email and log details to console
- Check the browser console for detailed email information

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test email functionality thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

---

**Note**: This application includes comprehensive email functionality with multiple service options and automatic fallbacks to ensure reliable email delivery for task sharing.