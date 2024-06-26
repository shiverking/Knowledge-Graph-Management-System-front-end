const { defineConfig } = require('@vue/cli-service')

const path = require('path');
const Version = new Date().getTime();
const webpack = require("webpack");
function resolve(dir) {
  return path.join(__dirname, dir)
}
const CompressionPlugin = require('compression-webpack-plugin')

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  publicPath: process.env.NODE_ENV == "production" ? "./" : "./",
  outputDir: "dist",
  assetsDir: "assets",
  devServer: {
    host: 'localhost',
    port: 8080,
    open: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:12345', // 需要跨域请求的地址或者IP
        changeOrigin: true, //  表示是否跨域
        pathRewrite: {
          '^/api': '' //本身的接口地址没有 '/api' 这种通用前缀，所以要rewrite，如果本身有则去掉
        }
      },
      '/pythonApi': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true, //  表示是否跨域
        pathRewrite: {
          '^/pythonApi': '' //本身的接口地址没有 '/pythonApi' 这种通用前缀，所以要rewrite，如果本身有则去掉
        }
      },
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
        '@assets': resolve('./src/assets')
      }
    },
    plugins: [
      new CompressionPlugin({
        cache: false,                   // 不启用文件缓存
        test: /\.(js|css|html)?$/i,     // 压缩文件格式
        filename: '[path].gz[query]',   // 压缩后的文件名
        algorithm: 'gzip',              // 使用gzip压缩
        minRatio: 0.8                   // 压缩率小于1才会压缩
      }),

      //引入jquery
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "windows.jQuery": "jquery"
      })
    ],
    /*打包配置版本号*/
    output: {/*模块名称+时间戳*/
      filename: `[name].${Version}.js`,
      chunkFilename: `[name].${Version}.js`
    }
  },
})
