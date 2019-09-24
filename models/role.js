const mongoose = require('mongoose');
const Joi = require('joi');

const roleSchema = new mongoose.Schema({
    name: {type:String, required:true, trim:true, minlength:3, maxlength:255}
});

function validateRole(role){
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(role, schema);
}

const Role = mongoose.model('Role', roleSchema);

exports.roleSchema = roleSchema;
exports.Role = Role;
exports.validate = validateRole;