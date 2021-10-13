# ![Rails Example App](media/realworld.png)

> This branch differs from the RealWorld API specs by including [limitations](https://gothinkster.github.io/realworld/docs/specs/frontend-specs/api#api-limitations) to public-created content.
> We encourage you to use it if you plan to host this app publicly.

# Deploy to Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

# Getting started

### Clone the repository

run `git clone`

### Install the dependancies

> [NodeJS](https://nodejs.dev/) required

```
cd node-express-prisma-v1-official-app
npm install
```

### Download pgAdmin for PostgreSQL

[PostgreSQL](https://www.postgresql.org/download/) downloads page

### Create a server

run **pgAdmin**
create a server (Object/Create/Server)
required fields:

- name
- HOST name/address

### Connect the created server

create a _.env_ file at the root of the project
populate it with the url of your database

```
DATABASE_URL="postgresql://<username>:<password>@<host_name>:<port>/<database_name>?schema=public"
```

### Run the project locally

run `npm run dev`

# Advanced usage

## Prisma

### Format the Prisma schema

```bash
npm run prisma:format
```

### Migrate the SQL schema

```bash
prisma migrate dev --name added_job_title
```

### Update the Prisma Client

```bash
npm run prisma:generate
```

_with watch option_

```bash
npm run prisma:generate:watch
```

### Seed the database

```bash
npm run prisma:seed
```

### Launch Prisma Studio

```bash
npm run prisma:studio
```

### Reset the database

- Drop the database
- Create a new database
- Apply migrations
- Seed the database with data

```bash
npm run prisma:reset
```
