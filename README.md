# College Voting System

A modern, secure, and responsive web-based voting application built with the MERN stack (MongoDB, Express.js, React, Node.js). This system facilitates digital elections for colleges, allowing admins to manage elections and candidates, while students can cast their votes securely and view live results.

## 🚀 Features

### for Users (Voters)
-   **Secure Authentication**: Role-based login access.
-   **Voter Dashboard**: View active, upcoming, and past elections.
-   **Live Voting**: Cast votes securely for various categories in an active election.
-   **Real-time Statistics**: View live voter turnout % and stats while the election is active.
-   **Result Visualization**: View detailed results and winners after the election concludes.
-   **Responsive Design**: Optimized for both desktop and mobile devices.

### for Admins
-   **Admin Dashboard**: comprehensive control panel.
-   **Election Management**: Create, update, and manage election events.
-   **Candidate Management**: Add and approve candidates for specific categories.
-   **Live Monitoring**: Monitor voting progress in real-time.
-   **Results Publication**: Publish official results with a single click.

## 🛠️ Tech Stack

-   **Frontend**: React.js, Tailwind CSS, Framer Motion (for animations), Lucide React (icons), Axios.
-   **Backend**: Node.js, Express.js.
-   **Database**: MongoDB.
-   **Authentication**: JWT (JSON Web Tokens).

## ⚙️ Prerequisites

Ensure you have the following installed:
-   [Node.js](https://nodejs.org/) (v14 or higher)
-   [MongoDB](https://www.mongodb.com/) (Local or Atlas)

## 📦 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd College_Voting_System
    ```

2.  **Install Dependencies**
    You can install dependencies for the root, server, and client simultaneously:
    ```bash
    npm run install:all
    ```
    
    *Alternatively, install manually:*
    ```bash
    # Root
    npm install
    
    # Server
    cd server
    npm install
    
    # Client
    cd ../client
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the `server` directory with the following variables:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key
    ```

4.  **Run the Application**
    Start both the backend server and frontend client with a single command:
    ```bash
    npm run dev
    ```

    -   **Frontend**: [http://localhost:5173](http://localhost:5173)
    -   **Backend**: [http://localhost:5000](http://localhost:5000)

## 📂 Project Structure

```
College_Voting_System/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components (Layout, etc.)
│   │   ├── context/        # Context API (AuthContext)
│   │   ├── pages/          # Page views (Login, Home, Dashboards)
│   │   └── ...
│   └── ...
├── server/                 # Express Backend
│   ├── controllers/        # Business logic
│   ├── models/             # Mongoose Database Models
│   ├── routes/             # API Endpoints
│   └── ...
└── package.json            # Root scripts
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
