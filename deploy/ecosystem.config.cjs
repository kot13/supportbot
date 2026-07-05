const path = require("path");

const appRoot = path.join(__dirname, "..");

/** @type {import('pm2').StartOptions[]} */
const apps = [
  {
    name: "supportbot-web",
    cwd: appRoot,
    script: "npm",
    args: "run start",
    instances: 1,
    autorestart: true,
    max_restarts: 10,
    env: {
      NODE_ENV: "production",
      PORT: 3000,
    },
  },
];

// Long polling: enable only when webhook is NOT used (one process per bot token).
if (process.env.SUPPORTBOT_ENABLE_POLL === "1") {
  apps.push({
    name: "supportbot-poll",
    cwd: appRoot,
    script: "npm",
    args: "run telegram:poll",
    instances: 1,
    autorestart: true,
    max_restarts: 10,
    env: {
      NODE_ENV: "production",
    },
  });
}

module.exports = { apps };
