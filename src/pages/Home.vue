<template>
  <div class="wrapper">
    <div class="content">
      <div class="margin-top-20 slogan">龙小新城2018-2019学年度下期</div>
      <p class="title margin-top-10">教师满意度{{is_teacher?'教师':'家长'}}测评问卷</p>
      <div class="welcome margin-top-20">
        <div v-if="!is_teacher">
          <p style="text-indent:0;">尊敬的家长朋友们：</p>

          <p>你们好！孩子的成长离不开您的关注，教师的工作离不开您的协作，学校的发展离不开您的支持，您的关心和支持是我们不断向前的动力。</p>

          <p>我们真诚希望您以客观、公正、实事求是的态度，对本学期执教您孩子的所有老师们给予评价。</p>

          <p>感谢您的配合与支持，让我们携手同行，家校相互的理解和协作是孩子健康成长的基础！</p>

          <p>活动起止时间：2019年6月19日12:00-21日24:00</p>
        </div>
        <div v-else>
          <p>尊敬的老师们：</p>
          <p>岁月不居，时节如流。一年之中有四分之三的时光我们与同事共同携手走过。这一学期，同事们工作表现如何？我们真诚希望您以客观、公正、实事求是的态度，对本学期所有的同事们给予满意度评价。</p>
          <p>评价是一种激励，它激励我们不断向上、向好，感谢您对学校工作的理解与支持！</p>
          <p>活动起止时间：2019年6月20日10:00-21日24:00.</p>
        </div>

        <p class="text-right">2019年6月</p>
      </div>
      <div class="btn-wrapper margin-top-20">
        <x-button
          :disabled="isEnd"
          type="primary"
          @click.native="jump('login')"
        >{{isEnd ? "活动已结束" : "登录"}}</x-button>
        <!-- <x-button @click.native="jump('chart')">查看汇总</x-button> -->
      </div>
    </div>
    <toast v-model="toast.show">{{ toast.msg }}</toast>
    <v-foot />
  </div>
</template>
<script>
import { XButton, Toast, dateFormat } from "vux";

import { mapState } from "vuex";

export default {
  components: {
    XButton,
    Toast
  },
  data() {
    return {
      toast: {
        show: false,
        msg: ""
      },
      showLoginfo: false,
      haveAnswerTimes: true
    };
  },
  computed: {
    ...mapState(["cdnUrl"]),
    year() {
      let date = new Date();
      return date.getFullYear();
    },
    sport: {
      get() {
        return this.$store.state.sport;
      },
      set(val) {
        this.$store.commit("setSport", val);
      }
    },
    isEnd() {
      return (
        dateFormat(new Date(), "YYYY-MM-DD HH:mm:ss") >
        (this.is_teacher ? "2019-6-21 23:59:00" : "2019-6-21 23:59:00")
      );
    },
    is_teacher() {
      return this.$store.state.is_teacher;
    }
  },
  methods: {
    jump(router) {
      this.$router.push(router);
    }
  },
  mounted() {
    document.title = "龙小新城2018-2019学年度下期教师满意度测评问卷";
  }
};
</script>
<style lang="less" scoped>
.content {
  display: flex;
  align-items: center;
  flex-direction: column;
  font-size: 13pt;
  width: 100%;
  justify-content: center;
  .title {
    font-size: 16pt;
    text-align: center;
    font-weight: bold;
  }
  .welcome {
    width: 80%;
    p {
      padding-top: 10px;
      text-indent: 2em;
      line-height: 1.5em;
      letter-spacing: 0.1em;
    }
    .text-right {
      text-align: right;
    }
  }
  .btn-wrapper {
    width: 80%;
  }
  .line {
    height: 30px;
    border-bottom: 1px #ddd solid;
    width: 80%;
  }
}
</style>
