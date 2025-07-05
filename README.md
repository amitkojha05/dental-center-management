# Dental Center Management Dashboard

A comprehensive dental center management system built with React, Next.js, and TypeScript for the ENTNT technical assignment.

## 🚀 Live Demo

[Deployed Application](https://your-deployed-app-url.vercel.app)

## 📋 Features

### Authentication
- **Role-based access control** with Admin (Dentist) and Patient roles
- **Session persistence** using localStorage
- **Hardcoded demo users** for testing

### Admin Dashboard
- **KPI Overview**: Total patients, pending/completed treatments, revenue tracking
- **Patient Management**: Full CRUD operations for patient records
- **Appointment Management**: Schedule, update, and manage dental appointments
- **Calendar View**: Monthly/weekly view with appointment scheduling
- **File Upload**: Support for treatment records, invoices, and images

### Patient Portal
- **Personal Information**: View patient details and health information
- **Appointment History**: Complete treatment history with costs and files
- **Upcoming Appointments**: View scheduled appointments
- **File Downloads**: Access treatment records and invoices

### Technical Features
- **Responsive Design**: Fully responsive across all devices
- **Data Persistence**: All data stored in localStorage
- **File Handling**: Base64 encoding for file uploads and downloads
- **Form Validation**: Comprehensive form validation throughout
- **State Management**: React Context API for global state

## 🛠️ Technology Stack

- **Frontend**: React 18, Next.js 14, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: React Context API
- **Routing**: Next.js App Router
- **Icons**: Lucide React
- **Data Storage**: localStorage (simulated backend)

## 🏗️ Project Structure

\`\`\`
src/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main application entry
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── AdminDashboard.tsx  # Admin main dashboard
│   ├── PatientDashboard.tsx # Patient portal
│   ├── LoginForm.tsx       # Authentication form
│   ├── PatientManagement.tsx # Patient CRUD operations
│   ├── IncidentManagement.tsx # Appointment management
│   └── CalendarView.tsx    # Calendar interface
└── contexts/
    ├── AuthContext.tsx     # Authentication state
    └── DataContext.tsx     # Application data state
\`\`\`

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-username/dental-center-management.git
   cd dental-center-management
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 👥 Demo Accounts

### Admin (Dentist)
- **Email**: admin@entnt.in
- **Password**: admin123
- **Access**: Full system access

### Patients
- **Email**: john@entnt.in
- **Password**: patient123
- **Access**: Personal data only

- **Email**: jane@entnt.in  
- **Password**: patient123
- **Access**: Personal data only

## 📊 Data Structure

### Users
\`\`\`json
{
  "id": "string",
  "role": "Admin" | "Patient",
  "email": "string",
  "patientId": "string" // for patients only
}
\`\`\`

### Patients
\`\`\`json
{
  "id": "string",
  "name": "string",
  "dob": "string",
  "contact": "string",
  "healthInfo": "string",
  "email": "string"
}
\`\`\`

### Appointments/Incidents
\`\`\`json
{
  "id": "string",
  "patientId": "string",
  "title": "string",
  "description": "string",
  "comments": "string",
  "appointmentDate": "string",
  "cost": "number",
  "treatment": "string",
  "status": "Scheduled" | "Completed" | "Cancelled",
  "nextDate": "string",
  "files": [
    {
      "name": "string",
      "url": "string",
      "type": "string"
    }
  ]
}
\`\`\`

## 🎯 Key Features Implementation

### Authentication System
- Simulated authentication using hardcoded users
- Role-based routing and component rendering
- Session persistence across browser refreshes

### Patient Management
- Complete CRUD operations for patient records
- Form validation for all patient data
- Integration with appointment system

### Appointment System
- Comprehensive appointment scheduling
- Status tracking (Scheduled, Completed, Cancelled)
- Cost and treatment details for completed appointments
- File upload and management system

### Calendar Integration
- Monthly calendar view with appointment visualization
- Click-to-view appointment details
- Navigation between months
- Today highlighting

### File Management
- Base64 encoding for file storage in localStorage
- Support for multiple file types (PDF, images, documents)
- File preview and download functionality
- File removal capabilities

## 🔧 Technical Decisions

### State Management
- **React Context API** chosen over Redux for simplicity
- Separate contexts for authentication and data management
- localStorage integration for data persistence

### Styling Approach
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for consistent, accessible components
- Responsive design principles throughout

### Data Storage
- **localStorage** used to simulate backend database
- JSON structure for complex data relationships
- Base64 encoding for file storage

### Form Handling
- Controlled components for all forms
- Client-side validation
- Error handling and user feedback

## 🚀 Deployment

The application is deployed on Vercel with automatic deployments from the main branch.

### Build Commands

npm run build
npm run start

## 🐛 Known Issues & Limitations

1. **File Storage**: Large files may exceed localStorage limits
2. **Data Persistence**: Data is browser-specific (localStorage)
3. **Concurrent Users**: No real-time synchronization between sessions
4. **File Types**: Limited file type validation on frontend only

## 🔮 Future Enhancements

- Real backend integration with database
- Real-time notifications for appointments
- Advanced reporting and analytics
- Mobile app development
- Integration with dental equipment APIs
- Advanced file management with cloud storage

## 📝 Assignment Requirements Checklist

- ✅ User Authentication (Simulated)
- ✅ Role-based access control
- ✅ Patient Management (Admin-only)
- ✅ Appointment/Incident Management
- ✅ Calendar View
- ✅ Dashboard with KPIs
- ✅ Patient View (Role: Patient)
- ✅ Data Persistence (localStorage)
- ✅ File Upload/Download
- ✅ Responsive Design
- ✅ React Functional Components
- ✅ React Router Navigation
- ✅ Context API State Management
- ✅ Form Validation
- ✅ Meaningful Git History

## 👨‍💻 Developer

**Your Name**
- Email: amitkojha2802@gmail.com
- GitHub: [amitkojha05](https://github.com/amitkojha05)
- LinkedIn: [Amit Kumar Ojha](https://www.linkedin.com/in/amit-kumar-ojha-84a697263)

## 📄 License

This project is created for the ENTNT technical assignment and is not intended for commercial use.
