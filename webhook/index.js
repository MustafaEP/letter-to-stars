const express = require("express");
const crypto = require("crypto");
const { spawn } = require("child_process");
const fs = require("fs");

const app = express();

// Raw body to verify GitHub HMAC
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

// ENV
const PORT = Number(process.env.PORT || 9000);
const HOST = process.env.HOST || "0.0.0.0"; // host'ta çalışacak
const SECRET = process.env.WEBHOOK_SECRET;  // ZORUNLU
const DEPLOY_SCRIPT = process.env.DEPLOY_SCRIPT || "/opt/letter-to-stars/scripts/deploy.sh";
const LOG_FILE = process.env.WEBHOOK_DEPLOY_LOG || "/opt/letter-to-stars/logs/webhook-deploy.log";
const DEPLOY_BRANCH = process.env.DEPLOY_BRANCH || "main";

if (!SECRET) {
  console.error("WEBHOOK_SECRET is missing. Set it in /opt/letter-to-stars/webhook/.env");
  process.exit(1);
}

function verifySignature(req) {
  const sig = req.headers["x-hub-signature-256"];
  if (!sig || !sig.startsWith("sha256=")) return false;

  const hmac = crypto.createHmac("sha256", SECRET);
  const digest = "sha256=" + hmac.update(req.rawBody || Buffer.from("")).digest("hex");

  if (sig.length !== digest.length) return false;
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(digest));
}

app.get("/health", (_req, res) => res.status(200).json({ ok: true }));

app.post("/deploy", (req, res) => {
  const event = req.headers["x-github-event"];
  const delivery = req.headers["x-github-delivery"];

  // ping
  if (event === "ping") {
    console.log("GitHub ping received", { delivery });
    return res.status(200).send("pong");
  }

  // only push
  if (event !== "push") {
    console.log("Ignored event", { event, delivery });
    return res.status(200).send("ignored");
  }

  // only configured branch
  const ref = req.body && req.body.ref;
  const expectedRef = `refs/heads/${DEPLOY_BRANCH}`;
  if (ref !== expectedRef) {
    console.log("Ignored push to other ref", { ref, expectedRef, delivery });
    return res.status(200).send("ignored");
  }

  // signature
  if (!verifySignature(req)) {
    console.warn("Invalid signature", { delivery });
    return res.status(401).send("Invalid signature");
  }

  // IMPORTANT: respond immediately (prevents 499)
  res.status(200).send("OK");

  // run deploy in background, log to file
  try {
    fs.mkdirSync("/opt/letter-to-stars/logs", { recursive: true });
    const out = fs.openSync(LOG_FILE, "a");
    const err = fs.openSync(LOG_FILE, "a");

    const child = spawn(DEPLOY_SCRIPT, [], {
      detached: true,
      stdio: ["ignore", out, err],
      shell: false,
    });
    child.unref();

    console.log("Deploy started", { delivery });
  } catch (e) {
    console.error("Failed to start deploy", e, { delivery });
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Webhook listening on ${HOST}:${PORT}`);
});
