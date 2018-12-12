import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'

import '@/styles/index.scss' // global css

import i18n from './lang'

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control

import 'vue-event-calendar/dist/style.css' // 1.1.10之后的版本，css被放在了单独的文件中，方便替换
import vueEventCalendar from 'vue-event-calendar'

import toolBox from '@/utils/toolBox'
import btnPermission from '@/utils/btnPermission'
import downloadFile from '@/utils/downloadFileFunc'

Vue.use(
  vueEventCalendar, {
    locale: 'zh',
    color: '#409EFF' // # 304156
  }
)

// import Tree from '@aui/tree'
// import '@aui/font/icon.css'
// import '@aui/tree/tree.css'
// Vue.use(Tree)

Vue.use(ElementUI, {
  locale,
  i18n: (key, value) => i18n.t(key, value)
})

Vue.config.productionTip = false

Vue.prototype.btnPermission = btnPermission;
Vue.prototype.downloadFile = downloadFile;
Vue.prototype.toolBox = toolBox;

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: {
    App
  }
})
