
const express = require('express');
const app = express();
const router = express.Router();

const Article = require('../models/article');

router.post('/addmanual', async(req, res)=>{
  const article = new Article(req.body);
  article.save()
  .then(article => {
    res.json('article added');
  })
  .catch(err => {
    console.log(err)
    res.json(err);
    });
});

module.exports = router;

