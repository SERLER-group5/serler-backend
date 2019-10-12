const _ = require('lodash');
const express = require('express');
const router = express.Router();
const {Article, validate} = require('../models/article');
const {Status} = require('../models/status');
const { Role } = require('../models/role');
const { User } = require('../models/user');
const auth = require('../middleware/authenticator');
const admin = require('../middleware/admin');

/**
 * article router
 */
router.get('/', async(req, res)=>{
    const articles = await Article.find();
    console.log('all articles are: ', articles);
    res.send(articles);
});

router.get('/:id', async(req, res)=>{
    const article = await Article.findById(req.params.id);
    console.log('the article of %s is: ', req.params.id, article);
    if (!article) {
        return res.status(404).send('The article with given id was not found');
    }
    res.send(article);
});

router.post('/', async(req, res)=>{
    console.log('newly added article is: ', req.body);
    const validatedFields = {
        title: req.body.title,
        submitter: req.body.submitter
    };
    const { error } = validate(validatedFields);
    if (error) {
        console.log('error information: ', error.details[0].message);
        return res.status(400).send(error.details[0].message);
    }

    const sumitter = await User.findById(req.body.submitter);
    if (!sumitter) {
        return res.status(400).send('Not found the submitter of the current article.');
    }

    const submittedStatus = await Status.findOne({name: 'submitted'});
    if (!submittedStatus) {
        return res.status(400).send('Has no status data for article to choose');
    }

    // get the tags string and split with the comma
    let tagStr = req.body.tags;
    let tags = [];
    if (tagStr) {
        tags = tagStr.split(';');
    }
    article = new Article(_.pick(req.body, ['title', 'content', 'submitter']));
    article.status = submittedStatus._id;
    article.tags = tags;
    await article.save();

    res.send(article);
});

router.put('/:id', async(req, res)=>{
    let updatedStatus = req.body;
    try{
        let updatedRs = await Article.findByIdAndUpdate(req.params.id, updatedStatus,{new:true});
        if(!updatedRs) {
            return res.status(404).send('The article with given id was not found');
        }
        res.send(updatedRs);
    }
    catch(err)
    {
        console.error(err);
    }
});

router.delete('/:id', async(req, res)=>{
    const removedArticle = await Article.findByIdAndRemove(req.params.id);
    if(!removedArticle) {
        return res.status(404).send('The article with given id was not found');
    }
    res.send(removedArticle);
});


 module.exports=router;
