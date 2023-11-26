<template>
  <div class="sidebar-container has-logo">
    <div class="el-scrollbar theme-dark">
      <el-row class="button-item">
        <el-dropdown class="" trigger="click" style="width: 80%;">
          <span class="el-dropdown-link">
            <el-button><i class="el-icon-plus"></i>新建</el-button>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item divided @click.native="createFolder">
              <span><i class="el-icon-folder"></i> 创建文件夹</span>
            </el-dropdown-item>
            <el-dropdown-item>
              <span><i class="el-icon-document"></i> 创建文件</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-row>
      <div class="button-item block el-menu">
        <el-tree
         :data="docsFileDirList"
         accordion
         node-key="id"
         default-expand-all
         :props="defaultProps"
         @node-click="handleNodeClick"
        >
        </el-tree>
      </div>
    </div>
    <el-dialog title="创建文件夹" :visible.sync="open" width="400px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-position="left">
        <el-form-item label="上级文件夹" prop="parentId">
          <treeselect
            v-model="form.parentId"
            :options="docsFileOptions"
            :normalizer="normalizer"
            :show-count="true"
            placeholder="请选择上级文件夹"
          />
        </el-form-item>
        <el-form-item label="文件夹名称" prop="fileName">
          <el-input v-model="form.fileName" placeholder="请输入文件夹名称"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addFile, docsTreeSelect, listFileDir, listFile } from '@/api/docs/file'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  components: { Treeselect },
  data() {
    return {
      menus: [{
        index: 2,
        title: '我的文档',
        icon: 'el-icon-document',
        path: '/workspace/list',
        cls: 'el-menu-item '
      }],
      defaultProps: {
        children: 'children',
        label: 'fileName'
      },
      queryParams: {

      },
      open: false,
      form: {
        parentId: null,
        fileName: null,
        isDir: 1
      },
      rules: {
        parentId: [
          { required: true, message: '请选择上级文件夹', trigger: 'change' }
        ],
        fileName: [
          { required: true, message: '请输入文件夹名称', trigger: 'blur' },
          { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
        ]
      },
      // 文件夹树数据
      docsFileDirList: [],
      // 文件夹树数据
      docsFileList: [],
      // 文件夹树选项
      docsFileOptions: [],
    }
  },
  created() {
    this.getDirList()
  },
  methods: {
    handleNodeClick(data) {
      if (data.parentId != 0) {
        this.$router.push("/folder/docs/"+data.parentId);
      }
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      listFileDir().then(response => {
        let data = response.data
        let docs = null
        this.docsFileOptions = []
        for (const iterm of data) {
          if (iterm.parentId == 0) {
            docs = iterm
            data.shift()
            break
          }
        }
        docs.children = this.handleTree(response.data)
        this.docsFileOptions.push(docs)
      })
    },
    /** 查询文件列表 */
    async getList(parentId) {
      this.loading = true
      let response = await listFile(this.queryParams)
      this.docsFileDirList = this.handleTree(response.data)
      console.log(this.docsFileDirList)
      this.loading = false
    },
    /** 查询目录列表 */
    async getDirList() {
      this.loading = true
      let response = await listFileDir({isDir: 1, isDel: 0, status: 0})
      this.docsFileDirList = this.handleTree(response.data)
      this.loading = false
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.fileName,
        children: node.children
      }
    },
    createFolder() {
      this.reset()
      this.getTreeselect()
      this.open = true
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        parentId: null,
        fileName: null,
        isDir: 1
      }
      this.resetForm('form')
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          addFile(this.form).then(response => {
            this.$modal.msgSuccess('新增成功')
            this.open = false
            this.getList()
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.button-item {
  background: white;
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
}

#app .sidebar-container {
  -webkit-transition: width 0.28s;
  transition: width 0.28s;
  width: 200px !important;
  background-color: #e6e6e6;
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
}

.el-form-item {
  margin-bottom: 10px;
}
</style>
