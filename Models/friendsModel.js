const mongoose = require('mongoose')

const friendsSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  avatarImage: {
    type: String,
    default: '',
  },
})

module.exports = mongoose.model('Friends', friendsSchema)
