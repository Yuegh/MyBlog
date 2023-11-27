<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const menuList = [
  {
    label: '首页',
    path: '/home',
  },
  {
    label: '相册',
    path: '/photoAlbum',
  },
  {
    label: '说说',
    path: '/talk',
  },
  {
    label: '留言',
    path: '/message/list',
  },
]

const goMenu = (val) => {
  router.push(val)
}

</script>

<template>
  <div class="home_bg">
    <!-- <canvas id="canvas"></canvas> -->
    <div class="content-box">
    <div class="font">肥猫博客</div>
    <!-- <TypeWriter class="type-writer" :typeList="saying"></TypeWriter> -->
    <ul class="home-tab">
      <li v-for="item in menuList" :key="item.path" @click="goMenu(item.path)">{{ item.label }}</li>
    </ul>
  </div>
  </div>
</template>

<style lang="scss" scoped>
.home_bg {
  width: 100%;
  height: 100vh;
  position: relative;
  background: rgba(0, 0, 0, 0.9);
  background-image: url(../../public/bg.png);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  box-shadow: inset 1px 2px 15px rgb(119, 183, 233),
  inset -1px 10px 9px rgb(105, 113, 228);
  overflow: hidden;
  
}
.content-box{
  position: absolute;
  top:50%;
  left:50% ;
  transform: translate(-50%,-50%);
  border-radius: 20px;
  box-shadow: 1px -1px 3px rgb(149, 148, 148),
  -1px 1px 3px rgb(204, 204, 204);
  width: 50%;
  height: 60%;
  background-color: rgba(66, 130, 158, 0.279);

}
.home-tab {
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translateX(-50%);
  min-height: 3rem;
  padding: 1rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  flex-wrap: nowrap;
  font-size: 1.6rem;
  color: rgb(253, 253, 253);
  font-weight: 600;
  margin-bottom: 1rem;
  border-radius: 1rem;
  border: 2px solid #fffcec65;
  box-shadow: inset -1px -1px 1px rgb(145, 145, 145),
  inset 1px 1px 1px rgb(156, 156, 156);
  background-color: rgba(112, 113, 113, 0.279);

  li {
    word-break: keep-all;
    margin-right: 1rem;
    &:hover{
      color: rgba(14, 122, 230, 0.396);
    }
  }
}
.font {
  position: absolute;
  top: 40%;
  left: 50%;
  font-style: italic;
  transform: translate(-50%, -50%);
  font-family: 'Peralta', monospace;
  font-size: clamp(2em, 8vmin, 20em);
  text-shadow: 0;
  color: #fffcec;
  padding: 0.5rem;
  cursor: pointer;
}


</style>
