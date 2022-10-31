<template>
    <div class="common-layout" style="height: 120vh">
        <el-header class="homeHeader">
          <div class="title">知识图谱管理系统</div>
          <el-input placeholder="请输入内容" v-model="searchPage" class="input-with-select" style="position: relative;width: 400px;left: 83px">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <el-dropdown class="dropdown">
              <div>
              <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" style="vertical-align:middle;margin: 10px"></el-avatar>
              <span style="color: azure;font-size: large;vertical-align:middle;">{{username}}</span>
              <i class="el-icon-arrow-down" style="color: azure;font-size: large;vertical-align:middle;"></i>
              <el-dropdown-menu>
                <router-link to="/personal" class="routerlink" ><el-dropdown-item>个人中心</el-dropdown-item></router-link>
                <router-link to="/setting" class="routerlink" ><el-dropdown-item>设置</el-dropdown-item></router-link>
                <el-dropdown-item divided @click.native="handleLogout">退出</el-dropdown-item>
              </el-dropdown-menu>
              </div>
            </el-dropdown>
        </el-header>
        <el-container style="height: 100%;">
          <el-aside  width="230px" style="background-color: rgb(238, 241, 246)">
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
                <el-submenu index="3-1">
                  <template slot="title">结构化数据管理</template>
                  <router-link to="/know/triples_management/IncrementalStructuredData" class="routerlink" ><el-menu-item index="3-1-1">增量数据管理</el-menu-item></router-link>              
                </el-submenu>
                <el-submenu index="3-2">
                  <template slot="title">非结构化数据管理</template>
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
                <router-link to="/kg/check" class="routerlink"><el-menu-item index="4-3">版本控制</el-menu-item></router-link>
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
          <el-main>
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
    padding-right: 0px;
    background-color:#303030;
  }
  .title{
    float: left;
    color: #ffffff;
    display: inline-block;
  }
  .dropdown{
    float: right;
    height: inherit;
    margin-right: 10px;
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
      }
  }
}
</script>
