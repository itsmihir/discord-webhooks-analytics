const express = require("express");
const app = express();
const geoip = require("geoip-lite");
const cors = require("cors");
const axios = require("axios");

require("dotenv").config();

const corsOptions = {
    // origin: "http://localhost:3000",
    origin: "https://www.mihirkhambhati.tech",
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

const { Webhook, MessageBuilder } = require("discord-webhook-node");

app.post("/portfolio", async (req, res) => {
    const ip = req.ip;
    const details = await axios.get(`http://ipwhois.app/json/${ip}`);

    const currentTime = Date();
    const data = {
        country: details.data.country,
        region: details.data.region,
        city: details.data.city,
        location: `https://www.google.com/maps/search/?api=1&query=${details.data.latitude},${details.data.longitude}`,
        startTime: currentTime,
    };
    const hook = new Webhook(process.env.WEBHOOK_URL);
    const embed = new MessageBuilder()
        .setTitle("New User")
        .setDescription(
            `Country : ${data.country} | Region : ${data.region} | City : ${data.city}`
        )
        .addField("Start Time", data.startTime)
        .addField("Location", data.location)
        .setTimestamp();

    hook.send(embed);
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log("Server running at port", port));
