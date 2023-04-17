import { createApp } from 'vue'
import App from './App.vue'
// import router from './router'
import store from './store'
// import axios from 'axios'

// import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

import treeTable from 'vue-table-with-tree-grid'

// 导入字体图标
// import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 实例化app
const app = createApp(App)

// 设置baseUrl 挂载axios
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 设置请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = localStorage.getItem('token')
  return config
})

app.config.globalProperties.$http = axios

// element-plus 字体图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 全局配置国际化
app.use(ElementPlus, {
  locale: zhCn,
})

app.component('tree-table', treeTable)

app.use(store).use(router).mount('#app')
