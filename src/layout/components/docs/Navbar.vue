<template xmlns="http://www.w3.org/1999/html">
  <div class="navbar">
    <el-row class="navbar-row">
      <el-col :span="4">
        <logo />
      </el-col>
      <el-col :span="7">
        <div class="app-breadcrumb" separator="/">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item>
              <el-input prefix-icon="el-icon-search" v-model="keyword" placeholder="搜索文档"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="default" @click="onSearchSubmit">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="13">
        <div class="right-menu">
          <div class="navbar-menu">
            <a round @click="jumpDocs()"><i class="el-icon-document"></i> 看板中心</a>
            <i class="top-line"></i>
            <msgLink />
          </div>
          <userLink />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {addWorkspace, listWorkspace, updateWorkspace} from '@/api/board/workspace'
import {addBoard, updateBoard} from '@/api/board/board'
import {mapGetters} from 'vuex'
import Logo from "../Logo"
import UserLink from '../UserLink'
import MsgLink from '../MsgLink'

export default {
  name: "Navbar",
  components: { MsgLink, UserLink, Logo},
  data() {
    return {
      workspaceDialogTableVisible: false,
      boardDialogTableVisible: false,
      keyword: "",
      form: {
        name: '',
        type: '',
        description: ''
      },
      formBoard: {
        title: '',
        workspaceId: '',
        description: '',
        defaultColor: null
      },
      formLabelWidth: '120px',
      workspaceList: null,

      rulesBoard: {
        title: [
          {required: true, message: '请填写看版标题', trigger: 'blur'},
          {min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur'}
        ],
        workspaceId: [
          {required: true, message: '请选择工作区', trigger: 'change'}
        ],
        viewRange: [
          {required: true, message: '请选择可见范围', trigger: 'change'}
        ],
      }
    }
  },
  watch: {
    '$store.state.user.createWorkspaceStatus'(newValue, oldValue) {
      this.workspaceDialogTableVisible = newValue;
    },
    '$store.state.user.createBoardStatus'(newValue, oldValue) {
      let json = JSON.parse(newValue);
      if (json.status) {
        this.formBoard.workspaceId = json.workspaceId;
        this.createBoard();
      } else {
        this.boardDialogTableVisible = json.status;
      }
    },
    '$store.state.user.updateBoardStatus'(data) {
      let json = JSON.parse(data);
      this.createBoard();
      this.formBoard = json;
    }
  },
  computed: {
    ...mapGetters([
      'avatar',
      "createWorkspaceStatus"
    ])
  },
  methods: {
    //关系方向下拉框改变事件
    changeSelection(scope) {
      this.$refs[`select`].$el.children[0].children[0].setAttribute('style', 'background:url(' + this.formBoard.backgroundImage + ') no-repeat;color:#fff;text-indent: -9999px;background-position: center center');
    },
    onSearchSubmit() {

    },
    beforeCloseCreateWorkspace() {
      this.workspaceDialogTableVisible = false;
      this.$store.dispatch("createWorkspace", false);
    },
    beforeCloseCreateBoard() {
      this.boardDialogTableVisible = false;
      this.resetBoardForm();
      this.$store.dispatch("createBoard", JSON.stringify({
        status: false
      }));
    },
    jumpDocs() {
      this.$router.push("/index");
    },
    createWorkspace() {
      this.resetWorkspaceForm();
      this.workspaceDialogTableVisible = true;
    },
    resetBoardForm() {
      this.formBoard.title = "";
      this.formBoard.description = "";
    },
    resetWorkspaceForm() {
      this.form = {
        name: '',
        type: '',
        description: ''
      }
    },
    async createBoard() {
      this.resetBoardForm();
      this.workspaceList = [];
      this.boardDialogTableVisible = true;
      let data = await listWorkspace({
        createBy: this.$store.getters.user.userId,
        getBoard: false,
        id: this.formBoard.workspaceId,
        pageSize: 100
      });
      this.workspaceList = data.rows;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.form.id) {
            updateWorkspace(this.form).then(response => {
              this.$modal.msgSuccess("更新成功");
              this.workspaceDialogTableVisible = false;
              this.$store.dispatch("refreshWorkspaceList", true);
              //this.getList();
            }).finally(() => {
              this.workspaceDialogTableVisible = false;
            });
          } else {
            addWorkspace(this.form).then(response => {
              this.$modal.msgSuccess("创建成功");
              this.workspaceDialogTableVisible = false;
              this.$store.dispatch("refreshWorkspaceList", true);
              //this.getList();
            }).finally(() => {
              this.workspaceDialogTableVisible = false;
            });
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    submitBoardForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.formBoard.id) {
            updateBoard(this.formBoard).then(response => {
              this.$modal.msgSuccess("更新成功");
              this.boardDialogTableVisible = false;
              this.$store.dispatch("refreshBoardList", true);
              //this.getList();
            }).finally(() => {
              this.boardDialogTableVisible = false;
            });
          } else {
            addBoard(this.formBoard).then(response => {
              this.$modal.msgSuccess("创建成功");
              this.boardDialogTableVisible = false;
              this.$store.dispatch("refreshBoardList", true);
              //this.getList();
            }).finally(() => {
              this.boardDialogTableVisible = false;
            });
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
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

  .right-menu {
    float: right;
    height: 100%;

    &:focus {
      outline: none;
    }
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
}

.el-form-item {
  margin-bottom: 0px;
}

.navbar .navbar-menu a {
  margin-right: 0px;
}
</style>
