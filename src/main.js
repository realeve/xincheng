// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';

// 弃用
import VueResource from 'vue-resource';
Vue.use(VueResource);

import store from './store';
import router from './router';

import { WechatPlugin, ToastPlugin } from 'vux';
Vue.use(WechatPlugin);

Vue.use(ToastPlugin);

let VueTouch = require('vue-touch');
Vue.use(VueTouch, { name: 'v-touch' });

import VFoot from './components/Copyright.vue';
Vue.component('v-foot', VFoot);

import VHeader from './components/Header.vue';
Vue.component('v-header', VHeader);

router.beforeEach(function(to, from, next) {
  store.commit('updateLoadingStatus', { isLoading: true });
  next();
});

router.afterEach(function(to) {
  store.commit('updateLoadingStatus', { isLoading: false });
});

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');
