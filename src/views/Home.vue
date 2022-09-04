<template>
    <div class="common-layout" style="height: 100%">

        <el-header class="homeHeader">
          <div class="title">知识图谱管理系统</div>
          <div>
<!--            <el-dropdown class="userInfo" @command="commandHandler">-->
<!--              <span class="el-dropdown-link">-->
<!--                {{user.name}}<i><img :src="user.userface" alt=""></i>-->
<!--              </span>-->
<!--              <el-dropdown-menu slot="dropdown">-->
<!--                <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>-->
<!--                <el-dropdown-item command="setting">设置</el-dropdown-item>-->
<!--                <el-dropdown-item command="logout" divided>注销登录</el-dropdown-item>-->
<!--              </el-dropdown-menu>-->
<!--            </el-dropdown>-->
            <el-dropdown>
              <span class="el-dropdown-link" style="color: azure">
                用户1
                <i class="el-icon-arrow-down"></i>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>个人中心</el-dropdown-item>
                  <el-dropdown-item>设置</el-dropdown-item>
                  <el-dropdown-item divided>退出</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>
        <el-container style="height: 100%; border: 1px solid #eee">
          <el-aside  width="230px" style="background-color: rgb(238, 241, 246)">
            <el-menu
              :default-active="$route.path"
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose">
              <el-submenu index="1">
                <template slot="title">
                  <i class="el-icon-edit-outline"></i>
                  <span>数据管理</span>
                </template>
                <el-submenu index="1-1">
                  <template slot="title">武器装备数据</template>
                  <el-menu-item index="1-1-1"><router-link to="/data/arm/Aircraft" class="routerlink" >飞机</router-link></el-menu-item>
                  <el-menu-item index="1-1-3"><router-link to="/data/arm/Artillery" class="routerlink">火炮</router-link></el-menu-item>
                  <el-menu-item index="1-1-4"><router-link to="/data/arm/Bomb" class="routerlink">爆炸物</router-link></el-menu-item>
                  <el-menu-item index="1-1-5"><router-link to="/data/arm/Vessel" class="routerlink">舰船</router-link></el-menu-item>
                </el-submenu>
                <el-submenu index="1-2">
                  <template slot="title">人员数据</template>
                  <el-menu-item index="1-2-2"><router-link to="/data/people/person" class="routerlink">人员信息</router-link></el-menu-item>
                  <el-menu-item index="1-2-3"><router-link to="/data/people/education" class="routerlink">教育信息</router-link></el-menu-item>
                  <el-menu-item index="1-2-4"><router-link to="/data/people/resume" class="routerlink">履历信息</router-link></el-menu-item>
                </el-submenu>
                <el-submenu index="1-3">
                  <template slot="title">计划与任务</template>
                  <el-menu-item index="1-3-1"><router-link to="/data/plan/plan" class="routerlink">作战计划</router-link></el-menu-item>
                  <el-menu-item index="1-3-2"><router-link to="/data/plan/task" class="routerlink">作战任务</router-link></el-menu-item>
                </el-submenu>
                <el-submenu index="1-4">
                  <template slot="title">数据分析</template>
                  <el-menu-item index="1-4-1"><router-link to="/data/analysis/column" class="routerlink">数据可视化</router-link></el-menu-item>
                </el-submenu>
              </el-submenu>
              <el-menu-item index="2">
                <i class="el-icon-collection"></i>
                <span slot="title">本体管理</span>
              </el-menu-item>
              <el-menu-item index="3">
                <i class="el-icon-document-copy"></i>
                <span slot="title">知识管理</span>
              </el-menu-item>
              <el-submenu index="4">
                <template slot="title">
                  <i class="el-icon-share"></i>
                  <span slot="title">图谱管理</span>
                </template>
                <el-menu-item index="4-1"><router-link to="/kg/align" class="routerlink">实体对齐</router-link></el-menu-item>
                <el-menu-item index="4-2"><router-link to="/kg/merge" class="routerlink">图谱融合</router-link></el-menu-item>
              </el-submenu>
            </el-menu>
          </el-aside>
          <el-main>
            <div class="breadcrumb">
              <el-breadcrumb separator="/" v-if="this.$router.currentRoute.path!='/home'" >
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
              </el-breadcrumb>
            </div>
            <router-view></router-view>
          </el-main>
        </el-container>
      </div>
</template>

<style>
.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}
.el-container{
  height: 100%;
}
.el-aside {
  color: #333;
}
.homeHeader {
  background-color: #545c64;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 15px;
  box-sizing: border-box;
}
.title{
  color: aliceblue;
  font-weight: bold;
}
.breadcrumb{
  margin-bottom: 10px;
}
.resize {
  cursor: col-resize;
  position: absolute;
  right: 0;
  height: 100%;
  width: 5px;
}
.routerlink{
  color: black;
  text-decoration: none;
}
</style>
<script>
export default {
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>
