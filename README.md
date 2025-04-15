# Freelix - Freelance Marketplace Platform

Freelix is a full-featured freelance marketplace platform where clients and freelancers connect, collaborate, and get work done. Built with the powerful MERN stack, Freelix offers a seamless experience for project posting, bidding, communication, and secure payments.

---

## 🚀 Tech Stack

-   **Frontend:** React, Tailwind CSS
-   **Backend:** Node.js, Express, MongoDB, Mongoose
-   **Authentication:** JWT
-   **Payment Integration:** Stripe
-   **Other Tools:** AWS S3,Multer, Socket.IO (for real-time chat)

---

## ✨ Features

### For Clients

-   Post jobs with detailed requirements
-   View freelancer profiles and proposals
-   Manage projects
-   Secure payments and release system

### For Freelancers

-   Create and manage profiles with portfolios
-   Browse jobs and send proposals
-   Chat with clients in real-time
-   Track earnings and manage orders

### Admin Dashboard

-   Manage users, jobs, payments, and reports

---

## 📦 Folder Structure (Monorepo)

```
freelix/
├── frontend/         # React frontend
├── backend/          # Node.js backend
└── README.md
```

---

## 🛠️ Installation & Setup

1. Clone the repository:

```bash
git clone https://github.com/your-username/freelix.git
cd freelix
```

2. Install dependencies for both frontend and backend:

```bash
cd frontend && npm install
cd ../backend && npm install
```

3. Set up `.env` files in both folders
   Example .env File
```bash
MAIL_HOST             # SMTP mail server host (e.g., smtp.gmail.com)
SMTP_PORT             # Port for SMTP (usually 587 for TLS)
MAIL_USER             # Email address used to send emails
MAIL_PASS             # Password or app-specific password for the mail account
JWT_SECRET            # Secret key for signing JWT tokens
NODE_ENV              # Environment mode (development | production)
ORIGIN                # Frontend URL (e.g., http://localhost:5173)
PORT                  # Backend server port (e.g., 5000)
MONGODB_ORIGIN        # MongoDB connection string
STRIPE_SECRET         # Stripe secret API key for handling payments
STRIPE_SUCCESS_URL    # Redirect URL on successful payment
STRIPE_CANCEL_URL     # Redirect URL on cancelled payment
AWS_ACCESS_KEY_ID     # AWS access key for S3 uploads
AWS_SECRET_ACCESS_KEY # AWS secret key for S3 uploads
AWS_REGION            # AWS region where your S3 bucket is hosted
AWS_BUCKET_NAME       # Name of your AWS S3 bucket

```

4. Start the development servers:

```bash
# In /client
npm run dev

# In /server
npm run dev
```

---

## 🌍 Deployment

Freelix deployed using:

-   **Frontend:** Vercel
-   **Backend:** AWS EC2 ubuntu
-   **Database:** MongoDB Atlas

---

## 📈 Roadmap

-   [x] Basic job & proposal system
-   [x] Real-time chat feature
-   [x] payment integration
-   [ ] Review & rating system
-   [ ] Notifications (in-app & email)
-   [ ] Mobile responsive UI improvements

---
