# Freelix - Freelance Marketplace Platform

Freelix is a full-featured freelance marketplace platform where clients and freelancers connect, collaborate, and get work done. Built with the powerful MERN stack, Freelix offers a seamless experience for project posting, bidding, communication, and secure payments.

---

## 🚀 Tech Stack
- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Authentication:** JWT
- **Payment Integration:** Stripe
- **Other Tools:** AWS S3,Multer, Socket.IO (for real-time chat)

---

## ✨ Features
### For Clients
- Post jobs with detailed requirements
- View freelancer profiles and proposals
- Manage projects
- Secure payments and release system

### For Freelancers
- Create and manage profiles with portfolios
- Browse jobs and send proposals
- Chat with clients in real-time
- Track earnings and manage orders

### Admin Dashboard
- Manage users, jobs, payments, and reports


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
- **Frontend:** Vercel
- **Backend:** AWS EC2 ubuntu
- **Database:** MongoDB Atlas

---

## 📈 Roadmap
- [x] Basic job & proposal system
- [x] Real-time chat feature
- [x] payment integration
- [ ] Review & rating system
- [ ] Notifications (in-app & email)
- [ ] Mobile responsive UI improvements

---

