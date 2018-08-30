var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RequestSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Code'
  },
  status: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Request', RequestSchema);
