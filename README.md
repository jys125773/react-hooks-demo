# react-hooks study demo

## useState
 ```js
 import React, { useState } from 'react';

  const UseStateDemo = () => {
    const [count, setCount] = useState(0);
    return (
      <div>
        <button onClick={() => setCount(n => n - 1)}>-</button>
        <span>{count}</span>
        <button onClick={() => setCount(count + 1)}>+</button>
      </div>
    );
  };
 ```

## useContext & useReducer
 ```js
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
 ```

## useEffect
 ```js
 import React, { useEffect, useState } from 'react';

  function formateTimeDiff(timeDiff, format) {
    let timeText = format;
    const o = {
      'd+': Math.floor(timeDiff / 86400000), //日
      'h+': Math.floor((timeDiff % 86400000) / 3600000), //小时
      'm+': Math.floor((timeDiff % 3600000) / 60000), //分
      's+': Math.floor((timeDiff % 60000) / 1000), //秒
      'S+': Math.floor(timeDiff % 1000), //毫秒
    };
    const timeList = [];
    for (const k in o) {
      if (new RegExp('(' + k + ')').test(timeText)) {
        timeText = timeText.replace(RegExp.$1, (match, offset, source) => {
          const v = o[k] + '';
          let digit = v;
          if (match.length > 1) {
            digit = (
              match.replace(new RegExp(match[0], 'g'), '0') + v
            ).substr(v.length);
          }
          const unit = source.substr(offset + match.length);
          const last = timeList[timeList.length - 1];
          if (last) {
            const index = last.unit.indexOf(match);
            if (index !== -1) {
              last.unit = last.unit.substr(0, index);
            }
          }
          timeList.push({ digit, unit, match });
          return digit;
        });
      }
    }
    return { timeText, timeList };
  }


  const CountDown = React.memo(({ time, format, interval = 1000 }) => {
    const [timeList, setTimeList] = useState([]);

    useEffect(() => {
      console.log('CountDown useEffect excute');
      const initialTime = time < 0 ? 0 : time;
      setTimeList(() => formateTimeDiff(initialTime, format).timeList);
      if (initialTime === 0) {
        return;
      }
      const timer = setInterval(() => {
        time = time - interval;
        time = time < 0 ? 0 : time;
        const { timeList } = formateTimeDiff(time, format);
        setTimeList(timeList);
        if (time === 0) {
          clearInterval(timer);
        }
      }, interval);
      return () => {
        console.log('CountDown clearInterval');
        clearInterval(timer);
      };
    }, [time, format, interval]);

    console.log('CountDown render', timeList);

    return (
      <div>
        {timeList.map(({ digit, unit }, index) => {
          return (
            <span key={index}>
              <span>{digit}</span>
              <span>{unit}</span>
            </span>
          );
        })}
      </div>
    );
  });
 ```

## useRef & useImperativeHandle & useMemo & useCallback

```js
import React, { useCallback, useState, useMemo, useRef, useImperativeHandle } from 'react';

const TestChild = React.memo(React.forwardRef(({ info, onNameChange }, ref) => {
  const inputRef = useRef(null);
  useImperativeHandle(
    ref,
    () => {
      return {
        focus: () => inputRef.current.focus(),
      };
    }
  );
  console.log('TestChild render');
  return (
    <div>
      <div>我是子组件，父组件传递过来的name是“{info.name}”</div>
      <input ref={inputRef} value={info.name} onChange={e => onNameChange(e.target.value)} type="text" />
    </div>
  );
}));

// let momesetTimes
const UseCallbackDemo = () => {
  const [times, setTimes] = useState(0);
  const [name, setName] = useState('TestChild');
  const ref = useRef(null);
  console.log('ref', ref);

  // momesetTimes = setTimes;
  return (
    <div>
      <div>{times} <button onClick={() => setTimes(times + 1)}>+</button> </div>
      <button onClick={() => ref.current.focus()}>focus</button>
      <TestChild
        ref={ref}
        info={useMemo(() => ({ name }), [name])}
        onNameChange={useCallback(value => {
          setName(value);
          setTimes(times + 1);
        }, [times])}
      />
    </div>
  );
};
```