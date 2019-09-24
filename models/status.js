const mongoose = require('mongoose');
const Joi = require('joi');

const statusSchema = new mongoose.Schema({
    name: {type:String, required:true, trim:true, minlength:5, maxlength:255}
});

function validateStatus(status){
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(status, schema);
}

const Status = mongoose.model('Status', statusSchema);

exports.statusSchema = statusSchema;
exports.Status = Status;
exports.validate = validateStatus;