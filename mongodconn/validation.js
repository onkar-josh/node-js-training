const dbConn = require('./mongoConn.js');

class userValidation
{
	constructor(name, email, mobileNo){ 
        this.name = name; 
        this.email = email; 
        this.mobileNo= mobileNo; 
    } 
	
checkEmail(mail,callback)
{	
	var myresult;
	var query = { email: mail};
		dbConn.get().collection("userNonDuplicate").find(query).toArray(function(err, result) {
			if (err) throw err;
			console.log(result.length);	
			return callback(null,result.length);
			});
}
	
validateEmail(mail) 
{
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    return (true);
  }
    return (false);
}

validateName(name) 
{
	if (name == "")
	{
		return (false);
	}
	else if (/\s|[0-9]/.test(name))
	{
	return (false);
	}
	 return (true);
}

validateMobile(mobile) 
{
	if (mobile == "")
	{
		return (false);
	}
	else if (/[0-9]{10,10}/.test(mobile))
	{
	return (false);
	}
	 return (true);
}
}
module.exports = {
	userValidation
}

