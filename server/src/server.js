import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import schema from './schema';

// auth 新添
import { client, server, database } from './config';
import mongoose from 'mongoose';
const { getTokenFromRequest } = require('./utils/auth');

const app = express();

// 创建CORS服务器
app.use('*', cors({ origin: client.url }));

// 创建graphql服务点
app.use('/graphql', bodyParser.json(), graphqlExpress(request => ({
  schema,
  context: { token: getTokenFromRequest(request) }
})));

// 添加graphiql服务
app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://${server.host}:${server.port}/subscriptions`
}));

// We wrap the express server so that we can attach the WebSocket for subscriptions
// 建立websocket服务器来发布订阅
const ws = createServer(app);
ws.listen(server.port, () => {
  // console.log(`GraphQL Server is now running on // http://localhost:${server.port}`);

  // Set up the WebSocket for handling GraphQL subscriptions
  // 这里替换了下面一行，看看是否可以
  // new SubscriptionServer({
  SubscriptionServer.create({
    execute,
    subscribe,
    schema
  }, {
    server: ws,
    path: '/subscriptions',
  });
});

// 新设置
// 链接mongo服务器
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${database.host}:${database.port}/${database.name}`, { useMongoClient: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => console.log('We are connected!'));
