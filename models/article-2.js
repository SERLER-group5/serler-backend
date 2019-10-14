
const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema;

const { statusSchema } = require('./status');

const submitterSchema = new mongoose.Schema({
    name: { type: String, required: false, minlength: 5, maxlength: 255, trim: true },
    submittedDate: { type: Date, required: true, default: Date.now }
});

const analystSchema = new mongoose.Schema({
    name: { type: String, required: false, minlength: 5, maxlength: 255, trim: true },
    analysedDate: Date
});

const moderatorSchema = new mongoose.Schema({
    name: { type: String, required: false, minlength: 5, maxlength: 255, trim: true },
    moderatedDate: Date
});

const rejectorSchema = new mongoose.Schema({
    name: { type: String, required: false, minlength: 5, maxlength: 255, trim: true },
    rejectedDate: Date
});

const articleSchema = new Schema({
    papertitle: { type: String, required: true, trim: true, minlength: 5, maxlength: 255 },
    author: { type: String, required: false },
    year: { type: Number, required: true  },
    source: { type: String, required: true },
    publisher: { type: String },
    number: { type: Number},
    pages: { type: String},
    link: { type: String, required: true },
    submitter: { type: submitterSchema, required: false },
    tags: [{ type: String, required: false, trim: true, minlength: 2, maxlength: 255 }],
    status: { type: statusSchema, required: false },
    moderator: { type: moderatorSchema, required: false  },
    analyst: { type: analystSchema, required: false  },
    rejector: { type: rejectorSchema, required: false  },
    noOfLikes: { type: Number, required: false, default: 0, min: 0 }
    
});
/*
function validateArticle(article) {
    const schema = {
        papertitle: Joi.string().min(3).required(),
        author: Joi.array().required(),
        year: Joi.number(),
        source: Joi.string().min(3).required(),
        publisher: Joi.string().min(3),
        number: Joi.number(),
        pages: Joi.number(),
        link: Joi.string()
    };
    return Joi.validate(article, schema);
    */

    module.exports = mongoose.model("Article", articleSchema)

