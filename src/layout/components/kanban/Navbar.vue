<template xmlns="http://www.w3.org/1999/html">
  <div class="navbar">
    <el-row class="navbar-row">
      <el-col :span="4">
        <logo/>
      </el-col>
      <!--<el-col :span="7">
        <div class="app-breadcrumb" separator="/">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item>
              <el-input prefix-icon="el-icon-search" v-model="keyword" placeholder="搜索工作空间, 看版"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="default" @click="onSearchSubmit">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>-->
      <el-col :span="20">
        <div class="right-menu">
          <div class="navbar-menu">
            <a round @click="jumpDocs()"><i class="el-icon-document"></i> 文档中心</a>
            <i class="top-line"></i>
<!--            <a round @click="createWorkspace()"><i class="el-icon-notebook-1"/> 创建工作区</a>
            <i class="top-line"></i>
            <a round @click="createBoard()"><i class="el-icon-reading"/> 创建看版</a>
            <i class="top-line"></i>-->
            <msgLink/>
          </div>
          <userLink/>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="新建工作区"
      width="500px"
      :before-close="beforeCloseCreateWorkspace"
      :visible.sync="workspaceDialogTableVisible"
    >
      <el-form :model="form" :rules="rules" ref="form" label-position="left">
        <el-form-item label="工作区名称" prop="name" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" placeholder="这是你的公司、团队或组织的名称。"></el-input>
        </el-form-item>
        <br/>
        <el-form-item label="工作区类型" prop="type" :label-width="formLabelWidth">
          <el-select v-model="form.type" placeholder="请选择工作区类型">
            <el-option
              v-for="dict in dict.type.workspace_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <br/>
        <el-form-item label="描述" prop="description" :label-width="formLabelWidth">
          <el-input v-model="form.description" type="textarea" placeholder="请输入简单描述"/>
        </el-form-item>
      </el-form>
      <br/>
      <div slot="footer" class="dialog-footer">
        <el-button @click="beforeCloseCreateWorkspace">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="新建看版"
      width="500px"
      :before-close="beforeCloseCreateBoard"
      :visible.sync="boardDialogTableVisible"
    >
      <el-form :model="formBoard" :rules="rulesBoard" ref="formBoard" class="demo-ruleForm" label-position="left">
        <el-form-item label="看版标题" prop="title" :label-width="formLabelWidth">
          <el-input clearable v-model="formBoard.title" autocomplete="off" placeholder="填写看版标题。"></el-input>
        </el-form-item>
        <br/>
        <el-form-item label="工作区" prop="workspaceId" :label-width="formLabelWidth">
          <el-select clearable v-model="formBoard.workspaceId" placeholder="请选择工作区">
            <el-option :label="item.name" :value="item.id" v-for="item in workspaceList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <br/>
        <el-form-item label="可见范围" prop="viewRange" :label-width="formLabelWidth">
          <el-select clearable v-model="formBoard.viewRange" placeholder="请选择可见范围">
            <el-option
              v-for="dict in dict.type.view_range"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- mark用来确定方向的指向 -->
        <!--          <el-form-item label="看版背景图片" prop="backgroundImage" :label-width="formLabelWidth">
                    <el-select clearable v-model="formBoard.backgroundImage" placeholder="请选择看版背景图片"
                               @change="changeSelection(formBoard)"
                               :ref="'select'+formBoard.$index">
                      <el-option
                              style="height: 120px"
                              v-for="(item, idx) in dict.type.board_background"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                        {{ idx + 1 }} <img :src="item.value + '?imageView2/1/w/250/h/120'" style="margin: 5px;">
                      </el-option>
                    </el-select>
                    <div v-if="formBoard.backgroundImage"><img :src="formBoard.backgroundImage + '?imageView2/1/w/250/h/120'"
                                                               style="margin: 5px;"></div>
                  </el-form-item>-->
        <br/>
        <el-form-item label="看版颜色" prop="defaultColor" :label-width="formLabelWidth">
          <el-select clearable v-model="formBoard.defaultColor" placeholder="请选择看版颜色"
                     @change="changeSelection(formBoard)"
                     :ref="'select'+formBoard.$index"
          >
            <el-option
              style="height: 40px"
              v-for="(item, idx) in dict.type.board_bg_color"
              :key="idx"
              :label="item.label"
              :value="item.value"
            >
              <span style="float: left">{{ idx + 1 }} {{ item.label }}</span>
              <span :style="{background: item.value, height: '30px', width: '50px',float: 'right'}"></span>
            </el-option>
          </el-select>
        </el-form-item>
        <br/>
        <el-form-item label="描述" prop="description" :label-width="formLabelWidth">
          <el-input clearable v-model="formBoard.description" type="textarea" placeholder="请输入简单描述"/>
        </el-form-item>
      </el-form>
      <br/>
      <div slot="footer" class="dialog-footer">
        <el-button @click="beforeCloseCreateBoard">取 消</el-button>
        <el-button type="primary" @click="submitBoardForm('formBoard')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addWorkspace, listWorkspace, updateWorkspace } from '@/api/board/workspace'
import { addBoard, updateBoard } from '@/api/board/board'
import { mapGetters } from 'vuex'
import Logo from '../Logo'
import UserLink from '../UserLink'
import MsgLink from '../MsgLink'
import { background } from 'quill/ui/icons'

export default {
  name: 'Navbar',
  components: { Logo, UserLink, MsgLink },
  dicts: ['workspace_type', 'view_range', 'board_background', 'tag_bg_color', 'board_bg_color'],
  data() {
    return {
      workspaceDialogTableVisible: false,
      boardDialogTableVisible: false,
      keyword: '',
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
      formLabelWidth: '100px',
      workspaceList: null,
      rules: {
        name: [
          { required: true, message: '请填写工作区名称', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择工作区类型', trigger: 'change' }
        ]
      },
      rulesBoard: {
        title: [
          { required: true, message: '请填写看版标题', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        workspaceId: [
          { required: true, message: '请选择工作区', trigger: 'change' }
        ],
        viewRange: [
          { required: true, message: '请选择可见范围', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    '$store.state.user.createWorkspaceStatus'(newValue, oldValue) {
      this.workspaceDialogTableVisible = newValue
    },
    '$store.state.user.createBoardStatus'(newValue, oldValue) {
      let json = JSON.parse(newValue)
      if (json.status) {
        this.formBoard.workspaceId = json.workspaceId
        this.createBoard()
      } else {
        this.boardDialogTableVisible = json.status
      }
    },
    '$store.state.user.updateBoardStatus'(data) {
      let json = JSON.parse(data)
      this.createBoard()
      this.formBoard = json
    }
  },
  computed: {
    ...mapGetters([
      'avatar',
      'createWorkspaceStatus'
    ])
  },
  methods: {
    background,
    //关系方向下拉框改变事件
    changeSelection(scope) {
      this.$refs[`select`].$el.children[0].children[0].setAttribute('style', 'background:url(' + this.formBoard.backgroundImage + ') no-repeat;color:#fff;text-indent: -9999px;background-position: center center')
    },
    onSearchSubmit() {

    },
    beforeCloseCreateWorkspace() {
      this.workspaceDialogTableVisible = false
      this.$store.dispatch('createWorkspace', false)
    },
    beforeCloseCreateBoard() {
      this.boardDialogTableVisible = false
      this.resetBoardForm()
      this.$store.dispatch('createBoard', JSON.stringify({
        status: false
      }))
    },
    jumpDocs() {
      this.$router.push('/docs')
    },
    createWorkspace() {
      this.resetWorkspaceForm()
      this.workspaceDialogTableVisible = true
    },
    resetBoardForm() {
      this.formBoard.title = ''
      this.formBoard.description = ''
    },
    resetWorkspaceForm() {
      this.form = {
        name: '',
        type: '',
        description: ''
      }
    },
    async createBoard() {
      this.resetBoardForm()
      this.workspaceList = []
      this.boardDialogTableVisible = true
      let data = await listWorkspace({
        createBy: this.$store.getters.user.userId,
        getBoard: false,
        id: this.formBoard.workspaceId,
        pageSize: 100
      })
      this.workspaceList = data.rows
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.form.id) {
            updateWorkspace(this.form).then(response => {
              this.$modal.msgSuccess('更新成功')
              this.workspaceDialogTableVisible = false
              this.$store.dispatch('refreshWorkspaceList', true)
              //this.getList();
            }).finally(() => {
              this.workspaceDialogTableVisible = false
            })
          } else {
            addWorkspace(this.form).then(response => {
              this.$modal.msgSuccess('创建成功')
              this.workspaceDialogTableVisible = false
              this.$store.dispatch('refreshWorkspaceList', true)
              //this.getList();
            }).finally(() => {
              this.workspaceDialogTableVisible = false
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    submitBoardForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.formBoard.id) {
            updateBoard(this.formBoard).then(response => {
              this.$modal.msgSuccess('更新成功')
              this.boardDialogTableVisible = false
              this.$store.dispatch('refreshBoardList', true)
              //this.getList();
            }).finally(() => {
              this.boardDialogTableVisible = false
            })
          } else {
            addBoard(this.formBoard).then(response => {
              this.$modal.msgSuccess('创建成功')
              this.boardDialogTableVisible = false
              this.$store.dispatch('refreshBoardList', true)
              //this.getList();
            }).finally(() => {
              this.boardDialogTableVisible = false
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  background: rgba(0, 0, 0, .24);
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .app-breadcrumb {
    padding-left: 34px;
    display: inline-block;
    vertical-align: sub;
  }

  .navbar-menu a {
    margin-right: 20px;
    font-size: 14px;
    color: white;
    line-height: 45px;
  }

  .navbar-row {
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
    display: inline-flex;

    &:focus {
      outline: none;
    }
  }

  .top-line {
    display: inline-block;
    margin: 0 15px;
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
