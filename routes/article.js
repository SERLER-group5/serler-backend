const mongoose = require('mongoose');
const Joi = require('joi');
const moment = require('moment');

const analystSchema = new mongoose.Schema({
    name: {type: mongoose.Types.ObjectId, ref: "User"},
    analysedDate: {type: Date, default: Date, get: v => moment(v).format('MMMM Do YYYY, h:mm:ss a')}
});

const moderatorSchema = new mongoose.Schema({
    name: {type: mongoose.Types.ObjectId, ref: "User"},
    moderatedDate: {type: Date, default: Date, get: v => moment(v).format('MMMM Do YYYY, h:mm:ss a')}
});

const rejectorSchema = new mongoose.Schema({
    name: {type: mongoose.Types.ObjectId, ref: "User"},
    rejectedDate: {type: Date, default: Date, get: v => moment(v).format('MMMM Do YYYY, h:mm:ss a')}
});

const articleSchema = new mongoose.Schema({
    title: {type:String, required:true, minlength:5, maxlength:255},
    content: {type:String, trim:true},
    submitter: {type: mongoose.Types.ObjectId, ref: "User",  required: true},
    tags: [ {type:String, trim:true, minlength:2, maxlength:255} ],
    status: {type: mongoose.Types.ObjectId, ref: "Status"},
    moderator: {type: moderatorSchema},
    analyst: {type: analystSchema},
    rejector: {type: rejectorSchema},
    createdDate: {type: Date, default: Date, get: v => moment(v).format('MMMM Do YYYY, h:mm:ss a')},
    updatedDate: {type: Date, default: Date, get: v => moment(v).format('MMMM Do YYYY, h:mm:ss a')}
});

function validateArticle(article){
    const schema = {
        title: Joi.string().min(3).required(),
        submitter: Joi.string().required()
    };
    return Joi.validate(article, schema);
}

const Article = mongoose.model('Article', articleSchema);

exports.articleSchema = articleSchema;
exports.Article = Article;
exports.validate = validateArticle;