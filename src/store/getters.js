const getters = {
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  user: state => state.user.user,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,
  createWorkspaceStatus: state => state.user.createWorkspaceStatus,
  createBoardStatus: state => state.user.createBoardStatus,
  updateBoardStatus: state => state.user.updateBoardStatus,
  refreshBoardList: state => state.user.refreshBoardList,
  refreshWorkspaceList: state => state.user.refreshWorkspaceList
}
export default getters
