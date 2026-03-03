import 'dotenv/config';

export default {
  port: parseInt(process.env.PORT || '3000', 10),
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  signingMode: process.env.SIGNING_MODE || 'mock',
  signinghub: {
    apiUrl: process.env.SIGNINGHUB_API_URL,
    clientId: process.env.SIGNINGHUB_CLIENT_ID,
    clientSecret: process.env.SIGNINGHUB_CLIENT_SECRET,
    scope: process.env.SIGNINGHUB_SCOPE,
  },
  graph: {
    tenantId: process.env.GRAPH_TENANT_ID,
    clientId: process.env.GRAPH_CLIENT_ID,
    clientSecret: process.env.GRAPH_CLIENT_SECRET,
  },
};
