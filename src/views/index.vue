<template>
  <div class="app-container">
    <div class="card_title" v-if="userJoinBoards !=null && userJoinBoards.length>0">
      <h3 class="boards-page-board-section-header-name">
      <i class="el-icon-s-finance"></i>&nbsp;&nbsp;&nbsp;&nbsp;我加入的看板
      </h3>
    </div>
    <div v-if="userJoinBoards !=null && userJoinBoards.length>0">
      <ul class="boards-page-board-section-list">
        <li class="boards-page-board-section-list-item" v-for="board in userJoinBoards" :key="board.id">
          <a class="board-title" @click="toBoard(board, false)" href="javascript:void(0)"
             :style='{
                backgroundColor: board.defaultColor,
                backgroundImage: board.backgroundImage !=null ? "url(\"" + board.backgroundImage + "?imageView2/1/w/250/h/120\")" : ""
            }'>
            <span class="board-title-fade"></span>
            <div class="board-title-details is-badged">
              <div :title="board.title" dir="auto" class="board-title-details-name">
                <div>
                  {{board.title}}
                </div>
              </div>
            </div>
            <div class="board-create-time"><time-diff :date="board.createTime"/></div>
          </a>
          <div class="u-clearfix"></div>
        </li>
      </ul>
    </div>
    <!--<div class="card_title" v-if="boards !=null && boards.length>0"><h3 class="boards-page-board-section-header-name">
      <i class="el-icon-time"></i>&nbsp;&nbsp;&nbsp;&nbsp;最近查看</h3></div>
    <div v-if="boards !=null && boards.length>0">
      <ul class="boards-page-board-section-list">
        <li class="boards-page-board-section-list-item" v-for="board in boards" :key="board.id">
          <a class="board-title" @click="toBoard(board, true)" href="javascript:void(0)"
             :style='{
                backgroundColor: board.defaultColor,
                backgroundImage: board.backgroundImage !=null ? "url(\"" + board.backgroundImage + "?imageView2/1/w/250/h/120\")" : ""
            }'>
            <span class="board-title-fade"></span>
            <div class="board-title-details is-badged">
              <div :title="board.title" dir="auto" class="board-title-details-name">
                <div>
                  {{board.title}}
                </div>
              </div>
            </div>
          </a>
          <div class="u-clearfix"></div>
        </li>
      </ul>
    </div>-->
    <div class="card_title" v-if="starBoards !=null && starBoards.length>0">
      <h3 class="boards-page-board-section-header-name">
        <i class="el-icon-star-on"></i>&nbsp;&nbsp;&nbsp;&nbsp;标星看版
      </h3>
    </div>
    <div  v-if="starBoards !=null && starBoards.length>0">
      <ul class="boards-page-board-section-list">
        <li class="boards-page-board-section-list-item" v-for="board in starBoards" :key="board.id">
          <div class="card-more">
            <el-dropdown trigger="click">
                      <span class="el-dropdown-link">
                        <i class="el-icon-more"></i>
                      </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-plus">添加成员</el-dropdown-item>
                <el-dropdown-item icon="el-icon-circle-plus">添加标签</el-dropdown-item>
                <el-dropdown-item icon="el-icon-edit">编辑</el-dropdown-item>
                <el-dropdown-item icon="el-icon-delete">删除</el-dropdown-item>
                <el-dropdown-item icon="el-icon-document-copy">复制</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <a class="board-title" @click="toBoard(board, false)" href="javascript:void(0)"
             :style='{
                backgroundColor: board.defaultColor,
                backgroundImage: board.backgroundImage !=null ? "url(\"" + board.backgroundImage + "?imageView2/1/w/250/h/120\")" : ""
            }'>
            <span class="board-title-fade"></span>
            <div class="board-title-details is-badged">
              <div :title="board.title" dir="auto" class="board-title-details-name">
                <div>
                  {{board.title}}
                </div>
              </div>
            </div>
            <div class="board-create-time"><time-diff :date="board.createTime"/></div>
          </a>
          <div class="u-clearfix"></div>
        </li>
      </ul>
    </div>
    <div class="card_title">
      <h3 class="boards-page-section-header-name">
        <i class="el-icon-sunrise-1"></i>&nbsp;&nbsp;&nbsp;&nbsp;您的工作区
      </h3>
    </div>
    <div class="boards-page-board-section mod-no-sidebar" v-loading="workspaceLoading" v-for="item in workspaces"
         :key="item.id">
      <div class="boards-page-board-section-header">
        {{item.name}}
        <div style="margin-left: 100px;">
          <el-button size="mini">看版</el-button>
          <el-button size="mini">成员</el-button>
          <el-button size="mini">设置</el-button>
        </div>
      </div>
      <div>
        <ul class="boards-page-board-section-list">
          <li class="boards-page-board-section-list-item" v-for="board in item.list" :key="board.id">
            <div class="card-more">
              <el-dropdown trigger="click">
                      <span class="el-dropdown-link">
                        <i class="el-icon-more"></i>
                      </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item icon="el-icon-plus">添加成员</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-circle-plus">添加标签</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-edit">编辑</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-delete">删除</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-document-copy">复制</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <a class="board-title" @click="toBoard(board, false)" href="javascript:void(0)"
               :style='{
                backgroundColor: board.defaultColor,
                backgroundImage: board.backgroundImage !=null ? "url(\"" + board.backgroundImage + "?imageView2/1/w/250/h/120\")" : ""
            }'>
              <span class="board-title-fade"></span>
              <div class="board-title-details is-badged">
                <div :title="board.title" dir="auto" class="board-title-details-name">
                  <div>
                    {{board.title}}
                  </div>
                </div>
              </div>
              <div class="board-create-time"><time-diff :date="board.createTime"/></div>
            </a>
            <div class="u-clearfix"></div>
          </li>
          <li data-test-id="create-board-title" class="boards-page-board-section-list-item">
            <div class="board-title mod-add" @click="createBoard(item.id)"><p><span>创建新看版</span></p></div>
          </li>
        </ul>
      </div>
    </div>
    <div v-if="workspaces && workspaces.length == 0">暂无数据</div>
  </div>
</template>

<script>
  import {listWorkspace} from "@/api/board/workspace"
  import {listBoardViewRecord} from "@/api/board/boardViewRecord"
  import {userStarBoardList, userJoinBoardList} from "@/api/board/board"

  export default {
    name: "Index",
    data() {
      return {
        // 版本号
        version: "3.5.0",
        workspaces: null,
        boards: null,
        starBoards: null,
        userJoinBoards: null,
        workspaceLoading: false,
        boardLoading: false,
      };
    },
    created() {
      this.getWorkspace();
      this.getUserJoinBoardList();
      //this.getViewBoardList();
      this.getStarBoardList();
    },
    watch: {
      '$store.state.user.refreshBoardList'(newValue, oldValue) {
        this.getWorkspace();
        //this.getViewBoardList();
      },
      '$store.state.user.refreshWorkspaceList'(newValue, oldValue) {
        this.getWorkspace();
      }
    },
    methods: {
      toBoard(item, isViewRecord) {
        let id = item.id;
        if (isViewRecord) {
          id = item.boardId;
        }
        this.$router.push("/board/" + id);
      },
      createBoard(workspaceId) {
        this.$store.dispatch("createBoard", JSON.stringify({
          status: true,
          workspaceId: workspaceId
        }));
      },
      async getWorkspace() {
        this.workspaceLoading = true;
        let data = await listWorkspace({
          createBy: this.$store.getters.user.userId,
          getBoard: true
        });
        this.workspaces = data.rows;
        this.workspaceLoading = false;
      },
      async getViewBoardList() {
        let data = await listBoardViewRecord({
          createBy: this.$store.getters.user.userId,
          pageSize: 5
        });
        this.boards = data.rows;
      },
      async getStarBoardList() {
        let data = await userStarBoardList({
          createBy: this.$store.getters.user.userId,
          pageSize: 5
        });
        this.starBoards = data.rows;
      },
      async getUserJoinBoardList() {
        let data = await userJoinBoardList({
          pageSize: 5
        });
        this.userJoinBoards = data.rows;
      },
      goTarget(href) {
        window.open(href, "_blank");
      },
      async logout() {
        this.$confirm('确定注销并退出系统吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('LogOut').then(() => {
            location.href = process.env.VUE_APP_CONTEXT_PATH + "index";
          })
        }).catch(() => {
        });
      }
    },
  };
</script>

<style scoped lang="scss">
.card-more {
  background-clip: padding-box;
  background-color: var(--ds-surface-raised-hovered,#f1f2f4);
  background-origin: initial;
  border-radius: 8px;
  opacity: .8;
  padding: 6px;
  position: absolute;
  right: 2px;
  top: 2px;
  visibility: hidden;
  z-index: 40;
}
</style>

