const http = require('http');
const express = require('express');
var cors = require('cors')
const ClientCapability = require('twilio').jwt.ClientCapability;
const twilio = require('twilio');
var bodyParser = require('body-parser');
const dotenv = require('dotenv');
var VoiceResponse = twilio.twiml.VoiceResponse;
dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({origin:'http://localhost:3000',}))
app.use(express.static('public'))


app.get('/token', function (req, res) {
    var capability = new ClientCapability({
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN
    });
    capability.addScope(
      new ClientCapability.OutgoingClientScope({
        applicationSid: process.env.TWILIO_APPLICATION_SID}));
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
    var callerId = process.env.TWILIO_PHONE_NUMBER;
    var twiml = new VoiceResponse();
  
    var dial = twiml.dial({callerId : callerId});
    // if (phoneNumber != null) {
    //   dial.number(phoneNumber);
    // } else {
    //   dial.client("support_agent");
    // }
    dial.number(phoneNumber||"+918123928667");
  
    res.send(twiml.toString());
  });

http.createServer(app).listen(process.env.PORT||80);
console.log(`Twilio Client app server running at http://localhost:${process.env.PORT||80}/`);
