const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');
// const User = require('./userModel'); // For embedding data 

const { Schema } = mongoose;

const tourSchema = new Schema({
  name: {
    type: String,
    required: [true, 'A tour name is required'],
    unique: true,
    trim: true,
    minlength: [10, 'A tour name minimum length is 10'],
    maxlength: [40, 'A tour name maximum length is 40']
    // validate: [validator.isAlpha, 'A tour name must container alphabest only'] // only for showing that we can use validator module here
  },
  slug: { type: String },
  duration: {
    type: Number,
    required: [true, 'A tour duration is required']
  },
  maxGroupSize: {
    type: Number,
    require: [true, 'A tour maxGroupSize is required']
  },
  difficulty: {
    type: String,
    require: [true, 'A tour difficulty is required'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'A tour difficulty should be easy, medium or difficult.'
    }
  },
  ratingAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'A tour minimum rating should be 1'],
    max: [5, 'A tour maximum rating should be 5']
  },
  ratingQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'A tour price is required']
  },
  priceDiscount: {
    type: Number,
    validate: {
      // this kind of validate can only be used when we are creating Documents and not updating Documents hence for those purposes we JOI schema module
      validator: function(val) {
        return val < this.price;
      },
      message: 'A tour priceDiscount({VALUE}) should be lower than its normal price'
    }
  },
  summary: {
    type: String,
    required: [true, 'A tour summary is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'A tour imageCover is required']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  startDates: [Date],
  secretTour: {
    type: Boolean,
    default: false
  },
  startLocation: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [Number],
    address: String,
    description: String
  },
  locations: [
    {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String,
      day: Number
    }
  ],
  // guides: Array //For embedding data
  guides: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User' // Here it automatically references it to User schemma without even requiring it
    }
  ]
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

//Vitual Properties are those that are not stored in the database as they can be calculated from the data of the database hence we can add these virtual properties so that they don't take any space in these database
tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});


//DOCUMENT Middleware, can only be applied to .save() and .create() functions of mongo documents and can be call multiple times before and after the save or create
//'save' is applicable to both save and create as well
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//1. Embedding data example
// tourSchema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(async el => await User.findById(el));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// tourSchema.pre('save', function(next) {
//   console.log('Will Save Document...');
//   next();
// });

// tourSchema.post('save', function(doc ,next) {
//   console.log(doc);
//   next();
// });

// //QUERY MIDDLEWARE : Just like any normal middleware
// tourSchema.pre('find', function(next) {
//   this.find({ secretTour: { $ne: true } });
//   next();
// });


// tourSchema.pre('findMany', function(next) {
//   this.find({ secretTour: { $ne: true } });
//   next();
// });

//Using RegEx
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });
  
  //can also add data here
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });
  next();
});

tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});


//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
})

module.exports = mongoose.model('Tour', tourSchema);