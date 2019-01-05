<template>
  <div id="app">
    <!-- <v-console /> -->
    <loading v-model="isLoading" />
    <router-view />
  </div>
</template>

<script>
import { Loading } from "vux";

import { querystring } from "vux";

import { mapState } from "vuex";
import * as db from "./lib/db";
// import VConsole from "./components/VConsole";
export default {
  name: "app",
  components: {
    Loading
    // VConsole
  },
  data() {
    return {
      code: "",
      apiId: "wx762c9153df774440",
      title: "",
      shouldShare: false
    };
  },
  computed: {
    ...mapState(["cdnUrl", "sport"]),
    isLoading: {
      get() {
        return this.$store.state.isLoading;
      },
      set(val) {
        this.$store.commit("updateLoadingStatus", val);
      }
    },
    // 签名用URL
    url() {
      return window.location.href.split("#")[0];
    },
    // 跳转URL
    redirectUrl() {
      return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${
        this.apiId
      }&redirect_uri=${encodeURIComponent(
        this.url
      )}&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect`;
    },
    shareUrl() {
      // 被分享的链接必须在安全域名中，不能直接分享为 redirectUrl
      return window.location.href.split("#")[0].split("?")[0];
    },
    shouldInitShare() {
      // && this.sport.curScore >= this.sport.minPrizeScore
      return this.sport.isLogin && this.shouldShare;
    }
  },
  watch: {
    shouldInitShare(val) {
      if (!val) {
        return;
      }
      this.title = `龙小新城2018-2019学年度上期教师满意度家长测评问卷...`;
      this.initWxShare();
    }
  },
  methods: {
    wxPermissionInit() {
      return axios({
        params: {
          s: "/weixin/signature",
          url: this.url
        }
      });
    },
    wxReady(obj) {
      let config = {
        debug: false,
        appId: obj.appId,
        timestamp: obj.timestamp,
        nonceStr: obj.nonceStr,
        signature: obj.signature,
        jsApiList: [
          "onMenuShareAppMessage",
          "onMenuShareTimeline",
          "hideMenuItems"
        ]
      };
      this.$wechat.config(config);
    },
    initWxShare() {
      this.$wechat.ready(() => {
        // let option = {
        //   title: this.title, // 分享标题
        //   desc: this.title,
        //   link: this.shareUrl,
        //   imgUrl: "http://cbpm.sinaapp.com/cdn/logo/cbpc.jpg",
        //   type: "",
        //   dataUrl: "",
        //   success: function() {},
        //   cancel: function() {}
        // };
        // this.$wechat.onMenuShareAppMessage(option);
        // this.$wechat.onMenuShareTimeline(option);
        // this.$wechat.onMenuShareQQ(option);
        // this.$wechat.onMenuShareWeibo(option);
        // this.$wechat.onMenuShareQZone(option);

        // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        this.$wechat.hideMenuItems({
          menuList: [
            "menuItem:editTag",
            "menuItem:delete",
            "menuItem:copyUrl",
            "menuItem:originPage",
            "menuItem:readMode",
            "menuItem:openWithQQBrowser",
            "menuItem:openWithSafari",
            "menuItem:share:email"
          ]
        });
      });
    },

    wxInit() {
      this.wxPermissionInit().then(data => {
        this.shouldShare = true;
        this.wxReady(data);
        this.initWxShare();
      });
    }
  },
  created() {
    this.title = this.sport.name;
  }
};
</script>

<style lang="less">
@import "~vux/src/styles/reset.less";
@import "assets/css/reset.css";
@import "assets/css/slider.less";
</style>
