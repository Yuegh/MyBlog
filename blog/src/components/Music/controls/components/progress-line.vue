<!--
* @Author: Zhang Yuming
* @Date: 2023-07-03 11:48:31
* @Description: 音乐进度组件
-->
<script setup>
import { ref, watch, defineComponent } from "vue";
import { music } from "@/store/index";
import { storeToRefs } from "pinia";

const musicStore = music();
const { getShowLyricBoard, getCurrentMusicId } = storeToRefs(musicStore);

defineComponent({
  name: "ProgressLine",
});

// 暴露出进度变化事件
const emits = defineEmits(["scheduleChange"]);

const props = defineProps({
  schedule: {
    // 进度
    type: Number,
    default: 0,
  },
});

const currentSchedule = ref(0);

const handleChange = () => {
  // 修改pina里的当前播放进度 统一状态管理
  musicStore.setCurrentSchedule(currentSchedule.value);
  // 通知父组件 当前播放进度改变了
  emits("scheduleChange");
};

const toggleLyricBoard = (val) => {
  musicStore.setShowLyricBoard(val);
};

watch(
  () => props.schedule,
  (newV) => {
    currentSchedule.value = newV;
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <div ref="musicRef" class="music-line">
    <div v-if="getCurrentMusicId">
      <div v-if="getShowLyricBoard" @click="toggleLyricBoard(false)" class="lyric lyric-down flex flex-col justify-center items-center">
        <i class="iconfont icon-arrowdown"></i>
        <i class="iconfont icon-arrowdown !mt-[-18px]"></i>
      </div>
      <div v-else @click="toggleLyricBoard(true)" class="lyric lyric-up flex flex-col justify-center items-center">
        <i class="iconfont icon-arrowup"></i>
        <i class="iconfont icon-arrowup !mt-[-18px]"></i>
      </div>
    </div>
    <el-slider v-model="currentSchedule" :step="0.1" :show-tooltip="false" @change="handleChange" />
  </div>
</template>

<style lang="scss" scoped>
.music-line {
  position: relative;
  width: 100%;
}
.iconfont {
  font-size: 1.5rem;
  font-weight: bold;
}
.lyric {
  position: absolute;
  left: 50%;
  top: -20px;
  z-index: 3009;
  color: #000;
}
.lyric-down {
  animation: down 2s ease-out infinite;
}
.lyric-up {
  animation: up 2s ease-out infinite;
}
@keyframes down {
  0% {
    opacity: 0.5;
    transform: translateX(-50%) scaleX(2) translateY(-5px);
  }

  100% {
    opacity: 0;
    transform: translateX(-50%) scaleX(2) translateY(0);
  }
}
@keyframes up {
  0% {
    opacity: 0.5;
    transform: translateX(-50%) scaleX(2) translateY(5px);
  }

  100% {
    opacity: 0;
    transform: translateX(-50%) scaleX(2) translateY(0);
  }
}
:deep(.el-slider__bar) {
  background-color: #62bf82;
}

:deep(.el-slider__button) {
  width: 8px;
  height: 8px;
  border: solid 2px #62bf82;
}

:deep(.el-slider.is-vertical .el-slider__runway) {
  width: 4px;
  margin: 0;
}

:deep(.el-slider.is-vertical .el-slider__button-wrapper) {
  left: -16px;
}

:deep(.el-slider.is-vertical .el-slider__bar) {
  width: 4px;
}
</style>
