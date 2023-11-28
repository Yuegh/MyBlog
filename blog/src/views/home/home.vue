<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { homeGetArticleList } from "@/api/article";
import { homeGetConfig } from "@/api/config";
import { getAllTag } from "@/api/tag";
import { homeGetStatistic } from "@/api/home";
import { randomFontColor, numberFormate } from "@/utils/tool";
import HomeArticleList from "@/components/HomeArticle/home-article-list.vue";
import RightSide from "@/components/RightSide/right-side.vue";
import MobileTopSkeleton from "@/components/RightSide/components/skeleton/mobile-top-skeleton .vue";
import { user } from "@/store/index.js";
import { transform, unObserveBox } from "@/utils/transform";

const userStore = user();

/** 文章 */
const param = reactive({
  current: 1, // 当前页
  size: 10, // 每页条目数
  loading: true, // 加载
});
const articleList = ref([]);
const articleTotal = ref();
let observe = null,
  boxList = [];

const getHomeArticleList = async (type) => {
  type == "init" ? "" : (param.loading = true);
  let res = await homeGetArticleList(param.current, param.size);

  if (res.code == 0) {
    type == "init" ? "" : (param.loading = false);
    const { list, total } = res.result;
    articleList.value = list;
    articleTotal.value = total;
  }
};

const pagination = (page) => {
  param.current = page.current;
  getHomeArticleList();
};

/** 网站右侧 */
const rightSizeLoading = ref(true);
const runtime = ref(0);
let configDetail = reactive({});
let tags = ref([]);

// 获取网站详细信息
const getConfigDetail = async () => {
  let res = await homeGetConfig();
  if (res.code == 0) {
    configDetail = res.result;
    userStore.setBlogAvatar(res.result.blog_avatar);
    calcRuntimeDays(configDetail.createdAt);
  }
};
// 获取文章数、分类数、标签数
const getStatistic = async () => {
  let res = await homeGetStatistic();
  if (res.code == 0) {
    Object.assign(configDetail, res.result);
  }
};

// 获取所有的标签
const getAllTags = async () => {
  let res = await getAllTag();
  if (res.code == 0) {
    tags.value = res.result.map((r) => {
      r.color = randomFontColor();
      return r;
    });
  }
};
// 计算出网站运行天数
const calcRuntimeDays = (time) => {
  if (time) {
    time = time.replace(/\-/g, "/"); // 解决ios系统上格式化时间出现NAN的bug
    const now = new Date().getTime();
    const created = new Date(time).getTime();
    const days = Math.floor((now - created) / 8.64e7);
    runtime.value = days;
  }
};

const init = async () => {
  param.loading = true;
  rightSizeLoading.value = true;
  await getHomeArticleList("init");
  await getConfigDetail();
  await getStatistic();
  await getAllTags();
  param.loading = false;
  rightSizeLoading.value = false;
};

const observeMobileBox = () => {
  boxList = document.querySelectorAll(".mobile-card");
  if (boxList.length) {
    if (observe) {
      unObserveBox(observe, boxList);
      boxList = null;
    }
    observe = transform("", boxList, "100px 0px 100px 0px");
  }
};

onMounted(async () => {
  await init();
  await observeMobileBox();
});

onBeforeUnmount(() => {
  unObserveBox(observe, boxList);
  observe = null;
});
</script>

<template>
  <div class="home_center_box">
    <el-row>
      <div class="water">
        <div class="card"></div>
      </div>
   
      <!-- 信息 -->
      <el-col :xs="0" :sm="5">
        <!-- 博客我的信息 -->
        <RightSide :configDetail="configDetail" :tags="tags" :runtime="runtime" :loading="rightSizeLoading" />
      </el-col>
      <!-- 文章 -->
      <el-col :xs="24" :sm="14">
        <el-card class="mobile-top-card mobile-card info-card animate__animated animate__fadeIn" shadow="hover">
          <el-skeleton :loading="rightSizeLoading" animated>
            <template #template>
              <MobileTopSkeleton />
            </template>
            <template #default>
              <RightSideTop :configDetail="configDetail" />
            </template>
          </el-skeleton>
        </el-card>
        <!-- 博客文章 -->
        <HomeArticleList :articleList="articleList" :param="param" :articleTotal="articleTotal" @pageChange="pagination"></HomeArticleList>
        <el-card class="mobile-bottom-card card-hover mobile-card info-card animate__animated animate__fadeIn" shadow="hover">
          <el-skeleton :loading="rightSizeLoading" animated>
            <template #template>
              <RightSideSkeletonItem />
            </template>
            <template #default>
              <RightSideItem icon="icon-localoffer" title="网站资讯">
                <div class="site-info">
                  <div class="flex_r_between">
                    <span>文章数目：</span>
                    <span class="value">{{ configDetail.articleCount }}</span>
                  </div>
                  <div class="flex_r_between">
                    <span>运行时间：</span>
                    <span class="value">{{ runtime }} 天</span>
                  </div>
                  <div class="flex_r_between">
                    <span>博客访问次数：</span>
                    <span class="value">{{ numberFormate(configDetail.view_time) }}</span>
                  </div>
                </div>
              </RightSideItem>
            </template>
          </el-skeleton>
        </el-card>
      </el-col>
    <el-col :xs="0" :sm="5">
      <el-calendar v-model="value" />
    </el-col>
    </el-row>
  </div>
</template>


<style lang="scss" scoped>
.mobile-top-card {
  height: 31rem;
  margin: 4px;
  :deep(.info-avatar) {
    padding: 0 2rem;
  }
  :deep(.personal-say) {
    padding-left: 1rem;
  }
  :deep(.info-background) {
    height: 10rem;
    width: 100%;
  }
  :deep(.common-menu) {
    padding: 1.5rem 5.5rem;
  }
  :deep(.git-ee) {
    padding: 0 4rem;
  }
  :deep(.personal-link) {
    padding: 1rem 6rem;
  }
}
.mobile-bottom-card {
  margin: 4px;
  padding: 1rem;
  .icon-localoffer {
    font-weight: 900;
  }
  span {
    margin-left: 0.3rem;
  }
  .site-info {
    padding: 0.3rem 1rem;
    line-height: 2;
    font-size: 1rem;

    .value {
      font-weight: 600;
    }
  }
}
</style>
