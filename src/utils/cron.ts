import { createUser } from '../services/auth.service';
import { RegisteredUser } from '../models/registered-user.model';
import { createArticle } from '../services/article.service';

export const generateUser = async (): Promise<RegisteredUser> =>
  createUser({
    username: 'Gerome',
    email: 'gerome@me',
    password: (process.env.FAKE_PASSWORD as string) || '123456',
    image: 'https://realworld-temp-api.herokuapp.com/images/demo-avatar.png',
    demo: true,
  });

export const generateFakeData = async (): Promise<void> => {
  const user = await generateUser();

  await createArticle(
    {
      title: 'Welcome to RealWorld project',
      description:
        'Exemplary fullstack Medium.com clone powered by React, Angular, Node, Django, and many more',
      body: 'See how the exact same Medium.com clone (called Conduit) is built using different frontends and backends. Yes, you can mix and match them, because they all adhere to the same API spec',
      tagList: ['welcome', 'introduction'],
    },
    user.username,
  );
};
