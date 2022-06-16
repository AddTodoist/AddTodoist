import axios from 'axios';

const deployOAuthURL = process.env.DEPLOY_ENDPOINT_OAUTH;
const deployWebhooksURL = process.env.DEPLOY_ENDPOINT_WEBHOOKS;

if (deployOAuthURL && deployWebhooksURL) {
  await Promise.all([
    axios.get(deployOAuthURL),
    axios.get(deployWebhooksURL)
  ]);
}

