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
    const articles = await Article.find().populate(["status", "submitter"]).sort({createdDate: -1});
    const result = []
    articles.forEach(article => {
        result.push(_.pick(article, ['_id', 'title', 'status.name', 'submitter.name']));
    });
    console.log('all articles are: ', result);
    res.send(articles);
});

router.post('/condition/query', async(req, res) => {
    let params = req.body;
    let query = {};
    if (params.title) {
        query.title = {$regex:`${params.title}`};
    }
    if (params.tags) {
        query.tags = {$in: params.tags.split(';')}
    }
    if (params.submitter) {
        let queryUser = await User.findOne({name: params.submitter});
        if (!queryUser) {
            return res.status(200).send('No query result');
        }
        query.submitter = queryUser._id;
    }

    let articles = await Article.find(query).populate(["status", "submitter"]).sort({createdDate: -1});
    const result = [];
    articles.forEach(article => {
        result.push(_.pick(article, ['_id', 'title', 'status.name', 'submitter.name','createdDate']));
    });
    res.send(result);
});

router.get('/:id', async(req, res)=>{
    const article = await Article.findById(req.params.id).populate(["status", "submitter"]);
    console.log('the article of %s is: ', req.params.id, article);
    if (!article) {
        return res.status(404).send('The article with given id was not found');
    }
    const result = _.pick(article, ['_id', 'title', 'tags', 'content', 'status.name', 'submitter.name', 'createdDate']);
    if (article.moderator) {
        let moderator = await User.findById(article.moderator.name);
        result.moderator = {
            _id: moderator._id,
            name: moderator.name,
            moderatedDate: article.moderator.moderatedDate
        };
    }
    if (article.analyst) {
        let analyst = await User.findById(article.analyst.name);
        result.analyst = {
            _id: analyst._id,
            name: analyst.name,
            analysedDate: article.analyst.analysedDate
        };
    }
    if (article.rejector) {
        let rejector = await User.findById(article.rejector.name);
        result.rejector = {
            _id: rejector._id,
            name: rejector.name,
            rejectedDate: article.rejector.rejectedDate
        };
    }
    res.send(result);
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
        console.log('Not found the submitter of the current article.');
        return res.status(400).send('Not found the submitter of the current article.');
    }

    const submittedStatus = await Status.findOne({name: 'submitted'});
    if (!submittedStatus) {
        console.log('Has no status data for article to choose');
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
