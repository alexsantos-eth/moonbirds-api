import { Handler } from '@netlify/functions';
import { bootstrap } from 'src';

let server;
export const handler: Handler = async (event, context, callback) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
