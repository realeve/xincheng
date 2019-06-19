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
      <!-- <popup-picker
        v-if="!is_teacher"
        :data="cascadeList"
        :fixed-columns="2"
        :columns="2"
        v-model="cascadeValue"
        @on-change="change"
        show-name
        title="班级"
        placeholder="请选择"
      ></popup-picker> -->

      <popup-picker
        v-if="!is_teacher"
        :data="clubList"
        :fixed-columns="2"
        :columns="2"
        v-model="clubValue"
        @on-change="clubChange"
        show-name
        title="社团"
        placeholder="请选择"
      ></popup-picker>

      <div class="btn">
        <x-button
          :disabled="!shouldCommit||isEnd"
          type="primary"
          @click.native="submit"
        >{{isEnd ? "活动已结束" : "登录"}}</x-button>
      </div>
      <div class="note">
        <p class="title">温馨提示：</p>
        <p style="padding-top:15px;">每份问卷只能提交一次，且提交后不能修改，故请{{is_teacher?'':'准确选择班级及社团名称，'}}认真填写满意度，以免造成评价结果有失公正。</p>
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
  PopupPicker,
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
    PopupPicker
  },
  data() {
    return {
      toast: {
        show: false,
        msg: ""
      },
      cascadeList: [],
      cascadeValue: ["一年级", "1"],
      gradeId: 1,
      clubValue: ["", "1"],
      clubList: []
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
        dateFormat(new Date(), "YYYY-MM-DD HH:mm:ss") >
        (this.is_teacher ? "2019-6-21 23:59:00" : "2019-6-21 23:59:00")
      );
    },
    is_teacher() {
      return this.$store.state.is_teacher;
    }
  },
  methods: {
    clubChange(value) {
      localStorage.setItem("club_id", value[1]);
    },
    change([gradeName, class_id]) {
      localStorage.setItem("class_id", class_id);
      this.gradeId = {
        一年级: 1,
        二年级: 2,
        三年级: 3,
        四年级: 4,
        五年级: 5,
        六年级: 6
      }[gradeName];
      localStorage.setItem("grade_id", this.gradeId);
    },
    jump(router) {
      this.$router.push(router);
    },
    async init() {
      let { data: cascadeList } = await db.getXinchengClasslistCascade();
      this.cascadeList = cascadeList;
      this.loadClassInfo();
      this.loadUserInfo();
      this.loadClubData();
    },
    loadClassInfo() {
      this.cascadeValue = this.loadLocalStorage("class_id", this.cascadeList);
    },
    loadClubInfo() {
      this.clubValue = this.loadLocalStorage("club_id", this.clubList);
    },
    loadLocalStorage(key, storageList, storageValue) {
      let class_id = localStorage.getItem(key);
      if (R.isNil(class_id)) {
        return;
      }
      let clsInfo = R.find(item => item.value == class_id)(storageList);
      return [clsInfo.parent, clsInfo.value];
    },
    async loadClubData() {
      let { data } = await db.getXinchengClublist();
      this.clubList = data;
      this.loadClubInfo();
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
      let method = this.is_teacher
        ? "getXinchengUserlistTeacher"
        : "getXinchengUserlist";
      let { data, rows } = await db[method]({
        username: this.sport.userName,
        id_card: this.sport.cardNo.toUpperCase()
      });

      // 卡号或部门输入错误
      if (rows == 0) {
        this.toast.show = true;
        this.toast.msg = "登录失败";
        return;
      }

      let [{ uid, is_vote, grade_id }] = data;
      this.grade_id = grade_id;
      localStorage.setItem("grade_id", grade_id);

      if (is_vote > -1 && this.sport.userName != "test") {
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
      this.jump(this.is_teacher ? "teacher" : "paper");
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

.note {
  margin: 10px 20px;
  .title {
    color: #e23;
    font-size: unset;
    font-weight: bold;
  }
  p {
    text-align: justify;
  }
}
</style>
