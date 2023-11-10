<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="父ID" prop="parentId">
        <el-input
          v-model="queryParams.parentId"
          placeholder="请输入父ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工作区ID" prop="wordspaceId">
        <el-input
          v-model="queryParams.wordspaceId"
          placeholder="请输入工作区ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="看版ID" prop="boardId">
        <el-input
          v-model="queryParams.boardId"
          placeholder="请输入看版ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="看版列表ID" prop="boardListId">
        <el-input
          v-model="queryParams.boardListId"
          placeholder="请输入看版列表ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="看版列表卡片ID" prop="boardListCardId">
        <el-input
          v-model="queryParams.boardListCardId"
          placeholder="请输入看版列表卡片ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="清单标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入清单标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="完成时间" prop="endTime">
        <el-date-picker clearable size="small"
          v-model="queryParams.endTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择完成时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="负责人ID" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入负责人ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="修改人名称" prop="updateName">
        <el-input
          v-model="queryParams.updateName"
          placeholder="请输入修改人名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="新增人名称" prop="createName">
        <el-input
          v-model="queryParams.createName"
          placeholder="请输入新增人名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['board:cardList:add']"
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
          v-hasPermi="['board:cardList:edit']"
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
          v-hasPermi="['board:cardList:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['board:cardList:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="cardListList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" v-if="true"/>
      <el-table-column label="父ID" align="center" prop="parentId" />
      <el-table-column label="工作区ID" align="center" prop="wordspaceId" />
      <el-table-column label="看版ID" align="center" prop="boardId" />
      <el-table-column label="看版列表ID" align="center" prop="boardListId" />
      <el-table-column label="看版列表卡片ID" align="center" prop="boardListCardId" />
      <el-table-column label="清单标题" align="center" prop="title" />
      <el-table-column label="完成时间" align="center" prop="endTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="负责人ID" align="center" prop="userId" />
      <el-table-column label="修改人名称" align="center" prop="updateName" />
      <el-table-column label="新增人名称" align="center" prop="createName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['board:cardList:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['board:cardList:remove']"
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

    <!-- 添加或修改卡片清单关系对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="父ID" prop="parentId">
          <el-input v-model="form.parentId" placeholder="请输入父ID" />
        </el-form-item>
        <el-form-item label="工作区ID" prop="wordspaceId">
          <el-input v-model="form.wordspaceId" placeholder="请输入工作区ID" />
        </el-form-item>
        <el-form-item label="看版ID" prop="boardId">
          <el-input v-model="form.boardId" placeholder="请输入看版ID" />
        </el-form-item>
        <el-form-item label="看版列表ID" prop="boardListId">
          <el-input v-model="form.boardListId" placeholder="请输入看版列表ID" />
        </el-form-item>
        <el-form-item label="看版列表卡片ID" prop="boardListCardId">
          <el-input v-model="form.boardListCardId" placeholder="请输入看版列表卡片ID" />
        </el-form-item>
        <el-form-item label="清单标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入清单标题" />
        </el-form-item>
        <el-form-item label="完成时间" prop="endTime">
          <el-date-picker clearable size="small"
            v-model="form.endTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择完成时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="负责人ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入负责人ID" />
        </el-form-item>
        <el-form-item label="修改人名称" prop="updateName">
          <el-input v-model="form.updateName" placeholder="请输入修改人名称" />
        </el-form-item>
        <el-form-item label="新增人名称" prop="createName">
          <el-input v-model="form.createName" placeholder="请输入新增人名称" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listCardList, getCardList, delCardList, addCardList, updateCardList } from "@/api/board/cardList";

export default {
  name: "CardList",
  data() {
    return {
      // 按钮loading
      buttonLoading: false,
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
      // 卡片清单关系表格数据
      cardListList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        parentId: undefined,
        wordspaceId: undefined,
        boardId: undefined,
        boardListId: undefined,
        boardListCardId: undefined,
        title: undefined,
        endTime: undefined,
        userId: undefined,
        updateName: undefined,
        createName: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [
          { required: true, message: "ID不能为空", trigger: "blur" }
        ],
        parentId: [
          { required: true, message: "父ID不能为空", trigger: "blur" }
        ],
        wordspaceId: [
          { required: true, message: "工作区ID不能为空", trigger: "blur" }
        ],
        boardId: [
          { required: true, message: "看版ID不能为空", trigger: "blur" }
        ],
        boardListId: [
          { required: true, message: "看版列表ID不能为空", trigger: "blur" }
        ],
        boardListCardId: [
          { required: true, message: "看版列表卡片ID不能为空", trigger: "blur" }
        ],
        title: [
          { required: true, message: "清单标题不能为空", trigger: "blur" }
        ],
        endTime: [
          { required: true, message: "完成时间不能为空", trigger: "blur" }
        ],
        userId: [
          { required: true, message: "负责人ID不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间(yyyy-MM-dd hh:mm:ss)不能为空", trigger: "blur" }
        ],
        updateName: [
          { required: true, message: "修改人名称不能为空", trigger: "blur" }
        ],
        createName: [
          { required: true, message: "新增人名称不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询卡片清单关系列表 */
    getList() {
      this.loading = true;
      listCardList(this.queryParams).then(response => {
        this.cardListList = response.rows;
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
        id: undefined,
        parentId: undefined,
        wordspaceId: undefined,
        boardId: undefined,
        boardListId: undefined,
        boardListCardId: undefined,
        title: undefined,
        endTime: undefined,
        userId: undefined,
        createTime: undefined,
        createBy: undefined,
        updateTime: undefined,
        updateBy: undefined,
        delFlag: undefined,
        updateName: undefined,
        createName: undefined
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
      this.title = "添加卡片清单关系";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getCardList(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改卡片清单关系";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateCardList(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addCardList(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除卡片清单关系编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delCardList(ids);
      }).then(() => {
        this.loading = false;
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).finally(() => {
        this.loading = false;
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('board/cardList/export', {
        ...this.queryParams
      }, `cardList_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
