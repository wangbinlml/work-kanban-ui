<template>
  <div>
    <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
      <div class="avatar-wrapper">
        <img :src=user.avatar class="user-avatar">
        <i class="el-icon-caret-bottom"/>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="showUserInfo">
          <span><i class="el-icon-user-solid"></i> 个人中心</span>
        </el-dropdown-item>
        <el-dropdown-item>
          <span><i class="el-icon-paperclip"></i> 邀请好友</span>
        </el-dropdown-item>
        <el-dropdown-item>
          <span><i class="el-icon-edit-outline"></i> 意见和建议</span>
        </el-dropdown-item>
        <el-dropdown-item divided @click.native="logout">
          <span><i class="el-icon-switch-button"></i> 退出登录</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog
      title="个人中心"
      z-index="50"
      :visible.sync="dialogVisible"
      width="820px"
    >
    <span>
    <el-row :gutter="20">
      <el-col :span="8" :xs="24">
        <el-card class="box-card" style="width: 100%; margin-top: 0px;">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div class="text-center">
              <userAvatar :user="user"/>
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <i class="el-icon-s-promotion"/>邀请码
                <div class="pull-right">{{ user.inviteCode }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="user"/>用户名称
                <div class="pull-right">{{ user.userName }}</div>
              </li>
<!--              <li class="list-group-item">
                <svg-icon icon-class="phone"/>手机号码
                <div class="pull-right">{{ user.phonenumber }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="email"/>用户邮箱
                <div class="pull-right">{{ user.email }}</div>
              </li>-->
              <li class="list-group-item">
                <svg-icon icon-class="date"/>登录时间
                <div class="pull-right">{{ user.loginDate }}</div>
              </li>
              <li class="list-group-item">
                <i class="el-icon-add-location"/>登录IP
                <div class="pull-right">{{ user.loginIp }}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16" :xs="24">
        <el-card class="box-card2">
          <div slot="header" class="clearfix">
            <span>基本资料</span>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userinfo">
              <userInfo :user="user"/>
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd :user="user"/>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
      </span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">关 闭</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import userAvatar from '@/views/customer/profile/userAvatar'
import userInfo from '@/views/customer/profile/userInfo'
import resetPwd from '@/views/customer/profile/resetPwd'
import { getUserProfile } from '@/api/customer'

export default {
  name: 'UserLink',
  components: { userAvatar, userInfo, resetPwd },
  props: {},
  computed: {
    ...mapGetters([
      'avatar'
    ])
  },
  data() {
    return {
      dialogVisible: false,
      user: {},
      activeTab: 'userinfo'
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    showUserInfo() {
      this.dialogVisible = true
    },
    getUser() {
      getUserProfile().then(response => {
        this.user = response.data
        this.user.avatar = this.user.avatar ? this.user.avatar : '//image-qiniu.zuts.net/background/profile.jpg'
      })
    },
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
      margin-right: 10px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 20px;
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
