import React, { useState } from 'react';

class LifeTimeTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clickTimes: 0,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log('getDerivedStateFromProps', nextProps, prevState);
    return null;
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log('getSnapshotBeforeUpdate', prevProps, prevState);
    return { snapshot: null };
  }

  UNSAFE_componentWillMount() {
    console.log('componentWillMount');
  }

  componentDidMount() {
    console.log('componentDidMount', ...arguments);
  }

  componentWillUnmount() {
    console.log('componentWillUnmount', ...arguments);
  }


  UNSAFE_componentWillReceiveProps() {
    console.log('componentWillReceiveProps', ...arguments);
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('shouldComponentUpdate', nextProps, nextState);
    return true;
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    console.log('componentWillUpdate', nextProps, nextState);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('componentDidUpdate', prevProps, prevState);
    console.log('snapshot', snapshot);
  }

  render() {
    console.log('render');

    return (
      <div>
        <div>I am LifeTimeTest,i was clicked {this.state.clickTimes} times</div>
        <button onClick={() => {
          this.setState(({ clickTimes }) => ({
            clickTimes: clickTimes + 1,
          }));
        }}>click me</button>
      </div>
    );
  }
}

const LifeTimesDemo = () => {
  const [visible, setVisible] = useState(true);
  const [toggleTimes, setToggleTimes] = useState(0);
  return (
    <div>
      <button onClick={() => {
        // setVisible(!visible);
        setToggleTimes(toggleTimes + 1);
      }}>toggle</button>
      <div>
        {visible && <LifeTimeTest toggleTimes={toggleTimes} />}
      </div>
    </div>
  );
};

export default LifeTimesDemo;