const mongoose = require('mongoose');
const Joi = require('joi');

const {statusSchema} = require('./status');

const submitterSchema = new mongoose.Schema({
    name: {type: String, required:true,  minlength:5, maxlength:255, trim:true},
    submittedDate: {type:Date, required:true, default:Date.now}
});

const analystSchema = new mongoose.Schema({
    name: {type: String, required:true,  minlength:5, maxlength:255, trim:true},
    analysedDate: Date
});

const moderatorSchema = new mongoose.Schema({
    name: {type: String, required:true,  minlength:5, maxlength:255, trim:true},
    moderatedDate: Date
});

const rejectorSchema = new mongoose.Schema({
    name: {type: String, required:true,  minlength:5, maxlength:255, trim:true},
    rejectedDate: Date
});

const articleSchema = new mongoose.Schema({
    name: {type:String, required:true, trim:true, minlength:5, maxlength:255},
    submitter: {type:submitterSchema, required:true},
    tags: [ {type:String, trim:true, minlength:2, maxlength:255} ],
    status: {type: statusSchema},
    moderator: {type: moderatorSchema},
    analyst: {type: analystSchema},
    rejector: {type: rejectorSchema},
    noOfLikes: {type:Number,required:true, default:0, min:0}
});

function validateArticle(article){
    const schema = {
        name: Joi.string().min(3).required(),
        submitterId: Joi.objectId().required(),
        tags: Joi.array()
    };
    return Joi.validate(article, schema);
}

const Article = mongoose.model('Article', articleSchema);

exports.articleSchema = articleSchema;
exports.Article = Article;
exports.validate = validateArticle;