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
]

const goMenu = (val) => {
  router.push(val)
}

</script>

<template>
  <div class="home_bg">
    <div class="content-box">
    <div class="title">
      <span>肥猫博客</span>
    </div>
  <div class="shadow">
    <div class="card">
  <div class="boxshadow"></div>
  <div class="main">
    <div class="top"></div>
    <div class="left side"></div>
    <div class="right side"></div>
    <div class="title">肥猫博客</div>
    <div class="button-container">
      <button class="button"  v-for="item in menuList" :key="item.path" @click="goMenu(item.path)">
        {{ item.label }}
      </button>
  
    </div>
  </div>
</div>
    </div>
  </div>
  </div>
</template>

<style lang="scss" scoped>

.home_bg {
  width: 100%;
  height: 100vh;
  background: rgba(9, 9, 9, 0.9);
  // background-image: url(../../public/bg.png);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  box-shadow: inset 1px 2px 15px rgb(119, 183, 233),
  inset -1px -6px 9px rgb(105, 113, 228);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  .content-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    height: 40rem;
    span{
      display: block;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 4.5rem;
      color: rgb(79, 108, 239) !important;
      font-family: 'Courier New', Courier, monospace;
      text-shadow: 0px 0px 10px rgb(119, 183, 233);
      width: 22rem;
      height: 8rem;
      border-radius: 10px;
      box-shadow: var(--dark-card-box-shadow);

    }
  }
}

.shadow{
  width: 22rem;
  height: 25rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  box-shadow: var(--dark-card-box-shadow);
}
.card {
  position: relative;
  height: 300px;
  width: 230px;
}

.card .boxshadow {
  position: absolute;
  height: 100%;
  width: 100%;
  border: 1px solid rgb(19, 99, 238)(0, 94, 255);
  transform: scale(0.8);
  box-shadow: rgb(0, 115, 255) 0px 30px 70px 0px;
  transition: all 0.5s cubic-bezier(0.785, 0.135, 0.15, 0.86);
}

.card .main {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: rgb(0, 145, 255);
  background: linear-gradient(0deg, rgb(0, 32, 62) 0%, rgb(0, 51, 255) 60%, rgb(0, 30, 62) 100%);
  position: relative;
  -webkit-clip-path: polygon(0 40px, 40px 0, calc(100% - 40px) 0, 100% 40px, 100% calc(100% - 40px), calc(100% - 40px) 100%, 40px 100%, 0 calc(100% - 40px));
  clip-path: polygon(0 40px, 40px 0, calc(100% - 40px) 0, 100% 40px, 100% calc(100% - 40px), calc(100% - 40px) 100%, 40px 100%, 0 calc(100% - 40px));
  -webkit-clip-path: polygon(0 0, 100% 0, 100% 40px, 100% calc(100% - 40px), calc(100% - 40px) 100%, 40px 100%, 0 calc(100% - 40px));
  clip-path: polygon(0 0, 100% 0, 100% 40px, 100% calc(100% - 40px), calc(100% - 40px) 100%, 40px 100%, 0 calc(100% - 40px));
  box-shadow: rgb(0, 17, 255) 0px 7px 29px 0px;
  transition: all 0.3s cubic-bezier(0.785, 0.135, 0.15, 0.86);
}

.card .main .top {
  position: absolute;
  top: 0px;
  left: 0;
  width: 0px;
  height: 0px;
  z-index: 2;
  border-top: 115px solid rgb(0, 0, 0);
  border-left: 115px solid transparent;
  border-right: 115px solid transparent;
  transition: all 0.5s cubic-bezier(0.785, 0.135, 0.15, 0.86);
}

.card .main .side {
  position: absolute;
  width: 100%;
  top: 0;
  transform: translateX(-50%);
  height: 101%;
  background: black;
  -webkit-clip-path: polygon(0% 0%, 50% 0, 95% 45%, 100% 100%, 0% 100%);
  clip-path: polygon(0% 0%, 50% 0, 95% 45%, 100% 100%, 0% 100%);
  transition: all 0.5s cubic-bezier(0.785, 0.135, 0.15, 0.86) 1s;
}

.card .main .left {
  left: 0;
}

.card .main .right {
  right: 0;
  transform: translateX(50%) scale(-1, 1);
}

.card .main .title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 90px;
  font-weight: bold;
  font-size: 25px;
  opacity: 0;
  z-index: -1;
  transition: all 0.2s ease-out 0s;
}

.card .main .button-container {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
}

.card .main .button-container .button {
  width: 3.125rem;
  position: absolute;
  transform: translateX(-50%);
  padding: 5px 10px;
  -webkit-clip-path: polygon(0 0, 100% 0, 81% 100%, 21% 100%);
  clip-path: polygon(0 0, 100% 0, 81% 100%, 21% 100%);
  background: rgb(19, 18, 18);
  border: none;
  color: rgb(52, 150, 249);
  display: grid;
  place-content: center;
  transition: all 0.5s cubic-bezier(0.785, 0.135, 0.15, 0.86);
}



.card .main .button-container .button:nth-child(1) {
  bottom: 300px;
  transition-delay: 0.4s;
}

.card .main .button-container .button:nth-child(2) {
  bottom: 300px;
  transition-delay: 0.6s;
}

.card .main .button-container .button:nth-child(3) {
  bottom: 300px;
  transition-delay: 0.8s;
}

.card .main .button-container .button:hover .svg {
  transform: scale(1.2);
}

.card .main .button-container .button:active .svg {
  transform: scale(0.7);
}

.card:hover .main {
  transform: scale(1.1);
}

.card:hover .main .top {
  top: -50px;
}

.card:hover .main .left {
  left: -50px;
  transition: all 0.5s cubic-bezier(0.785, 0.135, 0.15, 0.86) 0.1s;
}

.card:hover .main .right {
  right: -50px;
  transition: all 0.5s cubic-bezier(0.785, 0.135, 0.15, 0.86) 0.1s;
}

.card:hover .main .title {
  opacity: 1;
  transition: all 0.2s ease-out 1.3s;
}

.card:hover .main .button-container .button:nth-child(1) {
  bottom: 80px;
  transition-delay: 0.8s;
}

.card:hover .main .button-container .button:nth-child(2) {
  bottom: 40px;
  transition-delay: 0.6s;
}

.card:hover .main .button-container .button:nth-child(3) {
  bottom: 0;
  transition-delay: 0.4s;
}
</style>


