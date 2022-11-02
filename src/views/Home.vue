<template>
    <div class="common-layout" style="height: 120vh">
        <el-header class="homeHeader" id="boxFixed" :class="{ is_fixed: isFixed}">
          <div class="header_left">
            <el-avatar src="../../static/icon/01.png" style="vertical-align:middle;margin: 9px;background-color: #063a6b;"></el-avatar>
            <div class="title">知识图谱管理系统</div>
          </div>
          <div class="header_right">
            <el-input placeholder="请输入内容" v-model="searchPage" class="input-with-select" style="position: relative;width: 33%;left: 2%">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-dropdown class="dropdown">
              <div>
              <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" style="vertical-align:middle;margin: 10px"></el-avatar>
              <span style="color: azure;font-size: large;vertical-align:middle;">{{username}}</span>
              <i class="el-icon-arrow-down" style="color: #000000;font-size: large;vertical-align:middle;"></i>
              <el-dropdown-menu>
                <router-link to="/personal" class="routerlink" ><el-dropdown-item>个人中心</el-dropdown-item></router-link>
                <router-link to="/setting" class="routerlink" ><el-dropdown-item>设置</el-dropdown-item></router-link>
                <el-dropdown-item divided @click.native="handleLogout">退出</el-dropdown-item>
              </el-dropdown-menu>
              </div>
            </el-dropdown>
          </div>
        </el-header>
        <el-container style="height: 100%;">
          <el-aside  width="230px" style="background-color: rgb(238, 241, 246)" id="navFixed" :class="{ is_fixed_nav_left: isNavLeftFixed}">
            <el-menu
              :default-active="$route.path"
              class="el-menu-vertical-demo"
              >
              <el-submenu index="1">
                <template slot="title" >
                  <i class="el-icon-edit-outline"></i>
                  <span>核心集管理</span>
                </template>
                <router-link to="/data/analysis/column" class="routerlink"><el-menu-item index="1-1">数据分析</el-menu-item></router-link>
                <router-link to="/data/datasource" class="routerlink"><el-menu-item index="1-2">数据源管理</el-menu-item></router-link>
                <el-submenu index="1-3">
                  <template slot="title">武器装备数据</template>
                  <router-link to="/data/arm/ArmAnalysis" class="routerlink"><el-menu-item index="1-3-1">武器装备数据分析</el-menu-item></router-link>
                  <router-link to="/data/arm/Aircraft" class="routerlink" ><el-menu-item index="1-3-2">飞机</el-menu-item></router-link>
                  <router-link to="/data/arm/Vessel" class="routerlink"><el-menu-item index="1-3-3">舰船</el-menu-item></router-link>
                  <router-link to="/data/arm/Artillery" class="routerlink"><el-menu-item index="1-3-4">火炮</el-menu-item></router-link>
                  <router-link to="/data/arm/Bomb" class="routerlink"><el-menu-item index="1-3-5">爆炸物</el-menu-item></router-link>
                  <router-link to="/data/arm/Misile" class="routerlink"><el-menu-item index="1-3-6">导弹</el-menu-item></router-link>
                </el-submenu>
                <el-submenu index="1-4">
                  <template slot="title">人员数据</template>
                  <router-link to="/data/people/PersonAnalysis" class="routerlink"><el-menu-item index="1-4-1">人员数据分析</el-menu-item></router-link>
                  <router-link to="/data/people/person" class="routerlink"><el-menu-item index="1-4-2">人员信息</el-menu-item></router-link>
                </el-submenu>
                <el-submenu index="1-5">
                  <template slot="title">计划与任务</template>
                  <router-link to="/data/plan/plan" class="routerlink"><el-menu-item index="1-5-1">作战计划</el-menu-item></router-link>
                </el-submenu>

                <router-link to="/data/analysis" class="routerlink"><el-menu-item index="1-6">本体数据管理</el-menu-item></router-link>
                <router-link to="/data/tripledata" class="routerlink"><el-menu-item index="1-7">三元组数据管理</el-menu-item></router-link>

              </el-submenu>
              <el-submenu index="6">
                <template slot="title">
                  <i class="el-icon-edit-outline"></i>
                  <span slot="title">数据集管理</span>

                </template>
                <router-link to="/data/Meta" class="routerlink"><el-menu-item index="6-1">元数据管理</el-menu-item></router-link>
                <router-link to="/data/Unstructure" class="routerlink"><el-menu-item index="6-1">非结构化数据管理</el-menu-item></router-link>
              </el-submenu>
              <el-submenu index="2">
                <template slot="title">
                  <i class="el-icon-collection"></i>
                  <span slot="title">本体管理</span>
                </template>
                <router-link to="/ontology/OntologyShow" class="routerlink">
                  <el-menu-item index="2-1">本体展示与修改</el-menu-item>
                </router-link>
                <el-submenu index="2-3">
                  <template slot="title">候选本体构建</template>
                  <router-link to="/ontology/StructuredDataToOntology" class="routerlink">
                    <el-menu-item index="2-3-1">结构化数据</el-menu-item>
                  </router-link>
                  <router-link to="/ontology/HalfStructuredDataToOntology" class="routerlink">
                    <el-menu-item index="2-3-2">半结构化数据</el-menu-item>
                  </router-link>
                  <router-link to="/ontology/NotStructuredDataToOntology" class="routerlink">
                    <el-menu-item index="2-3-3">非结构化数据</el-menu-item>
                  </router-link>
                </el-submenu>
              </el-submenu>
              <el-submenu index="3">
                <template slot="title">
                  <i class="el-icon-document-copy"></i>
                  <span slot="title">三元组管理</span>
                </template>
                <router-link to="/know/IncrementalStructuredData" class="routerlink">
                  <el-menu-item index="3-1">增量结构化数据管理</el-menu-item>
                </router-link>
                <el-submenu index="3-2">
                  <template slot="title">增量非结构化数据管理</template>
                  <router-link to="/know/triples_extracton/NamedEntityRecognition" class="routerlink" ><el-menu-item index="3-2-1">实体抽取</el-menu-item></router-link>
                  <router-link to="/know/triples_extracton/TriplesExtraction" class="routerlink"><el-menu-item index="3-2-2">三元组抽取</el-menu-item></router-link>
                </el-submenu>
                <router-link to="/know/CandidateDatasets" class="routerlink">
                  <el-menu-item index="3-3">候选数据集管理</el-menu-item>
                </router-link>
              </el-submenu>
              <el-submenu index="4">
                <template slot="title">
                  <i class="el-icon-share"></i>
                  <span slot="title">图谱管理</span>
                </template>
                <router-link to="/kg/merge" class="routerlink">
                  <el-menu-item index="4-1">图谱融合</el-menu-item>
                </router-link>
                <el-submenu index="4-2">
                  <template slot="title">图谱补全</template>
                  <router-link to="/kg/completion/GetTriples" class="routerlink" ><el-menu-item index="4-2-1">手动添加</el-menu-item></router-link>
                  <router-link to="/kg/completion/LinkPrediction" class="routerlink"><el-menu-item index="4-2-2">链接预测</el-menu-item></router-link>
                  <router-link to="/kg/completion/AutoCompletion" class="routerlink"><el-menu-item index="4-2-3">半自动化补全</el-menu-item></router-link>
                  <router-link to="/kg/completion/CompletionModel" class="routerlink"><el-menu-item index="4-2-4">补全模型管理</el-menu-item></router-link>
                </el-submenu>
                <router-link to="/kg/error_detection" class="routerlink"><el-menu-item index="4-3">图谱质量检测</el-menu-item></router-link>
                <router-link to="/kg/check" class="routerlink"><el-menu-item index="4-4">版本控制</el-menu-item></router-link>
              </el-submenu>
              <router-link to="/setting" class="routerlink">
                <el-menu-item index="5">
                  <i class="el-icon-setting"></i>
                  <span slot="title">设置</span>
                </el-menu-item>
              </router-link>
              <router-link to="/personal" class="routerlink">
                <el-menu-item index="5">
                    <i class="el-icon-user"></i>
                    <span slot="title">个人中心</span>
                </el-menu-item>
              </router-link>
            </el-menu>
          </el-aside>
          <el-main  class="main_area">
            <el-empty description="欢迎来到知识图谱管理系统!" v-if="this.$router.currentRoute.path=='/'"></el-empty>
            <div class="breadcrumb" style="margin:10px;">
              <el-breadcrumb separator="/" v-if="this.$router.currentRoute.path!='/'" >
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
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
  .el-main {
    overflow:visible;
  }
  .el-header {
    color: #333;
    line-height: 60px;
  }
  .routerlink{
    text-decoration: none;
  }
  .homeHeader{
    padding: 0px;
  }
  .title{
    font-weight: bold;
    color: #ffffff;
    display: inline-block;
  }
  .dropdown{
    float: right;
    height: inherit;
    position: relative;
    right: 1%;
  }
  .header_left{
    display: inline-block;
    width:230px;
    height:inherit;
    margin: 0px;
    background-color: #063a6b;
  }
  .header_right{
    position: relative;
    display: inline-block;
    height:inherit;
    margin: 0px;
    left:-5px;
    width: 85%;
    background-color: #e3e7ea;
  }
  .is_fixed {
    position: fixed;
    top: 0px;
    z-index: 9999;
    width: 100%;
  }
  .is_fixed_nav_left {
    position: fixed;
    top: 60px;
    z-index: 999;
    /*width: 230px;*/
  }
  .main_area{
    position: absolute;
    left: 230px;
    width:85%;
  }
  /*优化滚动条*/
  .el-aside {
    height: 100%;
    overflow-x: scroll;
    white-space: nowrap;
  }
  .el-aside::-webkit-scrollbar-track-piece {
    background-color: #f8f8f800;
  }
  .el-aside::-webkit-scrollbar {
    width: 6px;
    transition: all 2s;
  }
  .el-aside::-webkit-scrollbar-thumb {
    background-color: #dddddd;
    border-radius: 100px;
  }
  .el-aside::-webkit-scrollbar-thumb:hover {
    background-color: #bbb;
  }
  .el-aside::-webkit-scrollbar-corner {
    background-color: rgba(255, 255, 255, 0);
  }
  /*全局滚动条*/
  body {
    height: 100%;
    overflow-x: scroll;
    white-space: nowrap;
    /*overflow: scroll;*/
  }
  body::-webkit-scrollbar-track-piece {
    background-color: #f8f8f800;
  }
  body::-webkit-scrollbar {
    width: 10px;
    transition: all 2s;
  }
  body::-webkit-scrollbar-thumb {
    background-color: #dddddd;
    border-radius: 100px;
  }
  body::-webkit-scrollbar-thumb:hover {
    background-color: #bbb;
  }
  body::-webkit-scrollbar-corner {
    background-color: rgba(255, 255, 255, 0);
  }
</style>
<script>
import store from "../store";
export default {
  name: 'Home',
  data(){
    return {
      session:'',
      username:'',
      headurl:'',
      searchPage:'',
      //表头吸顶
      isFixed: false,
      offsetTop: 0,
      //左侧导航栏固定
      isNavLeftFixed: false,
    }
  },
  created() {
    this.session = JSON.parse(window.sessionStorage.getItem('userInfo'))
    this.username = this.session.username
    this.headurl = this.session.headurl
  },
  methods:{
    test(){
      console.log(this.username)
    },
    handleLogout(){
        axios.post('/api/user/logout', this.$qs.stringify({
          token: store.state.token
        }),{headers:{'Content-Type': 'application/x-www-form-urlencoded'}}).then((response) => {
          //登出成功
          if (response.data.code == 200) {
            //删除token
            store.commit('REMOVE_INFO')
            // 跳转登录界面
            this.$router.push('/login')
          }
          //登出失败
          else {
            this.$message.error({
              message: '登出失败'
            });
          }
        }).catch(function (error) {
          console.log(error);
        })
      },
    initHeight() {
      var scrollTop =
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop //计算滚动条距离顶部的距离
          this.isFixed = scrollTop > this.offsetTop ? true : false//当滚动条大于吸顶距离顶部的距离试,就加上css样式
          this.isNavLeftFixed = scrollTop > this.offsetTop ? true : false
    }
  },
  mounted() {
    //监听滚动
    window.addEventListener('scroll', this.initHeight)
    //执行下一步
    this.$nextTick(() => {
      this.offsetTop = document.querySelector('#boxFixed').offsetTop //吸顶距离顶部的距离
    })
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll) //在销毁的生命周期取消监听事件,提高性能
  },
}
</script>
