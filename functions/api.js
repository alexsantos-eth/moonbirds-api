import { bootstrap } from 'dist';

let server;
export const handler = async (event, context, callback) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
