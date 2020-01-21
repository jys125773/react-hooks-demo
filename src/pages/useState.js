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

export default UseStateDemo;