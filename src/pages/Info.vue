<template>
  <div class="home">
    <div class="content">
      <msg
        :title="title"
        :description="desc"
        :icon="icon"
      ></msg>
    </div>
    <v-foot />
  </div>
</template>

<script>
import { Msg } from "vux";
export default {
  components: {
    Msg
  },
  data() {
    return {
      icon: "success",
      desc: `感谢您对本次活动的大力支持`,
      title: "感谢参与"
    };
  }
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
    margin: 0 auto;
    width: 80%;
    .btn-wrapper {
      width: 100%;
    }
  }
}
</style>
