<script setup>
import { watch, onMounted, nextTick } from "vue";
import { music, staticData } from "@/store";
import { storeToRefs } from "pinia";

const musicStore = music();

let lyricBox;

const { mainTheme } = storeToRefs(staticData());

const { getCurrentMusicDesc, getCurrentLyticIndex, getShowLyricBoard, getIsToggleImg, getIsPaused, getLyricList } = storeToRefs(musicStore);

const scrollToMiddle = () => {
  let current = document.getElementById("current");
  if (!current) return;

  let h = current ? current.offsetTop - Math.round(lyricBox.clientHeight / 2) + Math.round(current.offsetHeight / 2) : 0;
  lyricBox &&
    lyricBox.scrollTo({
      top: h,
      behavior: "smooth",
    });
};

const fullScreen = () => {
  const app = document.getElementById("app");
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    app.requestFullscreen();
  }
};

watch(
  () => getCurrentLyticIndex.value,
  () => {
    scrollToMiddle();
  },
  {
    immediate: true,
  }
);

watch(
  () => getShowLyricBoard.value,
  (newV) => {
    if (newV) {
      nextTick(() => {
        scrollToMiddle();
      });
    }
  }
);

onMounted(() => {
  lyricBox = document.getElementById("lyricBox");
});
</script>

<template>
  <div :class="['lyric-mask', getShowLyricBoard ? 'lyric-mask-show' : 'lyric-mask-hide']">
    <div class="!w-[100%] !h-[100%] flex justify-between">
      <div class="left">
        <div class="text-4xl font-semibold">
          {{ getCurrentMusicDesc?.name }}
        </div>
        <div class="disc-box">
          <svg-icon class="disc" :name="mainTheme ? 'darkDisc' : 'lightDisc'" :width="22"></svg-icon>
          <img :class="['music-img', 'animate__animated', 'animate__fadeIn', getIsToggleImg ? '' : 'disc-rotate', getIsPaused ? 'paused' : '']" :src="getCurrentMusicDesc?.al?.picUrl" @click="fullScreen" />
        </div>
      </div>
      <div id="lyricBox" class="right">
        <div class="!p-[10px]">
          <div>
            <div class="text-2xl leading-loose text-center">
              {{ getCurrentMusicDesc?.name }}
            </div>
          </div>
          <div :id="getCurrentLyticIndex == index ? 'current' : ''" :class="['lyric-word', getCurrentLyticIndex == index ? 'current' : '']" v-for="(item, index) in getLyricList" :key="index">
            {{ item }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.lyric-mask {
  position: absolute;
  top: 0px;
  left: 5px;
  right: 5px;
  bottom: -5px;
  z-index: 2001;
  background-color: #fafafa;
  overflow: hidden;
  padding-top: 60px;
  display: none;

  .left {
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .right {
    padding: 20% 5%;
    width: 50%;
    height: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    overflow: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
}

.lyric-mask-show {
  display: block;
  animation: showBoard 0.3s ease-in-out forwards;
}
.lyric-mask-hide {
  animation: hideBoard 0.3s ease-in-out forwards;
}
@keyframes showBoard {
  0% {
    top: 100%;
  }
  100% {
    top: 0;
  }
}

@keyframes hideBoard {
  0% {
    top: 0;
    display: block;
  }
  100% {
    top: 100%;
  }
}

.disc-rotate {
  animation: rotate360 36s infinite linear;
}

.paused {
  animation-play-state: paused;
}

.disc-box {
  position: relative;
  width: 30rem;
  height: 30rem;
  display: grid;
  place-items: center;

  .disc {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .music-img {
    width: 15rem;
    height: 15rem;
    border-radius: 7.5rem;
    object-fit: cover;
    cursor: pointer;
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
.lyric-word {
  text-align: center;
  line-height: 2;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s;
  opacity: 0.5;
}
.current {
  font-size: 1.5rem;
  font-weight: bold;
  opacity: 1;
}

// mobile
@media screen and (max-width: 768px) {
  .lyric-mask {
    .right {
      width: 100%;
    }
    .left {
      display: none;
    }
  }
}
</style>
