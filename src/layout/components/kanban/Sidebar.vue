<template>
  <div class="sidebar-container has-logo">
    <div class="el-scrollbar theme-dark">
      <el-row class="button-item">
        <el-button type="primary" @click="createWorkspaceSideBar"><i class="el-icon-plus"></i>创建工作区</el-button>
      </el-row>
      <el-menu default-active="1" role="menubar" class="el-menu" :unique-opened="true">
        <el-menu-item index="1" @click="toDirect('/index')">
          <i class="el-icon-house"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-menu-item :class="item.cls" style="padding-left: 20px;" v-for="(item, idx) in menus" :key="item.index" :index="item.path">
          <a href="javascript:void(0)" @click="toDirect(item.path)">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </a>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script>

import {mapGetters} from 'vuex'

export default {
  components: {},
  data() {
    return {
      menus: [{
        index: 2,
        title: "工作区",
        icon: "el-icon-notebook-2",
        path: "/workspace/list",
        cls: "el-menu-item "
      }, {
        index: 3,
        title: "标星看版",
        icon: "el-icon-star-off",
        path: "/board/star",
        cls: "el-menu-item "
      }, {
        index: 4,
        title: "归档看版",
        icon: "el-icon-collection",
        path: "/index",
        cls: "el-menu-item "
      }, {
        index: 5,
        title: "回收站",
        icon: "el-icon-delete",
        path: "/index",
        cls: "el-menu-item "
      }]
    }
  },
  computed: {
    ...mapGetters([
      'avatar',
      "createWorkspaceStatus"
    ])
  },
  created() {
  },
  methods: {
    createWorkspaceSideBar() {
      this.$store.dispatch("createWorkspace", true);
    },
    toDirect(url) {
      this.$router.push(url);
    }
  }
}
</script>

<style lang="scss" scoped>
.button-item {
  padding-top: 16px;
  padding-left: 16px;
}

.button-item button {
  width: 75%;
  margin: 5px;
}

.el-menu2 {
  border: none;
  width: 100% !important;
  list-style: none;
  position: relative;
  margin: 0;
  padding-left: 0;
}

.el-row {
  margin-bottom: 0px;

  &:last-child {
    margin-bottom: 0;
  }
}

.row-content {
  width: 100%;
  margin: auto;
  padding-top: 12px;
  clear: both;
}

.sidebar-container a {
  display: inline-block;
  width: 100%;
  overflow: hidden;
  color: white;
}

#app .sidebar-container {
  -webkit-transition: width 0.28s;
  transition: width 0.28s;
  width: 200px !important;
  height: 100%;
  position: fixed;
  font-size: 0px;
  top: 51px;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
  -webkit-box-shadow: 0px 4px 6px rgb(0 21 41 / 35%);
  box-shadow: 0px 4px 6px rgb(0 21 41 / 35%);
  background: none;
}

.el-form-item {
  margin-bottom: 10px;
}
</style>
