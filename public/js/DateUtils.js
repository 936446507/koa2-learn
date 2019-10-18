class DateUtils {
  constructor(time = Date.now()) {
    this._time = time;
  }
  getTodayRangeTime(timeArg) {
    const time =  timeArg || this._time;
    const oneDayTime = 24 * 60 * 60 * 1000;
    const date = new Date(time);
    const hours = date.getHours();
    const minutes = date.getMilliseconds();
    const seconds = date.getSeconds();
    const pastTimes = (hours * 60 * 60 + minutes * 60 + seconds) * 1000;

    return {
      start: time - pastTimes,
      end: oneDayTime - pastTimes + time
    }
  }
}

module.exports = DateUtils;