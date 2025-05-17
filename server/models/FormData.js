const mongoose = require('mongoose');

const formDataSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  page1: {
    name: String,
    email: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    zipcode: String
  },
  page2: {
    isStudying: String,
    studyLocation: String,
    fieldOfStudy: String,
    degree: String,
    yearStarted: String,
    expectedGraduation: String
  },
  page3: {
    projects: [{
      title: String,
      description: String,
      githubLink: String
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the timestamp before saving
formDataSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const FormData = mongoose.model('FormData', formDataSchema);

module.exports = FormData; 