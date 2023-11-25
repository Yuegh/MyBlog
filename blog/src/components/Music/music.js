export const MODELLIST = [
  "RANDOM", // 随机
  "LISTLOOP", // 列表循环
  "SINGLECYCLE", // 单曲循环
];

export const PLAYTYPE = {
  CUSTOM: "CUSTOM", // 播放用户添加的歌曲
  TOP: "TOP", // 当前歌曲排行榜列表歌曲
};


const returnRandomNoRepeat = (index, len) => {
  if (len == 1) {
    return index;
  }
  let res = Math.floor(Math.random() * (len - 0) + 0);

  if (res == index) {
    returnRandomNoRepeat(index);
  } else {
    return res;
  }
};

export function getNextMusic(len, index, playType, isPlayNext) {
  switch (playType) {
    // 随机
    case "RANDOM":
      index = returnRandomNoRepeat(index, len);
      break;
    // 列表循环
    case "LISTLOOP":
      if (isPlayNext) {
        if (index == len - 1) {
          index = 0;
        } else if (index != -1) {
          index = index + 1;
        } else {
          index = 0;
        }
      } else {
        if (index == 0) {
          index = len - 1;
        } else if (index != -1) {
          index = index - 1;
        } else {
          index = 0;
        }
      }
      break;
    // 单曲循环
    case "SINGLECYCLE":
      index = index;
      break;
  }

  return index;
}

/**
 * 给小于10的数字 + 0
 * @param {*} time
 * @returns time
 */
export function addZero(time) {
  if (time >= 0 && time < 10) {
    time = "0" + time;
  }
  return time;
}


export function calcMusicTime(time) {
  // 这里就按照分和秒来
  let minutes = 0,
    second = 0;

  if (!time) {
    return `${addZero(minutes)}:${addZero(second)}`;
  }

  minutes = Math.floor(time / 60);
  second = Math.floor(time % 60);

  return `${addZero(minutes)}:${addZero(second)}`;
}


export function calcMusicSchedule(current, duration) {
  return Math.round((current / duration) * 1000) / 10;
}
