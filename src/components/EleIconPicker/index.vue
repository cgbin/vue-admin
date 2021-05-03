<template>
<el-tabs :style="{'width':tabsWidth}">
    <el-tab-pane label="线框">
        <el-scrollbar :style="{'height':scrollbarHeight}" wrap-class="tree-scrollbar-wrapper"> 
          <el-row >
          <el-col class="icon-select" :span="4" v-for="(item,i) in getfonts.xiankuang" :key="i" >
            <el-card shadow="hover" :title="item.name">
              <div class="ele-icon-picker-item" @click="iconSelect(item)">
                <i :class="item.name"></i>
              </div>  
            </el-card>
          </el-col>
        </el-row>
        </el-scrollbar>
    </el-tab-pane>
    <el-tab-pane label="实心">
      <el-scrollbar :style="{'height':scrollbarHeight}" wrap-class="tree-scrollbar-wrapper"> 
          <el-row >
          <el-col class="icon-select" :span="4" v-for="(item,i) in getfonts.shixin" :key="i" >
            <el-card shadow="hover" :title="item.name">
              <div class="ele-icon-picker-item" @click="iconSelect(item)">
                <i :class="item.name" ></i>
              </div>  
            </el-card>
          </el-col>
        </el-row>
        </el-scrollbar>
    </el-tab-pane>
    <el-tab-pane label="svg">
        <el-scrollbar :style="{'height':scrollbarHeight}" wrap-class="tree-scrollbar-wrapper"> 
          <el-row >
          <el-col class="icon-select" :span="4" v-for="(item,i) in getfonts.svg" :key="i" >
            <el-card shadow="hover" :title="item.name">
              <div class="ele-icon-picker-item" @click="iconSelect(item)">
                <icon-item :icon="item.name" />
              </div>  
            </el-card>
          </el-col>
        </el-row>
        </el-scrollbar>
    </el-tab-pane>
  </el-tabs>        
</template>

<script>

import fontjson from '@/icons/font.json'
import IconItem from '@/layout/components/Sidebar/Item'

export default {
  name: 'EleIconPicker',
  props: {
    tabsWidth: {
      type: String,
      default(){
        return '350px'
      }
    },
    scrollbarHeight: {
      type: String,
      default(){
        return '225px'
      }
    }
  },
  components:{IconItem},
  computed: {
    getfonts(name) {
      return fontjson
    },
  },
  methods:{
        //选择图标
    iconSelect(item) {
      this.$emit('iconSelect',item.name);  
		},
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" >
.el-popper .el-tabs{
  margin: 0px 10px;
}
.el-popper .el-card__body{
    padding: 0;
}
.el-popper .el-card {
    margin: 10px 12px 0 0;
}
.el-popper .ele-icon-picker-item {
    display: block;
    padding: 8px 0;
    font-size: 20px;
    text-align: center;
    transition: transform .1s;
    cursor: pointer;
}
.el-popper .ele-icon-picker-item:hover {
    transform: scale(1.5);
}
.el-popper {
    background: #fff;
    min-width: 150px;
    border-radius: 4px;
    border: 1px solid #ededed;
    padding: 12px;
    z-index: 2000;
    color: #595959;
    line-height: 1.4;
    text-align: justify;
    font-size: 14px;
    word-break: break-all;
}
</style>
