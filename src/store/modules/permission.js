import { constantRoutes } from '@/router'

const state = {
  routes: [],
  addRoutes: [],
  router_path_arr:[]
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_ROUTE_PATH_ARR:(state, routes_arr) => {
    state.router_path_arr = routes_arr
  },
}

const actions = {
  generateRoutes({ commit }, data) {
    return new Promise(resolve => {
      const accessedRouters = data
      const router_path_arr = []
      accessedRouters.map(function(item) {
        //一级菜单组件默认layout，数据库中组件字段无需配置
        item.component = (resolve) => require(['./../../layout'], resolve)
        router_path_arr.push(item.path) //设置权限路由数组
        if(item.children){
          item.children.map(function(child) {
            router_path_arr.push(child.path)  //设置权限路由数组
            //二级菜单下如果无子菜单，数据库组件字段值=view下文件夹名称+'/'+vue文件名称，如果有三级菜单，二级菜单组件默认layout，数据库中组件字段无需配置
            const child_component = child.component
            if(child_component){
              child.component = (resolve) => require([`./../../views/${child_component}`], resolve)
            }else{
              child.component = (resolve) => require(['./../../layout'], resolve)
            }
            if(child.children){
              //最多三级级菜单，数据库组件字段值=view下一级文件夹名称+'/'+二级文件夹名称+'/'+vue文件名称
              child.children.map(function(children) {
                router_path_arr.push(children.path)  //设置权限路由数组
                const children_component = children.component
                children.component = (resolve) => require([`./../../views/${children_component}`], resolve)
              })
            }  
          })
        }
      })

      accessedRouters.push({ path: '*', redirect: '/404', hidden: true })
      commit('SET_ROUTES', accessedRouters)
      commit('SET_ROUTE_PATH_ARR', router_path_arr)
      resolve(accessedRouters)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
