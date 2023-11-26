<template>
  <span>
    <a round @click="jumpMsg()"><i class="el-icon-bell"/> 消息中心</a>
    <i class="top-line"></i>
  </span>
</template>

<script>

export default {
  name: 'MsgLink',
  props: {},
  computed: {},
  data() {
    return {}
  },
  methods: {
    jumpMsg() {
      this.$router.push('/msg')
    }
  }
}
</script>

<style lang="scss" scoped>

.top-line {
  display: inline-block;
  margin: 0 20px;
  background-color: rgba(0, 0, 0, 0.13);
  box-shadow: 1px 0 rgb(255 255 255 / 22%);
  width: 1px;
  height: 14px;
  position: relative;
  top: 2px;
}
</style>
