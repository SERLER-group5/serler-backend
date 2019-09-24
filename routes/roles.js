const express = require("express");
const { Role, validate } = require("../models/role");
const auth = require("../middleware/authenticator");
const admin = require("../middleware/admin");

const router = express.Router();

//router.get('/',auth, async(req, res)=>{
router.get("/", async (req, res) => {
  const roles = await Role.find();
  res.send(roles);
});

router.get("/:id", [auth, admin], auth, async (req, res) => {
  const role = await Role.findById(req.params.id);
  if (!role)
    return res.status(404).send("The role with given id was not found");
  res.send(role);
});

// router.post('/',[auth, admin], async (req, res)=>{
router.post("/", async (req, res) => {
  console.log(req.params);
  console.log(req.body);
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const existingRole = await Role.findOne({ name: req.body.name });
  if (existingRole) return res.status(400).send("Role exists");

  const role = new Role({
    name: req.body.name
  });

  await role.save();
  res.send(role);
});

router.put("/:id", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let role = { name: req.body.name };
  try {
    role = await Role.findByIdAndUpdate(req.params.id, role, { new: true });
    if (!role)
      return res.status(404).send("The role with given id was not found");
    res.send(role);
  } catch (err) {
    console.error(err);
  }
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const role = await Role.findByIdAndRemove(req.params.id);
  if (!role)
    return res.status(404).send("The role with given id was not found");
  res.send(role);
});

module.exports = router;
