import { bootstrap } from '../dist';
import serverless from 'serverless-http';

let server;
export const handler = async () => {
  server = server ?? (await bootstrap());
  return serverless(server);
};
