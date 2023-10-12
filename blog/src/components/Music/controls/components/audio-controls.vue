<!--
 * @Author: Zhang Yuming
 * @Date: 2023-06-26 15:48:34
 * @Description: 音乐播放器 控制音乐播放、暂停等
 -->
<script setup>
import { defineComponent, ref, watch, onBeforeUnmount, onMounted } from "vue";
import { ElNotification } from "element-plus";

import TimeVolume from "./time-volume";
import { music } from "@/store/index";
import { storeToRefs } from "pinia";
import { calcMusicTime, calcMusicSchedule, getNextMusic } from "../../music";

defineComponent({
  name: "AudioControls",
});
// 音乐播放器pina
const musicStore = music();
// 音乐播放器的一些参数 使用storetoRefs是为了保持数据的响应式
const { getMusicList, getCustomerMusicList, getLyricTimeList, getCurrentMusicId, getCurrentMusicDetail, getCurrentMusicDesc, getIsPaused, getVolume, getCurrentTime, getDuration, getIsAutoPaly, getCurrentSchedule, getPlayModel, getPlayType, getCurrentMusicDuration, setCurrentMusicDuration } =
  storeToRefs(musicStore);
// 定时器 用于一秒一秒地去计算歌曲播放时间
let timer;
// 用于定位歌词
let lyricTimer;
// 音乐播放器实例
const audioRef = ref();
// 当前播放的音乐列表 musicList
const musicList = ref([]);

// 清空当前播放数据 用于切换歌曲
const clear = () => {
  musicStore.setCurrentTime("00:00");
  musicStore.setDuration("00:00");
  musicStore.setCurrentSchedule(0);
  musicStore.setCurrentLyricIndex(0);
  clearInterval(timer);
};

// 播放音乐
const play = (isToggleMusic = false) => {
  if (!getCurrentMusicId.value || !getCurrentMusicDetail.value) {
    next();
  }
  if (!audioRef.value) {
    return;
  }

  // 开启autoplay 手动或者自动切换下一首才能自动播放
  musicStore.setIsAutoPaly(true);
  // 获取当前声音大小 在play的时候就使用pina里存的音量大小
  audioRef.value.volume = getVolume.value / 100;
  // 如果当前歌曲的播放进度大于0说明已经播放一段时间了，得自动切换到这歌进度来
  if (getCurrentSchedule.value > 0 && getCurrentMusicDuration.value > 0) {
    // Math.round 就是一个四舍五入的方法，* 后面跟10就是保留一位小数 以此类推
    audioRef.value.currentTime = Math.round(getCurrentSchedule.value * getCurrentMusicDuration.value * 100) / 10000;
  }
  if (isToggleMusic) {
    // 切换歌曲的时候，让图片回到初始状态
    musicStore.setIsToggleImg(true);
    audioRef.value.currentTime = 0;
  }

  // 设置歌词下标
  let index = getLyricTimeList.value.findIndex((v) => v >= audioRef.value.currentTime * 1000);
  musicStore.setCurrentLyricIndex(index - 1 || 0);
  // 播放音乐 ps: 这里使用了then是为了播放音乐，play是一个promise 用了catch就是只要我没播放成功就catch继续播放
  audioRef.value
    .play()
    .then(() => {
      // 设置当前播放器是否正在播放
      musicStore.setIsPaused(audioRef.value.paused);
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      if (lyricTimer) {
        clearInterval(lyricTimer);
        lyricTimer = null;
      }

      lyricTimer = setInterval(() => {
        // 设置歌词播放下标
        if (!audioRef.value) return;
        let index = getLyricTimeList.value.findIndex((v) => v >= audioRef.value.currentTime * 1000);
        musicStore.setCurrentLyricIndex(index - 1 || 0);
      }, 10);

      // 每隔500秒钟计算一下当前播放进度和时长
      timer = setInterval(() => {
        // 设置播放总时长
        musicStore.setDuration(calcMusicTime(audioRef.value.duration));
        // 设置播放当前时间
        musicStore.setCurrentTime(calcMusicTime(audioRef.value.currentTime));
        // 设置当前播放进度
        musicStore.setCurrentSchedule(calcMusicSchedule(audioRef.value.currentTime, audioRef.value.duration));
        // 设置格局总时间
        musicStore.setCurrentMusicDuration(audioRef.value.duration);
        // 设置切换图片 这里用于将图片转动复原
        musicStore.setIsToggleImg(false);
        // 如果到了结尾就播放下一首
        if (audioRef.value.ended) {
          next();
        }
      }, 500);
    })
    .catch(() => {
      play();
    });
};

// 暂停音乐
const pause = () => {
  // 暂停音乐
  audioRef.value.pause();
  // paused表示音乐是否正在播放
  musicStore.setIsPaused(audioRef.value.paused);
  // 清除歌曲和歌词时间定时器
  clearInterval(timer);
  clearInterval(lyricTimer);
  timer = null;
  lyricTimer = null;
};

// 上一首
const prev = async () => {
  // 音乐列表的总长度
  let len = musicList.value.length;
  // 找到当前音乐的下标
  let index = musicList.value.findIndex((item) => item.id == getCurrentMusicDesc.value.id);
  // 随机/顺序/单曲循环播放的逻辑
  const musicIndex = getNextMusic(len, index, getPlayModel.value, false);

  musicStore.setCurrentMusicId(musicList.value[musicIndex].id);
  musicStore.setCurrentMusicDesc(musicList.value[musicIndex]);

  clear();
  play(true);
};

// 下一首
const next = async () => {
  let len = musicList.value.length;
  let index = musicList.value.findIndex((item) => item.id == getCurrentMusicDesc.value.id);
  // 随机/顺序/单曲循环播放的逻辑
  const musicIndex = getNextMusic(len, index, getPlayModel.value, true);
  musicStore.setCurrentMusicId(musicList.value[musicIndex].id);
  musicStore.setCurrentMusicDesc(musicList.value[musicIndex]);
  clear();
  play(true);
};

// 切换当前时间
const changeCurrentTime = () => {
  if (!audioRef.value) return;
  audioRef.value.currentTime = Math.round(getCurrentSchedule.value * audioRef.value.duration * 100) / 10000;
  musicStore.setCurrentTime(calcMusicTime(audioRef.value.currentTime));
  play(false);
};

const bindAudioStateChange = () => {
  audioRef.value.onplay = () => {
    musicStore.setIsPaused(false);
  };

  audioRef.value.onpause = () => {
    musicStore.setIsPaused(true);
  };
};
// 音量调整
watch(
  () => getVolume.value,
  (newV) => {
    // 修改声音大小
    audioRef.value.volume = newV / 100;
    musicStore.setVolume(newV);
  }
);

watch(
  () => getCurrentMusicId.value,
  async () => {
    await clear();
    play(true);
  }
);

watch(
  () => getPlayType.value,
  (newV) => {
    musicList.value = newV == "CUSTOM" && getCustomerMusicList.value.length ? getCustomerMusicList.value : getMusicList.value;
  },
  {
    immediate: true,
  }
);

onMounted(() => {
  // 引导用户播放音乐
  var promise = document.querySelector("audio").play();
  if (promise !== undefined) {
    promise
      .then((_) => {
        // 开始播放
        if (!getIsPaused.value) {
          play(false);
        } else {
          audioRef.value.pause();
        }
        ElNotification({
          offset: 60,
          title: "左下角听听歌吧～",
        });
        bindAudioStateChange();
      })
      .catch((error) => {
        // 遇到错误就暂停 本地刷新依赖音乐播放器就被销毁了 所以需要暂停 线上可以自动播放
        musicStore.setIsPaused(true);
        bindAudioStateChange();
        // 需要用户进行页面交互
        ElNotification({
          offset: 60,
          title: "左下角听听歌吧～",
        });
      });
  } else {
    bindAudioStateChange();
  }
});

onBeforeUnmount(() => {
  clearInterval(timer);
  clearInterval(lyricTimer);
  timer = null;
  lyricTimer = null;
});

defineExpose({
  changeCurrentTime,
  play,
  pause,
});
</script>

<template>
  <div class="audio-controls">
    <div class="left">
      <i class="iconfont icon-shangyiqu change-color" @click="prev"></i>
      <i class="iconfont icon-zanting change-color" v-if="getIsPaused" @click="play(false)"></i>
      <i class="iconfont icon-bofangzhong change-color" v-else @click="pause"></i>
      <i class="iconfont icon-xiayiqu change-color" @click="next"></i>
    </div>
    <TimeVolume class="right" :currentTime="getCurrentTime" :duration="getDuration" />
    <audio class="audio" ref="audioRef" preload="auto" :autoplay="getIsAutoPaly" crossOrigin="anonymous" :src="getCurrentMusicDetail.url">你的浏览器不支持 audio 元素</audio>
  </div>
</template>

<style lang="scss" scoped>
.audio-controls {
  display: flex;
  align-items: center;
  justify-content: space-around;
  .left {
    width: 140px;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  .right {
    position: relative;
    width: 200px;
    display: flex;
    justify-content: space-around;
    align-items: center;

    .time {
      font-size: 1rem;
    }
  }
}
.iconfont {
  font-size: 1.8rem;
}

.icon-zanting,
.icon-bofangzhong {
  font-size: 2.8rem;
}
.change-color:hover {
  cursor: pointer;
  color: #62c28a;
}
</style>
