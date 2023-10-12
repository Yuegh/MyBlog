<!--
* @Author: Zhang Yuming
* @Date: 2023-07-03 11:35:38
* @Description: 播放器首页
-->
<script setup>
import MusicList from "./list/index.vue";
import MusicControl from "./controls/index.vue";
import { defineComponent, ref, reactive, watch } from "vue";
import blogAvatar from "@/assets/img/blogAvatar.png";

import { music } from "@/store/index";
import { storeToRefs } from "pinia";

const musicStore = music();
const { getIsShow, getIsPaused, getIsToggleImg, getCurrentMusicDesc } = storeToRefs(musicStore);

defineComponent({
  name: "MusicPlayer",
});

// 页面初始化播放器隐藏的时候不要做动画
const clickFlag = ref(false);
const musicControl = ref();

const toggleDisc = () => {
  musicStore.setIsShow();
  if (!clickFlag.value) {
    clickFlag.value = true;
  }
};

const playMusic = () => {
  if (getIsPaused.value) {
    musicControl.value.playMusic();
  } else {
    musicControl.value.pauseMusic();
  }
};

const musicInfo = reactive({
  name: "",
  ar: [
    {
      name: "",
    },
  ],
  al: {
    picUrl: "",
  },
});

watch(
  () => {
    getCurrentMusicDesc.value;
  },
  () => {
    Object.assign(musicInfo, getCurrentMusicDesc.value);
  },
  {
    deep: true,
    immediate: true,
  }
);
</script>

<template>
  <div :class="['music', getIsShow ? 'show-music' : '', !getIsShow && clickFlag ? 'hide-music' : '']">
    <div class="flex flex-col justify-center items-center">
      <i class="iconfont icon-off-search change-color" @click="toggleDisc"></i>
      <!-- 播放器列表 -->
      <MusicList class="list" />
      <!-- 播放器控制器 -->
      <MusicControl ref="musicControl" :autoplay="false" class="control" />
    </div>
  </div>
  <div :class="['music-disc', getIsPaused ? 'music-left' : '']">
    <img @click="toggleDisc" :class="['music-img', getIsToggleImg ? '' : 'disc-rotate', getIsPaused ? 'paused' : '']" :src="musicInfo?.al?.picUrl || blogAvatar" alt="music cover" />
    <div class="info-box">
      <div class="info">
        <div class="text-sm whitespace-nowrap">
          {{ musicInfo?.name }}
        </div>
        <div class="text-sm whitespace-nowrap">
          {{ musicInfo?.ar[0]?.name || "歌手走丢了" }}
        </div>
      </div>
      <i :class="['change-color', 'iconfont', getIsPaused ? 'icon-zanting' : 'icon-bofangzhong ']" @click="playMusic"></i>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.music {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fafafa;
  z-index: 2000;
  display: none;
  padding-top: 30px;

  .list {
    max-width: 1080px;
    height: 100%;
    overflow: hidden;
  }

  .control {
    max-width: 1080px;
  }
}
.icon-off-search {
  position: absolute;
  top: 70px;
  right: 30px;
  font-size: 1.4rem;
  z-index: 3001;
}

.show-music {
  display: flex;
  justify-content: center;
  align-items: center;
  animation: showPlayer 0.3s ease-in-out forwards;
}

.hide-music {
  animation: hidePlayer 0.4s ease-in-out forwards;
}

.music-disc {
  position: fixed;
  left: 0;
  box-sizing: border-box;
  background-color: #fafafa;
  display: flex;
  align-items: center;
  z-index: 3002;
  cursor: pointer;
  transition: left 0.2s;
  .music-img {
    width: 50px;
    height: 50px;
    border-radius: 25px;
    margin: 5px;
  }

  .info-box {
    display: flex;
    align-items: center;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    font-weight: bold;
    letter-spacing: 1px;
    box-sizing: border-box;
  }
}

.change-color:hover {
  cursor: pointer;
  color: #62c28a;
}

.disc-rotate {
  animation: rotate360 18s infinite linear;
}

.paused {
  animation-play-state: paused;
}

// pc
@media screen and (min-width: 768px) {
  .music-disc {
    bottom: 50px;
    height: 60px;
    border-radius: 30px;
    min-width: 60px;

    .music-img {
      width: 50px;
      height: 50px;
      border-radius: 25px;
    }
  }

  .music-disc:hover {
    left: 0;
    .info-box {
      width: 100%;
      padding-right: 10px;
    }
    .info {
      padding-right: 5px;
    }
  }

  .music-left {
    left: -30px;
  }
}

// mobile
@media screen and (max-width: 768px) {
  .show-music {
    animation: mShowPlayer 0.3s ease-in-out forwards;
  }

  .hide-music {
    animation: mHidePlayer 0.3s ease-in-out forwards;
  }

  .music-disc {
    bottom: 37px;
    width: 50px;
    border-radius: 25px;
    min-width: 50px;

    .music-img {
      width: 40px;
      height: 40px;
      border-radius: 20px;
    }
  }
  .music-left {
    left: -25px;
  }
}

@keyframes showPlayer {
  0% {
    transform: translateX(-1000px);
  }

  100% {
    transform: translateX(0px);
  }
}

@keyframes hidePlayer {
  0% {
    transform: translateX(0px);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  100% {
    transform: translateX(-800px);
    display: none;
    opacity: 0;
  }
}

@keyframes mShowPlayer {
  0% {
    transform: translateX(-1000px);
  }

  100% {
    transform: translateX(0px);
  }
}

@keyframes mHidePlayer {
  0% {
    transform: translateX(0px);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  100% {
    transform: translateX(-800px);
    display: none;
    opacity: 0;
  }
}

@keyframes rotate360 {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
