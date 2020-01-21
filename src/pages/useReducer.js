import React from 'react';
import { useStore } from '../store';

const UseReucerDemo = () => {
  const [count1, dispatch] = useStore(state => state.counter1.count);
  return (
    <div>
      <button onClick={() => dispatch({ type: 'counter1/minus' })}>-</button>
      <span>{count1}</span>
      <button onClick={() => dispatch((dispatch) => {
        setTimeout(() => {
          dispatch({ type: 'counter1/plus' });
        }, 1000);
      })}>+</button>
    </div>
  );
};

export default UseReucerDemo;