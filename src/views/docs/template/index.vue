<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="文件名称" prop="fileName">
        <el-input
          v-model="queryParams.fileName"
          placeholder="请输入文件名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="文件扩展名称" prop="extendName">
        <el-input
          v-model="queryParams.extendName"
          placeholder="请输入文件扩展名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分类ID" prop="categoryId">
        <el-select v-model="queryParams.categoryId" placeholder="请选择分类ID" clearable>
          <el-option
            v-for="dict in dict.type.category_id"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否热门" prop="isHot">
        <el-select v-model="queryParams.isHot" placeholder="请选择是否热门" clearable>
          <el-option
            v-for="dict in dict.type.is_dir"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否推荐" prop="isRecommend">
        <el-select v-model="queryParams.isRecommend" placeholder="请选择是否推荐" clearable>
          <el-option
            v-for="dict in dict.type.is_dir"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['docs:template:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['docs:template:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['docs:template:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['docs:template:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="templateList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="文件名称" align="center" prop="fileName" />
      <el-table-column label="文件扩展名称" align="center" prop="extendName" />
      <el-table-column label="大小(kb)" align="center" prop="fileSize" />
      <el-table-column label="模版ID" align="center" prop="templateId" />
      <el-table-column label="分类ID" align="center" prop="categoryId">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.category_id" :value="scope.row.categoryId"/>
        </template>
      </el-table-column>
      <el-table-column label="所有者ID" align="center" prop="userId" />
      <el-table-column label="md5唯一标识" align="center" prop="identifier" />
      <el-table-column label="存储类型" align="center" prop="storageType" />
      <el-table-column label="存储类型名称" align="center" prop="storageTypeName" />
      <el-table-column label="文件路径" align="center" prop="ossPath" />
      <el-table-column label="是否热门" align="center" prop="isHot">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.is_dir" :value="scope.row.isHot"/>
        </template>
      </el-table-column>
      <el-table-column label="是否推荐" align="center" prop="isRecommend">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.is_dir" :value="scope.row.isRecommend"/>
        </template>
      </el-table-column>
      <el-table-column label="查看次数" align="center" prop="views" />
      <el-table-column label="修改人名称" align="center" prop="updateName" />
      <el-table-column label="新增人名称" align="center" prop="createName" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['docs:template:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['docs:template:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改文件模版对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="文件名称" prop="fileName">
          <el-input v-model="form.fileName" placeholder="请输入文件名称" />
        </el-form-item>
        <el-form-item label="文件扩展名称" prop="extendName">
          <el-input v-model="form.extendName" placeholder="请输入文件扩展名称" />
        </el-form-item>
        <el-form-item label="大小(kb)" prop="fileSize">
          <el-input v-model="form.fileSize" placeholder="请输入大小(kb)" />
        </el-form-item>
        <el-form-item label="模版ID" prop="templateId">
          <el-input v-model="form.templateId" placeholder="请输入模版ID" />
        </el-form-item>
        <el-form-item label="分类ID" prop="categoryId">
          <el-select v-model="form.categoryId" placeholder="请选择分类ID">
            <el-option
              v-for="dict in dict.type.category_id"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所有者ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入所有者ID" />
        </el-form-item>
        <el-form-item label="md5唯一标识" prop="identifier">
          <el-input v-model="form.identifier" placeholder="请输入md5唯一标识" />
        </el-form-item>
        <el-form-item label="存储类型名称" prop="storageTypeName">
          <el-input v-model="form.storageTypeName" placeholder="请输入存储类型名称" />
        </el-form-item>
        <el-form-item label="文件路径" prop="ossPath">
          <el-input v-model="form.ossPath" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="是否热门" prop="isHot">
          <el-radio-group v-model="form.isHot">
            <el-radio
              v-for="dict in dict.type.is_dir"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否推荐" prop="isRecommend">
          <el-radio-group v-model="form.isRecommend">
            <el-radio
              v-for="dict in dict.type.is_dir"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="查看次数" prop="views">
          <el-input v-model="form.views" placeholder="请输入查看次数" />
        </el-form-item>
        <el-form-item label="是否删除" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入是否删除" />
        </el-form-item>
        <el-form-item label="修改人名称" prop="updateName">
          <el-input v-model="form.updateName" placeholder="请输入修改人名称" />
        </el-form-item>
        <el-form-item label="新增人名称" prop="createName">
          <el-input v-model="form.createName" placeholder="请输入新增人名称" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getTemplate, listTemplate} from "@/api/";

  export default {
  name: "Template",
  dicts: ['category_id', 'is_dir'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 文件模版表格数据
      templateList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        fileName: null,
        extendName: null,
        fileSize: null,
        templateId: null,
        categoryId: null,
        userId: null,
        identifier: null,
        storageType: null,
        storageTypeName: null,
        ossPath: null,
        isHot: null,
        isRecommend: null,
        views: null,
        updateName: null,
        createName: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        fileName: [
          { required: true, message: "文件名称不能为空", trigger: "blur" }
        ],
        extendName: [
          { required: true, message: "文件扩展名称不能为空", trigger: "blur" }
        ],
        fileSize: [
          { required: true, message: "大小(kb)不能为空", trigger: "blur" }
        ],
        userId: [
          { required: true, message: "所有者ID不能为空", trigger: "blur" }
        ],
        identifier: [
          { required: true, message: "md5唯一标识不能为空", trigger: "blur" }
        ],
        storageType: [
          { required: true, message: "存储类型不能为空", trigger: "change" }
        ],
        storageTypeName: [
          { required: true, message: "存储类型名称不能为空", trigger: "blur" }
        ],
        isHot: [
          { required: true, message: "是否热门不能为空", trigger: "change" }
        ],
        isRecommend: [
          { required: true, message: "是否推荐不能为空", trigger: "change" }
        ],
        views: [
          { required: true, message: "查看次数不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询文件模版列表 */
    getList() {
      this.loading = true;
      listTemplate(this.queryParams).then(response => {
        this.templateList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        fileName: null,
        extendName: null,
        fileSize: null,
        templateId: null,
        categoryId: null,
        userId: null,
        identifier: null,
        storageType: null,
        storageTypeName: null,
        ossPath: null,
        isHot: null,
        isRecommend: null,
        views: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        delFlag: null,
        updateName: null,
        createName: null,
        status: null,
        remark: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加文件模版";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getTemplate(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改文件模版";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateTemplate(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTemplate(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除文件模版编号为"' + ids + '"的数据项？').then(function() {
        return delTemplate(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('docs/template/export', {
        ...this.queryParams
      }, `template_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
