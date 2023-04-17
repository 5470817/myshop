<template>
  <!-- 面包屑导航 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>分类参数</el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 卡片视图 -->
  <el-card>
    <!-- 顶部提示 -->
    <el-alert title="注意：只允许为第三极分类设置相关参数" type="warning" :closable="false" show-icon />
    <!-- 选择分类 -->
    <span>选择商品分类：</span>
    <el-cascader v-model="selectedCataKeys" :options="cateList" :props="cateProps" @change="handleChange" />
  </el-card>
  <el-tabs v-model="choosename" class="demo-tabs" @tab-click="handleTabClick">
    <!-- 动态参数页签内容 -->
    <el-tab-pane label="动态参数" name="many">
      <el-button type="primary" ref="buttonRef" :disabled="this.selectedCataKeys.length === 0 ? true : false"
        >添加参数</el-button
      >
    </el-tab-pane>
    <!-- 静态属性页签内容 -->
    <el-tab-pane label="静态属性" name="only">
      <el-button type="primary" ref="buttonRef" :disabled="this.selectedCataKeys.length === 0 ? true : false"
        >添加属性</el-button
      >
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类列表
      cateList: [],
      // 级联选择的配置
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      // 级联选择框绑定的数据
      selectedCataKeys: [],
      // 默认页签显示内容
      choosename: 'many',
    }
  },
  methods: {
    // 获取商品分类
    async getCate() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return ElMessage.error('获取分类信息失败')
      }
      this.cateList = res.data
    },
    // 级联选择变化时
    async handleChange() {
      console.log(this.choosename)
      // console.log(this.selectedCataKeys.length)
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: { sel: this.choosename },
      })
      if (res.meta.status !== 200) {
        return ElMessage.error('获取参数列表失败')
      }
      console.log(res)
    },
    // 页签变化时
    handleTabClick() {},
  },
  mounted() {
    this.getCate()
  },
  computed: {
    cateId() {
      if (this.selectedCataKeys.length !== 0) {
        return this.selectedCataKeys.length - 1
      } else {
        return null
      }
    },
  },
}
</script>

<style scoped>
.el-alert {
  margin-bottom: 10px;
}
</style>
