<template>
  <div class="home">
    <div class="content">
      <x-button type="primary" @click.native="down('team')"
        >团队满意度</x-button
      >
      <x-button @click.native="down('class')">班级满意度</x-button>
      <x-button @click.native="down('teacher')">老师满意度</x-button>
      <x-button @click.native="down('teacher2')">不满意原因</x-button>
      <x-button @click.native="down('notanswer')">未参与人员名单</x-button>
    </div>
    <v-foot />
  </div>
</template>

<script>
import { axios } from "../lib/axios";
import Excel from "../lib/excel";
import { XButton } from "vux";
import dayjs from "dayjs";
/**
 *   @database: { 微信开发 }
 *   @desc:     { 团队评分排名 }
 */
const getViewXincheng = () =>
  axios({
    url: "/134/0bd11ad83e.array",
  });
/**
 *   @database: { 微信开发 }
 *   @desc:     { 按班级查询满意度 }
 */
const getViewXincheng2 = () =>
  axios({
    url: "/136/01264548fc.array",
  });
/**
 *   @database: { 微信开发 }
 *   @desc:     { 老师满意度查询（不加社团） }
 */
const getViewXincheng3 = () =>
  axios({
    url: "/129/0250f2a61f.array",
  });
/**
 *   @database: { 微信开发 }
 *   @desc:     { 老师不满意查询 }
 */
const getViewXincheng4 = () =>
  axios({
    url: "/135/c39403fd02.array",
  });

/**
 *   @database: { 微信开发 }
 *   @desc:     { 未参与人员 }
 */
const getXinchengUserlist = () =>
  axios({
    url: "/329/9db2861490.array",
  });

const now = () => dayjs().format("YYYY-MM-DD HH:mm:ss");
const ymd = () => dayjs().format("YYYYMMDD");
const ym = () => dayjs().format("YYYY年MM月");
const ymdhms = () => dayjs().format("YYYY年MM月DD日 HH时mm分ss秒");

const exportExcel = (data) => {
  if (!data) {
    return;
  }
  let excel = new Excel({
    header: data.header,
    body: data.data,
    filename: data.title + ymdhms(),
  });
  excel.save();
  excel = null;
};

export default {
  components: { XButton },
  methods: {
    down(type) {
      switch (type) {
        case "team":
          getViewXincheng().then(exportExcel);
          break;
        case "class":
          getViewXincheng2().then(exportExcel);
          break;
        case "teacher":
          getViewXincheng3().then(exportExcel);
          break;
        case "teacher2":
          getViewXincheng4().then(exportExcel);
          break;
        case "notanswer":
          getXinchengUserlist().then(exportExcel);
          break;
      }
    },
  },
};
</script>

<style scoped lang="less">
.home {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  font-weight: 100;
  .content {
    flex: 1;
    margin: 30px auto;
    width: 80%;
    max-width: 200px;
  }
}
</style>
