# AI Resume Builder 🚀

A professional, Zety-inspired AI Resume Builder built with Next.js, Redux, and Prisma. Create, customize, and export stunning resumes with ease.

## ✨ Features

- **Dynamic Templates**: Choose from a variety of professional, ATS-friendly templates.
- **Live Preview**: See your changes in real-time as you type.
- **AI-Powered**: (Optional) Integrated AI features for content generation.
- **Fit to One Page**: Automatically optimize layout to fit content on a single page.
- **Export Options**: Download your resume in PDF, DOCX, or TXT formats.
- **Dashboard**: Manage multiple resumes and cover letters in one place.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15+, React 19, Redux Toolkit, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: MongoDB
- **Authentication**: JWT-based auth
- **Storage**: Cloudinary (for profile images)
- **PDF Generation**: @react-pdf/renderer

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (Local or Atlas)
- Cloudinary Account (for image uploads)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd resume-builder
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_URL="your_mongodb_connection_string"
   JWT_SECRET="your_jwt_secret_key"
   
   # Cloudinary Configuration
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
   CLOUDINARY_API_KEY="your_api_key"
   CLOUDINARY_API_SECRET="your_api_secret"
   ```

4. **Initialize Database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

### Running the Application

- **Development Mode**:
  ```bash
  npm run dev
  ```
  Open [http://localhost:3000](http://localhost:3000) to view the app.

- **Build for Production**:
  ```bash
  npm run build
  npm run start
  ```

## 📂 Project Structure

- `src/app`: Next.js App Router pages and API routes.
- `src/components`: Reusable UI components (Builder, Dashboard, etc.).
- `src/lib`: Utility functions, hooks, and Redux slices.
- `src/styles`: Global styles and Tailwind configuration.
- `prisma`: Database schema and migrations.
- `public`: Static assets and icons.

## 📄 License

This project is licensed under the MIT License.
