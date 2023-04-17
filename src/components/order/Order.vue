<template>
  <!-- 面包屑导航 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    <el-breadcrumb-item>订单列表</el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 卡片视图 -->
  <el-card>
    <!-- 搜索框 -->
    <div class="mt-4">
      <el-row>
        <el-col :span="8">
          <el-input v-model="searchObj.query" placeholder="请输入" size="large">
            <template #append>
              <el-button icon="Search" />
            </template> </el-input
        ></el-col>
      </el-row>
    </div>
    <!-- 表格主体 -->
    <el-table :data="orderList" border stripe style="width: 100%">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="order_number" label="订单编号" width="180" />
      <el-table-column prop="order_price" label="订单价格" width="180" />
      <el-table-column prop="pay_status" label="是否付款" width="180">
        <template #default="scope">
          <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
          <el-tag type="danger" v-else>未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_send" label="是否发货" width="180" />
      <el-table-column prop="create_time" label="下单时间" width="180">
        <template #default="scope">
          {{ scope.row.create_time }}
          {{ getDate(scope.row.create_time) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button type="primary" icon="Edit" @click="showBox" />
          <el-button type="success" icon="Location" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      v-model:current-page="searchObj.pagenum"
      v-model:page-size="searchObj.pagesize"
      :page-sizes="[3, 5, 10, 15, 20]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 地址管理 -->
    <el-dialog v-model="showBoxVisible" title="修改地址" width="30%" @close="addressClose">
      <el-form ref="addressFormRef" :model="addressForm" :rules="addressRules" label-width="120px">
        <el-form-item label="省市区/县" prop="address1">
          <el-input v-model="addressForm.address1" />
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showBoxVisible = false">取消</el-button>
          <el-button type="primary" @click="showBoxVisible = false"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      // 获取订单列表所需参数
      searchObj: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
      // 订单列表数据
      orderList: [],
      // 总数据条数
      total: 0,
      // 控制地址对话框的显示隐藏
      showBoxVisible: false,
      addressForm: {
        address1: [],
        address2: '',
      },
      addressRules: {
        address1: [{ required: true, message: '请选择省市区县', trigger: 'blur' }],
        address2: [{ required: true, message: '请填写详细地址', trigger: 'blur' }],
      },
    }
  },
  methods: {
    // 获取订单列表
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', { params: this.searchObj })
      if (res.meta.status !== 200) {
        return ElMessage.error('获取订单列表失败')
      }
      this.orderList = res.data.goods
      this.total = res.data.total
      console.log(res.data)
    },
    // 时间格式化
    getDate(val) {
      const dt = new Date(val)
      let yy = dt.getFullYear()
      yy = yy > 10 ? yy : '0' + yy
      let mm = dt.getMonth() + 1
      mm = mm > 10 ? mm : '0' + mm
      let dd = dt.getDate()
      dd = dd > 10 ? dd : '0' + dd
      let hh = dt.getHours()
      hh = hh > 10 ? hh : '0' + hh
      let min = dt.getMinutes()
      min = min > 10 ? min : '0' + min
      let ss = dt.getSeconds()
      ss = ss > 10 ? ss : '0' + ss
      return `${yy}-${mm}-${dd} ${hh}:${min}:${ss}`
    },
    handleSizeChange(size) {
      this.searchObj.pagesize = size
      this.getOrderList()
    },
    handleCurrentChange(num) {
      this.searchObj.pagenum = num
      this.getOrderList()
    },
    // 显示修改地址的对话框
    showBox() {
      this.showBoxVisible = true
    },
    // 关闭修改地址的对话框触发的处理函数
    addressClose() {
      this.$refs.addressFormRef.resetFields()
    },
  },
  created() {
    this.getOrderList()
  },
}
</script>
