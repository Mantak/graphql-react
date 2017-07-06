import React, { Component } from 'react';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import { ApolloClient, ApolloProvider, createNetworkInterface, toIdValue } from 'react-apollo';

import { reducer as formReducer } from 'redux-form';
import authReducer from './reducers/auth';

import SignIn from './pages/sign_in';
import SignUp from './pages/sign_up';
import Home from './components/home';
import NotFound from './components/not_found';


const networkInterface = createNetworkInterface({ uri: 'http://localhost:4000/graphql' });
networkInterface.use([{
  applyMiddleware(req, next) {
    setTimeout(next, 500);
  },
}]);

function dataIdFromObject(result) {
  if (result.__typename) {
    if (result.id !== undefined) {
      return `${result.__typename}:${result.id}`;
    }
  }
  return null;
}


const logger = createLogger({
  // ...options
});


const client = new ApolloClient({
  networkInterface,
  customResolvers: {
    Query: {
      channel: (_, args) => {
        return toIdValue(dataIdFromObject({ __typename: 'Channel', id: args.id }));
      },
    },
  },
  dataIdFromObject,
});

const store = createStore(
  combineReducers({
    apollo: client.reducer(),
    form: formReducer,
    auth: authReducer,
  }),
  {}, // initial state
  compose(
      applyMiddleware(client.middleware(), logger),
      // If you are using the devToolsExtension, you can add it here also
      window.devToolsExtension ? window.devToolsExtension() : f => f,
  )
);

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client} store={store}>
        <BrowserRouter>
          <div className="App">
            <Link to="/" className="navbar">React + GraphQL Tutorial</Link>
            <Switch>
              <Route exact path="/" component={Home}/>
              <Route path="/sign_up" component={SignUp}/>
              <Route path="/sign_in" component={SignIn}/>
              <Route path="/channel/:channelId" component={NotFound}/>
              <Route component={ NotFound }/>
            </Switch>
          </div>
        </BrowserRouter>
      </ApolloProvider>
    );
  }
}

export default App;
