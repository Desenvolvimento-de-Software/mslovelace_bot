import * as dotenv from "dotenv";
import bodyParser from "body-parser";
import express from "express";
import Incoming from "./controller/incoming";

dotenv.config({
    path : __dirname + "/.env"
});

const options = {
    inflate : true,
    limit  : "100kb",
    type   : "application/json"
};

const app = express();
app.use(bodyParser.json(options));

app.post("/incoming", Incoming.index);

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});
