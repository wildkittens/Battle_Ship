import Vue from 'vue'
import App from './App.vue'
import VueTruncate from 'vue-truncate-filter'
import VueLogger from 'vuejs-logger'

const options = {
  logLevel : 'debug',
  // optional : defaults to false if not specified
  stringifyArguments : false,
  // optional : defaults to false if not specified
  showLogLevel : false
}

Vue.use(VueLogger, options)
Vue.use(VueTruncate)

new Vue({
  el: '#app',
  render: h => h(App)
})
