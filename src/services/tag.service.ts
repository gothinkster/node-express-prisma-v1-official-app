import prisma from '../../prisma/prisma-client';

const getTags = async (username?: string): Promise<string[]> => {
  const queries = [];
  queries.push({ demo: true });

  if (username) {
    queries.push({
      username: {
        equals: username,
      },
    });
  }

  const tags = await prisma.tag.groupBy({
    where: {
      articles: {
        some: {},
        every: {
          author: {
            OR: queries,
          },
        },
      },
    },
    by: ['name'],
    orderBy: {
      _count: {
        name: 'desc',
      },
    },
    take: 10,
  });

  return tags.map(tag => tag.name);
};

export default getTags;
