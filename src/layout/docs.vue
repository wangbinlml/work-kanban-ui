<template>
  <div class="app-wrapper openSidebar">
    <div>
      <navbar/>
    </div>
    <div>
      <sidebar/>
      <div class="main-container hasTagsView">
        <app-main/>
      </div>
    </div>
  </div>
</template>

<script>
  import {AppMain, Navbar, Sidebar} from './components/docs'
  import {mapState} from 'vuex'
  import variables from '@/assets/styles/variables.scss'

  export default {
    name: 'DocsLayout',
    components: {
      AppMain,
      Navbar,
      Sidebar
    },
    computed: {
      ...mapState({}),
      variables() {
        return variables;
      }
    },
    methods: {}
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/styles/mixin.scss";
  @import "~@/assets/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$base-sidebar-width});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px);
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
