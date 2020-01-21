import React, { createContext, useContext, useReducer, useMemo } from 'react';
const identity = arg => arg;

function compose(...funcs) {
  if (funcs.length === 0) {
    return identity;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}

const createReducer = (initialState, handlers) => {
  return (state = initialState, action) => {
    const handler = handlers[action.type];
    return handler ? handler(state, action) : state;
  }
}

const combineReducers = reducers => {
  const reducerKeys = Object.keys(reducers);
  return (state = {}, action) => {
    let hasChanged = false
    const nextState = {}
    for (let i = 0; i < reducerKeys.length; i++) {
      const key = reducerKeys[i];
      const reducer = reducers[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    hasChanged = hasChanged || reducerKeys.length !== Object.keys(state).length;
    return hasChanged ? nextState : state;
  }
}

const StoreContext = createContext(null);

const Provider = (reducer, middlewares = []) => WrappedComponent => {
  const intialState = reducer(undefined, { type: '@@store/INIT' });
  WrappedComponent = React.memo(() => <WrappedComponent />);
  return function WrapComponent() {
    const [state, rawDispatch] = useReducer(reducer, intialState);
    const composedDispatch = useMemo(() => {
      let dispatch = identity;
      const middlewareAPI = {
        dispatch: ation => dispatch(ation),
        getState: () => state,
      };
      const chain = middlewares.map(middleware => middleware(middlewareAPI));
      dispatch = compose(...chain)(rawDispatch);
      return dispatch;
    }, []);
    return (
      <StoreContext.Provider value={{ state, dispatch: composedDispatch }}>
        <WrappedComponent />
      </StoreContext.Provider>
    );
  };
};

const useStore = (selector = identity) => {
  const { state, dispatch } = useContext(StoreContext);
  return [selector(state), dispatch];
};

export {
  createReducer,
  combineReducers,
  compose,
  Provider,
  useStore,
};