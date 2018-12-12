require('babel-polyfill'); // es6  应用程序的入口点使用ES6的语法，则应该在入口点的顶部导入polyfill，以确保首先加载polyfill

import '@/utils/getGlobalParams'
import 'font-awesome/css/font-awesome.min.css'

document.addEventListener('ready', () => {
  require('./app-main')
})
