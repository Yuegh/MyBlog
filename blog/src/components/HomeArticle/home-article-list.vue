<script setup>
import { onBeforeUnmount, watch } from "vue";
import { useRouter } from "vue-router";
import { transform, unObserveBox } from "@/utils/transform";
import { numberFormate } from "@/utils/tool";

const emit = defineEmits(["pageChange"]);

const props = defineProps({
  articleList: {
    type: Array,
    default: () => {},
  },
  articleTotal: {
    type: Number,
    default: 0,
  },
  param: {
    type: Object,
    default: () => {},
  },
});

const router = useRouter();

let observe = null,
  boxList = [],
  timer = null;

/* 文章操作 start */
const operate = (type, item, index) => {
  switch (type) {
    case "detail":
      router.push({ path: "/article", query: { id: item.id } });
      break;
    case "tag":
      router.push({ path: "/tag" });
      break;
    case "category":
      router.push({ path: "/category" });
      break;
  }
};
/* 文章操作 end */

let layout = " prev, pager, next"; //分页组件会展示的功能项

const pagination = (page) => {
  emit("pageChange", page);
};

watch(
  () => props.articleList,
  () => {
    if (!props.articleList.length) return;
    timer = setInterval(() => {
      boxList = document.querySelectorAll(".article-col");
      if (boxList.length) {
        if (observe) {
          unObserveBox(observe, boxList);
          boxList = null;
        }
        observe = transform("", boxList, "100px 0px 100px 0px");
        clearInterval(timer);
        timer = null;
      }
    }, 500);
  }
);

onBeforeUnmount(() => {
  unObserveBox(observe, boxList);
  observe = null;
  clearInterval(timer);
  timer = null;
});
</script>

<template>
  <el-row class="root">
    <template v-if="param.loading">
      <el-col v-for="item in 10">
        <el-card class="card-hover">
          <div class="article-box">
            <el-skeleton :loading="param.loading" style="height: 100%" animated>
              <template #template>
                <ArticleSkeleton />
              </template>
            </el-skeleton>
          </div>
        </el-card>
      </el-col>
    </template>
    <template v-else>
      <el-col class="article-col" v-for="(item, index) in articleList" :key="item">
        <el-card class="card-hover">
          <div class="article-box">
            <div class="article-cover" @click="operate('detail', item)">
              <div v-image :data-src="item.article_cover" class="scale flex justify-center items-center" style="width: 100%; height: 100%">
                <el-image :src="item.article_cover" fit="cover" class="image animate__animated animate__fadeInDown">
                  <template #error>
                    <svg-icon name="image" :width="15" :height="15"></svg-icon>
                  </template>
                </el-image>
              </div>
            </div>
            <!-- 信息 -->
            <div class="article-info flex_c_between animate__animated animate__fadeIn">
              <span class="title text_overflow" :title="item.article_title" @click="operate('detail', item)">
                {{ item.article_title }}
              </span>
              <div class="meta">
                <span v-if="item.is_top == 1" class="to_pointer">
                  <i class="iconfont icon-zhiding"></i>
                  <span class="meta-label">置顶</span>
                </span>
                <span v-if="item.is_top == 1" class="article-meta__separator"></span>
                <span class="to_pointer">
                  <i class="iconfont icon-calendar2"></i>
                  <span class="meta-label">发表于</span>
                  <span class="meta-value">{{ item.createdAt }}</span>
                </span>
                <span class="to_pointer">
                  <i class="iconfont icon-schedule"></i>
                  <span class="meta-label">更新于</span>
                  <span class="meta-value">{{ item.updatedAt }}</span>
                </span>
                <span class="article-meta__separator"></span>
                <span class="to_pointer" @click="operate('category', item)">
                  <i class="iconfont icon-folder"></i>
                  <span class="meta-value">{{ item.categoryName }}</span>
                </span>
                <span class="article-meta__separator"></span>
                <span class="to_pointer" @click="operate('tag', item)">
                  <i class="iconfont icon-label_fill"></i>
                  <span class="meta-value" v-for="(tagName, index) in item.tagNameList" :key="index"> {{ index == item.tagNameList.length - 1 ? tagName : tagName + "、" }} </span>
                </span>
                <span class="article-meta__separator"></span>
                <span class="to_pointer">
                  <i class="iconfont icon-icon1"></i>
                  <span class="meta-value">{{ numberFormate(item.thumbs_up_times - 0) }}</span>
                </span>
                <span class="article-meta__separator"></span>
                <span class="to_pointer">
                  <i class="iconfont icon-chakan"></i>
                  <span class="meta-value">{{ numberFormate(item.view_times - 0) }} </span>
                </span>
              </div>
              <tooltip width="100%" size="1.2rem" align="left" :lineHeight="3" :name="item.article_description" />
            </div>
          </div>
          <!-- 图片 -->
        </el-card>
      </el-col>
    </template>
    <pagi-nation :size="param.size" :current="param.current" :layout="layout" :total="articleTotal" @pagination="pagination" />
  </el-row>
</template>

<style lang="scss" scoped>
.article-cover {
  .image {
    width: 100%;
    height: 100%;
    vertical-align: bottom;
  }
}

.article-info {
  .title {
    display: inline-block;
    width: 100%;
    font-size: 1.8rem;
    color: #676767;
    font-weight: 600;
    line-height: 3;
    transition: 0.2s ease-in-out;

    &:hover {
      cursor: pointer;
      color: var(--primary);
    }
  }

  .meta {
    color: #858585;
    line-height: 1.4;
    font-size: 100%;
    font-weight: 500;

    .icon-zhiding {
      font-size: 1rem;
      color: var(--top);
    }

    &-label {
      padding-right: 0.2rem;
    }

    &-value {
      padding-right: 0.2rem;
    }

    .icon-label_fill {
      font-size: 1.2rem;
    }

    .icon-icon1 {
      font-size: 1.2rem;
    }

    .icon-chakan {
      font-size: 1.2rem;
    }

    .article-meta__separator {
      margin: 0 0.4rem;
      font-size: 1.1rem;
      position: relative;

      &::after {
        content: "|";
        position: absolute;
        top: -3px;
        right: 0;
      }
    }

    i {
      margin: 0 0.2rem 0 0;
    }
  }
}

@media screen and (max-width: 768px) {
  .article-box {
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    align-items: center;
    height: 30rem;
  }

  .article-cover {
    width: 100%;
    height: 18rem;
    overflow: hidden;
  }

  .article-info {
    width: 100%;
    padding: 1rem 1.5rem;
    overflow: hidden;
    display: inline-block;
  }
}

// pc
@media screen and (min-width: 768px) {
  .article-box {
    display: flex;
    align-items: center;
    height: 20rem;
  }

  .article-cover {
    width: 45%;
    height: 100%;
    overflow: hidden;
  }

  .article-info {
    width: 55%;
    padding: 0 40px;
    overflow: hidden;
    display: inline-block;
  }
}
</style>
