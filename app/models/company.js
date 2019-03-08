var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validate = require('mongoose-validator');

var CompanySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  logo:{
    type: String
  },
  majors: [{
    type: String,
    required: true
  }],
  overview: {
    type: String,
    required: true
  },
  mission: {
    type: String,
    required: true
  },
  goals: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  news: {
    type: String,
    required: true
  },
  apply: {
    type: String,
    required: true
  },
  industry: [{
    type: String,
    required: true
  }],
  slogan: {
    type: String,
    required: true
  },
  academia: {
    type: Boolean,
    default: false
  },
  government: {
    type: Boolean,
    default: false
  },
  nonprofit:{
    type: Boolean,
    default: false
  },
  international: {
    type: Boolean,
    default: false
  },
  bbq: {
    type: Boolean,
    default: false
  },
  national: {
    type: Boolean,
    default: false
  },
  sponsor: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Company', CompanySchema);
