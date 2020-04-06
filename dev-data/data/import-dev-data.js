const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, './../../config.env')});
const fs = require('fs');
const mongoose = require('mongoose');;
const Tour = require('./../../models/tourModel');
const User = require('./../../models/userModel');
const Review = require('./../../models/reviewModel');

if(process.env.NODE_ENV === 'development') {  
  const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD).replace('<database>', process.env.MONGO_DB_DEV_DB);
  mongoose.connect(DB, { useUnifiedTopology: true, useNewUrlParser: true,  useFindAndModify: false, useCreateIndex: true}).then(res => console.log('Connected to Development Database.')).catch(err => console.error(err));
} else {
  const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD).replace('<database>', process.env.MONGO_DB_PROD_DB);
  mongoose.connect(DB, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true }).then(res => console.log('Connected to Production Database.'));
}

const tourData = JSON.parse(fs.readFileSync(path.join(__dirname, './tours.json'), 'utf-8'));
const userData = JSON.parse(fs.readFileSync(path.join(__dirname, './users.json'), 'utf-8'));
const reviewData = JSON.parse(fs.readFileSync(path.join(__dirname, './reviews.json'), 'utf-8'));

const importData = async () => {
  try{
    await Tour.create(tourData);
    await User.create(userData, { validateBeforeSave: false });
    await Review.create(reviewData);
    console.log('Data imported Successfully');
    process.exit();
  }catch(err) {
    console.log(err+'Data import failed');
    process.exit();
  }
}

const deleteData = async () => {
  try{
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data deleted Successfully');
    process.exit();
  }catch(err) {
    console.log('Data delete failed');
    process.exit();
  }
}

if(process.argv[2] === '--importAll') importData();
else if(process.argv[2] === '--deleteAll') deleteData();

// const fs = require('fs');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const Tour = require('./../../models/tourModel');
// const Review = require('./../../models/reviewModel');
// const User = require('./../../models/userModel');

// dotenv.config({ path: './config.env' });

// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD
// );

// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false
//   })
//   .then(() => console.log('DB connection successful!'));

// // READ JSON FILE
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
// const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
// const reviews = JSON.parse(
//   fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
// );

// // IMPORT DATA INTO DB
// const importData = async () => {
//   try {
//     await Tour.create(tours);
//     await User.create(users, { validateBeforeSave: false });
//     await Review.create(reviews);
//     console.log('Data successfully loaded!');
//   } catch (err) {
//     console.log(err);
//   }
//   process.exit();
// };

// // DELETE ALL DATA FROM DB
// const deleteData = async () => {
//   try {
//     await Tour.deleteMany();
//     await User.deleteMany();
//     await Review.deleteMany();
//     console.log('Data successfully deleted!');
//   } catch (err) {
//     console.log(err);
//   }
//   process.exit();
// };

// if (process.argv[2] === '--import') {
//   importData();
// } else if (process.argv[2] === '--delete') {
//   deleteData();
// }
