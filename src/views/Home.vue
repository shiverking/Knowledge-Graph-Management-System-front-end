<template>
    <div class="common-layout" style="height: 100%">
        <el-header class="homeHeader">
          <div class="title">知识图谱管理系统</div>
<!--          <div>-->
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
<!--          </div>-->
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
                  <router-link to="/data/arm/Aircraft" class="routerlink" ><el-menu-item index="1-1-1">飞机</el-menu-item></router-link>
                  <router-link to="/data/arm/Artillery" class="routerlink"><el-menu-item index="1-1-3">火炮</el-menu-item></router-link>
                  <router-link to="/data/arm/Bomb" class="routerlink"><el-menu-item index="1-1-4">爆炸物</el-menu-item></router-link>
                  <router-link to="/data/arm/Vessel" class="routerlink"><el-menu-item index="1-1-5">舰船</el-menu-item></router-link>
                </el-submenu>
                <el-submenu index="1-2">
                  <template slot="title">人员数据</template>
                  <router-link to="/data/people/person" class="routerlink"><el-menu-item index="1-2-2">人员信息</el-menu-item></router-link>
                  <router-link to="/data/people/education" class="routerlink"><el-menu-item index="1-2-3">教育信息</el-menu-item></router-link>
                  <router-link to="/data/people/resume" class="routerlink"><el-menu-item index="1-2-4">履历信息</el-menu-item></router-link>
                </el-submenu>
                <el-submenu index="1-3">
                  <template slot="title">计划与任务</template>
                  <router-link to="/data/plan/plan" class="routerlink"><el-menu-item index="1-3-1">作战计划</el-menu-item></router-link>
                  <router-link to="/data/plan/task" class="routerlink"><el-menu-item index="1-3-2">作战任务</el-menu-item></router-link>
                </el-submenu>
                <el-submenu index="1-4">
                  <template slot="title">数据分析</template>
                  <router-link to="/data/analysis/column" class="routerlink"><el-menu-item index="1-4-1">数据可视化</el-menu-item></router-link>
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
                <router-link to="/kg/merge" class="routerlink"><el-menu-item index="4-1">图谱融合</el-menu-item></router-link>
                <el-submenu index="4-2">
                  <template slot="title">图谱补全</template>
                  <router-link to="/kg/completion/GetTriples" class="routerlink" ><el-menu-item index="4-2-1">获取三元组</el-menu-item></router-link>
                  <router-link to="/kg/completion/LinkPrediction" class="routerlink"><el-menu-item index="4-2-2">链接预测</el-menu-item></router-link>
                  <router-link to="/kg/completion/AutomatedCompletion" class="routerlink"><el-menu-item index="4-2-3">自动化补全</el-menu-item></router-link>
                  <router-link to="/kg/completion/HandleConflicts" class="routerlink"><el-menu-item index="4-2-4">冲突处理</el-menu-item></router-link>
                  <router-link to="/kg/completion/ViewHistory" class="routerlink"><el-menu-item index="4-2-5">历史补全</el-menu-item></router-link>
                </el-submenu>
              </el-submenu>
              <router-link to="/setting" class="routerlink"><el-menu-item index="5">
                  <i class="el-icon-setting"></i>
                  <span slot="title">设置</span>
              </el-menu-item></router-link>
              <router-link to="/personal" class="routerlink"><el-menu-item index="5">
                <i class="el-icon-user"></i>
                <span slot="title">个人中心</span>
              </el-menu-item></router-link>
            </el-menu>
          </el-aside>
          <el-main>
            <el-empty description="欢迎来到知识图谱管理系统!" v-if="this.$router.currentRoute.path=='/home'"></el-empty>
            <div class="breadcrumb">
              <el-breadcrumb separator="/" v-if="this.$router.currentRoute.path!='/home'" >
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
              </el-breadcrumb>
            </div>
            <router-view>
                
            </router-view>
          </el-main>
        </el-container>
      </div>
</template>
<style>
  .el-header {
    color: #333;
    line-height: 60px;
  }
  .routerlink{
    text-decoration: none;
  }
  .homeHeader{
    background-color:#303030;
  }
  .title{
    width: 95%;
    color: #ffffff;
    display: inline-block;
  }
</style>
<script>
</script>
