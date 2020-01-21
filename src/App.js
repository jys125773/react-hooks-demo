import React, { useState, useCallback } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import logger from 'redux-logger';
import { Provider, createReducer, combineReducers, useStore } from './store';
import UseStateDemo from './pages/useState';
import UseEffectDemo from './pages/useEffect';
import UseCallbackDemo from './pages/useCallback';
import UseReucerDemo from './pages/useReducer';
import LifeTimesDemo from './pages/lifeTimes';

const thunk = (api) => (next) => (action) => {
  const { getState, getInitialState } = api;
  if (typeof action === 'function') {
    return action(api.dispatch, getState, getInitialState);
  }
  return next(action);
};

const counterReducer1 = createReducer(
  { count: 1 },
  {
    'counter1/minus'(state) {
      return { count: state.count - 1 };
    },
    'counter1/plus'(state) {
      return { count: state.count + 1 };
    },
  }
);

const counterReducer2 = createReducer(
  { count: 2 },
  {
    'counter2/minus'(state) {
      return { count: state.count - 1 };
    },
    'counter2/plus'(state) {
      return { count: state.count + 1 };
    },
  }
);

const rootReducer = combineReducers({
  counter1: counterReducer1,
  counter2: counterReducer2,
});

function App() {
  const [count, setCount] = useState(1);
  const [state] = useStore();
  console.log('App render');

  return (
    <Router>
      <div>
        <span>render {count} times</span>
        <button onClick={() => {
          setCount(count + 1);
        }}>trigger render</button>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/useState">useState</Link>
          </li>
          <li>
            <Link to="/useEffect">useEffect</Link>
          </li>
          <li>
            <Link to="/useCallback">useCallback</Link>
          </li>
          <li>
            <Link to="/useReucer">useReucer</Link>
          </li>
          <li>
            <Link to="/lifeTimes">lifeTimes</Link>
          </li>
        </ul>
        <div>{JSON.stringify(state)}</div>
        <hr />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/useState">
            <UseStateDemo />
          </Route>
          <Route path="/useEffect">
            <UseEffectDemo time={8000} format={'hh:mm:ss'} fn={useCallback(() => { }, [])} />
          </Route>
          <Route path="/useCallback">
            <UseCallbackDemo />
          </Route>
          <Route path="/useReucer">
            <UseReucerDemo />
          </Route>
          <Route path="/lifeTimes">
            <LifeTimesDemo />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}

export default Provider(rootReducer, [thunk, logger])(React.memo(App));