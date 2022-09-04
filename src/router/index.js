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
import entity_align from "../views/kg_merge/entity_align"
import kgmerge from "../views/kg_merge/kgmerge"
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
      hidden: true
    },
    {
      path: '/home',
      name: '主页',
      component: Home,
      hidden: true
    },
    {
      path: '/data',
      name: '数据管理',
      component: Home,
      show: true,
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
      children:[
        {
          path: '/kg/align',
          name: '实体对齐',
          component: entity_align,
          show: true,
        },
        {
          path: '/kg/merge',
          name: '图谱融合',
          component: kgmerge,
          show: true,
        },
      ]
    }
  ],
})
