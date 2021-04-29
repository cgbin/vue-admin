/**
 * xiegaolei
 */
import { objectMerge } from '@/utils'

// 递归格式化成多维数组
function listToTreeMulti(list, root = 0, pk = 'id', pid = 'pid', child = 'children', other = null) {
  const tree = []
  if (list) {
    list.forEach(item => {
      if (item[pid] === root) {
        if (other !== null) {
          item = objectMerge(item, other)
        }
        const children = listToTreeMulti(list, item[pk], pk, pid, child, other)
        if (children.length) {
          item[child] = children
        }
        tree.push(item)
      }
    })
  }
  return tree
}



//递归获取无子级权限数组
function getRoleAuthListData(node , selected_arr = []  , arr = []) {

  if(node){
    node.forEach(item => {
      //不存在子节点，则为选中的最后一级节点
      if((item.children.length === 0) && (selected_arr.indexOf(item.id) > -1)){
        return arr.push(item.id);
      }
      this.getRoleAuthListData(item.children, selected_arr, arr);
    });
  }
}

function getParentsId(list, id , tree) {
  if (list) {
    list.forEach(item => {
      if (item['id'] === id) {
        if(item['pid'] > 0){
          tree.unshift(item['pid'])
        }
        getParentsId(list, item['pid'], tree)
      }
    })
  }
  return tree
}

// 递归修改值
function upadteArr(arr, attr, val, source) {
  if (arr) {
    arr.map(item => {
      if (item[attr] === val) {
        objectMerge(item, source)
      } else {
        upadteArr(item.children, attr, val, source)
      }
    })
  }

  return arr
}

const tree = {
  listToTreeMulti,
  getParentsId,
  upadteArr,
  getRoleAuthListData
}

export default tree

