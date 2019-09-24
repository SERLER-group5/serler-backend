const express = require('express');
const {Gender, validate} = require('../models/gender');
const router = express.Router();

router.get('/', async(req, res)=>{
    const genders = await Gender.find();
    res.send(genders);
});

router.get('/:id', async(req, res)=>{
    const gender = await Gender.findById(req.params.id);
    if(!gender) return res.status(404).send('The gender with given id was not found');
    res.send(gender);
});

router.post('/', async (req, res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const existingGender = await Gender.findOne({name: req.body.name});
    if(existingGender) return res.status(400).send('Gender exists');

    const gender = new Gender({
        name: req.body.name
    })
    await gender.save();
    res.send(gender);
});

router.put('/:id', async(req, res)=>{

    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let gender = {name: req.body.name};
    try{
        gender = await Gender.findByIdAndUpdate(req.params.id, gender,{new:true});
        if(!gender) return res.status(404).send('The gender with given id was not found');
        res.send(gender);
    }
    catch(err)
    {
        console.error(err);
    }
});

router.delete('/:id', async(req, res)=>{

    const gender = await Gender.findByIdAndRemove(req.params.id);
    if(!gender) return res.status(404).send('The gender with given id was not found');
    res.send(gender);
});

module.exports = router;