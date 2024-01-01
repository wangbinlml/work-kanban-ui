<template>
  <div class="sidebar-logo-container">
    <a class="sidebar-logo-link router-link-active" href="/index">
      <img :xs="24" :md="12" height="32px" :src=logo class="sidebar-logo"></img>
      <h1 :xs="24" :md="12" class="sidebar-title">小熊看版 </h1>
    </a>
  </div>
</template>

<script>
import logoImg from '@/assets/logo/logo3.png'

export default {
  name: 'Logo',
  props: {},
  computed: {},
  data() {
    return {
      logo: logoImg
    }
  }
}
</script>

<style lang="scss" scoped>

.sidebar-logo-container .sidebar-logo-link .sidebar-logo {
  width: 32px;
  height: 32px;
  vertical-align: middle;
  margin-right: 12px;
}

.sidebar-logo-container {
  position: relative;
  height: 50px;
  line-height: 50px;
  padding-left: 20px;
  display: inline-block;
}

.sidebar-logo-container .sidebar-logo-link .sidebar-title {
  color: white;
  font-size: 18px;
  display: inline-block;
  font-weight: 500;
}
</style>
