<template>
  <router-view />
</template>

<style lang="less">
html {
  height: 100%;
  body {
    padding: 0;
    margin: 0;
    height: 100%;
    min-width: 1366px;
  }
}

#app {
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.el-breadcrumb {
  margin-bottom: 20px;
}
.el-card {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) !important;
}
.el-table {
  margin-top: 20px;
}
.el-pagination {
  margin-top: 20px;
}
</style>
