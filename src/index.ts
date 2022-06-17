// NEST
import { NestFactory } from '@nestjs/core';

// EXPRESS
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

// APP
import { AppModule } from './app.module';

// PIPES
import { ValidationPipe } from '@nestjs/common';
import { join, resolve } from 'path';
import cors from 'cors';

const expressServer = express();
const staticFolder = resolve('.', 'docs');

/**
 * It creates a NestJS application, sets up some middleware,
 * and returns the application
 * @returns The app is being returned.
 */
export const getApp = async () => {
  // SERVER
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressServer),
  );
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();
  app.setGlobalPrefix('/v1');

  return app;
};

/**
 * It creates a new Express server,
 * sets up the routes for the documentation, and then starts
 */
export async function bootstrap() {
  // DOCS ABSOLUTE
  expressServer.get('/v1/docs', (_req, res) => {
    res.sendFile(join(staticFolder, 'index.html'));
  });

  // DOCS API
  const router = express.Router();
  router.use(
    cors({
      allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'X-Access-Token',
      ],
      credentials: true,
      methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
      origin: '*',
      preflightContinue: false,
    }),
  );
  expressServer.use('/v1/docs', express.static(staticFolder));
  expressServer.use('/functions/api', router);

  // INICAR
  // const app = await getApp();
  // await app.listen(4000);
  await getApp();
  return expressServer;
}
