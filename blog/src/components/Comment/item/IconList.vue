<script setup>
const emit = defineEmits(["open", "selectIcon"]);

const emojiList = [
  "http://mrzym.top/emoji/daxiao.png",
  "http://mrzym.top/emoji/dianyan.png",
  "http://mrzym.top/emoji/fadai.png",
  "http://mrzym.top/emoji/jinchi.png",
  "http://mrzym.top/emoji/jingxia.png",
  "http://mrzym.top/emoji/jingya.png",
  "http://mrzym.top/emoji/kouzhao.png",
  "http://mrzym.top/emoji/ku.png",
  "http://mrzym.top/emoji/ku1.png",
  "http://mrzym.top/emoji/kunao.png",
  "http://mrzym.top/emoji/liuhan.png",
  "http://mrzym.top/emoji/qinqin.png",
  "http://mrzym.top/emoji/qushi.png",
  "http://mrzym.top/emoji/se.png",
  "http://mrzym.top/emoji/shengbing.png",
  "http://mrzym.top/emoji/tianshi.png",
  "http://mrzym.top/emoji/tushe.png",
  "http://mrzym.top/emoji/weixiao.png",
  "http://mrzym.top/emoji/xiaoku.png",
  "http://mrzym.top/emoji/yihuo.png",
];

const handleIcon = (e) => {
  if (e.target.src) {
    emit("selectIcon", e.target.src);
  }
};
</script>

<template>
  <el-dropdown trigger="click" class="search-down" placement="bottom-start">
    <svg-icon name="smileFace" width="25px" @click="emit('open')"></svg-icon>
    <template #dropdown>
      <div class="pop">
        <div class="icon-list">
          <div class="w-[30px] h-[30px] cursor-pointer" v-for="src in emojiList" :key="src">
            <img style="width: 30px; height: 30px" :src="src" alt="" @click="(e) => handleIcon(e)" />
          </div>
        </div>
      </div>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped>
.pop {
  margin: 10px;
  overflow: auto;
}
.icon-list {
  width: 300px;
  min-height: 100px;
  display: grid;
  grid-template-columns: repeat(9, 30px);
  grid-auto-rows: 30px;
  gap: 3px;
}
</style>
