<template>
  <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    width="30%">
    <el-form :model="form" :rules="rules" ref="form" label-position="top">
      <el-form-item label="上级目录" prop="deptId">
        <treeselect v-model="form.parentId" :options="docsOptions" :show-count="true" placeholder="请选择上级目录" />
      </el-form-item>
      <el-form-item label="文档名称" prop="fileName" label-width="200">
        <el-input v-model="form.fileName" autocomplete="off" placeholder="请输入文档名称。"></el-input>
      </el-form-item>
    </el-form>
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </el-dialog>
</template>

<script>

import { addFile, updateFile, docsTreeSelect } from '@/api/docs/file'
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  components: { Treeselect },
  name: 'CreateDoc',
  props: {
    form:{

    }
  },
  computed: {},
  data() {
    return {
      // 目录树选项
      docsOptions: undefined,
      form:{

      },
      dialogVisible: false,
      rules: {
        name: [
          {required: true, message: '请填写文档名称', trigger: 'blur'},
          {min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur'}
        ]
      },
    }
  },
  created() {
    this.getDocsTree();
  },
  methods: {
    /** 查询部门下拉树结构 */
    getDocsTree() {
      docsTreeSelect().then(response => {
        this.docsOptions = response.data;
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.form.id) {
            updateFile(this.form).then(response => {
              this.$modal.msgSuccess("更新成功");
              this.dialogVisible = false;
              //this.$store.dispatch("refreshWorkspaceList", true);
              //this.getList();
            }).finally(() => {
              this.dialogVisible = false;
            });
          } else {
            addFile(this.form).then(response => {
              this.$modal.msgSuccess("创建成功");
              this.dialogVisible = false;
            }).finally(() => {
              this.dialogVisible = false;
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
