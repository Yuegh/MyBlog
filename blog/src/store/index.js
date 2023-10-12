import { defineStore } from "pinia"; //引入pinia
// _setLocalItem 封装的缓存本地的方法 remove和get分别对应缓存的删除和获取
import { _getLocalItem, _removeLocalItem, _setLocalItem } from "@/utils/tool";
// 本地数据加密解密
import { _encrypt, _decrypt } from "@/utils/encipher";
// 歌曲枚举
import { MODELLIST, PLAYTYPE } from "@/utils/enum";

// 可以去看看vueUse怎么使用useDark 这个可以快速切换主题
import { useDark, useToggle } from "@vueuse/core";

const isDark = useDark({
  // 存储到localStorage/sessionStorage中的Key 根据自己的需求更改
  storageKey: "useDarkKEY",
  // 暗黑class名字
  valueDark: "dark",
  // 高亮class名字
  valueLight: "light",
});
const toggle = useToggle(isDark);

export const staticData = defineStore("staticData", {
  // 数据存到store里刷新页面会重置，持久化就不会了
  persist: {
    enabled: true, //开启数据持久化
    strategies: [
      {
        key: "staticState", //给一个要保存的名称
        storage: localStorage, //sessionStorage / localStorage 存储方式
      },
    ],
  },
  state: () => {
    return {
      // md预览主题列表
      previewThemeList: ["default", "github", "vuepress", "mk-cute", "smart-blue", "cyanosis"],
      // md代码主题列表
      codeThemeList: ["atom", "a11y", "github", "gradient", "kimbie", "paraiso", "qtcreator", "stackoverflow"],
      // md预览主题
      previewTheme: "default",
      // md代码主题
      codeTheme: "atom",
      // 整体主题 黑夜和白天
      theme: isDark.value,
      // 头部图片地址
      pageHeaderList: [],
    };
  },
  getters: {
    // 获取当前整体主题 黑夜/白天
    mainTheme() {
      return isDark.value;
    },
    // 获取每个页面背景图
    getPageHeaderList() {
      return this.pageHeaderList || _getLocalItem("pageHeaderList");
    },
  },
  actions: {
    // 切换主题
    switchMainTheme() {
      toggle();
      this.theme = isDark.value;
      _setLocalItem("mainTheme", this.theme ? "dark" : "light");
    },
    // 缓存图片
    setPageHeaderLIst(list) {
      this.pageHeaderList = list;
      _setLocalItem("pageHeaderList", list);
    },
  },
});

export const user = defineStore("user", {
  persist: {
    enabled: true, //开启数据持久化
    strategies: [
      {
        key: "userState", //给一个要保存的名称
        storage: localStorage, //sessionStorage / localStorage 存储方式
      },
    ],
  },
  state: () => {
    return {
      blogAvatar: "",
      userInfo: {}, // 当前登陆人信息
      token: "",
      infoFlag: false,
      tokenFlag: false,
    };
  },
  getters: {
    // 获取当前登录用户头像
    getBlogAvatar() {
      return this.blogAvatar;
    },
    // 获取当前登录人信息
    getUserInfo() {
      return this.infoFlag ? JSON.parse(_decrypt(this.userInfo)) : "";
    },
    // 获取token
    getToken() {
      return this.tokenFlag ? _decrypt(this.token) : "";
    },
  },
  actions: {
    // 设置头像
    setBlogAvatar(avatar) {
      this.blogAvatar = avatar;
    },
    // 设置用户信息
    setUserInfo(userInfo) {
      this.infoFlag = true;
      this.userInfo = _encrypt(userInfo);
    },
    // 设置token
    setToken(token) {
      this.tokenFlag = true;
      this.token = _encrypt(token);
    },
    // 清除用户信息
    clearUserInfo() {
      this.userInfo = {};
      this.token = "";
      this.tokenFlag = false;
      this.infoFlag = false;
    },
  },
});

export const music = defineStore("music", {
  persist: {
    enabled: true, //开启数据持久化
    strategies: [
      {
        key: "musicState", //给一个要保存的名称
        storage: localStorage, //sessionStorage / localStorage 存储方式
      },
    ],
  },
  state: () => {
    return {
      isShow: false, // 是否展示音乐控制器
      isPaused: true, // 音乐是否暂停
      volume: 25, // 音量大小
      currentMusicId: "", // 正在播放歌曲的id
      currentMusicDesc: {}, // 正在播放音乐的描述
      currentMusicDetail: {}, // 正在播放音乐的详情 音乐地址
      musicList: [], // 音乐列表
      customerMusicList: [], // 用户添加的音乐列表
      currentTime: "00:00", // 歌曲当前播放时间
      duration: "00:00", // 歌曲总时间
      currentSchedule: 0, // 当前播放进度
      currentMusicDuration: 0, // 当前播放歌曲总时间
      isToggleImg: false, // 是否正在切换图片
      isAutoPlay: false, // 是否自动播放
      playType: PLAYTYPE.TOP, // 播放列表 是用户选择的列表还是当前歌曲排行榜的列表 top表示排行 user表示用户选择的
      playModel: MODELLIST[0], // 播放模式 随机：RANDOM 列表循环：LISTLOOP 单曲循环：SINGLECYCLE
      showLyricBoard: false, // 是否展示歌词板
      lyricList: [], // 歌词列表
      lyricTimeList: [], // 歌词时间列表
      currentLyticIndex: 0, // 第一句歌词的下标
    };
  },
  getters: {
    getIsShow() {
      return this.isShow;
    },
    getMusicList() {
      return this.musicList;
    },
    getCustomerMusicList() {
      return this.customerMusicList;
    },
    getIsPaused() {
      return this.isPaused;
    },
    getVolume() {
      return this.volume;
    },
    getCurrentMusicId() {
      return this.currentMusicId;
    },
    getCurrentMusicDesc() {
      return this.currentMusicDesc;
    },
    getCurrentMusicDetail() {
      return this.currentMusicDetail;
    },
    getCurrentTime() {
      return this.currentTime;
    },
    getDuration() {
      return this.duration;
    },
    getIsAutoPaly() {
      return this.isAutoPlay;
    },
    getCurrentSchedule() {
      return this.currentSchedule;
    },
    getCurrentMusicDuration() {
      return this.currentMusicDuration;
    },
    getIsToggleImg() {
      return this.isToggleImg;
    },
    getPlayType() {
      return this.playType;
    },
    getPlayModel() {
      return this.playModel;
    },
    getShowLyricBoard() {
      return this.showLyricBoard
    },
    getLyricList() {
      return this.lyricList
    },
    getLyricTimeList() {
      return this.lyricTimeList
    },
    getCurrentLyticIndex() {
      return this.currentLyticIndex
    }
  },
  actions: {
    setIsShow() {
      this.isShow = !this.isShow;
    },
    setMusicList(list) {
      this.musicList = list;
    },
    setCustomerMusicList(type, music) {
      if (type == "add") {
        this.customerMusicList.push(music);
      } else if (type == "delete") {
        let index = this.customerMusicList.findIndex((item) => item.id == music.id);
        if (index != -1) {
          this.customerMusicList.splice(index, 1);
        }
      }
    },
    setIsPaused(isPaused) {
      this.isPaused = isPaused;
    },
    setVolume(volume) {
      this.volume = volume;
    },
    setCurrentMusicId(id) {
      this.currentMusicId = id;
    },
    setCurrentMusicDesc(desc) {
      this.currentMusicDesc = desc;
    },
    setCurrentMusicDetail(music) {
      this.currentMusicDetail = music;
    },
    setCurrentTime(time) {
      this.currentTime = time;
    },
    setDuration(duration) {
      this.duration = duration;
    },
    setCurrentMusicDuration(duration) {
      this.currentMusicDuration = duration;
    },
    setIsAutoPaly(autoPlay) {
      this.isAutoPlay = autoPlay;
    },
    setCurrentSchedule(schedule) {
      this.currentSchedule = schedule;
    },
    setIsToggleImg(isToggleImg) {
      this.isToggleImg = isToggleImg;
    },
    setPlayType(type) {
      this.playType = type;
    },
    setPlayModel(model) {
      this.playModel = model;
    },
    setShowLyricBoard(isSHow) {
      this.showLyricBoard = isSHow
    },
    setCurrentLyricIndex(index) {
      this.currentLyticIndex = index
    },
    setLyricList(list) {
      this.lyricList = list
    },
    setLyricTimeList(list) {
      this.lyricTimeList = list
    }
  },
});
