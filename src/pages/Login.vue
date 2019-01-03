<template>
  <div class="wrapper">
    <group class="content">
      <x-input
        title="姓名"
        required
        name="userName"
        v-model="sport.userName"
        placeholder="点击此处输入姓名"
      ></x-input>
      <x-input
        title="密码"
        required
        :max="6"
        name="cardNo"
        v-model="sport.cardNo"
        placeholder="点击此处输入身份证后6位"
      ></x-input>
      <x-input
        title="年级"
        required
        disabled
        name="grade_name"
      ></x-input>
      <picker
        :data='gradeList'
        v-model='params.grade_id'
      ></picker>

      <x-input
        title="班级"
        required
        disabled
        name="class_name"
      ></x-input>
      <picker
        :data='classList'
        v-model='params.class_name'
      ></picker>

      <div class="btn">
        <x-button
          :disabled="!shouldCommit||isEnd"
          type="primary"
          @click.native="submit"
        >{{isEnd ? "活动已结束" : "登录"}}</x-button>
      </div>
    </group>
    <toast v-model="toast.show">{{ toast.msg }}</toast>
    <v-foot />
  </div>
</template>
<script>
import {
  XButton,
  XInput,
  Group,
  Toast,
  Picker,
  GroupTitle,
  dateFormat
} from "vux";

import { mapState } from "vuex";
import * as db from "../lib/db";
const R = require("ramda");

export default {
  components: {
    XButton,
    XInput,
    Group,
    Toast,
    GroupTitle,
    Picker
  },
  data() {
    return {
      toast: {
        show: false,
        msg: ""
      },
      gradeList: [],
      classList: [],
      classIds: [],
      params: {
        class_id: 0,
        class_name: [0],
        grade_id: [0]
      }
    };
  },
  computed: {
    ...mapState(["cdnUrl"]),
    shouldCommit() {
      return this.sport.userName != "" && this.sport.cardNo != "";
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
        dateFormat(new Date(), "YYYY-MM-DD HH:mm:ss") > "2019-01-10 23:59:59"
      );
    }
  },
  watch: {
    "params.grade_id"([val]) {
      let grade_id = R.findIndex(R.equals(val))(this.gradeList[0]);

      let classList = R.compose(
        R.map(item => ["一", "二", "三", "四", "五", "六"][item - 1] + "班"),
        R.uniq,
        R.map(R.prop("class_id")),
        R.filter(R.propEq("grade_id", grade_id + 1))
      )(this.classIds);
      this.classList = [classList];
      localStorage.setItem("grade_id", grade_id + 1);
      //班级改变时
      let class_name = R.findIndex(R.equals(this.params.class_name[0]))(
        this.classList[0]
      );
      let curGrade = R.find(
        item => item.class_id == class_name + 1 && item.grade_id == grade_id + 1
      )(this.classIds);
      this.params.class_id = curGrade.class_id;
      localStorage.setItem("class_id", curGrade.id);
    },
    "params.class_name"([val]) {
      let grade_id = R.findIndex(R.equals(this.params.grade_id[0]))(
        this.gradeList[0]
      );

      let class_name = R.findIndex(R.equals(this.params.class_name[0]))(
        this.classList[0]
      );
      let curGrade = R.find(
        item => item.class_id == class_name + 1 && item.grade_id == grade_id + 1
      )(this.classIds);
      // if (typeof curGrade == "undefined") {
      //   return;
      // }
      this.params.class_id = curGrade.class_id;
      localStorage.setItem("class_id", curGrade.id);
    }
  },
  methods: {
    jump(router) {
      this.$router.push(router);
    },
    async init() {
      let { data: classIds } = await db.getXinchengClasslist();
      let gradeName = ["一", "二", "三", "四", "五", "六"].map(
        item => item + "年级"
      );

      this.gradeList = [gradeName];
      this.classIds = classIds;

      this.loadUserInfo();
    },
    loadUserInfo() {
      let userInfo = localStorage.getItem("userInfoVote");
      if (userInfo == null) {
        return;
      }
      userInfo = JSON.parse(userInfo);

      this.sport = {
        userName: userInfo.username,
        cardNo: userInfo.psw
      };
    },
    submit: async function() {
      let { data, rows } = await db.getXinchengUserlist({
        username: this.sport.userName,
        id_card: this.sport.cardNo.toUpperCase()
      });

      // 卡号或部门输入错误
      if (rows == 0) {
        this.toast.show = true;
        this.toast.msg = "登录失败";
        return;
      }

      let [{ uid, is_vote }] = data;

      if (is_vote > -1) {
        this.toast.show = true;
        this.toast.msg = "已提交";
        this.jump("info");
        return;
      }

      // 登录成功
      this.sport.isLogin = true;
      this.sport.curTimes = 1;

      let params = {
        username: this.sport.userName,
        psw: this.sport.cardNo,
        uid
      };

      var userInfo = JSON.stringify(params);
      this.sport.uid = uid;

      localStorage.setItem("userInfoVote", userInfo);
      this.jump("paper");
    }
  },
  mounted() {
    document.title = "登录";
    this.init();
  }
};
</script>
<style lang="less" scoped>
.wrapper {
  display: flex;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1;
  font-size: 13pt;
  color: #233;
  width: 100%;
  justify-content: center;
  .title {
    font-size: 22pt;
  }
}

.btn {
  width: 80%;
  margin: 60px auto;
}
</style>
