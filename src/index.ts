import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { CronJob } from 'cron';
import bodyParser from 'body-parser';
import prisma from '../prisma/prisma-client';
import routes from './routes/routes';
import { generateFakeData } from './utils/cron';
import HttpException from './models/http-exception.model';
import swaggerDocument from '../docs/swagger.json';

const app = express();

/**
 * App Configuration
 */

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);

// Serves images
app.use(express.static('public'));

app.get('/', (req: Request, res: Response) => {
  res.json({ status: 'API is running on /api' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/api-docs', (req: Request, res: Response) => {
  res.json({
    swagger:
      'the API documentation  is now available on https://realworld-temp-api.herokuapp.com/api',
  });
});

/* eslint-disable */
app.use((err: Error | HttpException, req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  if (err && err.errorCode) {
    // @ts-ignore
    res.status(err.errorCode).json(err.message);
  } else if (err) {
    res.status(404).send(`error: 404 Not Found ${req.path}`);
  }
});

const production = process.env.NODE_ENV === 'production';
if (production) {
  // triggered on Sundays at 12AM
  const job = new CronJob('00 00 12 * * 0', async () => {
    await prisma.article.deleteMany({
      where: {
        author: {
          demo: false,
        },
      },
    });
    await prisma.comment.deleteMany({
      where: {
        author: {
          demo: false,
        },
      },
    });
    await prisma.tag.deleteMany({});
  });
  job.start();

  generateFakeData();
}

/**
 * Server activation
 */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.info(`server up on port ${PORT}`);
});
