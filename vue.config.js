const { defineConfig } = require('@vue/cli-service')
module.exports = {
  //关闭eslint校验工具 声明变量但是没有使用时eslint会报错
  lintOnSave:false,
  //代理服务器解决跨域问题
  devServer: {
    proxy: {
      //当前端请求路径中出现/api时 代理服务器开始工作 找http://gmall-h5-api.atguigu.cn服务器要数据
      //服务器与服务器之间没有跨域问题
      '/api': {
        target: 'http://gmall-h5-api.atguigu.cn',
        // pathRewrite: { '^/api': '' },
      },
    },
  },
}
