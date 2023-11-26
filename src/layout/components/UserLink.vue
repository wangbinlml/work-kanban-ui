<template>
  <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
    <div class="avatar-wrapper">
      <img src="//image-qiniu.zuts.net/background/profile.jpg" class="user-avatar">
      <i class="el-icon-caret-bottom"/>
    </div>
    <el-dropdown-menu slot="dropdown">
      <router-link to="/user/profile">
        <el-dropdown-item>个人中心</el-dropdown-item>
      </router-link>
      <el-dropdown-item>
        <span>邀请好友</span>
      </el-dropdown-item>
      <el-dropdown-item>
        <span>意见和建议</span>
      </el-dropdown-item>
      <el-dropdown-item divided @click.native="logout">
        <span>退出登录</span>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'UserLink',
  props: {},
  computed: {
    ...mapGetters([
      'avatar'
    ])
  },
  data() {
    return {}
  },
  methods: {
    async logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          location.href = process.env.VUE_APP_CONTEXT_PATH + 'index'
        })
      }).catch(() => {
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .app-breadcrumb {
    padding-left: 34px;
    display: inline-block;
    vertical-align: sub;
  }

  .navbar-menu a {
    margin-right: 20px;
    font-size: 14px;
    color: #303133;
    line-height: 45px;
  }

  .navbar-row {
    position: fixed;
    background: white;
    z-index: 100;
    width: 100%;
    box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
  }

  .navbar-menu {
    display: inline-block;
    vertical-align: top;
  }

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

  .avatar-wrapper {
    margin-top: 3px !important;
    position: relative;
    overflow: hidden;
    height: 40px;
  }

  .avatar-wrapper .el-icon-caret-bottom {
    cursor: pointer;
    font-size: 12px;
    vertical-align: text-top;
  }

  .right-menu {
    float: right;
    height: 100%;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
