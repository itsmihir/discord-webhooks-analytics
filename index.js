const express = require("express");
const app = express();
const geoip = require("geoip-lite");
const cors = require("cors");

require("dotenv").config();

const corsOptions = {
    origins: ["http://localhost:3000", "https://www.mihirkhambhati.tech"],
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

const { Webhook, MessageBuilder } = require("discord-webhook-node");

app.post("/portfolio", (req, res) => {
    const geo = geoip.lookup(req.ip);
    const startTime = new Date(String(req.body.StartTime));
    const endTime = new Date(String(req.body.EndTime));
    const difference = endTime.getTime() - startTime.getTime(); // This will give difference in milliseconds

    const data = {
        Browser: req.headers["user-agent"],
        Language: req.headers["accept-language"],
        Country: geo ? geo.country : "Unknown",
        Region: geo ? geo.region : "Unknown",
        StartTime: startTime.toLocaleString(),
        EndTime: endTime.toLocaleString(),
        TimeSpendInMinutes: Math.round(difference / 60000),
        TimeSpendInSec: Math.round(difference / 1000),
    };

    const hook = new Webhook(process.env.WEBHOOK_URL);
    const embed = new MessageBuilder()
        .setTitle("New User")
        .setDescription(`Country : ${data.Country} | Region : ${data.Region}`)
        .addField("Time Spend in Minutes", data.TimeSpendInMinutes, true)
        .addField("Time Spend in Seconds", data.TimeSpendInSec, true)
        .addField("Start Time", data.StartTime)
        .addField("End Time", data.EndTime)
        .addField("Browser", data.Browser, true)
        .addField("Language", data.Language, true)
        .setColor("#00b0f4")
        .setTimestamp();

    hook.send(embed);
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log("Server running at port", port));
