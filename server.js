/*!
 * csv_parser server script
 * Copyright(c) 2018 Lijo E John
 * MIT Licensed
 */
 //express module for http
var express = require("express"),
app     = express(),
//path module for get the relative path of asset folder
path = require('path'),
//csv_morningtrain module for csv parsing
csv_morningtrain = require('csv-morningtrain'),
assetsPath = path.join(__dirname, 'assets');
app.use(express.static(assetsPath));

//Default route to load the DOM in browser
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/dashboard.html'));
  //__dirname : It will resolve to your project folder.
});

// It's very crucial that the file name matches the name attribute in your html
// Node server action to parse the CSV
app.post('/file_upload', function(req, res)
{
	//Match the auth token.
	//For demo use we are using the static token.
	//Once we switch to production env we can use the user based token authentication.
	var matches = req.headers.authorization.match(/Bearer\s(\S+)/);
	if(typeof matches[1] == "undefined" || matches[1]!='$2y$10$whagl5tjn3JZkVjRLrTF6OoCLkyI0QS6QzsWaR7HEPLFTWBIyM69i')
	{
		//Auth fails
		res.json({"status":0});
	}
	else
	{
		//If authentication is successfull the parse the csv using our custom module.
		csv_morningtrain.parsecsv(req,res);
	}
});
//Node server listening to the port 3000
app.listen(3000);