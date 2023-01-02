<template>
  <div class="common-layout" style="height: 120vh">
    <el-header class="homeHeader" id="boxFixed" :class="{ is_fixed: isFixed}">
      <div class="header_left">
        <el-avatar src="../../static/icon/01.png"
                   style="vertical-align:middle;margin: 9px;background-color: #063a6b;"></el-avatar>
        <div class="title">知识图谱管理系统</div>
      </div>
      <div class="header_right">
        <el-autocomplete placeholder="请输入要查找的页面" v-model="state" class="inline-input"
                         style="position: relative;width: 33%;left: 2%" :fetch-suggestions="querySearch"
                         :trigger-on-focus="false"
                         @select="handleSelect">
        </el-autocomplete>
        <el-dropdown class="dropdown">
          <div>
            <el-avatar src="../../static/avatar/default2.png"
                       style="vertical-align:middle;margin: 10px"></el-avatar>
            <span style="color: azure;font-size: large;vertical-align:middle;">{{ username }}</span>
            <i class="el-icon-arrow-down" style="color: #000000;font-size: large;vertical-align:middle;"></i>
            <el-dropdown-menu>
              <router-link to="/system_management/personal" class="routerlink">
                <el-dropdown-item>个人中心</el-dropdown-item>
              </router-link>
              <router-link to="/system_management/setting" class="routerlink">
                <el-dropdown-item>设置</el-dropdown-item>
              </router-link>
              <el-dropdown-item divided @click.native="handleLogout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </div>
        </el-dropdown>
      </div>
    </el-header>
    <el-container style="height: 100%;">
      <el-aside width="230px" style="background-color: rgb(238, 241, 246)" id="navFixed"
                :class="{ is_fixed_nav_left: isNavLeftFixed}">
        <el-menu
            :default-active="$route.path"
            class="el-menu-vertical-demo"
            active-text-color="#ffd04b"
        >
          <el-submenu index="1" class="parent_submenu">
            <template slot="title">
              <i class="el-icon-edit-outline"></i>
              <span>数据管理</span>
            </template>
            <el-submenu index="1-1">
              <template slot="title">
                <i class="el-icon-rank"></i>
                非结构化数据管理
              </template>
              <router-link to="/data/unstructure/UnstructureText" class="routerlink">
                <el-menu-item index="1-1-1"><i class = "el-icon-document"></i>非结构文档</el-menu-item>
              </router-link>
              <router-link to="/data/unstructure/UnstructureAlbum" class="routerlink">
                <el-menu-item index="1-1-2"><i class = "el-icon-money"></i>非结构图片</el-menu-item>
              </router-link>
            </el-submenu>
            <el-submenu index="1-2">
              <template slot="title">
                <i class="el-icon-s-data"></i>
                半结构化数据管理
              </template>
              <router-link to="/data/semistructure/SemiStructureShow" class="routerlink">
                <el-menu-item index="1-2-1"><i class = 'el-icon-document-copy'></i>半结构化数据展示</el-menu-item>
              </router-link>
            </el-submenu>
            <el-submenu index="1-3">
              <template slot="title">
                <i class="el-icon-s-grid"></i>
                结构化数据管理
              </template>
              <router-link to="/data/structure/analysis" class="routerlink">
                <el-menu-item index="1-3-1">数据分析</el-menu-item>
              </router-link>
              <el-submenu index="1-3-2">
                <template slot="title">武器数据</template>
                <router-link to="/data/structure/arm/ArmAnalysis" class="routerlink">
                  <el-menu-item index="1-3-2-1">武器数据分析</el-menu-item>
                </router-link>
                <router-link to="/data/structure/arm/Aircraft" class="routerlink">
                  <el-menu-item index="1-3-2-2">飞机</el-menu-item>
                </router-link>
                <router-link to="/data/structure/arm/Vessel" class="routerlink">
                  <el-menu-item index="1-3-2-3">舰船</el-menu-item>
                </router-link>
                <router-link to="/data/structure/arm/Artillery" class="routerlink">
                  <el-menu-item index="1-3-2-4">火炮</el-menu-item>
                </router-link>
                <router-link to="/data/structure/arm/Bomb" class="routerlink">
                  <el-menu-item index="1-3-2-5">爆炸物</el-menu-item>
                </router-link>
                <router-link to="/data/structure/arm/Misile" class="routerlink">
                  <el-menu-item index="1-3-2-6">导弹</el-menu-item>
                </router-link>
              </el-submenu>
              <el-submenu index="1-3-3">
                <template slot="title">人员数据</template>
                <router-link to="/data/structure/people/PersonAnalysis" class="routerlink">
                  <el-menu-item index="1-3-3-1">人员数据分析</el-menu-item>
                </router-link>
                <router-link to="/data/structure/people/person" class="routerlink">
                  <el-menu-item index="1-3-3-2">人员信息</el-menu-item>
                </router-link>
              </el-submenu>
              <el-submenu index="1-3-4">
                <template slot="title">计划与任务</template>
                <router-link to="/data/structure/plan/plan" class="routerlink">
                  <el-menu-item index="1-3-4-1">作战计划</el-menu-item>
                </router-link>
              </el-submenu>
            </el-submenu>
          </el-submenu>
          <el-submenu index="2" class="parent_submenu">
            <template slot="title">
              <i class="el-icon-collection"></i>
              <span slot="title">候选生成管理</span>
            </template>
            <el-submenu index="2-1">
              <template slot="title"><i class="el-icon-cloudy"></i>候选图谱</template>
              <router-link to="/candidate/kg/ner" class="routerlink">
                <el-menu-item index="2-1-1"><i class="el-icon-watermelon"></i>实体抽取</el-menu-item>
              </router-link>
              <router-link to="/candidate/kg/triplesExtraction" class="routerlink">
                <el-menu-item index="2-1-2"><i class="el-icon-grape"></i>三元组抽取</el-menu-item>
              </router-link>
              <router-link to="/candidate/kg/build" class="routerlink">
                <el-menu-item index="2-1-3"><i class="el-icon-sunrise-1"></i>候选图谱构建</el-menu-item>
              </router-link>
              <router-link to="/candidate/kg/merge" class="routerlink">
                <el-menu-item index="2-1-5"><i class="el-icon-document-add"></i>候选图谱融合</el-menu-item>
              </router-link>
              <router-link to="/candidate/kg/show" class="routerlink">
                <el-menu-item index="2-1-4"><i class="el-icon-sunrise"></i>候选图谱展示</el-menu-item>
              </router-link>

            </el-submenu>
            <el-submenu index="2-2">
              <template slot="title"><i class="el-icon-cloudy-and-sunny"></i>候选本体</template>
              <router-link to="/candidate/ontology/show" class="routerlink">
                <el-menu-item index="2-2-1"><i class="el-icon-moon"></i>候选本体展示</el-menu-item>
              </router-link>
              <router-link to="/candidate/ontology/build" class="routerlink">
                <el-menu-item index="2-2-2"><i class="el-icon-moon-night"></i>候选本体构建</el-menu-item>
              </router-link>
            </el-submenu>
          </el-submenu>
          <el-submenu index="3" class="parent_submenu">
            <template slot="title">
              <i class="el-icon-share"></i>
              <span slot="title">融合管理</span>
            </template>
            <el-submenu index="3-1">
              <template slot="title">
                <i class="el-icon-connection"></i>图谱融合
              </template>
              <router-link to="/merge/kg/merge" class="routerlink">
                <el-menu-item index="3-1-1"><i class="el-icon-rank"></i>图谱融合</el-menu-item>
              </router-link>
              <router-link to="/merge/kg/completion" class="routerlink">
                <el-menu-item index="3-1-2"><i class="el-icon-pie-chart"></i>图谱补全</el-menu-item>
              </router-link>
              <router-link to="/merge/kg/evaluation" class="routerlink">
                <el-menu-item index="3-1-3"><i class="el-icon-edit"></i>质量评估</el-menu-item>
              </router-link>
              <router-link to="/merge/kg/versionControl" class="routerlink" id="test">
                <el-menu-item index="3-1-4"><i class="el-icon-tickets"></i>版本记录</el-menu-item>
              </router-link>
            </el-submenu>
            <el-submenu index="3-2">
              <template slot="title">
                <i class="el-icon-link"></i>本体融合
              </template>
              <router-link to="/merge/onotology/merge" class="routerlink">
                <el-menu-item index="3-2-1"><i class="el-icon-rank"></i>融合</el-menu-item>
              </router-link>
              <router-link to="/merge/ontology/completion" class="routerlink">
                <el-menu-item index="3-2-3"><i class="el-icon-pie-chart"></i>本体补全</el-menu-item>
              </router-link>
              <router-link to="/merge/ontology/versionControl" class="routerlink">
                <el-menu-item index="3-2-4"><i class="el-icon-tickets"></i>版本记录</el-menu-item>
              </router-link>
            </el-submenu>
          </el-submenu>
          <el-submenu index="4" class="parent_submenu">
            <template slot="title">
              <i class="el-icon-coin"></i>
              <span slot="title">核心数仓管理</span>
            </template>
            <el-submenu index="4-1">
              <template slot="title">
                <i class="el-icon-aim"></i>
                核心图谱
              </template>
              <router-link to="/coredata/mainkg/display" class="routerlink">
                <el-menu-item index="4-1-1"><i class="el-icon-view"></i>图谱展示</el-menu-item>
              </router-link>
              <router-link to="/coredata/mainkg/topic" class="routerlink">
                <el-menu-item index="4-1-2"><i class="el-icon-brush"></i>主题图谱</el-menu-item>
              </router-link>
              <router-link to="/coredata/mainkg/situation" class="routerlink">
                <el-menu-item index="4-1-3"><i class="el-icon-map-location"></i>态势认知图谱</el-menu-item>
              </router-link>
            </el-submenu>
            <el-submenu index="4-2">
              <template slot="title">
                <i class="el-icon-discover"></i>
                核心本体
              </template>
              <router-link to="/coredata/mainontology/display" class="routerlink">
                <el-menu-item index="4-2-1"><i class="el-icon-view"></i>本体展示</el-menu-item>
              </router-link>
            </el-submenu>
          </el-submenu>
          <el-submenu index="5" class="parent_submenu">
            <template slot="title">
              <i class="el-icon-thumb"></i>
              <span slot="title">场景应用管理</span>
            </template>
            <el-submenu index="5-1">
              <template slot="title">
                <i class="el-icon-set-up"></i>
                接口集成管理
              </template>
              <router-link to="/applicationmanagement/interface/meta" class="routerlink">
                <el-menu-item index="5-1-1">与元数据集成</el-menu-item>
              </router-link>
              <router-link to="/applicationmanagement/interface/cognize" class="routerlink">
                <el-menu-item index="5-1-2">与认知推理集成</el-menu-item>
              </router-link>
              <router-link to="/applicationmanagement/interface/display" class="routerlink">
                <el-menu-item index="5-1-3">与前端展示集成</el-menu-item>
              </router-link>
            </el-submenu>
            <el-submenu index="5-2">
              <template slot="title">
                <i class="el-icon-guide"></i>
                知识推理管理
              </template>
              <router-link to="/applicationmanagement/reason/integration" class="routerlink">
                <el-menu-item index="5-2-1">推理集成</el-menu-item>
              </router-link>
              <router-link to="/applicationmanagement/reason/verify" class="routerlink">
                <el-menu-item index="5-2-2">推理验证</el-menu-item>
              </router-link>
              <router-link to="/applicationmanagement/reason/attack" class="routerlink">
                <el-menu-item index="5-2-3">攻击预测</el-menu-item>
              </router-link>
              <router-link to="/applicationmanagement/reason/event" class="routerlink">
                <el-menu-item index="5-2-4">事件预测</el-menu-item>
              </router-link>
              <router-link to="/applicationmanagement/reason/hypergraph" class="routerlink">
                <el-menu-item index="5-2-5">超图预测</el-menu-item>
              </router-link>
            </el-submenu>
            <el-submenu index="5-3">
              <template slot="title">
                <i class="el-icon-headset"></i>
                辅助决策管理
              </template>
              <router-link to="/applicationmanagement/decision/build" class="routerlink">
                <el-menu-item index="5-3-1">态势认知构建</el-menu-item>
              </router-link>
              <router-link to="/applicationmanagement/decision/situationAnalysis" class="routerlink">
                <el-menu-item index="5-3-2">态势认知分析</el-menu-item>
              </router-link>
              <router-link to="/applicationmanagement/decision/map" class="routerlink">
                <el-menu-item index="5-3-3">态势要图展示</el-menu-item>
              </router-link>
              <router-link to="/applicationmanagement/decision/evaluation" class="routerlink">
                <el-menu-item index="5-3-4">态势评估</el-menu-item>
              </router-link>
              <router-link to="/applicationmanagement/decision/cognitiveDecision" class="routerlink">
                <el-menu-item index="5-3-5">认知决策验证</el-menu-item>
              </router-link>
            </el-submenu>
          </el-submenu>
          <el-submenu index="6" class="parent_submenu">
            <template slot="title">
              <i class="el-icon-house"></i>
              <span slot="title">系统管理</span>
            </template>
            <router-link  to="/system_management/authority" class="routerlink">
            <el-menu-item index="6-1">
                <i class="el-icon-lock"></i>权限管理
            </el-menu-item>
            </router-link>
            <router-link to="/system_management/role" class="routerlink">
              <el-menu-item index="6-2">
                  <i class="el-icon-s-custom"></i>角色管理
              </el-menu-item>
            </router-link>
            <router-link to="/system_management/setting" class="routerlink">
            <el-menu-item index="6-3">
                <i class="el-icon-setting"></i>设置
            </el-menu-item>
            </router-link>
            <router-link to="/system_management/personal" class="routerlink">
              <el-menu-item index="6-4">
                <i class="el-icon-user"></i>个人中心
              </el-menu-item>
            </router-link>
          </el-submenu>
          <el-submenu index="7" class="parent_submenu">
            <template slot="title">
              <i class="el-icon-cpu"></i>
              <span slot="title">爬虫管理</span>
            </template>
            <router-link  to="/crawler_management/CrawlerMonitor" class="routerlink">
              <el-menu-item index="7-1">
                <i class="el-icon-view"></i>爬虫监控
              </el-menu-item>
            </router-link>
            <router-link to="/crawler_management/CrawlerList" class="routerlink">
              <el-menu-item index="7-2">
                <i class="el-icon-notebook-2"></i>爬虫列表
              </el-menu-item>
            </router-link>
            <router-link to="/crawler_management/CrawlerInfo" class="routerlink">
              <el-menu-item index="7-3">
                <i class="el-icon-document"></i>爬虫信息
              </el-menu-item>
            </router-link>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main_area">
        <el-empty description="欢迎来到知识图谱管理系统!" v-if="this.$router.currentRoute.path=='/'"></el-empty>
        <div class="breadcrumb" style="margin:10px;">
          <el-breadcrumb separator="/" v-if="this.$router.currentRoute.path!='/'">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ this.$router.currentRoute.name }}</el-breadcrumb-item>
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
  overflow: visible;
}

.el-header {
  color: #333;
  line-height: 60px;
}

.routerlink {
  text-decoration: none;
}

.homeHeader {
  padding: 0px;
}

.title {
  font-weight: bold;
  color: #ffffff;
  display: inline-block;
}

.dropdown {
  float: right;
  height: inherit;
  position: relative;
  right: 1%;
}

.header_left {
  display: inline-block;
  width: 230px;
  height: inherit;
  margin: 0px;
  background-color: #063a6b;
}

.header_right {
  position: relative;
  display: inline-block;
  height: inherit;
  margin: 0px;
  left: -5px;
  width: calc(100% - 230px);
  background-color: #e3e7ea;
}

.is_fixed {
  position: fixed;
  top: 0px;
  z-index: 999;
  width: 100%;
}

.is_fixed_nav_left {
  position: fixed;
  top: 60px;
  z-index: 999;
  /*width: 230px;*/
}

.main_area {
  position: absolute;
  left: 230px;
  width: calc(100% - 230px);
}

.parent_submenu {
  /**标识父级li元素**/
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
import $ from '../plugins/jquery.min.js';

export default {
  name: 'Home',
  data() {
    return {
      session: '',
      username: '',
      headurl: '',
      //表头吸顶
      isFixed: false,
      offsetTop: 0,
      //左侧导航栏固定
      isNavLeftFixed: false,
      searchPages: [],
      //输入框初始状态
      state:'',
    }
  },
  created() {
    this.session = JSON.parse(window.sessionStorage.getItem('userInfo'))
    this.username = this.session.username
    this.headurl = this.session.headurl

  },
  methods: {
    handleLogout() {
      axios.post('/api/user/logout', this.$qs.stringify({
        token: store.state.token
      }), {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((response) => {
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
    },
    //搜索页面功能
    loadAll() {
      return [
        {"value": "主页", "location":"/"},
        {"value": "/数据管理/结构化数据管理/数据分析", "location":"/data/structure/analysis"},
        {"value": "/数据管理/半结构化数据管理", "location":"/data/semistructure"},
        {"value": "/候选生成管理/候选图谱/候选图谱展示", "location":"/candidate/kg/show"},
        {"value": "/候选生成管理/候选图谱/候选图谱构建", "location":"/candidate/kg/build"},
        {"value": "/候选生成管理/候选图谱/候选融合", "location":"/candidate/kg/merge"},
        {"value": "/候选生成管理/候选图谱/实体抽取", "location":"/candidate/kg/ner"},
        {"value": "/候选生成管理/候选图谱/三元组抽取", "location":"/candidate/kg/triplesExtraction"},
        {"value": "/候选生成管理/候选本体/候选本体展示", "location":"/candidate/ontology/show"},
        {"value": "/候选生成管理/候选本体/候选本体构建", "location":"/candidate/ontology/build"},
        {"value": "/融合管理/图谱融合/融合", "location":"/merge/kg/merge"},
        {"value": "/融合管理/图谱融合/图谱补全", "location":"/merge/kg/completion"},
        {"value": "/融合管理/图谱融合/质量评估", "location":"/merge/kg/evaluation"},
        {"value": "/融合管理/图谱融合/版本控制", "location":"/merge/kg/versionControl"},
        {"value": "/融合管理/本体融合/融合", "location":"/merge/onotology/merge"},
        {"value": "/融合管理/本体融合/本体补全", "location":"/merge/ontology/completion"},
        {"value": "/融合管理/本体融合/版本记录", "location":"/merge/ontology/versionControl"},
        {"value": "/核心数仓管理/核心图谱/核心图谱展示", "location":"/coredata/mainkg/display"},
        {"value": "/核心数仓管理/核心图谱/主题图谱", "location":"/coredata/mainkg/topic"},
        {"value": "/核心数仓管理/核心图谱/态势认知图谱", "location":"/coredata/mainkg/situation"},
        {"value": "/核心数仓管理/核心本体/核心本体展示", "location":"/coredata/mainontology/display"},
        {"value": "/系统管理/权限管理", "location":"/system_management/authority"},
        {"value": "/系统管理/角色管理", "location":"/system_management/role"},
        {"value": "/系统管理/设置", "location":"/system_management/setting"},
        {"value": "/系统管理/个人中心", "location":"/system_management/personal"},
        {"value": "/场景应用管理/接口管理/元数据", "location":"/applicationmanagement/interface/meta"},
        {"value": "/场景应用管理/接口管理/认知推理", "location":"/applicationmanagement/interface/cognize"},
        {"value": "/场景应用管理/接口管理/前端", "location":"/applicationmanagement/interface/display"},
        {"value": "/场景应用管理/知识推理管理/推理集成", "location":"/applicationmanagement/reason/integration"},
        {"value": "/场景应用管理/知识推理管理/推理验证", "location":"/applicationmanagement/reason/verify"},
        {"value": "/场景应用管理/知识推理管理/攻击预测", "location":"/applicationmanagement/reason/attack"},
        {"value": "/场景应用管理/知识推理管理/时间预测", "location":"/applicationmanagement/reason/event"},
        {"value": "/场景应用管理/知识推理管理/超图预测", "location":"/applicationmanagement/reason/hypergraph"},
        {"value": "/场景应用管理/态势认知构建/态势认知构建", "location":"/applicationmanagement/decision/build"},
        {"value": "/场景应用管理/态势认知构建/态势认知分析", "location":"/applicationmanagement/decision/situationAnalysis"},
        {"value": "/场景应用管理/态势认知构建/态势要图展示", "location":"/applicationmanagement/decision/map"},
        {"value": "/场景应用管理/态势认知构建/态势评估", "location":"/applicationmanagement/decision/evaluation"},
        {"value": "/场景应用管理/态势认知构建/认知决策验证", "location":"/applicationmanagement/decision/cognitiveDecision"},
        {"value": "/爬虫管理/爬虫监控", "location":"/crawler_management/CrawlerMonitor"},
        {"value": "/爬虫管理/爬虫列表", "location":"/crawler_management/CrawlerList"},
        {"value": "/爬虫管理/任务列表", "location":"/crawler_management/TaskList"},
      ];
    },
    querySearch(queryString, cb) {
      var searchPages = this.searchPages;
      var results = queryString ? searchPages.filter(this.createFilter(queryString)) : searchPages;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (page) => {
        var reg = new RegExp(queryString);
        return (page.value.toLowerCase().match(reg));
      };
    },
    handleSelect(item) {
      //清空内容
      this.state = '';
      //跳转
      this.$router.push(item.location);
    }
  },
  mounted() {
    //监听滚动
    window.addEventListener('scroll', this.initHeight)
    //执行下一步
    this.$nextTick(() => {
      this.offsetTop = document.querySelector('#boxFixed').offsetTop //吸顶距离顶部的距离
    }),
    //点击导航栏按钮时将页面置顶
    $(".routerlink").click(function () {
      $('body,html').animate({scrollTop: 0}, 10);
      let parent = $(this).closest('.el-submenu');
      $(parent).siblings().children("ul").hide();
      let top_parent = $(this).closest('.parent_submenu');
      $(top_parent).siblings().children("ul").hide();
    })
    this.searchPages= this.loadAll();
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll) //在销毁的生命周期取消监听事件,提高性能
  },
}
</script>
