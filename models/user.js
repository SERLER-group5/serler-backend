const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const {articleSchema} = require('./article');
const {roleSchema} = require('./role');
const {genderSchema} = require('./gender');

const userSchema = new mongoose.Schema({
    name: {type:String, required:true, minlength:5, maxlength:255, trim:true},
    password: {type:String, required:true, minlength:5, maxlength:1024, trim:true},
    email: {type:String, unique:true},
    gender: {type: genderSchema, required:true},
    role: roleSchema,
    likedArticles : { type: [articleSchema]}
});

function validateUser(user){
    const schema = {
        name: Joi.string().min(3).required(),
        password: Joi.string().min(8).max(255).required(),
        email: Joi.string().min(5).max(255).required().email(),
        genderId: Joi.objectId().required(),
        age: Joi.number()
    };
    return Joi.validate(user, schema);
}
function validateUserEdit(user){
    const schema = {
        name: Joi.string().min(3).required(),
        genderId: Joi.objectId().required(),
        roleId: Joi.objectId().required(),
        age: Joi.number()
    };
    return Joi.validate(user, schema);
}
userSchema.methods.generateToken = function(){
    const token = jwt.sign({_id: this._id, role: this.role.name, name: this.name}, config.get('jwtPrivateKey'));
    return token;
}
const User = mongoose.model('User', userSchema);

exports.userSchema = userSchema;
exports.User = User;
exports.validate = validateUser;
exports.validateUserEdit = validateUserEdit;
