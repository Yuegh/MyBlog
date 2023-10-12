<script setup>
import { ref, watch, onMounted } from "vue";
import { debounce } from "@/utils/tool";
import { keepLastIndex, getCurrentIndex } from "../tool.js";
import IconList from "./IconList.vue";

const emit = defineEmits(["update:inputText", "publish"]);

const props = defineProps({
  inputText: {
    type: String,
    default: "",
  },
  showPublishButton: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: "",
  },
  parent: {
    type: Boolean,
    default: false,
  },
});

const inputCommentRef = ref("");
const showPublish = ref(false);
const currentIndex = ref(0);

const inputComment = debounce(() => {
  emit("update:inputText", inputCommentRef.value.innerHTML);
}, 100);

const publish = () => {
  // 发布
  emit("publish");
  showPublish.value = false;
};

// 清空内容
const clear = () => {
  inputCommentRef.value.innerHTML = "";
  emit("update:inputText", inputCommentRef.value.innerHTML);
};

// 当鼠标点入输入框做的事情 光标得在最后一位
const focusCommentInput = () => {
  if (inputCommentRef.value.innerHTML == "说点儿什么~") {
    inputCommentRef.value.innerHTML = "";
  }
  showPublish.value = true;
  keepLastIndex(inputCommentRef.value);
};

const selectIcon = (val) => {
  const text = `<img style="width: 1.5rem; height: 1.5rem" src="${val}" />`;

  inputCommentRef.value.innerHTML += text;
  emit("update:inputText", inputCommentRef.value.innerHTML);

  keepLastIndex(inputCommentRef.value);
};

const clickIconList = () => {
  currentIndex.value = getCurrentIndex(inputCommentRef.value);
};

watch(
  () => props.showPublishButton,
  (newV) => {
    showPublish.value = newV;
  }
);
onMounted(() => {
  if (inputCommentRef.value) {
    inputCommentRef.value.innerHTML = props.inputText || "说点儿什么~";
  }
});

defineExpose({
  clear,
});
</script>

<template>
  <div :class="parent ? 'parent-input' : 'children-input'">
    <div class="header">
      <div v-if="placeholder" class="placeholder">@ {{ placeholder }}</div>
      <div ref="inputCommentRef" contenteditable="true" :class="[parent ? 'parent-input-inputText' : 'children-input-inputText', 'input-inputText', '!mt-[5px]']" rows="3" cols="20" @input="inputComment(val)" @focus="focusCommentInput">说点儿什么~</div>
    </div>
    <div v-if="showPublish" class="!mt-[0.5rem] flex justify-between items-center animate__animated animate__fadeIn">
      <div class="cursor-pointer">
        <IconList @open="clickIconList" @select-icon="selectIcon" />
      </div>
      <div v-if="inputText">
        <el-button type="danger" class="clear-btn" @click="clear">清空</el-button>
        <el-button type="primary" class="publish-btn" @click="publish">发布</el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.placeholder {
  font-weight: 600;
  color: #a4a4a4;
}

.input-inputText {
  background-color: #fafafa;
  border-radius: 8px;
  padding: 8px;
  box-sizing: border-box;
  color: var(--font-color);
  font-size: 1rem;
}

.publish-btn {
  background-color: var(--primary);
  border: none;
}

.clear-btn {
  background-color: var(--top);
}

// pc
@media screen and (min-width: 768px) {
  .parent-input {
    width: 100%;
  }

  .children-input {
    width: 500px;
  }

  .parent-input-inputText {
    width: 100%;
    min-height: 80px;
  }
  .children-input-inputText {
    width: 100%;
    min-height: 60px;
  }

  .publish-btn {
    font-size: 1rem;
    height: 1.8rem;
    padding: 0 1rem;
  }
  .clear-btn {
    font-size: 1rem;
    height: 1.8rem;
    padding: 0 1rem;
  }
}
// mobile
@media screen and (max-width: 768px) {
  .parent-input {
    width: 100%;
  }

  .children-input {
    width: 260px;
  }

  .parent-input-inputText {
    width: 100%;
    min-height: 60px;
  }
  .children-input-inputText {
    width: 100%;
    min-height: 40px;
  }

  .publish-btn {
    font-size: 1rem;
    height: 1.5rem;
    padding: 0 0.5rem;
  }
  .clear-btn {
    font-size: 1rem;
    height: 1.5rem;
    padding: 0 0.5rem;
  }
}
</style>
