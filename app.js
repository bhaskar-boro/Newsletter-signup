const express = require("express");
const bodyParser = require("body-parser");
const request =require("request");
const https = require("https");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

// to use static files like custom css and images
app.use(express.static("public"));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
                {
                  email_address: email,
                  status: "subscribed",
                  merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                  }
                }
              ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us14.api.mailchimp.com/3.0/lists/d5f80cc221";

  const options = {
    method: "POST",
    auth: "anyString:ca96d80ea86e4081a453528a5e8bce34-us14"
  };

  const request  = https.request(url, options, function(response){
    if(response.statusCode === 200){
      res.sendFile(__dirname+"/success.html");
    } else {
      res.sendFile(__dirname+"/failure.html");
    }
    console.log(response.statusCode);
    response.on("data", function(data){
      // console.log(JSON.parse(data));
    })
  });

  // to send the data to mailchimp
  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000");
});

// API Key
// ca96d80ea86e4081a453528a5e8bce34-us14

// list id/ unique id
// d5f80cc221
