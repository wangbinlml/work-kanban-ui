<template>
  <div class="login">
    <div class="menu-default">
      <el-menu class="el-menu-demo" mode="horizontal">
        <el-menu-item index="1" style="float: left"><a class="link-type" href="/index">
          <img height="32px"
               src="../assets/logo/logo3.png"
               class="sidebar-logo"
          ></img>小熊看版</a></el-menu-item>
        <el-menu-item index="3" style="float: right" @click="changeDiv('register')">
          <label class="link-type">立即注册</label>
        </el-menu-item>
        <el-menu-item index="2" style="float: right" @click="changeDiv('login')">
          <label class="link-type">登录</label>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="login-container">
      <el-row>
        <!--<el-col :span="12">
          <div class="hero-image">
            <img src="../assets/images/bg2.png" width="100%" class="img-fluid" alt="">
          </div>
        </el-col>
        <el-col :span="2">
        </el-col>-->
        <el-col :span="24">
          <div class="hero-content">
            <el-form ref="loginForm" v-show="loginShow" :model="loginForm" :rules="loginRules" class="login-form">
              <h3 class="title">小熊看版登录</h3>
              <el-form-item prop="username">
                <el-input
                  v-model="loginForm.username"
                  type="text"
                  auto-complete="off"
                  placeholder="账号"
                >
                  <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon"/>
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  v-model="loginForm.password"
                  type="password"
                  auto-complete="off"
                  placeholder="密码"
                  @keyup.enter.native="handleLogin"
                >
                  <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon"/>
                </el-input>
              </el-form-item>
              <el-form-item prop="code" v-if="captchaOnOff">
                <el-input
                  v-model="loginForm.code"
                  auto-complete="off"
                  placeholder="验证码"
                  style="width: 63%"
                  @keyup.enter.native="handleLogin"
                >
                  <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon"/>
                </el-input>
                <div class="login-code">
                  <img :src="codeUrl" @click="getCode" class="login-code-img"/>
                </div>
              </el-form-item>
              <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
              <el-form-item style="width:100%;">
                <el-button
                  :loading="loading"
                  size="medium"
                  type="primary"
                  style="width:100%;"
                  @click.native.prevent="handleLogin"
                >
                  <span v-if="!loading">登 录</span>
                  <span v-else>登 录 中...</span>
                </el-button>
                <div style="float: right;" v-if="register">
                  <label class="link-type" @click="changeDiv('register')">立即注册</label>
                </div>
              </el-form-item>
            </el-form>
            <el-form ref="registerForm" v-show="registerShow" :model="registerForm" :rules="registerRules"
                     class="register-form"
            >
              <h3 class="title">新用户注册</h3>
              <el-form-item prop="username">
                <el-input v-model="registerForm.username" type="text" auto-complete="off" placeholder="账号">
                  <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon"/>
                </el-input>
              </el-form-item>
              <el-form-item prop="nickname">
                <el-input v-model="registerForm.nickname" type="text" auto-complete="off" placeholder="昵称">
                  <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon"/>
                </el-input>
              </el-form-item>
              <el-form-item prop="email">
                <el-input v-model="registerForm.email" type="text" auto-complete="off" placeholder="邮箱">
                  <svg-icon slot="prefix" icon-class="email" class="el-input__icon input-icon"/>
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  v-model="registerForm.password"
                  type="password"
                  auto-complete="off"
                  placeholder="密码"
                  @keyup.enter.native="handleRegister"
                >
                  <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon"/>
                </el-input>
              </el-form-item>
              <el-form-item prop="confirmPassword">
                <el-input
                  v-model="registerForm.confirmPassword"
                  type="password"
                  auto-complete="off"
                  placeholder="确认密码"
                  @keyup.enter.native="handleRegister"
                >
                  <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon"/>
                </el-input>
              </el-form-item>
              <el-form-item prop="code" v-if="captchaOnOff">
                <el-input
                  v-model="registerForm.code"
                  auto-complete="off"
                  placeholder="验证码"
                  style="width: 63%"
                  @keyup.enter.native="handleRegister"
                >
                  <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon"/>
                </el-input>
                <div class="register-code">
                  <img :src="codeUrl" @click="getCode" class="register-code-img"/>
                </div>
              </el-form-item>
              <el-form-item style="width:100%;">
                <el-button
                  :loading="loading"
                  size="medium"
                  type="primary"
                  style="width:100%;"
                  @click.native.prevent="handleRegister"
                >
                  <span v-if="!loading">注 册</span>
                  <span v-else>注 册 中...</span>
                </el-button>
                <div style="float: right;">
                  <label class="link-type" @click="changeDiv('login')">使用已有账户登录</label>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2021-2023 zuts.net All Rights Reserved.</span>
    </div>
  </div>
</template>

<script>
import { getCodeImg, register } from '@/api/login'
import Cookies from 'js-cookie'
import { decrypt, encrypt } from '@/utils/jsencrypt'
import Layout from '@/layout/index'

export default {
  name: 'Login',
  components: { Layout },
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.registerForm.password !== value) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      registerShow: false,
      loginShow: false,
      codeUrl: '',
      loginForm: {
        username: '',
        password: '',
        rememberMe: false,
        code: '',
        uuid: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '请输入您的账号' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '请输入您的密码' }
        ],
        code: [{ required: true, trigger: 'change', message: '请输入验证码' }]
      },
      registerForm: {
        username: '',
        nickname: '',
        password: '',
        email: '',
        confirmPassword: '',
        code: '',
        uuid: ''
      },
      registerRules: {
        username: [
          { required: true, trigger: 'blur', message: '请输入您的账号' },
          { min: 2, max: 20, message: '用户账号长度必须介于 2 和 20 之间', trigger: 'blur' }
        ],
        nickname: [
          { required: true, trigger: 'blur', message: '请输入您的昵称' },
          { min: 2, max: 20, message: '用户账号长度必须介于 2 和 20 之间', trigger: 'blur' }
        ],
        email: [
          { required: true, trigger: 'blur', message: '请输入您的邮箱' },
          { min: 2, max: 80, message: '用户邮箱长度必须介于 2 和 80 之间', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, trigger: 'blur', message: '请输入您的密码' },
          { min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, trigger: 'blur', message: '请再次输入您的密码' },
          { required: true, validator: equalToPassword, trigger: 'blur' }
        ],
        code: [{ required: true, trigger: 'change', message: '请输入验证码' }]
      },
      loading: false,
      // 验证码开关
      captchaOnOff: true,
      // 注册开关
      register: true,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.loginShow = true
    this.getCode()
    this.getCookie()
  },
  methods: {
    changeDiv(div) {
      if (div == 'login') {
        this.loginShow = true
        this.registerShow = false
      } else {
        this.loginShow = false
        this.registerShow = true
      }
    },
    getCode() {
      getCodeImg().then(res => {
        this.captchaOnOff = res.captchaEnabled === undefined ? true : res.captchaEnabled
        if (this.captchaOnOff) {
          this.codeUrl = 'data:image/gif;base64,' + res.img
          this.loginForm.uuid = res.uuid
          this.registerForm.uuid = res.uuid
        }
      })
    },
    getCookie() {
      const username = Cookies.get('username')
      const password = Cookies.get('password')
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.loginForm.rememberMe) {
            Cookies.set('username', this.loginForm.username, { expires: 30 })
            Cookies.set('password', encrypt(this.loginForm.password), { expires: 30 })
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 })
          } else {
            Cookies.remove('username')
            Cookies.remove('password')
            Cookies.remove('rememberMe')
          }
          this.$store.dispatch('Login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' }).catch(() => {
            })
          }).catch(() => {
            this.loading = false
            if (this.captchaOnOff) {
              this.getCode()
            }
          })
        }
      })
    },
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true
          register(this.registerForm).then(res => {
            const username = this.registerForm.username
            this.$alert('<font color=\'red\'>恭喜你，您的账号 ' + username + ' 注册成功！</font>', '系统提示', {
              dangerouslyUseHTMLString: true,
              type: 'success'
            }).then(() => {
              this.loading = false
              this.changeDiv('login')
            }).catch(() => {
              this.loading = false
            })
          }).catch(() => {
            this.loading = false
            if (this.captchaOnOff) {
              this.getCode()
            }
          })
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.menu-default {
  width: 100%;
}

.login {
  /*display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/bg.png");
  background-size: cover;*/

  height: 100%;
  background-image: url("../assets/images/bg3.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  background-attachment: fixed;
}

.login-container {
  background: url("../assets/images/bg2.png");
  margin: auto;
  padding: 0px 0;
  width: 1078px;
  height: 580px;
  background-size: cover;
  background-repeat: no-repeat;
  box-shadow: none;
}

.hero-content {
  float: right;
  margin-top: 80px;
  box-shadow: 0 8px 20px 0 rgb(0 33 70 / 10%);
  border-radius: 8px;
}

.hero-image {
  float: left;
}

.img-fluid {
  max-width: 100%;
  height: auto;
}

.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form, .register-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;

  .el-input {
    height: 38px;

    input {
      height: 38px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code, .register-code {
  width: 33%;
  height: 38px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-login-footer {
  position: relative;
  bottom: 5px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
  margin: auto;
  width: 100%;
  clear: both;
  color: #707070;
}

.login-code-img, .register-code-img {
  height: 38px;
}
</style>
