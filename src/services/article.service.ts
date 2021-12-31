import slugify from 'slugify';
import prisma from '../../prisma/prisma-client';
import HttpException from '../models/http-exception.model';
import { findUserIdByUsername } from './auth.service';
import profileMapper from '../utils/profile.utils';

const buildFindAllQuery = (query: any, username: string | undefined) => {
  const queries: any = [];
  const orAuthorQuery = [];
  const andAuthorQuery = [];

  if (username) {
    orAuthorQuery.push({
      username: {
        equals: username,
      },
    });
  }

  if ('author' in query) {
    andAuthorQuery.push({
      username: {
        equals: query.author,
      },
    });
  }

  const authorQuery = {
    author: {
      OR: orAuthorQuery,
      AND: andAuthorQuery,
    },
  };

  queries.push(authorQuery);

  if ('tag' in query) {
    queries.push({
      tagList: {
        some: {
          name: query.tag,
        },
      },
    });
  }

  if ('favorited' in query) {
    queries.push({
      favoritedBy: {
        some: {
          username: {
            equals: query.favorited,
          },
        },
      },
    });
  }

  return queries;
};

export const getArticles = async (query: any, username?: string) => {
  const andQueries = buildFindAllQuery(query, username);
  const articlesCount = await prisma.article.count({
    where: {
      AND: andQueries,
    },
  });

  const articles = await prisma.article.findMany({
    where: { AND: andQueries },
    orderBy: {
      createdAt: 'desc',
    },
    skip: Number(query.offset) || 0,
    take: Number(query.limit) || 10,
    include: {
      tagList: {
        select: {
          name: true,
        },
      },
      author: {
        select: {
          username: true,
          bio: true,
          image: true,
          followedBy: true,
        },
      },
      favoritedBy: true,
      _count: {
        select: {
          favoritedBy: true,
        },
      },
    },
  });

  return {
    articles: articles.map(({ authorId, id, _count, favoritedBy, ...article }) => ({
      ...article,
      author: profileMapper(article.author, username),
      tagList: article.tagList.map(tag => tag.name),
      favoritesCount: _count?.favoritedBy,
      favorited: favoritedBy.some(item => item.username === username),
    })),
    articlesCount,
  };
};

export const getFeed = async (offset: number, limit: number, username: string) => {
  const user = await findUserIdByUsername(username);

  const articlesCount = await prisma.article.count({
    where: {
      author: {
        followedBy: { some: { id: user?.id } },
      },
    },
  });

  const articles = await prisma.article.findMany({
    where: {
      author: {
        followedBy: { some: { id: user?.id } },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    skip: offset || 0,
    take: limit || 10,
    include: {
      tagList: {
        select: {
          name: true,
        },
      },
      author: {
        select: {
          username: true,
          bio: true,
          image: true,
          followedBy: true,
        },
      },
      favoritedBy: true,
      _count: {
        select: {
          favoritedBy: true,
        },
      },
    },
  });

  return {
    articles: articles.map(({ authorId, id, _count, favoritedBy, ...article }) => ({
      ...article,
      author: profileMapper(article.author, username),
      tagList: article.tagList.map(tag => tag.name),
      favoritesCount: _count?.favoritedBy,
      favorited: favoritedBy.some(item => item.username === username),
    })),
    articlesCount,
  };
};

export const createArticle = async (article: any, username: string) => {
  const { title, description, body, tagList } = article;

  if (!title) {
    throw new HttpException(422, { errors: { title: ["can't be blank"] } });
  }

  if (!description) {
    throw new HttpException(422, { errors: { description: ["can't be blank"] } });
  }

  if (!body) {
    throw new HttpException(422, { errors: { body: ["can't be blank"] } });
  }

  const user = await findUserIdByUsername(username);

  const slug = `${slugify(title)}-${user?.id}`;

  const existingTitle = await prisma.article.findUnique({
    where: {
      slug,
    },
    select: {
      slug: true,
    },
  });

  if (existingTitle) {
    throw new HttpException(422, { errors: { title: ['must be unique'] } });
  }

  const { authorId, id, ...createdArticle } = await prisma.article.create({
    data: {
      title,
      description,
      body,
      slug,
      tagList: {
        connectOrCreate: tagList.map((tag: string) => ({
          create: { name: tag },
          where: { name: tag },
        })),
      },
      author: {
        connect: {
          id: user?.id,
        },
      },
    },
    include: {
      tagList: {
        select: {
          name: true,
        },
      },
      author: {
        select: {
          username: true,
          bio: true,
          image: true,
        },
      },
      favoritedBy: true,
      _count: {
        select: {
          favoritedBy: true,
        },
      },
    },
  });

  return {
    ...createdArticle,
    tagList: createdArticle.tagList.map(tag => tag.name),
    favoritesCount: createdArticle._count?.favoritedBy,
    favorited: createdArticle.favoritedBy.some(item => item.username === username),
  };
};

export const getArticle = async (slug: string, username?: string) => {
  const article = await prisma.article.findUnique({
    where: {
      slug,
    },
    include: {
      tagList: {
        select: {
          name: true,
        },
      },
      author: {
        select: {
          username: true,
          bio: true,
          image: true,
          followedBy: true,
        },
      },
      favoritedBy: true,
      _count: {
        select: {
          favoritedBy: true,
        },
      },
    },
  });

  return {
    title: article?.title,
    slug: article?.slug,
    body: article?.body,
    description: article?.description,
    createdAt: article?.createdAt,
    updatedAt: article?.updatedAt,
    tagList: article?.tagList.map(tag => tag.name),
    favoritesCount: article?._count?.favoritedBy,
    favorited: article?.favoritedBy.some(item => item.username === username),
    author: {
      ...article?.author,
      following: article?.author.followedBy.some(follow => follow.username === username),
    },
  };
};

const disconnectArticlesTags = async (slug: string) => {
  await prisma.article.update({
    where: {
      slug,
    },
    data: {
      tagList: {
        set: [],
      },
    },
  });
};

export const updateArticle = async (article: any, slug: string, username: string) => {
  let newSlug = null;
  const user = await findUserIdByUsername(username);

  if (article.title) {
    newSlug = `${slugify(article.title)}-${user?.id}`;

    if (newSlug !== slug) {
      const existingTitle = await prisma.article.findFirst({
        where: {
          slug: newSlug,
        },
        select: {
          slug: true,
        },
      });

      if (existingTitle) {
        throw new HttpException(422, { errors: { title: ['must be unique'] } });
      }
    }
  }

  const tagList = article.tagList?.length
    ? article.tagList.map((tag: string) => ({
        create: { name: tag },
        where: { name: tag },
      }))
    : [];

  await disconnectArticlesTags(slug);

  const updatedArticle = await prisma.article.update({
    where: {
      slug,
    },
    data: {
      ...(article.title ? { title: article.title } : {}),
      ...(article.body ? { body: article.body } : {}),
      ...(article.description ? { description: article.description } : {}),
      ...(newSlug ? { slug: newSlug } : {}),
      updatedAt: new Date(),
      tagList: {
        connectOrCreate: tagList,
      },
    },
    include: {
      tagList: {
        select: {
          name: true,
        },
      },
      author: {
        select: {
          username: true,
          bio: true,
          image: true,
        },
      },
      favoritedBy: true,
      _count: {
        select: {
          favoritedBy: true,
        },
      },
    },
  });

  return {
    title: updatedArticle?.title,
    slug: updatedArticle?.slug,
    body: updatedArticle?.body,
    description: updatedArticle?.description,
    createdAt: updatedArticle?.createdAt,
    updatedAt: updatedArticle?.updatedAt,
    tagList: updatedArticle?.tagList.map(tag => tag.name),
    favoritesCount: updatedArticle?._count?.favoritedBy,
    favorited: updatedArticle?.favoritedBy.some(item => item.username === username),
    author: updatedArticle?.author,
  };
};

export const deleteArticle = async (slug: string) => {
  await prisma.article.delete({
    where: {
      slug,
    },
  });
};

export const getCommentsByArticle = async (slug: string, username?: string) => {
  const queries = [];

  if (username) {
    queries.push({
      author: {
        username,
      },
    });
  }

  const comments = await prisma.article.findUnique({
    where: {
      slug,
    },
    include: {
      comments: {
        where: {
          OR: queries,
        },
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          body: true,
          author: {
            select: {
              username: true,
              bio: true,
              image: true,
              followedBy: true,
            },
          },
        },
      },
    },
  });

  const result = comments?.comments.map(comment => ({
    ...comment,
    author: {
      username: comment.author.username,
      bio: comment.author.bio,
      image: comment.author.image,
      following: comment.author.followedBy.some(follow => follow.username === username),
    },
  }));

  return result;
};

export const addComment = async (body: string, slug: string, username: string) => {
  if (!body) {
    throw new HttpException(422, { errors: { body: ["can't be blank"] } });
  }

  const user = await findUserIdByUsername(username);

  const article = await prisma.article.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
    },
  });

  const comment = await prisma.comment.create({
    data: {
      body,
      article: {
        connect: {
          id: article?.id,
        },
      },
      author: {
        connect: {
          id: user?.id,
        },
      },
    },
    include: {
      author: {
        select: {
          username: true,
          bio: true,
          image: true,
          followedBy: true,
        },
      },
    },
  });

  return {
    id: comment.id,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    body: comment.body,
    author: {
      username: comment.author.username,
      bio: comment.author.bio,
      image: comment.author.image,
      following: comment.author.followedBy.some(follow => follow.id === user?.id),
    },
  };
};

export const deleteComment = async (id: number, username: string) => {
  const comment = await prisma.comment.findFirst({
    where: {
      id,
      author: {
        username,
      },
    },
  });

  if (!comment) {
    throw new HttpException(201, {});
  }

  await prisma.comment.delete({
    where: {
      id,
    },
  });
};

export const favoriteArticle = async (slugPayload: string, usernameAuth: string) => {
  const user = await findUserIdByUsername(usernameAuth);

  const { _count, ...article } = await prisma.article.update({
    where: {
      slug: slugPayload,
    },
    data: {
      favoritedBy: {
        connect: {
          id: user?.id,
        },
      },
    },
    include: {
      tagList: {
        select: {
          name: true,
        },
      },
      author: {
        select: {
          username: true,
          bio: true,
          image: true,
          followedBy: true,
        },
      },
      favoritedBy: true,
      _count: {
        select: {
          favoritedBy: true,
        },
      },
    },
  });

  const result = {
    ...article,
    author: profileMapper(article.author, usernameAuth),
    tagList: article?.tagList.map(tag => tag.name),
    favorited: article.favoritedBy.some(favorited => favorited.id === user?.id),
    favoritesCount: _count?.favoritedBy,
  };

  return result;
};

export const unfavoriteArticle = async (slugPayload: string, usernameAuth: string) => {
  const user = await findUserIdByUsername(usernameAuth);

  const { _count, ...article } = await prisma.article.update({
    where: {
      slug: slugPayload,
    },
    data: {
      favoritedBy: {
        disconnect: {
          id: user?.id,
        },
      },
    },
    include: {
      tagList: {
        select: {
          name: true,
        },
      },
      author: {
        select: {
          username: true,
          bio: true,
          image: true,
          followedBy: true,
        },
      },
      favoritedBy: true,
      _count: {
        select: {
          favoritedBy: true,
        },
      },
    },
  });

  const result = {
    ...article,
    author: profileMapper(article.author, usernameAuth),
    tagList: article?.tagList.map(tag => tag.name),
    favorited: article.favoritedBy.some(favorited => favorited.id === user?.id),
    favoritesCount: _count?.favoritedBy,
  };

  return result;
};
