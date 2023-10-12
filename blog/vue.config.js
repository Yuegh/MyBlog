const AutoImport = require("unplugin-auto-import/webpack");
const Components = require("unplugin-vue-components/webpack");
const { ElementPlusResolver } = require("unplugin-vue-components/resolvers");
const { defineConfig } = require("@vue/cli-service");
const CompressionPlugin = require("compression-webpack-plugin"); //引入gzip压缩插件

const path = require("path");

// 拼接路径
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = defineConfig({
  // 打包输出
  outputDir: resolve("dist"),
  assetsDir: "assets",
  productionSourceMap: false,
  publicPath: "./",
  transpileDependencies: true,
  // eslint 保存时检查
  lintOnSave: false,
  chainWebpack: (config) => {
    config.resolve.alias.set("@", resolve("src"));
    config.module.rules.delete("svg"); //重点:删除默认配置中处理svg,
    config.module
      .rule("svg")
      .test(/\.svg$/)
      .include.add(resolve("src/icons")) //处理svg目录
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();
  },
  configureWebpack: {
    // 按需导入element-plus main.js里不需要再引入了
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      // new PrerenderSPAPlugin({
      //   routes: ["/", "/article"], // 需要预渲染的页面，要与router路由一致
      // }),
      new CompressionPlugin({
        //gzip压缩配置
        test: /\.js$|\.html$|\.css/, //匹配文件名
        threshold: 10240, //对超过10kb的数据进行压缩
        deleteOriginalAssets: false, //是否删除原文件
      }),
    ],
  },
  // scss
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "scss",
      patterns: [],
    },
  },
  css: {
    loaderOptions: {
      // 引入全局scss
      scss: {
        additionalData: `@import "./src/styles/base.scss";`,
      },
    },
  },
  devServer: {
    port: 8080,
    https: false,
    open: {
      target: [`http://localhost:${8080}`],
    },
    proxy: {
      //匹配规则
      "/api": {
        //要访问的跨域的域名
        target: " http://localhost:8888",
        ws: true,
        secure: false, // 使用的是http协议则设置为false，https协议则设置为true
        changOrigin: true, //开启代理
        pathRewrite: {
          "^/api": "",
        },
      },
      "/wapi": {
        //要访问的跨域的域名
        target: "http://mrzym.top:3000",
        ws: true,
        secure: false, // 使用的是http协议则设置为false，https协议则设置为true
        changOrigin: true, //开启代理
        pathRewrite: {
          "^/wapi": "",
        },
      },
    },
  },
});
