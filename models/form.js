const mongoose = require('mongoose');

const form = new mongoose.Schema({
    firstname: String,
    surname: String,
    grade: String,
    applicationForm: String,
    idChild: String,
});

module.exports = mongoose.model('form', form);