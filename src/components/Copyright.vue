<template>
  <footer class="margin-top-20">
  </footer>
</template>
<style lang="less" scoped>
footer {
  padding-bottom: 10px;
  font-size: 14px;
  color: #999;
  text-align: center;
}
</style>
<script>
export default {
  computed: {
    year() {
      let date = new Date();
      return date.getFullYear();
    }
  }
};
</script>
