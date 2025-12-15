# LuxCart - E-Commerce Platform

A full-stack e-commerce application built with Next.js, Express.js, and PostgreSQL.

![LuxCart](https://img.shields.io/badge/LuxCart-E--Commerce-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Express](https://img.shields.io/badge/Express-5-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)

## 🚀 Features

### Customer Features
- **Product Browsing** - View products with images, prices, and categories
- **Search & Filter** - Search by name, filter by category and price range
- **Shopping Cart** - Add/remove items, adjust quantities
- **Checkout** - Place orders with shipping information
- **User Authentication** - Register and login

### Admin Features
- **Dashboard** - View revenue, orders, and product stats
- **Product Management** - Add, edit, delete products with image upload
- **Order Management** - View all orders
- **Role-Based Access** - Protected admin routes

### Technical Features
- **JWT Authentication** - Secure token-based auth
- **Cloudinary Integration** - Image upload and storage
- **Responsive Design** - Works on all devices
- **Real-time Cart** - Persistent cart with Zustand

---

## 📁 Project Structure

```
next-postgres-ecommerce/
├── frontend/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   │   ├── admin/       # Admin dashboard pages
│   │   │   ├── products/    # Products page
│   │   │   ├── cart/        # Shopping cart
│   │   │   ├── checkout/    # Checkout page
│   │   │   ├── login/       # Login page
│   │   │   ├── register/    # Registration page
│   │   │   └── account/     # User account page
│   │   ├── components/      # Reusable components
│   │   ├── lib/             # API utilities
│   │   └── store/           # Zustand state stores
│   └── package.json
│
├── backend/                  # Express.js Backend
│   ├── src/
│   │   ├── config/          # Database & Cloudinary config
│   │   ├── middleware/      # Auth middleware
│   │   └── routes/          # API routes
│   ├── .env                 # Environment variables
│   └── package.json
│
└── README.md
```

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v15 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)
- **Cloudinary Account** (for image uploads) - [Sign up free](https://cloudinary.com/)

---

## ⚙️ Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd next-postgres-ecommerce
```

### Step 2: Set Up PostgreSQL Database

1. Open PostgreSQL shell (psql):
```bash
psql -U postgres
```

2. Create the database:
```sql
CREATE DATABASE ecommerce_db;
```

3. Add role column to users (after first run):
```sql
\c ecommerce_db
ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user';
```

### Step 3: Configure Backend Environment

1. Navigate to backend folder:
```bash
cd backend
```

2. Create `.env` file with the following:
```env
# PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# Server Configuration
PORT=5000

# JWT Secret (use any random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Cloudinary Configuration (get from cloudinary.com dashboard)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

3. Install dependencies:
```bash
npm install
```

### Step 4: Configure Frontend

1. Navigate to frontend folder:
```bash
cd ../frontend
```

2. Install dependencies:
```bash
npm install
```

---

## 🚀 Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

Backend will run on: `http://localhost:5000`

### Start Frontend Server

```bash
cd frontend
npm run dev
```

Frontend will run on: `http://localhost:3000`

---

## 👤 Default Admin Account

After running the backend for the first time, create an admin user:

```powershell
# Windows PowerShell
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -ContentType "application/json" -Body '{"email":"admin@example.com","name":"Admin","password":"admin123"}'
```

Then set their role to admin in psql:
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

**Login credentials:**
- Email: `admin@example.com`
- Password: `admin123`

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product (admin) |
| PUT | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Delete product (admin) |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |
| POST | `/api/categories` | Create category |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders/:id` | Get order by ID |
| POST | `/api/orders` | Create new order |

### Stats (Admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats` | Get dashboard statistics |

---

## 🔧 Technologies Used

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Zustand** - State management
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend
- **Express.js 5** - Node.js framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Cloudinary** - Image storage
- **Multer** - File uploads

---

## 📝 Environment Variables Reference

### Backend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `DB_HOST` | PostgreSQL host | Yes |
| `DB_PORT` | PostgreSQL port | Yes |
| `DB_NAME` | Database name | Yes |
| `DB_USER` | Database user | Yes |
| `DB_PASSWORD` | Database password | Yes |
| `PORT` | Server port | No (default: 5000) |
| `JWT_SECRET` | Secret for JWT tokens | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |

---

## 🐛 Troubleshooting

### "client password must be a string" error
Make sure `DB_PASSWORD` is set correctly in `.env` and the file is saved.

### Hydration error in browser
This is caused by browser extensions like Grammarly. The app has `suppressHydrationWarning` to ignore it.

### Images not showing
1. Check Cloudinary credentials in `.env`
2. Restart the backend server
3. Re-upload images via admin panel

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Credits

Built as a learning project for full-stack development with modern web technologies.
