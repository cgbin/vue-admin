import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const buttons = store.getters && store.getters.buttons

    // if (value && value instanceof Array && value.length > 0) {
    if (value) {
      const permissionRoles = value

      // const hasPermission = roles.some(role => {
      //   return permissionRoles.includes(role)
      // })
      const hasPermission = buttons.some(buttons => {
        return permissionRoles === buttons;
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      // throw new Error(`need roles! Like v-permission="['admin','editor']"`)
      throw new Error(`need roles! Like v-permission="'article/blog/eidit'`)
    }
  }
}
