# Syncly

Syncly is a full-stack social media platform built using the MERN stack. It includes realtime messaging, group chats, stories, notifications, post sharing, tagged posts, saved posts, and many other features inspired by modern social networking apps.

## Features

### Social Features

* Authentication & Authorization
* User Profiles
* Follow / Unfollow Users
* Create Posts
* Like & Comment on Posts
* Saved Posts
* Tagged Posts
* Tagged Users
* Stories
* Notifications
* Explore Page
* Admin Ban / Unban System

### Messaging

* Realtime Direct Messages
* Realtime Group Chats
* Reply to Messages
* Read Receipts
* Typing Indicators
* Image & Video Sharing
* Shared Post Cards
* Delete Messages

### Group Chats

* Create Groups
* Change Group Name
* Change Group Avatar
* Add Members
* Remove Members
* Promote Admins
* Multiple Group Admins
* Leave Group
* Delete Group
* Automatic Admin Transfer
* Group Information Panel

## Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Zustand
* Socket.io Client

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Socket.io
* JWT Authentication

### Services

* MongoDB Atlas
* Cloudinary

## Project Structure

```txt
syncly/
├── client/
│   ├── src/
│   ├── public/
│   └── ...
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── ...
│
└── README.md
```

## Local Setup

### Clone Repository

```bash
git clone <repo-url>
cd syncly
```

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

## Environment Variables

Create a `.env` file inside the server folder and add:

```env
MONGODB_URI=
JWT_SECRET=
REFRESH_TOKEN_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Create a `.env` file inside the client folder and add:

```env
VITE_API_URL=http://localhost:5000
```

## Future Improvements

* Voice Messages
* Video Calling
* Message Reactions
* End-to-End Encryption
* Progressive Web App Support

## Author

Built by Hujef Khan.
