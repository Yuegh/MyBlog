博客后端基于node.js、koa、koa-router、koa-body、seqlize、mysql、qiniu(七牛云对象存储)、bcryptjs、nodemon等主流技术

## 🚀 博客后端下载运行

因为后端是采用的node.js，所以不需要配置很多就能运行。

```git
# npm 版本 v6.14.17
# node 版本 v16.17.0

1、下载项目
git clone https://gitee.com/mrzym/blogServer.git
tips: 也可以下载zip打开，这样不会和我的仓库关联，也可以自己去解除关联
2、打开项目，安装依赖
npm i
3、数据库是mysql，需要先连接数据库
应该大家都有mysql吧，没有就装一个，再装个navicat
(1) 打开项目，在根目录下找到src文件夹下的db文件夹，里面有数据库的sql文件
(2) 使用navicat创建一个空的数据库，运行这个sql文件，就可以生成表
(3) 打开项目根目录下的.env文件，根据注释修改自己的mysql数据库账号名称、密码进行连接即可
4、运行项目 
npm run serve 

tips：.env文件下可以配置项目的上传文件方式，local为本地上传，qiniu为上传到七牛云存储,online为上传到自己的云服务器，使用其他的对象存储（七牛云、阿里云）是因为自己的服务器带宽不够，下载资源很慢，自己也可以先试一试online上传到自己的服务器，然后有经验了再去试一试七牛云。