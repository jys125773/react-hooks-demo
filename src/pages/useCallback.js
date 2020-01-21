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

export default UseCallbackDemo;