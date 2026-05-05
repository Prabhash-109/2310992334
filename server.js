const express = require("express");
const Log = require("./logger");

const app = express();

app.get("/", async (req, res) => {
    await Log("backend", "info", "route", "Home page opened");
    res.send("Home Page");
});

app.get("/user", async (req, res) => {
    await Log("backend", "debug", "controller", "User data fetched");
    res.send("User Page");
});

app.get("/error", async (req, res) => {
    await Log("backend", "error", "handler", "Something went wrong");
    res.send("Error Page");
});

app.listen(3000, () => {
    console.log(" Server running on port http://localhost:3000");
});