<template>
  <div class="app-container">
    <div class="card_title">
      <h3 class="boards-page-board-section-header-name">
        <i class="el-icon-star-off"></i>&nbsp;&nbsp;&nbsp;&nbsp;标星看板
      </h3>
    </div>
    <div v-loading="loading">
      <ul class="boards-page-board-section-list">
        <li v-if="boardList.length == 0">暂无数据</li>
        <li class="boards-page-board-section-list-item" v-for="board in boardList" :key="board.id">
          <a class="board-title" @click="toBoard(board, false)" href="javascript:void(0)"
             :style='{
                background: board.backgroundImage !=null ? "url(\"" + board.backgroundImage + "?imageView2/1/w/250/h/120\")" : board.defaultColor
            }'>
            <span class="board-title-fade"></span>
            <div class="board-title-details is-badged">
              <div :title="board.title" dir="auto" class="board-title-details-name">
                <div>
                  {{board.title}}
                </div>
                <dict-tag :options="dict.type.view_range" :value="board.viewRange"/>
              </div>
            </div>
            <div class="board-create-time"><time-diff :date="board.createTime"/></div>
          </a>
          <div class="u-clearfix"></div>
        </li>
      </ul>
    </div>
    <div class="load-more mr-bottom" v-if="queryParams.pageSize * queryParams.pageNum < total" @click='loadMore'>---点击加载更多---</div>
  </div>
</template>

<script>
  import {userStarBoardList} from "@/api/board/board"

  export default {
    name: "Workspace",
    dicts: ['view_range'],
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
        // 表格数据
        boardList: [],
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
      toBoard(item, isViewRecord) {
        let id = item.id;
        if (isViewRecord) {
          id = item.boardId;
        }
        this.$router.push("/board/" + id);
      },
      /** 查询工作区列表 */
      getList() {
        this.loading = false;
        userStarBoardList(this.queryParams).then(response => {
          this.boardList = response.rows;
          this.total = response.total;
          //this.loading = false;
        });
      }
    },
    loadMore() {
      this.queryParams.pageNum = this.queryParams.pageNum+1;
      this.getList();
    },
  };
</script>


<style lang="scss">

</style>
