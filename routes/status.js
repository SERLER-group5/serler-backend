const express = require('express');
const router = express.Router();
const { Status, validate } = require('../models/status');
const auth = require('../middleware/authenticator');
const admin = require('../middleware/admin');

/**
 * status router
 */
router.get('/', async(req, res)=>{
    const statuses = await Status.find();
    console.log('all the status are: ', statuses);
    res.send(statuses);
});

router.get('/:id', async(req, res)=>{
    const status = await Status.findById(req.params.id);
    console.log('the status of the %s is: ', req.params.id, status);
    if(!status) {
        return res.status(404).send('The status with given id was not found');
    }
    res.send(status);
});

router.post('/', async(req, res)=>{
    console.log('saved info is: ', req.body);
    const {error} = validate(req.body);
    if(error) {
        return res.status(400).send(error.details[0].message);
    }

    const exsitedStatus = await Status.findOne({name: req.body.name});
    if(exsitedStatus) {
        console.log('the saved name has existed!');
        return res.status(400).json({
            msg: 'Status has existed!'
        });
    }

    const status = new Status({
        name: req.body.name
    })
    await status.save();
    res.send(status);
});

router.put('/:id', async(req, res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let updatedStatus = {name: req.body.name};
    try{
        let updatedRs = await Status.findByIdAndUpdate(req.params.id, updatedStatus,{new:true});
        if(!updatedRs) {
            return res.status(404).send('The status with given id was not found');
        }
        res.send(updatedRs);
    }
    catch(err)
    {
        console.error(err);
    }
});

router.delete('/:id', async(req, res)=>{
    const removedStatus = await Status.findByIdAndRemove(req.params.id);
    if(!removedStatus) {
        return res.status(404).send('The status with given id was not found');
    }
    res.send(removedStatus);
});

 module.exports=router;

