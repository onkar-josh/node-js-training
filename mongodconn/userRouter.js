const express = require('express');
const router = express.Router();
const dbConn = require('./mongoConn.js');
const bodyParser = require('body-parser');
const mailFile = require('./mailApi.js');
const validator = require("email-validator");
const validate =require('./validation.js');

 
router.use(bodyParser.json());
router.post('/adduser',function(req,res){
	//mailFile.senderFunction(req.body);
	const myUserValidation = new validate.userValidation(req.body.email,req.body.name,req.body.mobile_no);
	var mail = myUserValidation.validateEmail(req.body.email);
	var name = myUserValidation.validateName(req.body.name);
	var mail = req.body.email;
	
	if(mail && name)
	{
		myUserValidation.checkEmail(mail,function(err,data){
		if(err) throw err;
		console.log(data);
		else if(data == 1)
		{
					res.status(400).json("there is email already in use");
		}
		else
		{
			dbConn.get().collection('userNonDuplicate').insertOne(req.body,function(err,resp){
				if (err)
				{
				throw err;
				}
				console.log(resp.result.n +"document inserted go and check mongo database");
				});		
		}		
		});
	}
	else
	{
		if(mail == false)
		{
			res.status(400).json("not a valid email");
		}
		else if(name == false)
		{
			res.status(400).json("name should only contain characters");
		}
		else
			res.status(400).json("something went wrong");
	}
});


router.get('/',function(req,res){
 dbConn.get().collection("userNonDuplicate").find({}).toArray(function(err, result) {
    if (err) throw err;
    res.json(result);
  });
 });
  
router.get('/finduser/name:name',function(req,res){	
	var myname=(req.params.name);
	console.log(myname);
  dbConn.get().collection("userNonDuplicate").find({}, { projection: { name: myname} }).toArray(function(err, result) {
    if (err)
	{
		result.status(422).json("unprocessed entity");
	}
	else if (result == o)
	{
		result.status(404).json("data not found");
	}
    console.log(result);
	 res.json(result);
  });
 });
  
router.delete('/deleteuser',function(req,res){	
	var myquery = { name: req.body.name};
	console.log(req.body.name);
	dbConn.get().collection("userNonDuplicate").deleteOne(myquery, function(err, obj) {
    if (err)
	{
		res.status(422).json("unprocessed entity");
	}
	else if (obj.result.n  == 0)
	{
		res.status(404).json("data not found");
	}
    console.log(obj.result.n + " document(s) deleted");
  });
 });
  
  
 
router.put('/updateuser',function(req,res){
	//console.log(req.body.name);
	var myquery = { name: req.body.name};
	var newvalues = { $set: {name: req.body.updatedName, email: req.body.updatedEmail } };
	dbConn.get().collection("userNonDuplicate").updateOne(myquery, newvalues, function(err, obj) {
     if (err)
	{
		res.status(422).json("unprocessed entity");
	}
	else if (obj.result.n  == 0)
	{
		res.status(404).json("data not found");
	}
    console.log(obj.result.n +" document updated");
    
  });
});

module.exports = router;

