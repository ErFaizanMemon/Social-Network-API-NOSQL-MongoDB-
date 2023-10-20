// const { connect, connection } = require('mongoose');

// // After you create your Heroku application, visit https://dashboard.heroku.com/apps/ select the application name and add your Atlas connection string as a Config Var
// // Node will look for this environment variable and if it exists, it will use it. Otherwise, it will assume that you are running this application locally
// const connectionString =
//   process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mighty-lowlands-82912';
  
  
// // 127.0.0.1:27017
// connect(connectionString);
//   //,{
//   //   useFindAndModify: false,
//   // useNewUrlParser: true,
//   // useUnifiedTopology: true,


// module.exports = connection;

const { connect, connection } = require('mongoose');

// After you create your Heroku application, visit https://dashboard.heroku.com/apps/
// Select the application name and add your Atlas connection string as a Config Var
// Node will look for this environment variable and if it exists, it will use it.
// Otherwise, it will assume that you are running this application locally

const connectionString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mighty-lowlands-82912';

// Connect to the MongoDB database
connect(connectionString, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  // useFindAndModify: false,
});

// Create a reference to the MongoDB connection
const db = connection;

// Event listeners for MongoDB connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to the MongoDB database.');
});

module.exports = db;
