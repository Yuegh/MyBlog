<!--友链列表  -->
<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, h } from "vue";
import { getFriendLinks, addFriendLinks } from "@/api/links";
import { ElNotification } from "element-plus";
import SkeletonItem from "@/components/SkletonItem/skeleton-item.vue";

const urlV = (rule, value, cb) => {
  const reg = new RegExp(/^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/);
  if (!value) {
    return cb(new Error("请输入网站地址"));
  } else if (value && !reg.test(value)) {
    return cb(new Error("请输入正确的网站地址"));
  } else {
    cb();
  }
};

const active = ref(0);
const activeType = ref("");
const loading = ref(false);
const params = reactive({
  current: 1,
  size: 12,
  status: 2,
});
const activeName = ref("");

const linksList = ref([]);
const total = ref(0);
const formRef = ref();
const form = reactive({
  site_name: "", // 网站名称
  site_desc: "", // 网站描述
  url: "", // 网址
  site_avatar: "", // 网站头像
});
const primaryForm = reactive({ ...form });
let observe;
let box;

const rules = reactive({
  site_name: [{ required: true, message: "请输入网站名称", trigger: "blur" }],
  site_desc: [{ required: true, message: "请输入网站描述", trigger: "blur" }],
  url: [{ required: true, validator: urlV, trigger: "blur" }],
});

// 鼠标进入触发
const mouseEnterItem = (type, index) => {
  activeType.value = type;
  active.value = index;
};
// 鼠标离开触发
const mouseLeaveItem = () => {
  activeType.value = "";
  active.value = 0;
};
const goToSite = (url) => {
  window.open(url);
};

const observeBox = () => {
  // 获取要监听的元素
  box = document.querySelector(".observer");
  observe = new IntersectionObserver(
    (entries) => {
      entries.forEach(async (e) => {
        if (e.isIntersecting && e.intersectionRatio > 0) {
          if (total.value > linksList.value.length) {
            params.current++;
            pageGetLinksList(e);
          }
        }
      });
    },
    { threshold: [1] }
  );
  observe.observe(box);
};

// 申请友链
const applayLinks = async () => {
  await formRef.value.validate(async (valid) => {
    if (valid) {
      const res = await addFriendLinks(form);
      if (res && res.code == 0) {
        ElNotification({
          offset: 60,
          title: "提示",
          message: h("div", { style: "color: #7ec050; font-weight: 600;" }, "申请成功，等待博主审核通过"),
        });
        activeName.value = "";
        Object.assign(form, primaryForm);
      } else {
        ElNotification({
          offset: 60,
          title: "错误提示",
          message: h("div", { style: "color: #f56c6c; font-weight: 600;" }, res.message),
        });
      }
    }
  });
};

const returnUrl = (url) => {
  const end = url.substring(url.length - 1);
  return end != "/" ? url + "/favicon.ico" : url + "favicon.ico";
};

const pageGetLinksList = async () => {
  if (params.current == 1) {
    loading.value = true;
  }
  const res = await getFriendLinks(params);
  if (res && res.code == 0) {
    linksList.value = params.current == 1 ? res.result.list : linksList.value.concat(res.result.list);
    total.value = res.result.total - 0;
    loading.value = false;
  }
};

onMounted(async () => {
  await pageGetLinksList();
  if (linksList.value.length < total.value) {
    observeBox();
  }
});

onBeforeUnmount(() => {
  observe && observe.unobserve(box);
  observe = null;
});
</script>

<template>
  <PageHeader :loading="loading" />
  <div class="center_box">
    <el-collapse v-model="activeName" class="apply">
      <el-collapse-item title="申请友链" name="applay">
        <el-form class="apply-form" ref="formRef" :model="form" :rules="rules" label-width="100px" label-suffix=":">
          <el-form-item label="网站名称" prop="site_name">
            <el-input v-model="form.site_name" :style="{ width: '220px' }" placeholder="请输入网站名称" clearable />
          </el-form-item>
          <el-form-item label="网站描述" prop="site_desc">
            <el-input type="textarea" v-model="form.site_desc" :style="{ width: '220px' }" maxlength="125" resize="none" :autosize="{ minRows: 2, maxRows: 3 }" show-word-limit placeholder="请输入网站描述" clearable />
          </el-form-item>
          <el-form-item label="网站地址" prop="url">
            <el-input v-model="form.url" :style="{ width: '220px' }" placeholder="请输入网站地址" clearable />
          </el-form-item>
          <el-form-item label="网站头像" prop="site_avatar">
            <el-input v-model="form.site_avatar" :style="{ width: '220px' }" placeholder="请输入网站头像" clearable />
          </el-form-item>
        </el-form>
        <div class="pos">
          <el-button class="apply-button" type="danger" @click="applayLinks">申请</el-button>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-skeleton :loading="loading" style="height: 100%" animated>
      <template #template>
        <div class="flex justify-start w-[100%] !mt-[10px]" v-for="i in 2" :key="i">
          <div class="flex justify-between w-[100%] !p-[10px]">
            <div class="w-[47%] flex">
              <SkeletonItem variant="circle" width="60px" height="60px" />
              <div class="w-[60%] flex flex-col justify-start !ml-[10px]">
                <SkeletonItem variant="text" width="20%" height="20px" />
                <SkeletonItem variant="text" width="90%" height="30px" top="5px" />
              </div>
            </div>
            <div class="w-[47%] flex">
              <SkeletonItem variant="circle" width="60px" height="60px" />
              <div class="w-[60%] flex flex-col justify-start !ml-[10px]">
                <SkeletonItem variant="text" width="20%" height="20px" />
                <SkeletonItem variant="text" width="90%" height="30px" top="5px" />
              </div>
            </div>
          </div>
        </div>
      </template>
      <el-row class="site">
        <el-col :xs="12" :sm="6" v-for="(item, index) in linksList" :key="index">
          <el-card class="card-hover">
            <div class="site-item animate__animated animate__fadeIn" @click="goToSite(item.url)">
              <div class="left" @mouseenter="mouseEnterItem('site', index)" @mouseleave="mouseLeaveItem">
                <span :class="['top', activeType == 'site' && active == index ? 'top-animate' : '']"></span>
                <el-avatar fit="scale-down" :size="60" :src="item.site_avatar || returnUrl(item.url)">
                  <span class="avatar-font">{{ item.site_name }}</span></el-avatar
                >
                <span :class="['bottom', activeType == 'site' && active == index ? 'bottom-animate' : '']"></span>
              </div>
              <div class="right">
                <a :title="item.site_name" :href="item.url" target="_blank" class="name">{{ item.site_name }}</a>
                <span :title="item.site_desc" class="desc"> {{ item.site_desc }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <div class="observer">{{ total <= linksList.length ? "没有更多了" : "加载更多" }}</div>
    </el-skeleton>
  </div>
</template>

<style lang="scss" scoped>
.site {
  &-item {
    display: flex;
    justify-content: flex-start;
    padding: 20px 10px;
    cursor: pointer;

    .left {
      position: relative;
      width: 60px;
      height: 60px;
      transition: all 0.8s;

      &:hover {
        transform: scale(1.1);
      }

      .top {
        content: "";
        position: absolute;
        top: -3px;
        left: -3px;
        width: 66px;
        height: 33px;
        border-top-left-radius: 33px;
        border-top-right-radius: 33px;
        background: rgba(255, 255, 255, 0.3);
      }

      .top-animate {
        animation-name: up;
        animation-duration: 0.8s;
        animation-fill-mode: forwards;
      }

      .bottom {
        content: "";
        position: absolute;
        bottom: -3px;
        left: -3px;
        width: 66px;
        height: 33px;
        border-bottom-left-radius: 33px;
        border-bottom-right-radius: 33px;
        background: rgba(255, 255, 255, 0.3);
      }

      .bottom-animate {
        animation-name: down;
        animation-duration: 0.8s;
        animation-fill-mode: forwards;
      }
    }

    .right {
      width: 70%;
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;

      .name {
        width: 90%;
        font-size: 1.2rem;
        font-weight: 600;
        line-height: 1.7;
        color: var(--font-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-decoration: none;

        &:hover {
          color: var(--primary);
        }
      }

      .desc {
        display: -webkit-box;
        width: 90%;
        height: 2.4rem;
        color: var(--font-color);
        font-size: 0.8rem;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
  }
}

.apply {
  margin: 3.75px;
  .pos {
    padding: 0.5rem 0 0 10rem;
  }

  &-button {
    height: 24px;
    padding: 0 30px;
    background-color: var(--border-color);
    border: none;
    transition: all 0.5s;
    &:hover {
      background-color: var(--primary);
    }
  }
}

.observer {
  text-align: center;
  font-size: 1rem;
  color: var(--font-color);
  margin-top: 3px;
  letter-spacing: 1px;
}

@keyframes up {
  0% {
    transform: translateY(0px);
  }

  100% {
    transform: translateY(-33px);
    background: rgba(255, 255, 255, 0);
  }
}

@keyframes down {
  0% {
    transform: translateY(0px);
  }

  100% {
    transform: translateY(33px);
    background: rgba(255, 255, 255, 0);
  }
}

:deep(.el-avatar) {
  color: var(--font-color);
  background: linear-gradient(90deg, #dfd2d2 1%, #ead2ea 10.2%, #e4d5ee 19.6%, #d1def3 36.8%, #b5dee5 62.2%, #cfebf3 88.9%, #dde7ea 99%) !important;
}

:deep(.el-form-item) {
  padding: 10px 0;
}
</style>
