import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    createWorkspaceStatus: false,
    createBoardStatus: false,
    updateBoardStatus: {},
    refreshBoardList: false,
    refreshWorkspaceList: false,
    name: '',
    avatar: '',
    roles: [],
    permissions: [],
    user: {}
  },

  mutations: {
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_CREATE_WORKSPACE: (state, createWorkspaceStatus) => {
      state.createWorkspaceStatus = createWorkspaceStatus
    },
    SET_CREATE_BOARD: (state, createBoardStatus) => {
      state.createBoardStatus = createBoardStatus
    },
    SET_UPDATE_BOARD: (state, updateBoardStatus) => {
      state.updateBoardStatus = updateBoardStatus
    },
    SET_REFRESH_WORKSPACE_LIST: (state, refreshWorkspaceList) => {
      state.refreshWorkspaceList = refreshWorkspaceList
    },
    SET_REFRESH_BOARD_LIST: (state, refreshBoardList) => {
      state.refreshBoardList = refreshBoardList
    }
  },
  actions: {
    refreshWorkspaceList({ commit }, refreshWorkspaceList) {
      commit('SET_REFRESH_WORKSPACE_LIST', refreshWorkspaceList)
    },
    refreshBoardList({ commit }, refreshBoardList) {
      commit('SET_REFRESH_BOARD_LIST', refreshBoardList)
    },
    createWorkspace({ commit }, createWorkspaceStatus) {
      commit('SET_CREATE_WORKSPACE', createWorkspaceStatus)
    },
    createBoard({ commit }, createBoardStatus) {
      commit('SET_CREATE_BOARD', createBoardStatus)
    },
    updateBoard({ commit }, updateBoardStatus) {
      commit('SET_UPDATE_BOARD', updateBoardStatus)
    },
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid).then(res => {
          setToken(res.token)
          commit('SET_TOKEN', res.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          const user = res.data
          const avatar = user.avatar == "" ? "//image-qiniu.zuts.net/background/profile.jpg" : user.avatar;
          commit('SET_USER', user)
          commit('SET_NAME', user.nickName)
          commit('SET_AVATAR', avatar)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_USER', {})
          commit('SET_PERMISSIONS', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
