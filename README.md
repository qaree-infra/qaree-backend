# Qaree

Qaree is a mobile app for e-book reading, with the ability to communicate with readers and authors in one-to-one chats or book communities (such as simple chat groups).

## Table of content

- [About](#about)
- [Features](#features)
- [Built with](#built-with)
- [Project structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Get started](#getting-started)
- [API Reference](#api-reference)
- [Issues](#Issues)
- [License](#license)

## About

- This app is based on the MongoDB database management system, Express.js web application framework, Node.js JavaScript runtime environment, Kotlin for mobile app development, and React.js for front-end.
- You can use this app to buy books, then read them, or review them, create your own library, chat with others, or on books communityes.
- This repository contains Entagk backend only, Publishing services repository [here](https://github.com/MohamedAli00949/entagk-fontend), Mobile app [here]().

## Built With

- [Node.js](https://nodejs.org/en/) - Node.js is an open-source, cross-platform, back-end JavaScript runtime environment.
- [Exprees.js](https://expressjs.com/) - Express.js is a back end web application framework for building RESTful APIs with Node.js, released as free and open-source software under the MIT License.
- [MongoDB](https://www.mongodb.com/) - MongoDB is a source-available cross-platform document-oriented database program. Classified as a NoSQL database program, MongoDB uses JSON-like documents with optional schemas.
- [GraphQL](https://graphql.org) - GraphQL is an open-source data query and manipulation language for APIs and a query runtime engine. GraphQL enables declarative data fetching where a client can specify exactly what data it needs from an API.
- [Kotlin](https://kotlinlang.org/) - Kotlin is a cross-platform, statically typed, general-purpose high-level programming language with type inference. Kotlin is designed to interoperate fully with Java, and the JVM version of Kotlin's standard library depends on the Java Class Library, but type inference allows its syntax to be more concise.
- [React.js](https://reactjs.org/) - React.js is a free and open-source front-end JavaScript library for building user interfaces based on UI components. It is maintained by Meta and a community of individual developers and companies.
- [Next.js](https://nextjs.org/) - Next.js is an open-source web development framework created by the private company Vercel providing React-based web applications with server-side rendering and static website generation.

## Project Structure

```
├── src
|   ├── graphql
|   ├── middeleware
|   ├── models
|   ├── readChapter
|   ├── upload
|   ├── utils
|   ├── index.js
|   └── server.js
├── .env.example
├── .gitignore
├── index.js
├── LICENSE
├── package.json
├── README.md
└── tsconfig.js
```

### Highlight Folders:

- `src` -- Contains all code files.
  - `graphql` -- Contains all things related with graphql.
  - `middlewares` -- Contains all middlewares needed for the application in one place.
  - `models` -- Contains all MongoDB models
  - `readChapter` -- Contains all functionality of ePub reading.
  - `upload` -- Contains all functionality of uploading files.

### Highlight Files:

- `.env.example` -- Contains required environment variables
- `tsconfig.json` -- Configuration file used in TypeScript
- `package.json` -- File which contains all the project npm details, scripts and dependencies.

## Prerequisites

- [Node.js](https://nodejs.org/en/) version 14+
- [Exprees.js](https://expressjs.com/) version 4+
- [MongoDB](https://www.mongodb.com/)

## Getting Started

1. **Clone the repository**

```
git clone https://github.com/qaree-infra/qaree-backend.git
```

```
cd qaree-backend
```

2. **Install dependencies**

```
npm install
```

3. **Run the project**

```
npm run start
```

## API Reference

Qaree API is organized around [GraphQL](https://en.wikipedia.org/wiki/GraphQL) for data fetching. Our API has predictable resource-oriented URLs, accepts JSON-encoded request bodies, returns [JSON-encoded](http://www.json.org/) responses, and uses standard HTTP response codes and verbs. It also uses [JWT](https://jwt.io/) for authentication.

### Base URL

```
https://publishingcompany-backend.onrender.com/graphql
```

### Endpoints

> Head over [Here](https://documenter.getpostman.com/view/16838332/2s9YJaXiZD) for Postman API documentation.

## Issues

If you have an issue, please open it in the issues tab and I will respond.

## License

> This software is licensed under MIT License, See [License](./LICENSE) for more information.
