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

export default CountDown;