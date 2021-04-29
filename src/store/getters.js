const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  group: state => state.user.group,
  buttons: state => state.user.buttons,
  permission_routes: state => state.permission.routes,
  router_path_arr: state => state.permission.router_path_arr,
}
export default getters
