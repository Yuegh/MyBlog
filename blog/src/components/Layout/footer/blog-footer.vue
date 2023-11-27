<template>
  <!-- 最外层 div 是占位置的 -->
  <div class="footer_box flex flex-col items-center justify-center">
    <div class="footer-color">加肥猫的博客</div>
    <div class="footer-color mt-[5px] flex justify-center flex-wrap">
      <a href="">关注博主不迷路</a>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.footer-color {
  color: var(--font-color);
  text-align: center;
}

.change-color {
  text-decoration: none;
  transition: all 0.3s;

  &:hover {
    color: #000;
  }
}
</style>
