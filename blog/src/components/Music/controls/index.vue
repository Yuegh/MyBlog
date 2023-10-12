<script setup>
import { onMounted, ref, defineComponent, watch } from "vue";

import ProgressLine from "./components/progress-line";
import Information from "./components/information";
import AudioControls from "./components/audio-controls";
import { reqMusicDetail, reqMusicLyricById } from "@/api/music";

import { music } from "@/store/index";
import { storeToRefs } from "pinia";

const musicStore = music();
const { getIsPaused, getCurrentMusicId, getCurrentSchedule, getIsToggleImg, getCurrentMusicDesc } = storeToRefs(musicStore);

defineComponent({
  name: "MusicControls",
});

const props = defineProps({
  // 是否autoplay 自动播放就是刚进来就播放
  autoplay: {
    type: Boolean,
    default: false,
  },
});

// 播放器的实例子 原理就是通过浏览器原生的dom操作获取播放器的实例/dom元素
const audioControlsRef = ref();

// 自动play
watch(
  () => props.autoplay,
  (newV) => {
    // 切换下一首需要改为自动播放才会切
    musicStore.setIsAutoPaly(newV);
  },
  {
    immediate: true,
  }
);

watch(
  () => getCurrentMusicId.value,
  (newV) => {
    // 根据pina存的当前播放的音乐id 根据网易云api获取音乐详情 主要是播放的地址
    getMusicDetail(newV);
    getLyric(newV);
  }
);

// 拖动播放滚动条的时候，触发这个事件去切换音乐播放器的时间 切换当前时间
const changeCurrentTime = () => {
  // 触发自组件内的changeCurrentTime事件 currentTime存在pina的
  audioControlsRef.value.changeCurrentTime();
};

const getMusicDetail = async (id) => {
  const res = await reqMusicDetail({
    id,
    level: "exhigh",
  });
  if (res.code == 200) {
    // 设置音乐详情 播放器通过监听音乐的id 进行音乐播放
    musicStore.setCurrentMusicDetail(res.data[0]);
  }
};

const getLyric = async (id) => {
  const res = await reqMusicLyricById(id);
  if (res.code == 200) {
    let lyricArr = res.lrc.lyric.split("\n");
    const notNullLyricArr = [];
    const timeList = [];
    lyricArr.forEach((v) => {
      let arr = v.split("]");
      let timeArr = arr[0].replace("[", "").split(":");
      if (arr[1] && arr[0]) {
        // 不为空才收集歌词
        timeList.push((timeArr[0] - 0) * 1000 * 60 + (timeArr[1] - 0) * 1000);
        notNullLyricArr.push(arr[1]);
      }
    });
    musicStore.setLyricTimeList(timeList);
    musicStore.setLyricList(notNullLyricArr);
  }
};

const pauseMusic = () => {
  audioControlsRef.value.pause();
};
const playMusic = () => {
  audioControlsRef.value.play();
};

defineExpose({
  pauseMusic,
  playMusic,
});

onMounted(async () => {
  // 挂载的时候获取音乐最新的详情，防止音乐有效时间过去 播放器报错
  if (getCurrentMusicId.value) {
    getMusicDetail(getCurrentMusicId.value);
    getLyric(getCurrentMusicId.value);
  }
});
</script>

<template>
  <div class="music-controls">
    <div class="main">
      <div class="music-header">
        <ProgressLine :schedule="getCurrentSchedule" @scheduleChange="changeCurrentTime" />
      </div>
      <div class="music-body">
        <div class="music-body__left">
          <Information :isPaused="getIsPaused" :isToggleImg="getIsToggleImg" :currentMusic="getCurrentMusicDesc" />
        </div>
        <div class="music-body__right">
          <!-- 控制音乐 -->
          <AudioControls ref="audioControlsRef" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.music-controls {
  box-sizing: border-box;
  background: transparent;
  display: flex;
  justify-content: center;
  .main {
    width: 1080px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .music-header {
    width: 100%;
    padding: 0 10px;
  }
  .music-body {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 3rem;
    &__left {
      width: 33%;
      height: 32%;
    }

    &__right {
      width: 68%;
    }
  }
}

.change-color:hover {
  cursor: pointer;
  color: #62c28a;
}

// mobile
@media screen and (max-width: 768px) {
  .main {
    width: 414px !important;
  }

  .music-body {
    &__left {
      width: 20% !important;
    }

    &__right {
      width: 80% !important;
    }
  }
}
</style>
