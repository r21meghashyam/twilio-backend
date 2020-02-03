const http = require('http');
const express = require('express');
var cors = require('cors')
const ClientCapability = require('twilio').jwt.ClientCapability;
const twilio = require('twilio');
var bodyParser = require('body-parser');
var VoiceResponse = twilio.twiml.VoiceResponse;


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({origin:'http://localhost:3000',}))


app.get('/token', function (req, res) {
    var capability = new ClientCapability({
        accountSid: "AC0a47ed2c2e924b2592738b24036b132f",
        authToken: "26301ef7160e99d3e9d652aefbdffd79"
    });
    capability.addScope(
      new ClientCapability.OutgoingClientScope({
        applicationSid: "AP75c10fd6c22772ef2dc8ed89fdc57f18"}));
    capability.addScope(
      new ClientCapability.IncomingClientScope("support_agent"));
  
    var token = capability.toJwt();
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ token: token }));
  });
app.post('/voice', (req, res) => {
  // TODO: Create TwiML response
});

app.post('/call', twilio.webhook({validate: false}), function(req, res, next) {
    var phoneNumber = req.body.phoneNumber;
    var callerId = +17176090847;
    var twiml = new VoiceResponse();
  
    var dial = twiml.dial({callerId : callerId});
    // if (phoneNumber != null) {
    //   dial.number(phoneNumber);
    // } else {
    //   dial.client("support_agent");
    // }
    dial.number("+918123928667");
  
    res.send(twiml.toString());
  });

http.createServer(app).listen(process.env.PORT||80);
console.log('Twilio Client app server running at http://127.0.0.1:1337/');
