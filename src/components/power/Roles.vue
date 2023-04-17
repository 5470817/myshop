<template>
  <!-- 面包屑导航 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 卡片视图 -->
  <el-card>
    <!-- 添加角色按钮 -->
    <el-button type="primary">添加角色</el-button>
    <!-- 表格主体 -->
    <el-table :data="roleList" border stripe style="width: 100%">
      <!-- 展开列 -->
      <el-table-column type="expand" width="80">
        <template #="scope">
          <el-row v-for="(item1, i1) in scope.row.children" :key="item1.id" class="center">
            <!-- 一级权限渲染区 -->
            <el-col :span="5">
              <el-tag closable @close="removeRightsById(scope.row.id, item1.id)">{{ item1.authName }} </el-tag>
              <el-icon><CaretRight /></el-icon>
            </el-col>
            <!-- 二级权限渲染区 -->
            <el-col :span="19">
              <el-row v-for="item2 in item1.children" :key="item2.id" class="center">
                <el-col :span="6">
                  <el-tag closable @close="removeRightsById(scope.row.id, item2.id)" type="success">{{
                    item2.authName
                  }}</el-tag>
                  <el-icon><CaretRight /></el-icon>
                </el-col>
                <!-- 三级权限渲染区域 -->
                <el-col :span="18">
                  <el-tag
                    closable
                    @close="removeRightsById(scope.row.id, item3.id)"
                    type="warning"
                    v-for="item3 in item2.children"
                    :key="item3.id"
                    >{{ item3.authName }}</el-tag
                  >
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <!-- 序号列 -->
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="roleName" label="角色名称" width="180" />
      <el-table-column prop="roleDesc" label="角色描述" width="180" />
      <el-table-column label="操作">
        <template #="scope">
          <el-button size="small" type="primary" icon="Edit">编辑</el-button>
          <el-button size="small" type="danger" icon="Delete">删除</el-button>
          <el-button @click="showSettingRightsDialog(scope.row)" size="small" type="warning" icon="Setting"
            >分配权限</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <!-- 分配权限对话框 -->
  <el-dialog v-model="settingRightsDialogVisible" title="分配权限" width="50%" @close="resetRights">
    <!-- 树形控件 -->
    <el-tree
      show-checkbox
      node-key="id"
      default-expand-all
      :default-checked-keys="defaultKeys"
      :data="rightsList"
      :props="defaultProps"
      ref="treeRef"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="settingRightsDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="settingRights"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'Power',
  data() {
    return {
      roleList: [], //用户角色列表
      settingRightsDialogVisible: false, //控制分配权限对话框的显示与隐藏
      rightsList: [], //权限列表
      defaultProps: {
        // 树形控件的绑定对象
        children: 'children',
        label: 'authName',
      },
      // 树形控件的默认勾选权限
      defaultKeys: [],
      // 即将分配权限的角色id
      roleId: '',
    }
  },
  methods: {
    // 获取所有角色
    async getRoleList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        ElMessage.error('获取角色列表失败')
      } else {
        this.roleList = res.data
      }
    },
    // 删除权限
    removeRightsById(role, rightId) {
      ElMessageBox.confirm('此操作将永久删除该权限，是否删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`roles/${role}/rights/${rightId}`)
          console.log(res)
          if (res.meta.status !== 200) {
            return ElMessage.error('删除权限失败')
          } else {
            role.children = res.data
            ElMessage({
              message: '删除权限成功',
              type: 'success',
            })
          }
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: 'Delete canceled',
          })
        })
    },

    // 点击展示分配权限对话框
    async showSettingRightsDialog(role) {
      this.roleId = role.id
      // 获取所有权限
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return ElMessage.error('获取权限列表失败')
      } else {
        this.rightsList = res.data
        // console.log(res.data)

        this.getLeafKeys(role, this.defaultKeys)
        this.settingRightsDialogVisible = true
      }
    },
    // 递归获取三级权限的id并保存到defaultKeys
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      } else {
        node.children.forEach(item => {
          this.getLeafKeys(item, arr)
        })
      }
    },
    // 分配权限对话框关闭时重置权限列表，避免点开多个对话框时，后面的权限会加上前面的权限
    resetRights() {
      this.defaultKeys = []
    },
    // 确定分配权限
    async settingRights() {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return ElMessage.error('分配权限失败')
      } else {
        ElMessage({
          message: '分配权限成功',
          type: 'success',
        })
        this.getRoleList()
        this.settingRightsDialogVisible = false
      }
    },
  },
  mounted() {
    this.getRoleList()
  },
}
</script>

<style scoped>
.el-tag {
  margin: 7px;
}

.center {
  display: flex;
  align-items: center;
}
</style>
