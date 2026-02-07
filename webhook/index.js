const express = require('express');
const { exec } = require('child_process');
const crypto = require('crypto');

const app = express();

// RAW BODY (for HMAC verification)
app.use(
    express.json({
        verify: (req, res, buf) => {
            req.rawBody = buf;
        },
    })
);

const SECRET = "letter-to-stars-secret";

function verifySignature(req) {
    const signature = req.headers["x-hub-signature-256"];
    if (!signature || !signature.startsWith("sha256=")) {
      return false;
    }
  
    const hmac = crypto.createHmac("sha256", SECRET);
    const digest = "sha256=" + hmac.update(req.rawBody).digest("hex");
  
    // Buffer length check (CRITICAL)
    if (signature.length !== digest.length) {
        return false;
    }
  
    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(digest)
    );
}
  


app.post("/deploy", (req, res) => {
    const event = req.headers["x-github-event"];
  
    // 1 - Ping event (GitHub test)
    if (event === "ping") {
      console.log("GitHub ping received");
      return res.status(200).send("pong");
    }
  
    // 2 - Sadece push event kabul et
    if (event !== "push") {
      console.warn("Unsupported GitHub event:", event);
      return res.status(200).send("ignored");
    }
  
    // 3 - HMAC doğrulama
    if (!verifySignature(req)) {
      console.warn("Invalid webhook signature");
      return res.status(401).send("Invalid signature");
    }
  
    console.log("- Verified push webhook received, deploying...");
  
    exec("/opt/letter-to-stars/scripts/deploy.sh", (err, stdout, stderr) => {
      if (err) {
        console.error(stderr);
        return res.status(500).send("Deploy failed");
      }
      console.log("- Deploy script output: " + stdout);
      res.status(200).send("Deploy successful");
    });
  });
  
const PORT = process.env.PORT || 9000;
app.listen(9000, "127.0.0.1", () => {
    console.log(`Webhook listening on 127.0.0.1:${PORT}`);
});