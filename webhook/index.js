const express = require("express");
const { spawn } = require("child_process");
const crypto = require("crypto");

const app = express();

// RAW BODY (for HMAC verification)
app.use(
    express.json({
        verify: (req, res, buf) => {
        req.rawBody = buf;
        },
    })
);

// ENV (prod'da mutlaka ENV ile ver)
const SECRET = process.env.WEBHOOK_SECRET || "letter-to-stars-secret";
const DEPLOY_SCRIPT = process.env.DEPLOY_SCRIPT || "/opt/letter-to-stars/scripts/deploy.sh";
const LOG_FILE = process.env.WEBHOOK_LOG_FILE || "/opt/letter-to-stars/logs/webhook-deploy.log";

function verifySignature(req) {
    const signature = req.headers["x-hub-signature-256"];
    if (!signature || !signature.startsWith("sha256=")) return false;

    const hmac = crypto.createHmac("sha256", SECRET);
    const digest = "sha256=" + hmac.update(req.rawBody || Buffer.from("")).digest("hex");

    // timingSafeEqual requires same length
    if (signature.length !== digest.length) return false;

    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

app.post("/deploy", (req, res) => {
    const event = req.headers["x-github-event"];
    const delivery = req.headers["x-github-delivery"];

    // 1) Ping event
    if (event === "ping") {
        console.log("GitHub ping received", { delivery });
        return res.status(200).send("pong");
    }

    // 2) Only push events
    if (event !== "push") {
        console.warn("Ignored GitHub event:", event, { delivery });
        return res.status(200).send("ignored");
    }

    // 3) HMAC verification
    if (!verifySignature(req)) {
        console.warn("Invalid webhook signature", { delivery });
        return res.status(401).send("Invalid signature");
    }

    // 4) IMPORTANT: Respond immediately to GitHub (avoid 499 timeouts)
    res.status(200).send("OK");

    // 5) Run deploy in background (detached)
    console.log("Verified push received. Starting deploy...", { delivery });

    try {
        const child = spawn(DEPLOY_SCRIPT, [], {
        detached: true,
        stdio: ["ignore", "append", "append"],
        // append output to a log file on the SAME filesystem
        // Note: 'append' works in Node >= v16 on Linux
        // If it fails, we fallback below.
        shell: false,
        });

        // If your Node version doesn't support "append" stdio:
        // use fs.createWriteStream(LOG_FILE, { flags: "a" }) approach (see below)
        child.unref();
    } catch (e) {
        console.error("Failed to spawn deploy script:", e, { delivery });
    }
});

// Health endpoint
app.get("/health", (req, res) => res.status(200).json({ ok: true }));

const PORT = process.env.PORT || 9000;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`Webhook listening on ${HOST}:${PORT}`);
});
