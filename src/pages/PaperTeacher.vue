<template>
  <div class="container">
    <div
      class="section"
      v-for="({uid,username},i) of teacherList"
      :key="i"
    >
      <div class="section-item">
        <div class="weui-cells__title">
          {{i+1}}.{{username}}
        </div>
        <group>
          <radio
            title="title"
            :selected-label-style="{color: '#09BB07'}"
            :options="options"
            v-model="answerList[i]"
          ></radio>
        </group>
        <div v-show="answerList[i]=='不满意'">
          <x-textarea
            v-model="remarkList[i]"
            placeholder=" 我们希望了解不满意的原因(必填项，至少10个字)。"
          ></x-textarea>
          <p style="padding-left:10px;">({{remarkList[i]?remarkList[i].trim().length:0}}/10)</p>
        </div>
      </div>
    </div>

    <x-button
      :disabled="!isCompleted"
      type="primary"
      @click.native="submit()"
      class="submit"
    >提交</x-button>
    <toast v-model="toast.show">{{ toast.msg }}</toast>
  </div>
</template>
<script>
import {
  Toast,
  XTextarea,
  Group,
  Checklist,
  XButton,
  Picker,
  Radio
} from "vux";

import { dateFormat } from "vux";

import { mapState } from "vuex";

import questionJSON from "../assets/data/harmoney";

import Tips from "../components/Tips.vue";
import util from "../lib/common";
import * as db from "../lib/db";
const R = require("ramda");
let questionList = util.getHarmoney(questionJSON);

export default {
  name: "page",
  components: {
    Toast,
    Group,
    Checklist,
    XButton,
    Tips,
    XTextarea,
    Picker,
    Radio
  },
  data() {
    return {
      toast: {
        show: false,
        msg: ""
      },
      remarkList: [],
      answerList: [],
      isCompleted: false,
      startTime: dateFormat(new Date(), "YYYY-MM-DD HH:mm:ss"),
      teacherList: [],
      options: ["非常满意", "比较满意", "基本满意", "不满意"].reverse()
    };
  },
  computed: {
    ...mapState(["userInfo", "cdnUrl"]),
    sport: {
      get() {
        return this.$store.state.sport;
      },
      set(val) {
        this.$store.commit("setSport", val);
      }
    },
    url() {
      return window.location.href.split("#")[0];
    },
    tips: {
      get() {
        return this.$store.state.tips;
      },
      set(val) {
        this.$store.commit("setTips", val);
      }
    }
  },
  watch: {
    answerList(val) {
      this.getCompleteStatus();
    },
    remarkList(val) {
      this.getCompleteStatus();
    }
  },
  methods: {
    getCompleteStatus() {
      let flag = true;
      // 是否全部选择
      if (this.answerList.length === 0) {
        return false;
      }
      for (let i = 0; flag && i < this.teacherList.length; i++) {
        let item = this.answerList[i];
        if (typeof item == "undefined") {
          flag = false;
        } else if (item == "不满意") {
          if (
            typeof this.remarkList[i] == "undefined" ||
            this.remarkList[i].trim().length < 10
          ) {
            flag = false;
          }
        }
      }
      this.isCompleted = flag;
    },
    getSubmitData() {
      let voteInfo = this.answerList.map((scoreText, idx) => {
        let { uid: course_id } = this.teacherList[idx];

        let score = {
          不满意: 1,
          基本满意: 2,
          比较满意: 3,
          非常满意: 4
        }[scoreText];

        return {
          uid: this.sport.uid,
          course_id,
          score,
          remark: this.remarkList[idx] || ""
        };
      });

      return {
        voteInfo,
        userInfo: {
          start_time: this.startTime,
          rec_time: dateFormat(new Date(), "YYYY-MM-DD HH:mm:ss"),
          uid: this.sport.uid,
          class_id: 1
        }
      };
    },
    async submit() {
      let { voteInfo, userInfo } = this.getSubmitData();

      let { data } = await db.addXinchengTeacherVotelist(voteInfo);
      db.setXinchengUserlist(userInfo);
      if (data[0].affected_rows > 0) {
        this.toast.show = true;
        this.toast.msg = "提交成功";
        this.$router.push("info");
      }
    },
    async prepareData() {
      let { data } = await db.getXinchengTeachers();
      this.teacherList = data;

      // this.answerList = data.map(item => "比较满意");

      if (this.sport.uid == 0) {
        this.$router.push("/login");
      }
    }
  },
  mounted() {
    this.prepareData();
  }
};
</script>
<style scoped lang="less">
@import "../assets/css/weui.css";
.container {
  padding: 20px 10px;
  width: 100%;
}
.section {
  margin: 0;
  padding: 8px;
  color: #785a32;
  background: #fff;
  text-align: left;
  &-item {
    border: 1px solid #e2e2e2;
    border-radius: 5px;
    box-shadow: 0 0 6px 2px rgba(210, 199, 187, 0.2);
    background: #faf5f0;
    background-clip: padding-box;
    padding: 5px 0;
    box-sizing: border-box;
    .rater-container {
      padding: 0 15px 10px 15px;
      display: flex;
      align-items: center;
      .text {
        font-size: 16px;
        padding-left: 10px;
      }
    }
  }
}
.submit {
  margin-top: 10px;
}
</style>
