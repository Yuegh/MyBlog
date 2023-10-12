<!-- 用户登录注册  -->
<script setup>
import { ref, reactive, watch, h } from "vue";
import { useRoute, useRouter } from "vue-router";
import { reqLogin, reqRegister, getUserInfoById } from "@/api/user";
import { ElNotification } from "element-plus";
import { user } from "@/store/index.js";
import { _getLocalItem, getWelcomeSay } from "@/utils/tool";

const userStore = user();
const route = useRoute();
const router = useRouter();

const usernameV = (rule, value, cb) => {
  if (!value) {
    return cb(new Error("请输入用户账号"));
  } else if (value.length > 16 || value.length < 5) {
    return cb(new Error("用户账号长度应该在5-16之间"));
  }
  cb();
};
const REGEXP_PWD = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)(?!^.*[\u4E00-\u9FA5].*$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){6,18}$/;
const password1V = (rule, value, cb) => {
  if (!value) {
    return cb(new Error("请输入密码"));
  } else if (!REGEXP_PWD.test(value)) {
    return cb(new Error("密码格式应为8-18位数字、字母、符号的任意两种组合"));
  }
  cb();
};
const password2V = (rule, value, cb) => {
  if (!value) {
    return cb(new Error("请输入二次确认密码"));
  } else if (value != registerForm.password1) {
    return cb(new Error("两次密码不一致"));
  }
  cb();
};

const loginFormRef = ref();
const loginForm = reactive({
  username: "",
  password: "",
});
const primaryLoginForm = reactive({ ...loginForm });

const registerFormRef = ref();
const registerForm = reactive({
  username: "", // 用户名
  password1: "", // 密码
  password2: "", // 确认密码
  nick_name: "", // 昵称
});
const primaryRegisterForm = reactive({ ...registerForm });

const loginRlues = {
  username: [{ required: true, message: "请输入用户账号", trigger: "blur" }],
  password: [{ required: true, message: "请输入用户密码", trigger: "blur" }],
};
const registerRules = {
  username: [{ required: true, validator: usernameV, trigger: "blur" }],
  password1: [{ required: true, validator: password1V, trigger: "blur" }],
  password2: [{ required: true, validator: password2V, trigger: "blur" }],
};

// 用户注册
const userRegister = async () => {
  await registerFormRef.value.validate(async (valid) => {
    if (valid) {
      const register = {
        username: registerForm.username,
        password: registerForm.password1,
        nick_name: registerForm.nick_name,
      };
      const res = await reqRegister(register);
      if (res && res.code == 0) {
        ElNotification({
          offset: 60,
          title: "提示",
          message: h("div", { style: "color: #7ec050; font-weight: 600;" }, "注册成功"),
        });
        // 自动登录
        await userLogin("register");
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

const welcome = (id, nick_name) => {
  // 欢迎
  let msg = getWelcomeSay(nick_name);
  if (id == 3) {
    msg = "小婷光临，真是三生有幸";
  }
  ElNotification({
    offset: 60,
    title: "欢迎～",
    message: h("div", { style: "font-weight: 600;" }, msg),
  });
};

// 用户登录
const userLogin = async (type) => {
  // 如果是用户注册以后进行登录的 参数需要整合一下
  if (type == "register") {
    const loginForm = {
      username: registerForm.username,
      password: registerForm.password1,
    };

    const res = await reqLogin(loginForm);
    if (res && res.code == 0) {
      // 保存 token
      await userStore.setToken(res.result.token);
      ElNotification({
        offset: 60,
        title: "提示",
        message: h("div", { style: "color: #7ec050; font-weight: 600;" }, "自动登录成功"),
      });
      // 获取并保存当前用户信息
      const userRes = await getUserInfoById(res.result.id);
      if (userRes.code == 0) {
        await userStore.setUserInfo(userRes.result);
        Object.assign(registerForm, primaryRegisterForm);
        const { id, nick_name } = userRes.result;
        await welcome(id, nick_name);
        router.go(-2);
      } else {
        ElNotification({
          offset: 60,
          title: "错误提示",
          message: h("div", { style: "color: #f56c6c; font-weight: 600;" }, res.message),
        });
      }
    } else {
      ElNotification({
        offset: 60,
        title: "错误提示",
        message: h("div", { style: "color: #f56c6c; font-weight: 600;" }, res.message),
      });
    }
  } else {
    await loginFormRef.value.validate(async (valid) => {
      if (valid) {
        const res = await reqLogin(loginForm);
        const token = res.result.token;
        if (res && res.code == 0) {
          // 保存 token
          await userStore.setToken(token);
          ElNotification({
            offset: 60,
            title: "提示",
            message: h("div", { style: "color: #7ec050; font-weight: 600;" }, "登录成功"),
          });
          // 获取并保存当前用户信息
          const userRes = await getUserInfoById(res.result.id);
          if (userRes.code == 0) {
            await userStore.setUserInfo(userRes.result);
            Object.assign(loginForm, primaryLoginForm);
            const { id, nick_name } = userRes.result;
            await welcome(id, nick_name);
            router.go(-1);
          } else {
            ElNotification({
              offset: 60,
              title: "错误提示",
              message: h("div", { style: "color: #f56c6c; font-weight: 600;" }, res.message),
            });
          }
        } else {
          ElNotification({
            offset: 60,
            title: "错误提示",
            message: h("div", { style: "color: #f56c6c; font-weight: 600;" }, res.message),
          });
        }
      }
    });
  }
};

const goRegister = () => {
  router.push("/register");
};

// 提交
const submit = () => {
  if (route.name == "Login") {
    userLogin();
  } else {
    userRegister();
  }
};

watch(
  () => route.name,
  (newV) => {
    if (newV == "Login") {
      loginFormRef.value && loginFormRef.value.resetFields();
    } else {
      registerForm.valid && registerFormRef.value.resetFields();
    }
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <div class="layout">
    <PageHeader />
    <div class="center_box flex flex-col justify-center items-center">
      <el-form v-if="route.name == 'Login'" class="login-register-form" ref="loginFormRef" :model="loginForm" :rules="loginRlues" label-width="100px" label-suffix=":">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" :style="{ width: '220px' }" placeholder="请输入用户名" clearable @keyup.enter.native="submit" />
        </el-form-item>
        <el-form-item label="用户密码" prop="password" @keyup.enter.native="submit">
          <el-input v-model="loginForm.password" show-password :style="{ width: '220px' }" placeholder="请输入密码" clearable />
        </el-form-item>
        <el-form-item>
          <div class="flex justify-between items-center w-[100%]">
            <el-button class="login-register-button" type="danger" @click="submit">登录</el-button>
            <div v-if="route.name == 'Login'" class="no-account">没有账号？<span class="line" @click="goRegister">去注册</span></div>
          </div>
        </el-form-item>
      </el-form>
      <el-form v-else class="login-register-form" ref="registerFormRef" :model="registerForm" :rules="registerRules" label-width="100px" label-suffix=":">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="registerForm.username" :style="{ width: '220px' }" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="registerForm.nick_name" :style="{ width: '220px' }" placeholder="请输入昵称" clearable />
        </el-form-item>
        <el-form-item label="密码" prop="password1">
          <el-input show-password v-model="registerForm.password1" :style="{ width: '220px' }" placeholder="请输入密码" clearable />
        </el-form-item>
        <el-form-item label="确认密码" prop="password2">
          <el-input show-password v-model="registerForm.password2" :style="{ width: '220px' }" placeholder="确认密码" clearable @keyup.enter.native="submit" />
        </el-form-item>
        <el-form-item>
          <div class="flex justify-between items-center w-[100%]">
            <el-button class="login-register-button" type="danger" @click="submit">注册</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.center_box {
  min-height: 28rem !important;
}
.login-register {
  margin: 3.75px;

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

.line {
  cursor: pointer;
  text-decoration: underline;
}
.no-account {
  font-size: 0.8rem;
}

:deep(.el-form-item) {
  padding: 15px 0;
}
</style>
