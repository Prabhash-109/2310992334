const axios = require("axios");

async function register() {
    const res = await axios.post(
        "http://20.207.122.201/evaluation-service/register",
        {
            email: "prabhash2334.be23@chitkara.edu.in",
            name: "Prabhash Jha",
            mobileNo: "6239639905",
            githubUsername: "Prabhash-109",
            rollNo: "2310992334",
            accessCode: "EXfvDp"
        }
    );

    console.log(res.data);
}

register();