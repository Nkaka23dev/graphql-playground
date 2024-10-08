import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { db } from "./db";
import { typeDefs } from "./schema";

const resolvers = {
  Query: {
    games() {
      return db.games;
    },
    game(_: any, args: { id: string }) {
      return db.games.find((game) => game.id === args.id);
    },
    authors() {
      return db.authors;
    },
    author(_: any, args: { id: string }) {
      return db.authors.find((author) => author.id === args.id);
    },
    review(_: any, args: { id: string }) {
      return db.reviews.find((review) => review.id === args.id);
    },
    reviews() {
      return db.reviews;
    },
  },
  Game: {
    reviews(parent: any) {
      return db.reviews.filter((review) => review.game_id === parent.id);
    },
  },
  Author: {
    reviews(parent: any) {
      return db.reviews.filter((review) => review.author_id === parent.id);
    },
  },
  Review: {
    author(parent: any) {
      return db.authors.find((author) => author.id === parent.author_id);
    },
    game(parent: any) {
      return db.games.find((game) => game.id === parent.game_id);
    },
  },
  Mutation: {
    deleteGame(_: any, args: any) {
      return db.games.filter((game) => game.id !== args.id);
    },
    addGame(_: any, args: { game: any }) {
      let game = {
        ...args.game,
        id: Math.floor(Math.random() * 1000).toString(),
      };
      db.games.push(game);
      return game;
    },
    updateGame(_: any, args: any) {
      db.games = db.games.map((game) => {
        if (game.id === args.id) {
          return { ...game, ...args.game };
        }
        return game;
      });
      return db.games.find((game) => game.id === args.id);
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const bootstrap = async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 80 },
  });

  console.log(`Server is running on port ${url}`);
};

bootstrap();
