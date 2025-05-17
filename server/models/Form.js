const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
    studyLocation: String
  },
  page3: {
    projects: [{
      title: String,
      description: String,
      githubLink: String,
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Form = mongoose.model('Form', formSchema);

module.exports = Form; 