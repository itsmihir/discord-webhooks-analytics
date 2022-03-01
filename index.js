const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");

require("dotenv").config();

const corsOptions = {
    origin: [
        "https://mihirkhambhati.tech",
        "https://tender-torvalds-a1ae7b.netlify.app",
    ],
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

const { Webhook, MessageBuilder } = require("discord-webhook-node");

app.post("/portfolio", async (req, res) => {
    const ip = req.body.ip;
    console.log(ip);
    const details = await axios.get(`https://ipapi.co/${ip}/json`);
    const currentTime = Date();
    const data = {
        country: details.data.country_name,
        region: details.data.region,
        city: details.data.city,
        location: `https://www.google.com/maps/search/?api=1&query=${details.data.latitude},${details.data.longitude}`,
        startTime: currentTime,
        userId: req.body.userId,
        organisation: details.data.org,
    };
    const hook = new Webhook(process.env.WEBHOOK_URL);
    const embed = new MessageBuilder()
        .setTitle("New User")
        .setDescription(
            `Country : ${data.country} | Region : ${data.region} | City : ${data.city} | User Id: ${data.userId}`
        )
        .addField("Start Time", data.startTime)
        .addField("Location", data.location)
        .addField("ISP", data.organisation)
        .setTimestamp();

    hook.send(embed);
    res.sendStatus(200);
});

app.post("/portfolio/action", async (req, res) => {

    const currentTime = Date();
    const data = {
        startTime: currentTime,
        userId: req.body.userId,
        link: req.body.link,
        event: req.body.event
    };
    const hook = new Webhook(process.env.WEBHOOK_URL);
    const embed = new MessageBuilder()
        .setTitle("Action")
        .setDescription(
            `User Id: ${data.userId} | Event: ${data.event}`
        )
        .addField("URL", data.link)
        .addField("Start Time", data.startTime)
        .setTimestamp();

    hook.send(embed);
    res.sendStatus(200);
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log("Server running at port", port));
