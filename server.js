const dotenv = require('dotenv');
dotenv.config({ path: './config.env'});

const mongoose = require('mongoose');
const app = require('./app');

process.on('unhandledRejection', err => {
  console.log('Unhandled Rejection Happened, Shutting Down Server...');
  console.log(`Error Message: ${ err.message }`);
  server.close(() => {
    process.exit(1);
  });
});


if(process.env.NODE_ENV === 'development') {  
  const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD).replace('<database>', process.env.MONGO_DB_DEV_DB);
  mongoose.connect(DB, { useUnifiedTopology: true, useNewUrlParser: true,  useFindAndModify: false, useCreateIndex: true}).then(res => console.log('Connected to Development Database.')).catch(err => console.error(err));
} else {
  const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD).replace('<database>', process.env.MONGO_DB_PROD_DB);
  mongoose.connect(DB, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true }).then(res => console.log('Connected to Production Database.'));
}

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Listening to PORT ${PORT}`);
});

process.on('uncaughtException', err => {
  console.log('Uncaught Exception Happened, Shutting Down Server...');
  console.log(`Error Message: ${ err.message }`);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM Recieved, Shutting Down Server Gracefully...');
  server.close(() => {
    console.log('Process Terminated');
  });
});
