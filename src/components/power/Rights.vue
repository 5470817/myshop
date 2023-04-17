<template>
  <!-- 面包屑导航 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>权限列表</el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 卡片视图 -->
  <el-card>
    <!-- 表格主体部分 -->
    <el-table :data="rightsList" style="width: 100%" stripe border>
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="authName" label="权限名称" />
      <el-table-column prop="path" label="路径" />
      <el-table-column prop="level" label="权限等级">
        <template v-slot="scope">
          <el-tag v-if="scope.row.level === '0'">一级权限 </el-tag>
          <el-tag type="success" v-else-if="scope.row.level === '1'">二级权限</el-tag>
          <el-tag type="warning" v-else>三级权限</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  name: 'Rights',
  data() {
    return {
      rightsList: [],
      num: 2,
    }
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get(`rights/list`)
      if (res.meta.status !== 200) {
        ElMessage.error('获取权限列表失败')
      } else {
        this.rightsList = res.data
      }
    },
  },
  mounted() {
    this.getRightsList()
  },
}
</script>

<style scoped></style>
