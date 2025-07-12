const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { app, server } = require('./lib/socket');  // Express + socket.io setup
const path = require('path');
require('dotenv').config();

// Port config
const PORT = process.env.PORT || 5000;
const originalAppUse = app.use.bind(app);

app.use = function (path, ...handlers) {
  if (typeof path === 'string') {
    console.log('🛠 REGISTERING ROUTE:', `"${path}"`);
  }
  return originalAppUse(path, ...handlers);
};

// ✅ Optional: Health check or base route
app.get('/', (req, res) => {
  res.send('🚀 Backend running');
});

// ✅ Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log('✅ Socket.IO server ready');
      console.log('✅ MongoDB connected');
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });


// ✅ Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',  // Change to your frontend URL on Render
  credentials: true,
}));

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);


// ✅ Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const indexPath = path.join(__dirname, '../frontend/dist/index.html');

  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) => {
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('Frontend not found');
    }
  });
} // ✅ <-- this brace must be there!
