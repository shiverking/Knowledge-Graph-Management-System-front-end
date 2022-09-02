import Vue from 'vue'
import VueRouter from 'vue-router'
import Aircraft from '../views/Aircraft'
import Artillery from '../views/Artillery'
import Bomb from '../views/Bomb'
import Index from '../views/Index'
import Education from'../views/education'
import Person from'../views/Person'
import Resume from'../views/Resume'
import Plan from'../views/Plan'
import Task from'../views/Task'
import Vessel from'../views/Vessel'
import Column from'../views/Column'
Vue.use(VueRouter)

const routes = [
  {
    path:"/",
    name:"武器装备数据",
    component:Index,
    show:true,
    redirect:"/Aircraft",
    children:[
      {
        path:"/Aircraft",
        name:"飞机",
        component:Aircraft
      },
      {
        path:"/Artillery",
        name:"火炮",
        component:Artillery
      },
      {
        path:"/Bomb",
        name:"爆炸物",
        component:Bomb
      },
      {
        path:"/Vessel",
        name:"舰船",
        component:Vessel
      }

    ]
  },
  {
    path:"/",
    name:"人员信息",
    component:Index,
    show:true,
    children:[
      {
        path:"/person",
        name:"人员信息",
        component:Person
      },
      {
        path:"/education",
        name:"教育信息",
        component:Education
      },
      {
        path:"/resume",
        name:"履历信息",
        component:Resume
      },
    ]
  },
  {
    path:"/",
    name:"计划与任务",
    component:Index,
    show:true,
    children:[
      {
        path:"/plan",
        name:"作战计划",
        component:Plan
      },
      {
        path:"/task",
        name:"作战任务",
        component:Task
      },

    ]
  },
  {
    path:"/",
    name:"数据分析",
    component:Index,
    show:true,
    children:[
      {
        path:"/column",
        name:"数据可视化",
        component:Column
      },


    ]
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
