<template>
  <!-- 面包屑导航 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品分类</el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 卡片视图 -->
  <el-card>
    <!-- 添加分类按钮 -->
    <el-button type="primary">添加分类</el-button>

    <!-- 表格主体 -->
    <!-- <tree-table :data="cateList"></tree-table> -->
    <el-table :data="cateList" style="width: 100%">
      <el-table-column type="index" label="序号" width="80"> </el-table-column>
      <el-table-column prop="cat_name" label="分类名称" width="180">
        <!-- <el-tree :data="cateList" :props="defaultProps" /> -->
      </el-table-column>
      <!-- 分类是否有效，有效则显示绿色，无效显示红色 -->
      <el-table-column prop="cat_deleted" label="是否有效" width="180">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-icon color="lightgreen" v-if="scope.row.cat_deleted === false"><SuccessFilled /></el-icon>
            <el-icon v-else color="red"><CircleCloseFilled /></el-icon>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="cat_level" label="排序" width="180">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280">
        <template #default="scope">
          <el-button type="primary" icon="Edit"> 编辑</el-button>
          <el-button type="danger" icon="Delete"> 删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="pageObj.pagenum"
      v-model:page-size="pageObj.pagesize"
      :page-sizes="[1, 5, 10, 20, 30]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      // 获取到的商品分类
      cateList: [],
      // 查询条件
      pageObj: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      total: 0, //分类总数据条数，默认为0
      defaultProps: {
        children: 'children',
        label: 'cat_name',
      },
    }
  },
  methods: {
    // 获取商品分类信息
    async getCategories() {
      const { data: res } = await this.$http.get('categories', { params: this.pageObj })
      if (res.meta.status !== 200) {
        return ElMessage.error('获取商品分类失败')
      }
      // console.log(res)
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 监听pegesize改变
    handleSizeChange(newsize) {
      this.pageObj.pagesize = newsize
      this.getCategories()
    },
    // 监听pagenum改变
    handleCurrentChange(newnum) {
      // console.log()
      this.pageObj.pagenum = newnum
      this.getCategories()
    },
  },
  created() {
    this.getCategories()
  },
}
</script>
