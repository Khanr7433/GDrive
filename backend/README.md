# GDrive - Cloud Storage Solution

A Node.js-based cloud storage application that allows users to upload, store, and manage their files securely.

## Features

- **User Authentication**: Secure registration and login system using JWT tokens
- **File Upload**: Upload files with support for various file types
- **File Management**: View and download uploaded files
- **Secure Storage**: Files are stored securely with user-specific access control
- **Responsive UI**: Modern, responsive interface using Tailwind CSS
- **Cloud Storage Ready**: Configurable for Google Cloud Storage or local storage

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens), bcrypt for password hashing
- **File Upload**: Multer (with Google Cloud Storage support)
- **Frontend**: EJS templates, Tailwind CSS, Flowbite components
- **Validation**: Express Validator

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd GDrive
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   - Copy `.env.example` to `.env`
   - Configure your environment variables:
     ```
     PORT=3000
     MONGO_URI=mongodb://localhost:27017/gdrive
     JWT_SECRET=your_jwt_secret_key_here
     ```

4. **Database Setup**

   - Make sure MongoDB is running
   - The application will connect automatically using the MONGO_URI

5. **Start the application**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## Configuration

### Local Storage (Default)

Files are stored locally in the `uploads/` directory.

### Google Cloud Storage (Optional)

To use Google Cloud Storage:

1. Create a Google Cloud project and enable Cloud Storage API
2. Create a storage bucket
3. Create a service account with Storage Admin permissions
4. Download the service account JSON key file or use environment variables
5. Update your `.env` file with Google Cloud Storage configuration
6. Set `USE_GOOGLE_CLOUD_STORAGE=true`

For detailed setup instructions, see `GOOGLE_CLOUD_STORAGE_SETUP.md`.

## API Endpoints

### Authentication

- `GET /user/register` - Registration page
- `POST /user/register` - Register new user
- `GET /user/login` - Login page
- `POST /user/login` - User login

### File Operations

- `GET /home` - Dashboard with user files
- `POST /upload` - Upload file
- `GET /download/:path` - Download file

## Usage

1. **Register**: Create a new account at `/user/register`
2. **Login**: Sign in at `/user/login`
3. **Upload Files**: Use the upload button on the dashboard
4. **Manage Files**: View and download your files from the dashboard

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- User-specific file access control
- Input validation and sanitization
- CSRF protection ready

## Dependencies

### Production

- express: Web framework
- mongoose: MongoDB object modeling
- bcrypt: Password hashing
- jsonwebtoken: JWT implementation
- multer: File upload handling
- ejs: Template engine
- express-validator: Input validation
- cookie-parser: Cookie parsing
- dotenv: Environment variable management
- @google-cloud/storage: Google Cloud Storage integration (optional)
- multer-google-storage: Google Cloud Storage for multer (optional)

### Development

- nodemon: Development server with auto-reload

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, please open an issue in the repository or contact the maintainer.
