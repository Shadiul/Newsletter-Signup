const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {

  const fs = require('fs');

  var apiKey = fs.readFileSync('apiKey.txt').toString();
  var listID = fs.readFileSync('listID.txt').toString();

  console.log(apiKey);
  console.log(listID);

  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;

  var data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  }

  var jsonData = JSON.stringify(data);

  var options = {
    url: "https://us19.api.mailchimp.com/3.0/lists/" + listID,
    method: "POST",
    headers: {
      "Authorization": "username " + apiKey
    },
    body: jsonData
  };

  request(options, function(error, response, body) {
    if (error) {
      console.log(error);
      res.sendFile(__dirname + "/failure.html");
    } else {

      if (response.statusCode === 200) {
        console.log('Resposne Code: ' + response.statusCode);
        console.log('First Name   : ' + firstName);
        console.log('Last Name    : ' + lastName);
        console.log('Email        : ' + email);
        console.log('------------------------------------------');
        res.sendFile(__dirname + "/success.html")
      } else {
        console.log(response.statusCode);
        res.sendFile(__dirname + "/failure.html");
      }

    }
  });
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen(3000, function() {
  console.log("Server is running on port 3000");
});
