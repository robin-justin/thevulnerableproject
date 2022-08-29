const mysql = require('mysql');
const express = require('express');
const path = require('path');
const libxmljs = require("libxmljs");
const xpath = require("xpath");
const dom = require('xmldom').DOMParser
const fs = require("fs");

/* const session = require('express-session'); */

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: 'nodelogin',
  password: ""
});

const app = express();

/* app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
})); */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/* app.use(express.static(path.join(__dirname, 'static'))); */


app.get('/', (req, res) => {
	app.use(express.static("Base"));
	// Render login template
	res.sendFile(path.join(__dirname + '/Base/base.html'));
});

app.get('/sqlinject_present', (req, res) => {
	app.use(express.static("SQLInjection_Present"));
	// Render login template
	res.sendFile(path.join(__dirname + '/SQLInjection_Present/indexSQLpresent.html'));
});

app.post('/sqlinject_present', (req, res) => {
	// Capture the input fields
	let uname = req.body.username;
	let pword = req.body.password;
    console.log(uname,pword)
	// Ensure the input fields exists and are not empty
	if (uname && pword) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		const quer = con.query("SELECT * FROM accounts WHERE username = '"+uname+"' AND password = '"+pword+"'", /* [uname, pword], */ (err, results,fields) => {
			quer;
			console.log(quer.sql);
			if (err)
			{
				res.status(400).send('Unknown Error Occured, Please try again later');
				res.end();
			}
			// If the account exists
			else{
				if (results.length > 0) {
				// Authenticate the user
                console.log(results)
				/* request.session.loggedin = true;
				request.session.username = username; */
                username = results[0].username;
                email = results[0].email;
                res.send('Welcome back, ' + username + '! :) Your email is ' + email);
				// Redirect to home page
				/* res.redirect('/home'); */
			} else {
				res.status(400).send('Incorrect Username and/or Password!');
			}			
			res.end();}
		});
	} else {
		res.status(400).send('Please enter Username and Password!');
	}
});

app.get('/sqlinject_fixed', (req, res) => {
	app.use(express.static("SQLInjection_Fixed"));
	res.sendFile(path.join(__dirname + '/SQLInjection_Fixed/indexSQLfixed.html'));
});

app.post('/sqlinject_fixed', (req, res) => {
	let uname = req.body.username;
	let pword = req.body.password;
    console.log(uname,pword)
	if (uname && pword) {
		const quer = con.query("SELECT * FROM accounts WHERE username = ? AND password = ? ", [uname, pword], (err, results,fields) => {
			quer;
			console.log(quer.sql);
			if (err) throw err;
			if (results.length > 0) {
                console.log(results)
                username = results[0].username;
                email = results[0].email;
                res.send('Welcome back, ' + username + '! :)\nYour email is ' + email);
			} else {
				res.status(400).send('Incorrect Username and/or Password!');
			}			
			res.end();
		});
	} 
});

app.get('/simpledomxss_present', (req, res) => {
	app.use(express.static("SimpleDOMXSS_Present"));
	res.sendFile(path.join(__dirname + '/SimpleDOMXSS_Present/indexDOMpresent.html'));

});

app.get('/simpledomxss_fixed', (req,res) =>{
	app.use(express.static("SimpleDOMXSS_Fixed"));
	res.sendFile(path.join(__dirname + '/SimpleDOMXSS_Fixed/indexDOMfixed.html'));
})

app.get('/xxe_present', (req, res) =>{
	app.use(express.static("XXE_Present"));
	res.sendFile(path.join(__dirname + '/XXE_Present/indexXXEpresent.html'));
	/* fs.readFile(__dirname + '/XXE_Present/Studeets.xml', (error, data) => {
		if(error) {throw error;}
		xmldata = data.toString();
		const xmlDoc = libxmljs.parseXml(xmldata, {noent: true});
		console.log(xmlDoc.toString())
	}) */
});

app.post('/xxe_present', (req, res) =>{	
	let thingpassedtobackend = req.body.passthistothebackend;
/* fs.readFile(__dirname + '/XXE_Present/Studeets.xml', (error, data) => {
	if(error) {throw error;} */
	/* console.log(thingpassedtobackend); */
	parsedxml = libxmljs.parseXmlString(thingpassedtobackend, {noent: true}).toString();
	res.header('Content-Type', 'application/xml');
	res.send(JSON.stringify({status: "ok"}));
	app.get('/xxe/present_res', (req,res) =>{
		/* res.header('Content-Type', 'application/xml')
		res.send(parsedxml) */
		
		var doc = new dom().parseFromString(parsedxml);
		const nodes = xpath.select("//Title", doc);
		var arr= [];
		if (nodes.length >3)
		{
			res.header('Content-Type', 'application/text')
			res.status(400).send("Couldn't process your request. Please try again later")

		}
		for(i=0; i<3; i++)
		{
			arr[i] = (nodes[i].localName + ": " + nodes[i].firstChild.data)
			console.log(nodes[i].toString());
		}
		console.log(arr[1])
		res.header('Content-Type', 'application/xml');
		res.send(JSON.stringify(arr));

		//payload: "<?xml version=\"1.0\" encoding=\"UTF-8\"?><!DOCTYPE XXE[<!ENTITY hack SYSTEM 'file:///C:/Users/Administrator.REDSEC-DC/Documents/nodelogin/XXE_Present/passwd.txt'>]><Music><Title>&hack;</Title><Title>Still got the blues</Title><Title>Unchain my heart</Title></Music>"
	})
})

app.get('/xxe_fixed', (req, res) =>{
	app.use(express.static("XXE_Fixed"));
	res.sendFile(path.join(__dirname + '/XXE_Fixed/indexXXEfixed.html'));
});

app.post('/xxe_fixed', (req, res) =>{	
	let thingpassedtobackend = req.body.passthistothebackend;
	parsedxml = libxmljs.parseXmlString(thingpassedtobackend, {noent: false}).toString();
	res.header('Content-Type', 'application/json');
	res.send(JSON.stringify({status: "ok"}));
	app.get('/xxe/fixed_res', (req,res) =>{
		var doc = new dom().parseFromString(parsedxml);
		const nodes = xpath.select("//Title", doc);
		var arr= [];
		if (nodes.length >3)
		{
			res.header('Content-Type', 'application/text')
			res.status(400).send("Couldn't process your request. Please try again later")

		}
		for(i=0; i<3; i++)
		{
			arr[i] = (nodes[i].localName + ": " + nodes[i].firstChild.data)
			console.log(nodes[i].toString());
		}
		res.header('Content-Type', 'application/xml');
		res.send(JSON.stringify(arr));

		//payload: "<?xml version=\"1.0\" encoding=\"UTF-8\"?><!DOCTYPE XXE[<!ENTITY hack SYSTEM 'file:///C:/Users/Administrator.REDSEC-DC/Documents/nodelogin/XXE_Present/passwd.txt'>]><Music><Title>&hack;</Title><Title>Still got the blues</Title><Title>Unchain my heart</Title></Music>"
	})
})



	





// http://localhost:3000/home
/* app.get('/home', function(request, response) {
	// If the user is loggedin
	if (request.session.loggedin) {
		// Output username
		response.send('Welcome back, ' + request.session.username + '!\nYour email is ' + request.session.email);
	} else {
		// Not logged in
		response.send('Please login to view this page!');
	}
	response.end();
}); */

app.listen(3000);