import Vue from 'vue'
import Router from 'vue-router'
import Aircraft from '../views/data_management/arm/Aircraft'
import Artillery from '../views/data_management/arm/Artillery'
import Bomb from '../views/data_management/arm/Bomb'
import Education from '../views/data_management/people/education'
import Person from '../views/data_management/people/Person'
import Resume from '../views/data_management/people/Resume'
import Plan from '../views/data_management/plan/Plan'
import Task from '../views/data_management/plan/Task'
import Vessel from '../views/data_management/arm/Vessel'
import Column from '../views/data_management/analysis/Column'
import Login from "../views/Login";
import Home from "../views/Home"
import Arm from "../views/data_management/arm/Arm"
import People from "../views/data_management/people/People"
import Summary from "../views/data_management/plan/Summary"
import Analysis from "../views/data_management/analysis/Analysis"
import KgMerge from "../views/kg_merge/KgMerge"
import KgCompletion from "../views/kg_completion/KgCompletion"
import GetTriples from "../views/kg_completion/GetTriples"
import LinkPrediction from "../views/kg_completion/LinkPrediction"
import AutomatedCompletion from "../views/kg_completion/AutomatedCompletion"
import HandleConflicts from "../views/kg_completion/HandleConflicts"
import ViewHistory from "../views/kg_completion/ViewHistory"
import Personal from "../views/Personal";
import setting from "../views/Setting";
import Register from "../views/Register";
import OntologyShow from "../views/ontology_management/OntologyShow"
import OntologyUpdate from "../views/ontology_management/OntologyUpdate"
import OntologyAutoBuild from "../views/ontology_management/OntologyAutoBuild"
import StructuredDataToOntology from "../views/ontology_management/StructuredDataToOntology"
import HalfStructuredDataToOntology from "../views/ontology_management/HalfStructuredDataToOntology"
import NotStructuredDataToOntology from "../views/ontology_management/NotStructuredDataToOntology"
import twoView from "../views/visualization/2dView.vue";
import MergeHistory from "../views/kg_merge/MergeHistory";
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: '登录',
      component: Login,
      hidden: true
    },
    {
      path: '/register',
      name: '注册',
      component: Register,
      hidden: true
    },
    //测试可视化界面
    {
      path: '/2dView',
      name: '2dView',
      component:twoView,
      hidden: true
    },
    {
      path: '/',
      name: '主页',
      component: Home,
      hidden: true,
      meta:{
        requireAuth:true //此时表示进入这个路由是需要登录的
      },
      children:[
        {
          path:'/setting',
          name:'设置',
          component:setting,
          show:true,
        },
        {
          path:'/personal',
          name:'个人中心',
          component:Personal,
          show:true,
        },
      ]
    },
    {
      path: '/data',
      name: '数据管理',
      component: Home,
      show: true,
      meta:{
        requireAuth:true //此时表示进入这个路由是需要登录的
      },
      children:[
        {
          path: '/data/arm',
          name: '武器装备数据',
          component: Arm,
          show: true,
          redirect:'Aircraft',
          children:[
            {
              path: "/data/arm/Aircraft",
              name: "飞机",
              component: Aircraft,
            },
            {
              path: "/data/arm/Artillery",
              name: "火炮",
              component: Artillery
            },
            {
              path: "/data/arm/Bomb",
              name: "爆炸物",
              component: Bomb
            },
            {
              path: "/data/arm/Vessel",
              name: "舰船",
              component: Vessel
            },
          ]
        },
        {
          path: "/data/people",
          name: "人员数据",
          component: People,
          show: true,
          children: [
            {
              path: "/data/people/person",
              name: "人员信息",
              component: Person
            },
            {
              path: "/data/people/education",
              name: "教育信息",
              component: Education
            },
            {
              path: "/data/people/resume",
              name: "履历信息",
              component: Resume
            },
          ]
        },
        {
          path: "/data/plan",
          name: "计划与任务",
          component: Summary,
          show: true,
          children: [
            {
              path: "/data/plan/plan",
              name: "作战计划",
              component: Plan
            },
            {
              path: "/data/plan/task",
              name: "作战任务",
              component: Task
            },
          ]
        },
        {
          path: "/data/analysis",
          name: "数据分析",
          component: Analysis,
          show: true,
          children: [
            {
              path: "/data/analysis/column",
              name: "数据可视化",
              component: Column
            },
          ]
        },
      ]
    },
    {
      path: '/kg',
      name: '图谱管理',
      component: Home,
      show: true,
      meta:{
        requireAuth:true //此时表示进入这个路由是需要登录的
      },
      children:[
        {
          path: '/kg/merge',
          name: '图谱融合',
          component: KgMerge,
          show: true,
        },
        {
          path: '/kg/merge/history',
          name: '融合历史',
          component: MergeHistory,
          show: true,
        },
        {
          path: '/kg/completion',
          name: '图谱补全',
          component: KgCompletion,
          show: true,
          redirect:'GetTriples',
          children:[
            {
              path: "/kg/completion/GetTriples",
              name: "获取三元组",
              component: GetTriples,
            },
            {
              path: "/kg/completion/LinkPrediction",
              name: "链接预测",
              component: LinkPrediction
            },
            {
              path: "/kg/completion/AutomatedCompletion",
              name: "自动化补全",
              component: AutomatedCompletion
            },
            {
              path: "/kg/completion/HandleConflicts",
              name: "冲突处理",
              component: HandleConflicts
            },
            {
              path: "/kg/completion/ViewHistory",
              name: "历史补全",
              component: ViewHistory
            },
          ]
        },
      ]
    },
    {
      path:'/ontology',
      name:'本体管理',
      component:Home,
      show: true,
      children:[
        {
          path: '/ontology/ontologyshow',
          name: '本体展示',
          component: OntologyShow,
          show: true
        },
        {
          path: '/ontology/ontologyupdate',
          name: '本体修改',
          component: OntologyUpdate,
          show: true
        },
        {
          path: '/ontology/ontologyautobuild',
          name: '本体自动化构建',
          component: OntologyAutoBuild,
          show: true,
          children: [
            {
              path:'/ontology/structureddatatoontology',
              name:'结构化数据',
              component:StructuredDataToOntology,
              show:true
            },
            {
              path:'/ontology/halfstructureddatatoontology',
              name:'半结构化数据',
              component:HalfStructuredDataToOntology,
              show: true
            },
            {
              path:'/ontology/notstructureddatatoontology',
              name:'非结构化数据',
              component:NotStructuredDataToOntology,
              show: true
            }
          ]
        }
      ]
    }
  ],
})
