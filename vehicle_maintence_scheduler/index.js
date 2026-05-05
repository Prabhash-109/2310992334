const axios = require("axios");
require("dotenv").config({ path: "../.env" });

const BASE_URL = "http://20.207.122.201/evaluation-service/auth";

async function getToken() {
    try {
        const res = await axios.post(`${BASE_URL}/auth`, {
            email: process.env.EMAIL,
            name: process.env.NAME,
            rollNo: process.env.ROLL_NO,
            accessCode: process.env.ACCESS_CODE,
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET
        });
        return res.data.access_token;
    } catch (error) {
        console.error(" Auth Failed:", error.response?.data || error.message);
        process.exit(1);
    }
}

function findOptimalVehicles(vehicles, maxHours) {
    const n = vehicles.length;
    const dp = Array(n + 1).fill(0).map(() => Array(maxHours + 1).fill(0));

    for (let i = 1; i <= n; i++) {
        const v = vehicles[i - 1];
        const duration = v.Duration;
        const impact = v.Impact;

        for (let w = 0; w <= maxHours; w++) {
            if (duration <= w) {
                dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - duration] + impact);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    let res = dp[n][maxHours];
    let w = maxHours;
    const selectedTasks = [];

    for (let i = n; i > 0 && res > 0; i--) {
        if (res !== dp[i - 1][w]) {
            const v = vehicles[i - 1];
            selectedTasks.push(v.TaskID);
            res -= v.Impact;
            w -= v.Duration;
        }
    }

    return { maxImpact: dp[n][maxHours], selectedTasks };
}

async function runScheduler() {
    console.log(" Authenticating...");
    const token = await getToken();
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
        console.log("📥 Fetching Depots and Vehicles...");
        const [depotRes, vehicleRes] = await Promise.all([
            axios.get(`${BASE_URL}/depots`, config),
            axios.get(`${BASE_URL}/vehicles`, config)
        ]);

        const budget = depotRes.data.depots[0].MechanicHours; 
        const vehicles = vehicleRes.data.vehicles;

        console.log(`Daily Mechanic-Hour Budget: ${budget} hours`);
        console.log(`Total Vehicles Requiring Service: ${vehicles.length}`);
        
        console.log("Calculating optimal schedule...");
        const result = findOptimalVehicles(vehicles, budget);

        console.log(" === OPTIMAL SCHEDULE FOUND ===");
        console.log(`Maximum Impact Score: ${result.maxImpact}`);
        console.log(`Total Tasks Selected: ${result.selectedTasks.length}`);
        console.log(" Selected Task IDs:");
        console.log(result.selectedTasks);

    } catch (error) {
        console.error(" API Error:", error.response?.data || error.message);
    }
}

runScheduler();