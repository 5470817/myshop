<template>
  <!-- 面包屑导航 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>添加商品</el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 卡片视图 -->
  <el-card>
    <!-- 提示文本 -->
    <el-alert title="添加商品信息" type="info" show-icon :closable="false" center />
    <!-- 进度条 -->
    <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
      <el-step title="基本信息" />
      <el-step title="商品参数" />
      <el-step title="商品属性" />
      <el-step title="商品图片" />
      <el-step title="商品内容" />
      <el-step title="完成" />
    </el-steps>
    <!-- 表单 -->
    <el-form
      ref="addGoodsFormRef"
      :model="addGoodsForm"
      :rules="addGoodsFormRules"
      label-width="120px"
      status-icon
      label-position="top"
    >
      <el-tabs v-model="activeIndex" :tab-position="tabPosition" class="demo-tabs" :before-leave="beforeTabLeave">
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addGoodsForm.goods_name" />
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addGoodsForm.goods_price" type="number" />
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addGoodsForm.goods_weight" type="number" />
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addGoodsForm.goods_number" type="number" />
          </el-form-item>
          <!-- 级联选择器 -->
          <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader
              v-model="addGoodsForm.goods_cat"
              :options="cateList"
              :props="cateProps"
              @change="handleChange"
            />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <el-form-item :label="item.attr_name" v-for="item in manyTableData">
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox :label="i" v-for="(i, index) in item.attr_vals" :key="index" border />
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item :label="attr.attr_name" v-for="(attr, index) in onlyTableData" :key="index">
            <el-input v-model="attr.attr_vals" />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload
            action="http://127.0.0.1:8888/api/private/v1/upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture"
            :headers="headers"
            :on-success="handleSuccess"
          >
            <el-button type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <textarea v-model="addGoodsForm.goods_introduce"></textarea> <br />
          <el-button type="primary" size="large" @click="addGoods">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
  <!-- 图片预览对话框 -->
  <el-dialog v-model="imgDialogVisible" title="图片预览" width="30%">
    <img :src="previewPath" class="preimg" />
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      // 进度条默认保持在基本信息
      activeIndex: '0',
      // 标签页显示的位置
      tabPosition: 'left',
      // 表单绑定的数据
      addGoodsForm: {
        goods_name: '',
        goods_cat: [],
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: '',
        pics: [],
        attrs: [],
      },
      // 表单的验证规则
      addGoodsFormRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }],
      },
      // 商品分类列表
      cateList: [],
      // 级联选择参数
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      // 获取到的动态商品参数
      manyTableData: [],
      // 获取到的静态商品参数
      onlyTableData: [],
      // 上传图片时携带的token
      headers: {
        Authorization: localStorage.getItem('token'),
      },
      // 图片预览的路径
      previewPath: '',
      // 图片预览对话框默认隐藏
      imgDialogVisible: false,
    }
  },
  methods: {
    // 获取商品分类信息
    async getCategories() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return ElMessage.error('获取分类信息失败')
      }

      this.cateList = res.data
    },
    // 级联选择器选择变化时
    handleChange() {
      // console.log(this.addGoodsForm.goods_cat)
      // console.log(this.addGoodsForm.goods_cat.join(','))
    },
    // 标签页切换前的处理函数
    async beforeTabLeave(activeName, oldActiveName) {
      // 如果进到商品参数和商品属性之前没有选择三级商品分类，则不跳转到该页面
      if (activeName == 1 && this.addGoodsForm.goods_cat.length !== 3) {
        ElMessage.error('请选择三级分类')
        return false
      } else if (activeName == 2 && this.addGoodsForm.goods_cat.length !== 3) {
        ElMessage.error('请选择三级分类')
        return false
      } else if (activeName == 3 && this.addGoodsForm.goods_cat.length !== 3) {
        ElMessage.error('请选择三级分类')
        return false
      }
      // 进到商品参数时获取相应数据，并将数据保存
      if (activeName == 1) {
        const { data: res } = await this.$http.get(`categories/${this.addGoodsForm.goods_cat[2]}/attributes`, {
          params: { sel: 'many' },
        })
        if (res.meta.status !== 200) {
          return ElMessage.error('获取商品参数信息失败')
        }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
      } else if (activeName == 2) {
        // 进到商品属性时获取相应数据，并将数据保存
        const { data: res } = await this.$http.get(`categories/${this.addGoodsForm.goods_cat[2]}/attributes`, {
          params: { sel: 'only' },
        })
        if (res.meta.status !== 200) {
          return ElMessage.error('获取静态属性失败')
        }
        this.onlyTableData = res.data
      }
    },
    // 图片上传预览
    handlePreview(file) {
      this.imgDialogVisible = true
      this.previewPath = file.response.data.url
    },
    // 图片移除
    handleRemove(file) {
      const removePicUrl = file.response.data.tmp_path
      const i = this.addGoodsForm.pics.findIndex(item => item.pic === removePicUrl)
      this.addGoodsForm.pics.splice(i, 1)
    },
    // 图片上传成功后的函数
    handleSuccess(response) {
      if (response.meta.status !== 200) {
        return ElMessage.error('上传图片失败')
      }
      const picInfo = {
        pic: response.data.tmp_path,
      }
      this.addGoodsForm.pics.push(picInfo)
    },
    // 添加商品
    addGoods() {
      this.$refs.addGoodsFormRef.validate(async valid => {
        if (!valid) {
          return ElMessage.error('请填写必要的表单项')
        }
        //  验证通过，发起添加商品的请求
        this.addGoodsForm.goods_cat = this.addGoodsForm.goods_cat.join(',')
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' '),
          }
          this.addGoodsForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          }
          this.addGoodsForm.attrs.push(newInfo)
        })
        const { data: res } = await this.$http.post('goods', this.addGoodsForm)
        if (res.meta.status !== 201) {
          return ElMessage.error('添加商品失败')
        }
        ElMessage.success('添加商品成功')
        this.$router.push('/goods')
      })
    },
  },
  mounted() {
    this.getCategories()
  },
}
</script>

<style scoped>
.el-steps {
  margin: 20px 0;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.preimg {
  width: 100%;
}
textarea {
  width: 600px;
  height: 200px;
  outline: none;
}
</style>
