module.exports = {
  apps: [{
    name: 'webhook',
    script: './index.js',
    cwd: '/opt/letter-to-stars/webhook',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '200M',
    env: {
      NODE_ENV: 'production',
      PORT: 9000,
      HOST: '0.0.0.0',
      WEBHOOK_SECRET: 'portakal-vps-deploy-secret',
      DEPLOY_SCRIPT: '/opt/letter-to-stars/scripts/deploy.sh',
      WEBHOOK_DEPLOY_LOG: '/opt/letter-to-stars/logs/webhook-deploy.log',
      DEPLOY_BRANCH: 'main'
    },
    error_file: '/opt/letter-to-stars/logs/webhook-error.log',
    out_file: '/opt/letter-to-stars/logs/webhook-out.log',
    time: true
  }]
};
