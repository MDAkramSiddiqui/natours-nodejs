const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, './../../config.env')});
const fs = require('fs');
const mongoose = require('mongoose');;
const Tour = require('./../../models/tourModel');
const User = require('./../../models/userModel');
const Review = require('./../../models/reviewModel');

const DB = process.env.MONGO_DB_URL.replace('<password>', process.env.MONGO_DB_PASSWORD).replace('<database>', process.env.MONGO_DB_DEV_DB);
mongoose.connect(DB, { useUnifiedTopology: true, useNewUrlParser: true,  useFindAndModify: false, useCreateIndex: true}).then(res => console.log('Connected to Development Database.'));

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