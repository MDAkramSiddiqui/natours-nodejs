const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;
 
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'A User name is required']
  },
  email: {
    type: String,
    required: [true, 'A User Email is required'],
    unique: true,
    lowercase: true
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'A User Password is required'],
    minlength: 8,
    select: false //So that it will not selected from the database
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please enter your Confirm password'],
    validate: {
      //This will only work for create and save and not the update method directly
      validator: function(el) {
        return el === this.password;
      },
      message: 'Password are not the same.'
    }
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
  active: {
    type: Boolean,
    default: true
  }
});


userSchema.pre('save', async function(next) {
  //only run if the password was modified
  if(!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined; // As we no longer have the need to stored into the database and it also does not create error also setting to undefined will make it non-persistent and thus not be stored in database

  next();
});

userSchema.pre('save', function(next) {
  if(!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//Query Middleware
userSchema.pre(/^find/, function(next) {
  //This points to the current query
  this.find({ active: { $ne: false } });
  next();
});

//Document Instance method available to every document of this User Collection
userSchema.methods.comparePassword = async (candidatePassword, userPassword) => bcrypt.compare(candidatePassword, userPassword);

userSchema.methods.checkPasswordChangedAfter = function(jwtTimestamp) {
  if(this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    //if true that means password has been changed after genereting token and thus new login is required otherwise its fine
    return changedTimestamp > jwtTimestamp;
  }

  return false;
}

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User;