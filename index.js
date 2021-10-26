const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");

require("dotenv").config();

const corsOptions = {
    origins: [
        "https://www.mihirkhambhati.tech",
        "https://tender-torvalds-a1ae7b.netlify.app",
        // "https://localhost:3000",
    ],
    optionsSuccessStatus: 200,
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
        organisation: details.data.org,
    };
    const hook = new Webhook(process.env.WEBHOOK_URL);
    const embed = new MessageBuilder()
        .setTitle("New User")
        .setDescription(
            `Country : ${data.country} | Region : ${data.region} | City : ${data.city}`
        )
        .addField("Start Time", data.startTime)
        .addField("Location", data.location)
        .addField("ISP", data.organisation)
        .setTimestamp();

    hook.send(embed);
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log("Server running at port", port));
