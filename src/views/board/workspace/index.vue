<template>
  <div class="app-container">
    <div class="card_title">
      <h3 class="boards-page-board-section-header-name">
        <i class="el-icon-sunrise-1"></i>&nbsp;&nbsp;&nbsp;&nbsp;工作空间
      </h3>
    </div>
    <div v-loading="loading">
      <ul class="boards-page-board-section-list">
        <li v-if="workspaceList.length == 0">暂无数据</li>
        <li class="boards-page-board-section-list-item" v-for="work in workspaceList" :key="work.id">
          <a class="board-title" @click="toBoard(work, false)" href="javascript:void(0)"
             :style='{
                background: work.backgroundImage !=null ? "url(\"" + work.backgroundImage + "?imageView2/1/w/250/h/120\")" : work.defaultColor
            }'>
            <span class="board-title-fade"></span>
            <div class="board-title-details is-badged">
              <div :title="work.name" dir="auto" class="board-title-details-name">
                <div>
                  {{work.name}}
                </div>
                <dict-tag :options="dict.type.workspace_type" :value="work.type"/>
                <div>{{work.description}}</div>
              </div>
            </div>
            <div class="board-create-time"><time-diff :date="work.createTime"/></div>
          </a>
          <div class="u-clearfix"></div>
        </li>
      </ul>
    </div>
    <div class="load-more mr-bottom" v-if="queryParams.pageSize * queryParams.pageNum < total" @click='loadMore'>---点击加载更多---</div>
  </div>
</template>

<script>
  import {listWorkspace} from "@/api/board/workspace";

  export default {
    name: "Workspace",
    dicts: ['common_status', 'workspace_type'],
    data() {
      return {
        // 按钮loading
        buttonLoading: false,
        // 遮罩层
        loading: true,
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 总条数
        total: 0,
        // 工作区表格数据
        workspaceList: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 20
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询工作区列表 */
      getList() {
        this.loading = false;
        listWorkspace(this.queryParams).then(response => {
          this.workspaceList = response.rows;
          this.total = response.total;
          //this.loading = false;
        });
      },
      loadMore() {
        this.queryParams.pageNum = this.queryParams.pageNum+1;
        this.getList();
      },
    }
  };
</script>

<style lang="scss">
</style>
