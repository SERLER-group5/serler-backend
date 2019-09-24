const mongoose = require('mongoose');
const Joi = require('joi');

const genderSchema = new mongoose.Schema({
    name: {type:String, required:true, trim:true, minlength:2, maxlength:255}
});

function validateGender(gender){
    const schema = {
        name: Joi.string().min(2).required()
    };
    return Joi.validate(gender, schema);
}

const Gender = mongoose.model('Gender', genderSchema);

exports.genderSchema = genderSchema;
exports.Gender = Gender;
exports.validate = validateGender;