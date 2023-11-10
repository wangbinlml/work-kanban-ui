<template>
  <div class="app-container2" :style="containerStyle">
    <div>
      <navbar/>
    </div>
    <el-row class="board-navbar-item">
      <el-button type="default">{{ boardInfo && boardInfo.workspace.name }}</el-button>
      <span class="board-header-btn-divider"></span>
      <el-button type="default">
        <template>
          <dict-tag
            :options="dict.type.workspace_type"
            :value="boardInfo && boardInfo.workspace.type"
          />
        </template>
      </el-button>
      <span class="board-header-btn-divider"></span>
      <el-button type="default">
        <template>
          <dict-tag
            :options="dict.type.view_range"
            :value="boardInfo && boardInfo.viewRange"
          />
        </template>
        可见
      </el-button>
      <span class="board-header-btn-divider"></span>
      <el-button type="default" @click="updateBoard">{{ boardInfo && boardInfo.title }}</el-button>
      <span class="board-header-btn-divider"></span>
      <div class="user-range">
        <div class="user-item" v-for="item in boardSelectUserList" :key="item.id">
          <el-popover
            placement="bottom"
            width="400"
            trigger="click"
          >
            <p>userinfo</p>
            <el-avatar slot="reference" size="medium" :src="item.avatar">{{ item.nickname }}</el-avatar>
          </el-popover>
        </div>
      </div>
      <el-popover
        placement="bottom"
        width="400"
        trigger="click"
        v-model="addBoardUserVisible"
      >
        <p>
          <el-autocomplete
            class="inline-input"
            v-model="boardUserId"
            clearable
            style="width: 100%;"
            :fetch-suggestions="querySearchUser"
            placeholder="请输入用户名称"
            :trigger-on-focus="false"
            @select="handleSelectUser">
          </el-autocomplete>
        </p>
        <el-button slot="reference" type="default" icon="el-icon-plus" circle title="参与人员"></el-button>
      </el-popover>

      <span class="board-header-btn-divider"></span>
      <div class="block">
        <el-color-picker v-model="boardInfo && boardInfo.defaultColor || '#fff'"></el-color-picker>
      </div>
      <span class="board-header-btn-divider"></span>
      <div>
        <i class="el-icon-star-off" style="font-size: xx-large; color: #e6a23c;"
           v-if="boardInfo && (boardInfo.boardUser == null || boardInfo.boardUser.star == 2)" @click="starBoard"></i>
        <i class="el-icon-star-on" style="font-size: xx-large; color: #e6a23c;" v-else @click="starBoard"></i>
      </div>
      <div style="float: right;">
        <el-button @click="updateBoard" type="default" title="看版信息">
          <i class="el-icon-edit"></i>看版信息
        </el-button>
        <el-button @click="showTagDrawer" type="default" title="标签管理" style="margin-left: 16px;">
          <i class="el-icon-collection-tag"></i>标签管理
        </el-button>
        <el-drawer
          title="标签管理"
          :visible.sync="drawerTag"
          ref="drawerTag"
          size="20%"
          :with-header="false">
          <div class="tag-drawer__content" style="padding: 20px;">
            <el-tag
              class="board-tags"
              v-for="tag in tagList"
              closable
              :disable-transitions="false"
              :key="tag.id"
              :color="tag.bgColor"
              @close="handleTagClose(tag)">
              {{ tag.tagName }}
            </el-tag>
            <el-divider></el-divider>
            <h5>新增标签</h5>
            <div style="padding-bottom: 10px;">
              <el-popover
                v-for="(item, idx) in dict.type.tag_bg_color"
                :key="idx"
                placement="top-start"
                width="80"
                trigger="hover"
                content="点击选择颜色">
                <el-button slot="reference" size="medium"
                           :style="{'background-color': item.value}" circle @click="selectTagBg(item.value)">
                </el-button>
              </el-popover>
            </div>
            <el-form :model="formTag" ref="formTag">
              <el-form-item
                prop="color"
                width="80px"
                :rules="[{ required: true, message: '请选择标签背景色', trigger: 'blur' }]"
                label="背景颜色">
                <el-tooltip content="点击选择标签背景色" placement="bottom" effect="light">
                  <el-color-picker v-model="formTag.color"></el-color-picker>
                </el-tooltip>
              </el-form-item>
              <el-form-item
                label="标签名称"
                width="80px"
                prop="title"
                :rules="[{ required: true, message: '请输入标签', trigger: 'blur' }]"
              >
                <el-input
                  class="input-new-tag"
                  v-model="formTag.title"
                  ref="saveTagInput"
                  size="small"
                  placeholder="请输入标签"
                >
                </el-input>
              </el-form-item>
            </el-form>
            <div class="tag-drawer__footer">
              <el-button @click="cancelFormTag">取 消</el-button>
              <el-button @click="resetFormTag('formTag')">重置</el-button>
              <el-button :loading="buttonLoading" type="default" @click="submitFormTag('formTag')">提交</el-button>
            </div>
          </div>
        </el-drawer>
      </div>
    </el-row>
    <div class="section">
      <div id="list" class="clearfix">
        <draggable
          class="dragArea"
          tag="div"
          :animation='500'
          v-bind="dragOptions"
          :list="listBoardList"
          @end="endBoardDrag($event, listBoardList)"
          :group="{ name: 'g1' }"
        >
          <div class="list-group" v-for="(item, index) in listBoardList" v-bind:key="index">
            <div class="list-title">{{ item.title }}
              <span class="add-item" title="删除当前看版列表" @click="deleteListBoardList(index,item)"><i
                class="el-icon-remove-outline"></i> </span>
            </div>
            <draggable
              class="draggable"
              :animation='500'
              :data-index="item.id"
              :list="item.cards"
              v-bind="dragOptions"
              @end="endCardDrag($event, item.cards)"
              @start="drag = true"
              group="people"
              :name="!drag ? 'flip-list' : null"
            >
              <div class="draggable-item" v-for="element in item.cards" :data-item="JSON.stringify(element)" v-bind:key="element.id">
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
                <div class="item" :class="'level'"
                     @click="viewCardDetail(element.id)"
                     @mousedown="onDownTd"
                     @mouseup="onUpTd"
                >
                  <div>
                    <el-tag
                      class="card-label"
                      :key="tag.id"
                      :color="tag.bgColor"
                      v-for="tag in (element.tagList && element.tagList.length>0 ? element.tagList: [])"
                      :disable-transitions="false">
                      {{ tag.tagName }}
                    </el-tag>
                  </div>
                  <div style="clear: both">{{ element.title }}</div>
                  <p v-if="element.endTime != null && !element.isExpire"><i class="el-icon-time"></i>
                    {{ parseTime(element.endTime, '{y}/{m}/{d}') }}
                  </p>
                  <p v-if="element.endTime != null && element.isExpire" class="is-due-past"><i class="el-icon-time"></i>
                    {{ parseTime(element.endTime, '{y}/{m}/{d}') }}
                  </p>
                  <el-row>
                    <div class="row-item row-taskCount" v-if="element.taskCount>0">
                      <i class="el-icon-circle-check"></i> {{ element.finishTaskCount }}/{{ element.taskCount }}
                    </div>
                    <div class="row-item row-item2" v-if="element.userList.length>0">
                      <el-avatar class="member member-item" size="medium" v-for="item in element.userList"
                                 :src="item.avatar"
                                 v-bind:key="item.id">{{ item.nickname }}
                      </el-avatar>
                    </div>
                  </el-row>
                </div>
              </div>
            </draggable>
            <div class="new-item" v-show="item.cardTitleInputShow">
              <el-row>
                <el-col :span="22">
                  <el-input
                    v-model="cardTitle"
                    type="text"
                    auto-complete="off"
                    placeholder="请输入卡片标题"
                  ></el-input>
                </el-col>
                <el-col :span="2">
                  <div><i class="el-icon-close" @click="closeCardInput(item)"></i></div>
                </el-col>
              </el-row>
            </div>
            <el-button
              size="medium"
              type="default"
              class="add_card_button"
              v-show="item.cardTitleInputShow == null || item.cardTitleInputShow==false"
              @click="showAddCardInput(item)"
            ><span><i class="el-icon-plus"></i>添加卡片</span>
            </el-button>
            <el-button
              size="medium"
              v-show="item.cardTitleInputShow == true"
              type="default"
              @click="saveCard(item)"
              class="add_card_button"><span><i class="el-icon-plus"></i>保存卡片</span>
            </el-button>
          </div>
          <div class="list-group" v-show="showBoardInput">
            <div class="new-item">
              <el-input
                v-model="title"
                type="text"
                auto-complete="off"
                placeholder="请输入标题"
              ></el-input>
              <el-button
                size="medium"
                type="default"
                @click="addBoardList"
                style="width:100%; margin-top: 4px"><span><i class="el-icon-plus"></i>添加列表</span></el-button>
            </div>
          </div>
        </draggable>
      </div>
    </div>
    <el-dialog width="800px" :visible.sync="cardDetailDialogTableVisible">
      <el-row class="card-main-col">
        <el-col :span="19">
          <div>
            <h3><i class="el-icon-s-data"></i> 卡片标题
              <el-popover
                placement="top"
                width="230"
                v-model="updateCardTitleVisible">
                <p>
                  <el-input class="add_card_title"
                            v-model="formCard && formCard.title"
                            autocomplete="off"
                            placeholder="填写标题"></el-input>
                </p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="updateCardTitleVisible = false">取消</el-button>
                  <el-button type="default" size="mini" @click="saveAutoCardInfo('title')">确定</el-button>
                </div>
                <i slot="reference" class="el-icon-edit"></i>
              </el-popover>
            </h3>
            <div class="titleContent card-description">
              <div-edit class="description" style="width: 99%" :sourceData="formCard" v-model="formCard && formCard.title" v-on:input="saveAutoCardInfo"></div-edit>
            </div>
          </div>
          <div class="user-cell">
            <div class="card-end-time">
              <h4><i class="el-icon-time"></i>开始时间</h4>
              <div class="block">
                <el-date-picker
                  v-model="formCard && formCard.startTime"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  @change="saveAutoCardInfo('startTime')"
                  placeholder="选择开始时间">
                </el-date-picker>
              </div>
            </div>
            <div class="card-end-time">
              <h4><i class="el-icon-time"></i>到期时间</h4>
              <div class="block">
                <el-date-picker
                  v-model="formCard && formCard.endTime"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  @change="saveAutoCardInfo('endTime')"
                  placeholder="选择到期时间">
                </el-date-picker>
              </div>
            </div>
            <div class="user-info" v-if="formCard && formCard.cardUsers && formCard.cardUsers.length>0">
              <h4><i class="el-icon-user"></i>成员</h4>
              <el-avatar class="member" size="medium" v-for="item in formCard && formCard.cardUsers" :src="item.avatar"
                         v-bind:key="item.id">{{ item.nickname }}
              </el-avatar>
            </div>
            <div class="card-tags" v-if="cardDetail && cardDetail.cardTags && cardDetail.cardTags.length>0">
              <h4><i class="el-icon-price-tag"></i>标签</h4>
              <el-tag
                class="board-tags2"
                :key="tag.id"
                :color="tag.bgColor"
                v-for="tag in (cardDetail ? cardDetail.cardTags: [])"
                :disable-transitions="false">
                {{ tag.tagName }}
              </el-tag>
            </div>
            <br/>
          </div>
          <br/>
          <div class="description-cell">
            <h3><i class="el-icon-s-data"></i> 卡片描述
              <el-popover
                placement="right"
                width="730"
                v-model="updateCardDescriptionVisible">
                <p>
                  <el-input class="add_card_description"
                            type="textarea"
                            :rows="15"
                            v-model="formCard && formCard.description"
                            placeholder="填写描述"></el-input>
                </p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="updateCardDescriptionVisible = false">取消</el-button>
                  <el-button type="default" size="mini" @click="saveAutoCardInfo('description')">确定</el-button>
                </div>
                <i slot="reference" class="el-icon-edit-outline"></i>
              </el-popover>
            </h3>
            <el-row>
              <div style="white-space: pre-wrap;" class="card-description card-description2" v-html="formCard && formCard.description">
                {{ formCard && formCard.description || "添加详细描述..." }}
              </div>
            </el-row>
          </div>
          <el-row>
            <div class="checkList" v-for="(item, idx) in (cardDetail != null ? cardDetail.cardLists: [])">
              <h3 class="check-item-h3">
                <i class="el-icon-circle-check"></i>
                <div-edit class="description" style="width: 90%; display: inline-block;" :sourceData="item" v-model="item.title" v-on:input="saveCardItemInfo"></div-edit>
                <span class="icon-delete">
                <i class="el-icon-delete" @click="deleteCardList(idx, item)"></i>
                </span>
              </h3>
              <!--
                            <el-progress :percentage="33.3" :stroke-width="8"></el-progress>
              -->
              <draggable
                      :animation='500'
                      @end="taskListEnd($event, item.children)"
                      tag="ul"
                      :list="(item != null ? item.children : [])"
                      handle=".handle"
                      class="list-group">
                <li
                  v-for="(obj, idx) in (item != null ? item.children : [])"
                  :key="obj.title"
                >
                  <i class="el-icon-d-caret handle"></i>
                  <el-checkbox v-model="obj.checked" @change="checkCardListItem(obj)"></el-checkbox>
                  <div style="display: inline-block; width: 90%" :class="obj.checked? 'underline':''">
                    <div-edit class="description" :sourceData="obj" v-model="obj.title" v-on:input="saveCardItemInfo"></div-edit>
                  </div>
                  <span class="icon-delete">
                    <i class="el-icon-remove-outline" @click="deleteCardListItem(idx, obj, item)"></i>
                  </span>
                </li>
              </draggable>
              <div class="new-item" v-show="item.cardListItemTitleInputShow">
                <el-row>
                  <el-col :span="22">
                    <el-input
                      v-model="cardListItemTitle"
                      type="text"
                      auto-complete="off"
                      placeholder="请输入任务项"
                    ></el-input>
                  </el-col>
                  <el-col :span="2">
                    <div><i class="el-icon-close" @click="closeCardListItemInput(item)"></i></div>
                  </el-col>
                </el-row>
              </div>
              <el-button
                size="medium"
                type="default"
                class="add_card_button"
                v-show="item.cardListItemTitleInputShow == null || item.cardListItemTitleInputShow==false"
                @click="showAddCardListItemInput(item)"
              ><span><i class="el-icon-plus"></i>添加任务项</span>
              </el-button>
              <el-button
                size="medium"
                v-show="item.cardListItemTitleInputShow == true"
                type="default"
                @click="saveCardListItem(idx, item)"
                class="add_card_button"><span><i class="el-icon-plus"></i>保存任务项</span>
              </el-button>
            </div>
          </el-row>

          <h3><i class="el-icon-news"></i> 活动</h3>
          <el-form ref="activityForm" :rules="activityRules" :model="activityForm">
            <el-form-item prop="description">
              <el-input type="textarea" v-model="activityForm.description" placeholder="请输入评论内容"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitActivityForm('activityForm')">保存</el-button>
              <el-button @click="resetActivityForm('activityForm')">重置</el-button>
            </el-form-item>
          </el-form>
          <el-row>
            <div class="block">
              <div v-for="(item, idx) in activityList" class="top">
                <el-row>
                  <el-col :span="2">
                    <div>
                      <span class="member ant-avatar-lg">
                        {{ item.createName}}
                      </span>
                    </div>
                  </el-col>
                  <el-col :span="22">
                    <div>{{ item.createName}}</div>
                    <div class="commentDesc card-description">{{item.description}}</div>
                    <div class="time"><time-diff :date="item.createTime"/></div>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div class="load-more mr-bottom" v-if="queryParams.pageSize * queryParams.pageNum < total" @click='loadMore'>---点击加载更多---</div>
          </el-row>
        </el-col>
        <el-col :span="5">
          <div class="list-button">
            <h3>添加到卡片</h3>
            <el-popover
              placement="left"
              width="230"
              v-model="addUserVisible">
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="addUserVisible = false">取消</el-button>
                <el-button type="default" size="mini" @click="submitSelectCardUser">确定</el-button>
              </div>
              <p>
                <el-select v-model="cardUserIds" multiple placeholder="请选择">
                  <el-option
                    v-for="item in boardSelectUserList"
                    :key="item.id"
                    :label="item.nickname"
                    :value="item.id">
                  </el-option>
                </el-select>
              </p>
              <el-button slot="reference" size="mini"><i class="el-icon-user"></i> 成员管理</el-button>
            </el-popover>

            <el-popover
              placement="left"
              width="230"
              v-model="addCardListVisible">
              <p>
                <el-input
                  v-model="cardListTitle"
                  type="text"
                  auto-complete="off"
                  placeholder="请输入清单标题"
                ></el-input>
              </p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="addCardListVisible = false">取消</el-button>
                <el-button type="default" size="mini" @click="submitCardList">确定</el-button>
              </div>
              <el-button slot="reference" size="mini"><i class="el-icon-notebook-2"></i> 添加清单</el-button>
            </el-popover>
            <el-popover
              placement="left"
              width="360"
              v-model="addTagVisible">
              <div>
                <el-checkbox-group v-model="checkboxTagGroup" size="small">
                  <el-tag
                    class="board-tags"
                    v-for="tag in tagList"
                    :disable-transitions="false"
                    :key="tag.id"
                    :color="tag.bgColor">
                    <el-checkbox :fill="tag.bgColor" :label="tag.id" :key="tag.id"
                                 @change="changeTag(tag)">{{ tag.tagName }}
                    </el-checkbox>
                  </el-tag>

                  <!--<el-checkbox v-for="tag in tagList" :label="tag.label" :key="tag.id" @change="changeTag(tag)"></el-checkbox>-->
                </el-checkbox-group>
                <!--<div>
                  <el-row>
                    <el-col :span="3">
                      <el-tooltip content="点击选择标签背景色" placement="bottom" effect="light">
                        <el-color-picker v-model="inputTagColor"></el-color-picker>
                      </el-tooltip>
                    </el-col>
                    <el-col :span="15">
                      <el-input
                        class="input-new-tag"
                        v-model="inputTagValue"
                        ref="saveTagInput"
                        size="small"
                        placeholder="请输入标签"
                        @keyup.enter.native="handleInputTagConfirm"
                        @blur="handleInputTagConfirm"
                      >
                      </el-input>
                    </el-col>
                    <el-col :span="6">
                      <el-button class="button-new-tag" size="small" @click="showInputTag">+ 新增</el-button>
                    </el-col>
                  </el-row>
                </div>-->
              </div>

              <div style="text-align: right; margin: 0">
                <!--<span style="float: left;">选择背景色和输入标签</span>-->
                <el-button size="mini" type="text" @click="addTagVisible = false">关闭</el-button>
              </div>
              <el-button slot="reference" size="mini" @click="showSelectTag"><i class="el-icon-collection-tag"></i> 添加标签
              </el-button>
            </el-popover>
            <el-button size="mini"><i class="el-icon-files"></i> 添加附件</el-button>

          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import {getBoard} from "@/api/board/board"
import {addBoardList, delBoardList, listBoardList, moveBoardList} from "@/api/board/boardList"
import {addCard, getCard, moveCard, updateCard, orderCard} from "@/api/board/card"
import {addBoardUser, queryUserList, updateBoardUser} from "@/api/board/boardUser"
import {batchUpdateCardUser} from "@/api/board/cardUser"
import {addCardList, checkCardList, delCardList, updateCardList, moveTaskList} from "@/api/board/cardList"
import {listCardActivity, addCardActivity, updateCardActivity} from "@/api/board/cardActivity";
import {listCustomer} from "@/api/customer"
import {listTag, addTag, updateTag, delTag} from "@/api/board/tag"
import {cardBindTags} from "@/api/board/cardTag"
import {Navbar} from "../layout/components";
import Draggable from 'vuedraggable'

export default {
  name: "Board",
  dicts: ["workspace_type", "view_range", "tag_bg_color"],
  components: {
    Navbar,
    Draggable
  },
  data() {
    return {
      list: [
        { name: "John", text: "", id: 0 },
        { name: "Joao", text: "", id: 1 },
        { name: "Jean", text: "", id: 2 }
      ],
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        boardListCardId: null
      },
      id: null,
      buttonLoading: null,
      title: null,
      cardTitle: null,
      drag: false,
      listBoardList: null,
      boardInfo: null,
      showBoardInput: false,
      timeStart: null,
      timeEnd: null,
      time: null,
      cardDetail: null,
      cardDetailDialogTableVisible: false,
      addUserVisible: false,
      addTagVisible: false,
      updateCardTitleVisible: false,
      updateCardDescriptionVisible: false,
      boardSelectUserList: null,
      cardUserIds: null,
      cardListTitle: null,
      addCardListVisible: null,
      addBoardUserVisible: null,
      cardListItemTitle: null,
      boardUserId: null,
      boardUserList: null,
      activityList: [],
      formCard: {},
      iconClass: "el-icon-circle-check",
      tagList: [],
      inputTagColor: '#ff9f1a',
      inputTagValue: '',
      checkboxTagGroup: [],
      drawerTag: false,
      rulesCard: {
        title: [
          {required: true, message: '请填写卡片标题', trigger: 'blur'},
          {min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur'}
        ]
      },
      formTag: {
        color: '#ff9f1a',
        title: ''
      },
      containerStyle: {
        "backgroundImage": "url('//image-qiniu.zuts.net/background/bg.svg')",
        "backgroundRepeat": "no-repeat",
        "backgroundPosition": "100%,100%",
        "backgroundSize": "cover",
        "backgroundAttachment": "fixed",
        "height": "100%",
        "width": "100%",
        "overflow": "auto"
      },
      activityForm: {
        description: ''
      },
      activityRules: {
        description: [
          {required: true, message: '请输入评论', trigger: 'blur'}
        ],
      }
    }
  },
  computed: {
    dragOptions() {
      return {
        id: null,
        title: null,
        cardTitle: null,
        drag: false,
        listBoardList: null,
        boardInfo: null,
        showBoardInput: false,
        timeStart: null,
        timeEnd: null,
        time: null,
        cardDetail: null,
        cardDetailDialogTableVisible: false,
        addUserVisible: false,
        addTagVisible: false,
        updateCardTitleVisible: false,
        updateCardDescriptionVisible: false,
        boardSelectUserList: null,
        cardUserIds: null,
        cardListTitle: null,
        addCardListVisible: null,
        addBoardUserVisible: null,
        cardListItemTitle: null,
        boardUserId: null,
        boardUserList: null,
        formCard: {},
        iconClass: "el-icon-circle-check",
        rulesCard: {
          title: [
            {required: true, message: '请填写卡片标题', trigger: 'blur'},
            {min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur'}
          ]
        },
        containerStyle: {
          "backgroundImage": "url('//image-qiniu.zuts.net/background/bg.svg')",
          "backgroundRepeat": "repeat",
          "backgroundPosition": "center",
          "backgroundSize": "cover",
          "height": "100%"
        },
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    }
  },
  created() {
    this.id = this.$route.params && this.$route.params.id;
    this.getBoardContent();
  },
  watch: {
    '$store.state.user.refreshBoardList'(newValue, oldValue) {
      this.getBoardContent();
    }
  },
  methods: {
    async submitActivityForm(formName) {
      let valid = await this.$refs[formName].validate();
      if (valid) {
        let data = {
          description: this.activityForm.description,
          boardListCardId: this.formCard.id,
          boardListId: this.formCard.boardListId,
          boardId: this.formCard.boardId,
          workspaceId: this.formCard.workspaceId
        }
        let res = await addCardActivity(data);
        this.flushActivityList(res.data);
      } else {
        return false;
      }
    },
    flushActivityList(data) {
      this.activityList.unshift(data);
      if (this.activityList.length > this.queryParams.pageSize) {
        this.activityList.pop();
      }
    },
    resetActivityForm(formName) {
      this.$refs[formName].resetFields();
    },
    selectTagBg(bgColor) {
      this.formTag.color = bgColor;
    },
    async showSelectTag() {
      this.checkboxTagGroup = [];
      await this.getTagList();
      let cardDetail = this.cardDetail;
      let cardTags = cardDetail.cardTags;
      if (cardTags && cardTags.length > 0) {
        for (let i = 0; i < cardTags.length; i++) {
          const caElement = cardTags[i];
          this.checkboxTagGroup.push(caElement.tagId);
        }
      }
    },
    async showTagDrawer() {
      this.drawerTag = true;
      await this.getTagList();
    },
    async getTagList() {
      let res = await listTag({
        pageSize: 10000,
        workspaceId: this.boardInfo.workspaceId,
        boardId: this.boardInfo.id
      });
      if (res.code == 200) {
        this.tagList = res.rows;
      } else {
        this.$message.error("获取标签列表失败，请重试！");
      }
    },
    cancelFormTag() {
      this.drawerTag = false;
    },
    handleTagClose(tag) {
      let self = this;
      delTag(tag.id).then(function () {
        self.tagList.splice(self.tagList.indexOf(tag), 1);
      });
    },
    submitFormTag(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.formTag)
          console.log(this.boardInfo)
          let formTag = this.formTag;
          formTag.workspaceId = this.boardInfo.workspaceId;
          formTag.boardId = this.boardInfo.id;
          formTag.tagName = this.formTag.title;
          formTag.bgColor = this.formTag.color;
          this.buttonLoading = true;
          if (formTag.id != null) {
            updateTag(formTag).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.getTagList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addTag(formTag).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.getTagList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          }
        }
      });
    },
    resetFormTag(formName) {
      this.$refs[formName].resetFields();
    },
    async saveCardItemInfo(inputText, data) {
      let result = await updateCardList(data);
      if (result.code == 200) {
      } else {
        this.$message.error("操作失败");
      }
    },
    async deleteCardListItem(idx, item, list) {
      let result = await delCardList(item.id);
      if (result.code == 200) {
        await this.viewCardDetail(item.boardListCardId);
      } else {
        this.$message.error("操作失败");
      }
    },
    async deleteCardList(idx, item) {
      let result = await delCardList(item.id);
      if (result.code == 200) {
        delete this.cardDetail.cardLists.splice(idx);
      } else {
        this.$message.error("操作失败");
      }
    },
    async handleSelectUser(item) {
      let result = await addBoardUser({
        boardId: this.boardInfo.id,
        workspaceId: this.boardInfo.workspaceId,
        userId: item.id
      });
      if (result.code == 200) {
        this.boardSelectUserList.push(result.data);
        this.addBoardUserVisible = false;
      } else {
        this.$message.error("操作失败");
      }
    },
    querySearchUser(queryString, cb) {
      if (queryString.length < 2) {
        return;
      }
      let that = this;
      listCustomer({
        username: queryString
      }).then(function (res) {
        if (res.code = 200) {
          that.boardUserList = res.data;
          that.boardUserList.forEach((element) => {
            element.value = element.username + (element.email ? '(' + element.email + ')' : '');
          });
          const results = queryString ? that.boardUserList.filter(that.createFilter(queryString)) : this.boardUserList;
          cb(results);
        }
      }).catch(err => err);
    },

    createFilter(queryString) {
      return name => (name.username.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
    },

    async deleteListBoardList(index, item) {
      let result = await delBoardList(item.id);
      if (result.code == 200) {
        this.listBoardList.splice(index);
      } else {
        this.$message.error("操作失败");
      }
    },
    async checkCardListItem(list) {
      if (list.checked == true) {
        list.status = 1;
      } else {
        list.status = 0;
      }
      let result = await checkCardList(list);
      if (result.code == 200) {
        // 重新加载detail
        await this.viewCardDetail(this.cardDetail.id);
      } else {
        this.$message.error("操作失败");
      }
    },
    // 显示清单任务项输入框
    showAddCardListItemInput(item) {
      item.cardListItemTitleInputShow = true;
    },
    // 保存清单任务项
    async saveCardListItem(idx, item) {
      if (!this.cardListItemTitle) {
        this.$message.error("请输入任务项");
        return;
      }
      let data = {
        parentId: item.id,
        checked: false,
        title: this.cardListItemTitle,
        workspaceId: this.cardDetail.workspaceId,
        boardId: this.cardDetail.boardId,
        boardListId: this.cardDetail.boardListId,
        boardListCardId: this.cardDetail.id,
      };
      let result = await addCardList(data);
      if (result.code == 200) {
        if (item.children == null) {
          item.children = [];
        }
        item.children.push(result.data);
        item.cardListItemTitleInputShow = false;
        this.cardListItemTitle = "";
        // 重新加载detail
        await this.viewCardDetail(this.cardDetail.id);
        //this.flushActivityList(res.data);
      } else {
        this.$message.error("保存任务项失败");
      }
    },
    // 隐藏卡片输入框
    closeCardListItemInput: function (item) {
      item.cardListItemTitleInputShow = false;
      this.cardListItemTitle = "";
    },
    // 添加清单
    async submitCardList() {
      let result = await addCardList({
        parentId: 0,
        checked: false,
        title: this.cardListTitle,
        workspaceId: this.cardDetail.workspaceId,
        boardId: this.cardDetail.boardId,
        boardListId: this.cardDetail.boardListId,
        boardListCardId: this.cardDetail.id,
      });
      if (result.code == 200) {
        /*if (!this.cardDetail.cardLists) {
          this.cardDetail.cardLists == [];
        }
        this.cardDetail.cardLists.push(result.data);*/
        await this.viewCardDetail(this.cardDetail.id);
        this.addCardListVisible = false;
        this.cardListTitle = null;
      } else {
        this.$message.error("操作成功");
      }
    },
    // 添加人员到卡片
    async submitSelectCardUser() {
      let result = await batchUpdateCardUser({
        userIds: this.cardUserIds,
        workspaceId: this.cardDetail.workspaceId,
        boardId: this.cardDetail.boardId,
        boardListId: this.cardDetail.boardListId,
        boardListCardId: this.cardDetail.id,
      });
      if (result.code == 200) {
        this.formCard.cardUsers = result.data;
        this.cardDetail.cardUsers = result.data;
        this.addUserVisible = false;
        await this.getListBoardList();
      } else {
        this.$message.error("操作失败");
      }
    },
    // 查询"添加成员"列表
    async querySelectUserList() {
      let result = await queryUserList({
        boardId: this.boardInfo.id,
        workspaceId: this.boardInfo.workspaceId,
      });
      if (result.code == 200) {
        this.boardSelectUserList = result.data;
      }
    },
    // 打星操作
    async starBoard() {
      let result = null;
      if (!this.boardInfo.boardUser) {
        result = await addBoardUser({
          boardId: this.boardInfo.id,
          workspaceId: this.boardInfo.workspaceId,
          star: 1
        });

      } else {
        let star = this.boardInfo.boardUser.star;
        if (star == 1) {
          star = 2;
        } else if (star == 2) {
          star = 1;
        }
        this.boardInfo.boardUser.star = star;
        result = await updateBoardUser(this.boardInfo.boardUser);
      }
      if (result.code == 200) {
        this.boardInfo.boardUser = result.data;
      } else {
        this.$message.error("加星失败")
      }
    },
    //鼠标弹起的事件。
    onUpTd(e) {
      //如果按下时间不到1000毫秒便弹起，
      clearInterval(this.time);
    },
    //鼠标按下的事件。
    onDownTd(e) {
      let self = this;
      //获取鼠标按下时的时间
      this.timeStart = new Date().getTime();
      //setInterval会每100毫秒执行一次
      this.time = setInterval(function () {
        //也就是每100毫秒获取一次时间
        this.timeEnd = new Date().getTime();
        //如果此时检测到的时间与第一次获取的时间差有1000毫秒
        if (this.timeEnd - self.timeStart > 1000) {
          //便不再继续重复此函数 （clearInterval取消周期性执行）
          clearInterval(self.time);
          //并弹出代码
          console.log("=====长按========");
        }
      }, 100);
    },
    // 查看卡片详情
    async viewCardDetail(id) {
      //this.cardDetail = null;
      //this.activityList = [];
      //this.formCard = null;
      let result = await getCard(id);
      this.cardDetail = result.data;
      this.cardDetailDialogTableVisible = true;
      this.formCard = result.data;
      this.cardUserIds = [];
      let users = this.formCard.cardUsers && this.formCard.cardUsers.length > 0 ? this.formCard.cardUsers : [];
      if (users.length > 0) {
        for (let i = 0; i < users.length; i++) {
          const user = users[i];
          this.cardUserIds.push(user.userId);
        }
      }
      await this.getCardActivity();
    },
    async getCardActivity() {
      this.queryParams.boardListCardId = this.cardDetail.id;
      let activityList = await listCardActivity(this.queryParams);
      this.activityList = this.activityList.concat(activityList.rows);
      this.total = activityList.total;
      this.loading = false;
    },
    async loadMore() {
      this.queryParams.pageNum = this.queryParams.pageNum+1;
      await this.getCardActivity();
    },
    // 保存卡片信息
    async saveAutoCardInfo(input) {
      console.log(">>>>>this.formCard>>>>>>>>>", this.formCard)
      console.log(">>>>>this.formCard>>>>>>>>>", this.cardDetail[input])
      console.log(">>>>>this.formCard>>>>>>>>>", this.formCard[input])
      //if (this.cardDetail[input] != this.formCard[input]) {
      let result = await updateCard(this.formCard);
      if (result.code == 200) {
        this.cardDetail.title = this.formCard.title;
        this.cardDetail.description = this.formCard.description;
        this.cardDetail.startTime = this.formCard.startTime;
        this.cardDetail.endTime = this.formCard.endTime;
        if (input == 'description') {
          this.updateCardDescriptionVisible = false;
        } else if (input == 'title') {
          this.updateCardTitleVisible = false;
        }
      } else {
        this.$message.error("保存失败");
      }
      //}
    },
    // 显示卡片标题输入框
    showAddCardInput(item) {
      item.cardTitleInputShow = true;
    },
    // 保存卡片标题
    async saveCard(item) {
      if (!this.cardTitle) {
        this.$message.error("请输入卡片标题");
        return;
      }
      let data = {
        boardId: item.boardId,
        boardListId: item.id,
        title: this.cardTitle,
        workspaceId: item.workspaceId
      };
      let result = await addCard(data);
      if (result.code == 200) {
        if (item.cards == null) {
          item.cards = [];
        }
        item.cards.push(result.data);
        item.cardTitleInputShow = false;
        this.cardTitle = "";
      } else {
        this.$message.error("保存卡片失败");
      }
    },
    // 隐藏卡片输入框
    closeCardInput: function (item) {
      item.cardTitleInputShow = false;
      this.cardTitle = "";
    },
    // 获取看版信息
    async getBoardContent() {
      await this.getBoardInfo();
      if (this.boardInfo.defaultColor) {
        this.containerStyle.backgroundColor = this.boardInfo.defaultColor;
      }
      if (this.boardInfo.backgroundImage) {
        this.containerStyle.backgroundImage = "url('" + this.boardInfo.backgroundImage + "')";
        console.log(this.containerStyle)
      }
      await this.getListBoardList();
      this.showBoardInput = true;
      await this.querySelectUserList();
    },
    async getBoardInfo() {
      let data = await getBoard(this.id);
      this.boardInfo = data.data;
    },
    async getListBoardList() {
      let data2 = await listBoardList({
        boardId: this.boardInfo.id,
        workspaceId: this.boardInfo.workspaceId,
      });
      this.listBoardList = data2.rows;
    },
    async endBoardDrag(evt, item) {
      this.drag = false;
      const data = item.map((obj, index) => {
          return {id: obj.id, level: index};
      });
      await moveBoardList(data);
    },
    async endCardDrag(evt, item) {
      this.drag = false;
      let data = JSON.parse(evt.item.dataset.item);
      let newBoardListId = evt.to.dataset.index;
      if (data.boardListId != newBoardListId) {
        data.boardListId = newBoardListId;
        await moveCard(data);
      } else {
        const data = item.map((obj, index) => {
          return {id: obj.id, level: index};
        });
        await orderCard(data);
      }
    },
    async taskListEnd(evt, item){
      this.drag = false;
      const data = item.map((obj, index) => {
        return {id: obj.id, level: index};
      });
      await moveTaskList(data);
    },
    // 添加看版列表
    async addBoardList() {
      if (!this.title) {
        this.$message.error("请填写标题");
        return;
      }
      let result = await addBoardList({
        boardId: this.boardInfo.id,
        workspaceId: this.boardInfo.workspaceId,
        title: this.title
      });
      if (result.code == 200) {
        if (this.listBoardList == null) {
          this.listBoardList = [];
        }
        this.listBoardList.push(result.data);
        this.title = null;
      } else {
        this.$message.error("操作失败");
      }
    },

    showInputTag() {
      let inputTagColor = this.inputTagColor;
      let inputTagValue = this.inputTagValue;
      this.$nextTick(_ => {
        // 保存
        console.log(inputTagColor)
        console.log(inputTagValue)
      });
    },

    handleInputTagConfirm() {
      let inputTagColor = this.inputTagColor;
      let inputTagValue = this.inputTagValue;
      if (inputTagValue) {
        this.tagList.push(inputTagValue);
      }
      this.inputTagColor = '#ff9f1a';
      this.inputTagValue = '';
    },
    async changeTag(tag) {
      console.log(this.cardDetail)
      console.log(this.checkboxTagGroup)
      let result = await cardBindTags({
        boardListCardId: this.cardDetail.id,
        tagsId: this.checkboxTagGroup
      });
      if (result.code == 200) {
        //self.cardDetail.cardTags = result.data;
        await this.viewCardDetail(this.cardDetail.id);
        this.getListBoardList();
      } else {
        this.$message.error("操作失败");
      }
    },
    updateBoard() {
      this.$store.dispatch("updateBoard", JSON.stringify(this.boardInfo));
    },
  }
};
</script>

<style lang="scss">
.app-container {
  padding: 0px;
}

.el-dialog {

}

.el-avatar {
  background: #1890ff;
}

.section {
  height: auto;
  margin-left: 10px;
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  width: max-content;
}

.section .item-detail .dialog {
  padding: 20px;
}

.section .item-detail .dialog li {
  margin-bottom: 10px;
}

.section .item-detail .dialog .img-pre {
  width: 50px;
  height: 50px;
  float: left;
  margin-right: 10px;
}

.section .item-detail .dialog .add-img-btn {
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background: #dedede;
  float: left;
}

.section .item-detail .dialog .add-img-btn i {
  color: #fff;
  font-size: 24px;
}

.section .item-detail .dialog .file-input {
  display: none;
}

#list {
  height: 100%;
  margin-top: 10px;
}

.new-item div i {
  cursor: pointer;
}

.new-item {
  padding: 10px;
}

#list .list-group {
  float: left;
  width: 240px;
  height: 100%;
  margin-right: 20px;
  display: flex;
  flex-direction: column;
  background-color: #ebecf0;
  border-radius: 3px;
  box-sizing: border-box;
  max-height: 100%;
  position: relative;
  white-space: normal;
}

#list .list-group .list-title {
  line-height: 30px;
  font-size: 14px;
  font-weight: 700;
  padding: 10px 10px 0px 10px;
}

#list .list-group .list-title .add-item {
  float: right;
  cursor: pointer;
  text-align: right;
  width: 20px;
}

#list .list-group .list-title .add-item:after {
  content: '';
  display: block;
  width: 80px;
}

#list .list-group .draggable {
  flex: 1;
  padding: 0px 10px 0px 10px;
  min-height: 20px;
}

#list .list-group .draggable > span {
  display: block;
  height: 100%;
}

#list .list-group .draggable.active {
  box-shadow: 0px 0px 2px #10af7e;
}

#list .list-group .draggable .draggable-item {
  margin-bottom: 8px;
}

.draggable-item .item:hover {
  opacity: 0.8;
  .card-more {
    visibility: visible;
  }
}
.draggable-item:hover {
  .card-more {
    visibility: visible;
  }
}

#list .flip-list-move {
  transition: transform 0.5s;
}

#list .no-move {
  transition: transform 0s;
}

#list .ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.item {
  white-space: normal;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  padding: 10px;
  font-size: 14px;
  position: relative;
  overflow: hidden;
}

.item.level:before {
  position: absolute;
  content: '';
  display: inline-block;
  width: 5px;
  height: 100%;
  left: 0;
  top: 0;
  transition: width 0.3s;
}

.item.level1:before {
  background: #ffad32;
}

.item.level2:before {
  background: #f42;
}

.item:hover.level0:before {
  background: #ccc;
}

.item:hover.level:before {
  width: 10px;
}

.sortable-chosen {
  transform: rotate(2deg);
  -ms-transform: rotate(2deg); /* Internet Explorer */
  -moz-transform: rotate(2deg); /* Firefox */
  -webkit-transform: rotate(2deg); /* Safari 和 Chrome */
  -o-transform: rotate(2deg); /* Opera */
}

.list-button {
  padding: 0 16px 8px 8px;
  width: 100%;
  z-index: 10;
  text-align: left;
}

.list-button button {
  background-color: #091e420a;
  border: none;
  border-radius: 3px;
  box-shadow: none;
  box-sizing: border-box;
  cursor: pointer;
  display: block;
  height: 32px;
  margin-top: 8px;
  max-width: 300px;
  overflow: hidden;
  padding: 6px 12px;
  position: relative;
  text-decoration: none;
  text-overflow: ellipsis;
  transition-duration: 85ms;
  transition-property: background-color, border-color, box-shadow;
  transition-timing-function: ease;
  -webkit-user-select: none;
  user-select: none;
  white-space: nowrap;
}

.card-main-col {
  margin: 0;
  min-height: 24px;
  padding: 0 8px 8px 16px;
  position: relative;
  width: 100%;
  z-index: 0;
}

.checkList {

}

.checkList .is-checked span.el-checkbox__label {
  text-decoration: line-through;
  color: #5e6c84;
}

.card-main-col h3 {
  font-weight: bold;
}

.add_card_button {
  width: 100%;
  margin-top: 4px;
  padding-left: 6px !important;
  border: 0px;
  background: none;
  text-align: left;
  padding-left: 0px;
}

.list-group .add_card_button {
  padding-left: 10px !important;
  margin-left: 0;
}

.el-input__inner {
}

.el-textarea__inner {
  background-color: #091e420a;
  border: 0px !important;
  font-size: 16px !important;
}

.el-dialog__body {
  padding-top: 0px;
}

.user-info, .card-tags, .card-end-time {
  display: inline-block;
  margin-right: 10px;
  float: left;
}

.description-cell {
  clear: both;
}

.user-cell {
  display: inline-block;
}

.board-navbar-item div, .board-navbar-item button, .board-navbar-item span {
  display: inline-block;
  float: left;
}

.user-range {
  margin-left: 0px;
}

.user-range .user-item {
  margin-right: -5px;
  cursor: pointer;
}
.user-item .el-avatar {
  border: 1px solid;
  font-size: 11px;
}
.board-navbar-item {
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 10px;
}

.board-header-btn-divider {
  border-left: 1px solid #3939393d;
  float: left;
  height: 16px;
  margin: 8px 8px 12px 8px;
}

.checklist-card-item {
  border-radius: 3px;
  clear: both;
  padding: 0px 6px;
  position: relative;
  transform-origin: left bottom;
  transition-duration: .14s;
  transition-property: transform, opacity, height, padding, margin;
  transition-timing-function: ease-in;
}

.checklist-card-item:hover {
  background-color: #f7f7f7;
}

.member {
  background-color: #1890ff;
  border-radius: 25em;
  color: #fff;
  cursor: pointer;
  display: block;
  font-size: 10px;
  float: left;
  height: 32px;
  margin: 0 -5px 4px 0;
  overflow: hidden;
  position: relative;
  text-decoration: none;
  -webkit-user-select: none;
  user-select: none;
  width: 32px;
  z-index: 0;
  line-height: 32px;
  border: 1px solid #fff;
}

.checklist-card-item .div-edit {
  padding-left: 5px;
}

.icon-delete {
  float: right;
  line-height: 40px;
}

.checklist-card-item .icon-delete {
  display: none;
}

.checklist-card-item:hover .icon-delete {
  display: block;
}

.check-item-h3 {
  margin-bottom: 0px;
}

.underline div {
  text-decoration: line-through;
}

.phenom-creator, .phenom-icon {
  height: 32px;
  left: -40px;
  position: absolute;
  top: 8px;
  width: 32px;
}

.phenom {
  margin-left: 40px;
  min-height: 32px;
  padding: 8px 0;
  position: relative;
}

.phenom-meta {
  font-size: 12px;
  margin: 0;
  min-width: 110px;
  color: #5e6c84;
}

.member-initials {
  display: block;
  font-size: 12px;
  font-weight: 700;
  height: 32px;
  left: 0;
  line-height: 32px;
  overflow: hidden;
  position: absolute;
  text-align: center;
  top: 0;
  width: 100%;
}

.row-item {
  display: inline-flex;
  padding-right: 10px;
  line-height: 15px;
}

.row-item2 {
  float: right;
}
.row-taskCount{
  padding-top: 10px;
}

.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  vertical-align: bottom;
}

.board-tags i {
  float: right;
}

.board-tags {
  width: 100%;
  margin-left: 0px !important;
  margin-bottom: 10px;
  color: white;
  height: 32px;
  border: none;
  line-height: 32px;
}

.board-tags2 {
  color: white;
  height: 32px;
  border: none;
  line-height: 32px;
}

.tag-drawer__content {
  padding: 10px;
}

.tag-drawer__footer {
  text-align: center;
}

.el-checkbox__label {
  color: white;
}

.el-checkbox__input.is-checked + .el-checkbox__label {
  color: white;
}

.titleContent .div-text {
  font-size: 16px !important;
}

.board-tags .el-icon-close {
  padding-top: 10px;
}

.card-label {
  float: left;
  font-size: 12px;
  font-weight: 700;
  height: 8px;
  line-height: 100px;
  margin: 0 0px 8px 0;
  max-width: 40px;
  min-width: 40px;
  padding: 0;
  text-shadow: none;
  width: auto;
}
.is-due-past {
  background-color: #ec9488;
  border-radius: 3px;
  color: #fff;
  display: inline-block;
  padding: 4px;
  margin: 6px 0px;
}
.el-checkbox__inner{
  margin-left: 3px;
  margin-right: 3px;
}
.handle{
  cursor: pointer;
}

.card-description {
  margin-bottom: 14px;
  background-color: var(--ds-background-neutral, #091e420f);
  box-shadow: none;
  border: none;
  font-weight: 500;
  border-radius: 3px;
  color: var(--ds-text, #172b4d);
  padding: 8px 12px;
  min-height: 40px;
  width: 100%;
}

.card-description2 {
  min-height: 90px;
}

.commentDesc {
  margin-bottom: 5px;
  font-size: 14px;
  white-space: pre-wrap;
  font-weight: 500;
  color: rgba(3, 14, 44, 0.85);
  user-select: text;
  word-break:break-all;
  word-wrap:break-word
}
.ant-avatar-lg {
  line-height: 40px;
  width: 40px;
  height: 40px;
  text-align: center;
  color: rgba(3, 14, 44, 0.85);
  background-color: var(--ds-background-neutral, #091e420f);
}
.top .time {
  font-weight: 400;
  color: rgba(3, 14, 44, 0.45);
  font-size: 14px;
}
.top {
  margin-bottom: 16px;
}
.draggable-item {
  position: relative;
}
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
