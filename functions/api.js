import { bootstrap } from '../dist';
import serverless from '@vendia/serverless-express';

let server;
export const handler = async (event, context, callback) => {
  server = server ?? (await bootstrap());
  const serverVendia = serverless({ app: server });
  return serverVendia(event, context, callback);
};
