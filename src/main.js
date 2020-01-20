
// import Vue from 'vue'
// import axios from 'axios'
import App from './App.vue'
import '@/assets/css/style.scss'
// import echarts from 'echarts'
import dark from '@/assets/dark.json'

import apiConfig from '../config/api.config'

import "@/assets/fonts/iconfont.css"

axios.defaults.baseURL = apiConfig.baseUrl;
Vue.prototype.$http = axios;
// import echarts from '@/utils/initEcharts'

echarts.registerTheme('dark', dark);

Vue.prototype.$echarts = echarts;

var elementResizeDetectorMaker = require("element-resize-detector");

Vue.prototype.$er = elementResizeDetectorMaker();

Vue.use( echarts );

new Vue({
  render: h => h(App),
}).$mount('#app')
