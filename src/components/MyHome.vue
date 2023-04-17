<template>
  <div class="common-layout">
    <el-container>
      <!-- 头部 -->
      <el-header>
        <h3>后台管理系统</h3>
        <el-button type="primary" plain @click="signOut">退出</el-button>
      </el-header>
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="collapseFlag ? '64px' : '200px'">
          <el-scrollbar>
            <!-- 切换侧边栏 -->
            <div class="toggole-button" @click="toggleCollapse">|||</div>
            <el-menu
              active-text-color="#ff6200"
              background-color="#2b4b6b"
              class="el-menu-vertical-demo"
              :default-active="activePath"
              text-color="#fff"
              unique-opened
              :collapse="collapseFlag"
              :collapse-transition="false"
              router
            >
              <!-- 一级菜单 -->
              <el-sub-menu :index="item.id + ''" v-for="(item, i) in menuList" :key="item.id">
                <template #title>
                  <el-icon>
                    <component :is="iconList[i].icon" />
                  </el-icon>
                  <span>{{ item.authName }}</span>
                </template>
                <!-- 一级菜单下的二级菜单 -->
                <el-menu-item
                  :index="'/' + subitem.path + ''"
                  v-for="subitem in item.children"
                  :key="subitem.id"
                  @click="savaNavState('/' + subitem.path)"
                >
                  <template #title>
                    <el-icon><Menu /></el-icon>
                    <span>{{ subitem.authName }}</span>
                  </template>
                </el-menu-item>
              </el-sub-menu>
            </el-menu>
          </el-scrollbar>
        </el-aside>
        <!-- 页面主体 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      iconList: [
        { icon: 'UserFilled' },
        { icon: 'Promotion' },
        { icon: 'GoodsFilled' },
        { icon: 'List' },
        { icon: 'TrendCharts' },
      ],
      collapseFlag: false,
      activePath: '/users',
    }
  },
  methods: {
    // 退出登录
    signOut() {
      localStorage.clear()
      ElMessage({
        message: '已退出',
        type: 'success',
      })
      this.$router.push('/login')
    },
    // 获取列表信息
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        ElMessage.error(res.meta.msg)
      } else {
        this.menuList = res.data
        // console.log(this.menuList)
      }
    },
    // 切换侧边栏的折叠和展开
    toggleCollapse() {
      this.collapseFlag = !this.collapseFlag
    },
    // 存储侧边栏的高亮状态
    savaNavState(activePath) {
      localStorage.setItem('path', activePath)
      this.activePath = activePath
    },
  },
  created() {
    // 获取侧边栏的信息
    this.getMenuList()
    // 获取path，设置高亮显示
    this.activePath = localStorage.getItem('path')
  },
}
</script>

<style lang="less" scoped>
.common-layout {
  height: 100%;
  .el-container {
    height: 100%;
    // 头部样式
    .el-header {
      background-color: #2b4b6b;
      display: flex;
      justify-content: space-between;
      align-items: center;
      h3 {
        color: #fff;
      }
    }
    // 侧边栏样式
    .el-aside {
      height: 100%;
      background-color: #2b4b6b;
      color: #fff;

      .el-menu {
        border-right: none;
      }
    }
    // 主体区域样式
    .el-main {
      background-color: #f2f2f2;
    }
  }
}

.toggole-button {
  width: 100%;
  text-align: center;
  background-color: #4a5064;
  letter-spacing: 2px;
  cursor: pointer;
}
</style>
