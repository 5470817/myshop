<template>
  <!-- 面包屑导航 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品列表</el-breadcrumb-item>
  </el-breadcrumb>

  <el-card>
    <!-- 输入框和添加按钮 -->
    <div class="mt-4">
      <el-input
        v-model="pageObj.query"
        placeholder="请输入内容"
        size="large"
        @keyup.enter="getGoodsList"
        clearable
        @clear="getGoodsList"
      >
        <template #append>
          <el-button icon="Search" @click="getGoodsList" />
        </template>
      </el-input>
      <el-button type="primary" size="large" @click="goAddPage">添加商品</el-button>
    </div>
    <!-- 商品表格区域 -->
    <el-table :data="goodsList" border stripe style="width: 100%">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="goods_name" label="商品名称" />
      <el-table-column prop="goods_price" label="商品价格(元)" width="115" />
      <el-table-column prop="goods_weight" label="商品重量" width="100" />
      <el-table-column prop="add_time" label="创建时间" width="160">
        <template #default="scope">
          <!-- 显示的时间一致 -->
          {{ scope.row.add_time }} <br />
          {{ getDate(scope.row.add_time) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button type="primary" icon="Edit"></el-button>
          <el-button type="danger" icon="Delete" @click="removeById(scope.row.goods_id)"> </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      v-model:current-page="pageObj.pagenum"
      v-model:page-size="pageObj.pagesize"
      :page-sizes="[5, 10, 20, 30, 40, 50]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
</template>

<script>
import moment from 'moment'
export default {
  data() {
    return {
      // 获取商品列表所需要用到的参数
      pageObj: {
        qurey: '',
        pagenum: 1,
        pagesize: 5,
      },
      // 总商品数量
      total: 0,
      goodsList: [],
    }
  },
  methods: {
    // 获取商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', { params: this.pageObj })
      if (res.meta.status !== 200) {
        return ElMessage.error('获取商品列表失败')
      }
      this.total = res.data.total
      this.goodsList = res.data.goods
      // console.log(res.data.goods)
    },
    // pagesize改变时
    handleSizeChange(val) {
      this.pageObj.pagesize = val
      this.getGoodsList()
    },
    // pagenum改变时
    handleCurrentChange(val) {
      this.pageObj.pagenum = val
      this.getGoodsList()
    },
    // 时间格式化
    getDate(val) {
      return moment(val).format('YYYY-MM-DD HH:mm:ss')
      // const dt = new Date(val)
      // let yy = dt.getFullYear()
      // yy = yy > 10 ? yy : '0' + yy
      // let mm = dt.getMonth() + 1
      // mm = mm > 10 ? mm : '0' + mm
      // let dd = dt.getDate()
      // dd = dd > 10 ? dd : '0' + dd
      // let hh = dt.getHours()
      // hh = hh > 10 ? hh : '0' + hh
      // let min = dt.getMinutes()
      // min = min > 10 ? min : '0' + min
      // let ss = dt.getSeconds()
      // ss = ss > 10 ? ss : '0' + ss
      // return `${yy}-${mm}-${dd} ${hh}:${min}:${ss}`
    },
    // 点击添加商品按钮，跳转到相应页面
    goAddPage() {
      this.$router.push('/goods/add')
    },
    // 删除商品
    removeById(id) {
      ElMessageBox.confirm('商品删除后不可撤销，确认删除?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`goods/${id}`)
          if (res.meta.status !== 200) {
            ElMessage({
              type: 'error',
              message: '删除失败',
            })
          } else {
            ElMessage({
              type: 'success',
              message: '删除成功',
            })
            this.getGoodsList()
          }
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '取消删除',
          })
        })
    },
  },
  mounted() {
    this.getGoodsList()
    this.getDate()
  },
}
</script>

<style scoped>
.el-card .el-input {
  width: 300px;
  margin-right: 30px;
}
.el-table .el-table-column {
  padding: 0;
}
</style>
