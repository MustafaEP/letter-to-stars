const express = require('express');
const { exec } = require('child_process');

const app = express();
app.use(express.json());

const SECRET = "letter-to-stars-secret";

app.post("/deploy", (req, res) => {
    const signature = req.headers['x-hub-signature'];
    if(!signature) {
        return res.status(401).send("No signature");
    }

    console.log("- Deploy webhook received");

    exec("/opt/letter-to-stars/scripts/deploy.sh", (error, stdout, stderr) => {
        if(err) {
            console.error(stderr);
            return res.status(500).send("Deploy failed");
        }
        console.log("- Deploy script output: " + stdout);
        res.send("Deploy successful");
    });
})

app.listen(9000, () => {
    console.log("- Webhook listener running on port 9000");
})