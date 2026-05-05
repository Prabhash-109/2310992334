const axios = require("axios");
require("dotenv").config();

let token = "";

// 🔹 Get Token
async function getToken() {
    const res = await axios.post(
        "http://20.207.122.201/evaluation-service/auth",
        {
            email: process.env.EMAIL,
            name: process.env.NAME,
            rollNo: process.env.ROLL_NO,
            accessCode: process.env.ACCESS_CODE,
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET
        }
    );

    token = res.data.access_token;
}

async function Log(stack, level, pkg, message) {
    try {
        if (!token) {
            await getToken();
        }

        const res = await axios.post(
            "http://20.207.122.201/evaluation-service/logs",
            {
                stack: stack,
                level: level,
                package: pkg,
                message: message
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        console.log("Log Sent:", res.data.message);
    } catch (err) {
        console.error("Log Error:", err.message);
    }
}

module.exports = Log;