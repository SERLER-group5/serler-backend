const _= require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

const {User, validate, validateUserEdit} = require('../models/user');
const {Role} = require('../models/role');
const {Gender} = require('../models/gender');
const auth = require('../middleware/authenticator');
const admin = require('../middleware/admin');

// router.get('/',[auth, admin],  async(req, res)=>{
router.get('/', async(req, res)=>{
    const users = await User.find()
    .select("-__v -password");
    res.send(users);
});

router.get('/me', auth, async(req,res)=> {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

router.get('/:id',[auth,admin], async(req, res)=>{
    const user = await User.findById(req.params.id);
    if(!user) return res.status(404).send('The user with given id was not found');
    res.send(user);
});

router.post('/', async(req, res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // find gender and save it
    const gender = await Gender.findById(req.body.genderId);
    if(!gender) return res.status(400).send('Invalid gender');

    // find role as user and save it
    let role = await Role.findOne({name: 'User'});
    if(!role) return res.status(400).send('Role [User] is not registered');

    // make sure user is not already registered
    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send('User has already registered');

    user = new User(_.pick(req.body,['name', 'email', 'password', 'age']));
    user.gender = { _id: gender._id, name: gender.name};
    user.role = { _id: role._id, name: role.name};

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    // const token = jwt.sign({_id: user._id}, config.get('jwtPrivateKey'));
    const token = user.generateToken();
    res.header('x-auth-token', token)
    .header('access-control-expose-headers','x-auth-token')
    .send(_.pick(user,['_id','name', 'email']));
});

// router.put('/:id',[auth, admin], async(req, res)=>{
    router.put('/:id', async(req, res)=>{

    const {error} = validateUserEdit(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    // find gender and save it
    const gender = await Gender.findById(req.body.genderId);
    if(!gender) return res.status(400).send('Invalid gender');

    // find role and save it
    const role = await Role.findById(req.body.roleId);
    if(!role) return res.status(400).send('Invalid Role');

    let user = {
        name: req.body.name,
        gender: { _id: gender._id, name: gender.name},
        role: { _id: role._id, name: role.name},
        age: req.body.age
    };

    try{
        user = await User.findByIdAndUpdate(req.params.id, user, {new:true});
        if(!user) return res.status(404).send('The user with given id was not found');
        res.send(_.pick(user,['_id','name', 'email']));
    }
    catch(err){
        console.error(err);
    }
});

router.delete('/:id',[auth, admin], async(req, res)=>{

    const user = await User.findByIdAndRemove(req.params.id);
    if(!user) return res.status(404).send('The user with given id was not found');
    res.send(user);
});



module.exports = router;