const express = require('express');
const mongoose = require('mongoose');
const db = require('./config/connection');
const routes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

// Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/social-network', {
//   useFindAndModify: false,
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// API Routes
//app.use('/api/users', require('./routes/api/user-routes'));
// Define routes for thoughts and reactions here...

// Start the server
db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
    });
  });