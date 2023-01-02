import Vue from 'vue'
import Router from 'vue-router'
//全局组件
import Register from "../views/Register";
import Login from "../views/Login";
import Home from "../views/Home"
//第一部分 数据管理所需组件
import ArmAnalysis from '../views/data_management/structured_data_management/arm/ArmAnalysis'
import Aircraft from '../views/data_management/structured_data_management/arm/Aircraft'
import Artillery from '../views/data_management/structured_data_management/arm/Artillery'
import Bomb from '../views/data_management/structured_data_management/arm/Bomb'
import Misile from '../views/data_management/structured_data_management/arm/Misile'
import AddAircraft from '../views/data_management/structured_data_management/arm/AddAircraft'
import AddMisile from '../views/data_management/structured_data_management/arm/AddMisile'
import AddVessel from '../views/data_management/structured_data_management/arm/AddVessel'
import AddArtillery from '../views/data_management/structured_data_management/arm/AddArtillery'
import AddBomb from '../views/data_management/structured_data_management/arm/AddBomb'
import ArtilleryUpdate from '../views/data_management/structured_data_management/arm/ArtilleryUpdate'
import AircraftUpdate from '../views/data_management/structured_data_management/arm/AircraftUpdate'
import MisileUpdate from '../views/data_management/structured_data_management/arm/MisileUpdate'
import BombUpdate from '../views/data_management/structured_data_management/arm/BombUpdate'
import VesselUpdate from '../views/data_management/structured_data_management/arm/VesselUpdate'
import AddPerson from '../views/data_management/structured_data_management/people/AddPerson'
import Person from '../views/data_management/structured_data_management/people/Person'
import PersonAnalysis from '../views/data_management/structured_data_management/people/PersonAnalysis'
import PersonDetail from '../views/data_management/structured_data_management/people/PersonDetail'
import PersonUpdate from '../views/data_management/structured_data_management/people/PersonUpdate'
import Plan from '../views/data_management/structured_data_management/plan/Plan'
import AddPlan from '../views/data_management/structured_data_management/plan/AddPlan'
import PlanUpdate from '../views/data_management/structured_data_management/plan/PlanUpdate'
import PlanDetail from '../views/data_management/structured_data_management/plan/PlanDetail'
import TaskDetail from '../views/data_management/structured_data_management/plan/TaskDetail'
import Vessel from '../views/data_management/structured_data_management/arm/Vessel'
import Arm from "../views/data_management/structured_data_management/arm/Arm"
import People from "../views/data_management/structured_data_management/people/People"
import Summary from "../views/data_management/structured_data_management/plan/Summary"
import Analysis from "../views/data_management/structured_data_management/Analysis"
import StructuredData from "../views/data_management/structured_data_management/StructuredData";
import UnstructuredData from "../views/data_management/unstructured_data_management/UnstructuredData";
import SemiStructuredData from "../views/data_management/semi_structured_data_management/SemiStructuredData";
import SemiStructureShow from "../views/data_management/semi_structured_data_management/SemiStructureShow";
import SemiStructureDetail from "../views/data_management/semi_structured_data_management/SemiStructureDetail";
import UnstructureText from "../views/data_management/unstructured_data_management/UnstructureText";
import UnstructureTextDetail from "../views/data_management/unstructured_data_management/UnstructureTextDetail";
import UnstructurePicture from "../views/data_management/unstructured_data_management/UnstructurePicture";
import UnstructureAlbum from "../views/data_management/unstructured_data_management/UnstructureAlbum";
//第二部分,候选生成管理部分组件
import CandidateKg from "../views/candidate_generation_management/candidate_kg/CandidateKg";
import CandidateKgBuild from "../views/candidate_generation_management/candidate_kg/CandidateKgBuild";
import CandidateKgShow from "../views/candidate_generation_management/candidate_kg/CandidateKgShow";
import CandidateOntology from "../views/candidate_generation_management/candidate_ontology/CandidateOntology";
import CandidateOntologyShow from "../views/candidate_generation_management/candidate_ontology/CandidateOntologyShow";
import CandidateOntologyBuild from "../views/candidate_generation_management/candidate_ontology/CandidateOntologyBuild";
import NamedEntityRecognition from "../views/candidate_generation_management/candidate_kg/NamedEntityRecognition"
import TriplesExtraction from "../views/candidate_generation_management/candidate_kg/TriplesExtraction"
import CandidateMerge from "../views/candidate_generation_management/candidate_kg/CandidateMerge";
// 第三部分,融合管理部分组件
import KgMergeHome from "../views/merge_management/kg_merge/KgMergeHome";
import KgMerge from "../views/merge_management/kg_merge/KgMerge"
import AutoCompletion from "../views/merge_management/kg_merge/AutoCompletion"
import CheckKg from "../views/merge_management/kg_merge/CheckKg";
import QualityEvaluation from "../views/merge_management/kg_merge/QualityEvaluation";
import OntologyMergeHome from "../views/merge_management/ontology_merge/OntologyMergeHome";
import OntologyCompletion from "../views/merge_management/ontology_merge/OntologyCompletion";
import OntologyVersionControl from "../views/merge_management/ontology_merge/OntologyVersionControl";
import OntologyMerge from "../views/merge_management/ontology_merge/OntologyMerge";
// 第四部分,核心数仓部分组件
import CoreKg from "../views/coredata_warehouse/core_kg/CoreKg";
import CoreKgDisplay from "../views/coredata_warehouse/core_kg/CoreKgDisplay";
import TopicKg from "../views/coredata_warehouse/core_kg/TopicKg";
import SituationKg from "../views/coredata_warehouse/core_kg/SituationKg";
import CoreOntology from "../views/coredata_warehouse/core_ontology/CoreOntology";
import CoreOntologyShow from "../views/coredata_warehouse/core_ontology/CoreOntologyShow";
// 第五部分,用户应用管理组件
import Interface from "../views/user_application_management/interface/Interface";
import Display from "../views/user_application_management/interface/Display";
import MetaData from "../views/user_application_management/interface/MetaData";
import Cognize from "../views/user_application_management/interface/Cognize";
import Reason from "../views/user_application_management/reason/Reason";
import Attack from "../views/user_application_management/reason/Attack";
import Event from "../views/user_application_management/reason/Event";
import Hypergraph from "../views/user_application_management/reason/Hypergraph";
import Integration from "../views/user_application_management/reason/Integration";
import Verify from "../views/user_application_management/reason/Verify";
import Decision from "../views/user_application_management/decision/Decision";
import Build from "../views/user_application_management/decision/Build";
import Evaluation from "../views/user_application_management/decision/Evaluation";
import Map from "../views/user_application_management/decision/Map";
import SituationAnalysis from "../views/user_application_management/decision/SituationAnalysis";
import CognitiveDecision from "../views/user_application_management/decision/CognitiveDecision";
// 第六部分,系统管理
import Personal from "../views/system_management/Personal";
import Setting from "../views/system_management/Setting";
import Authority from "../views/system_management/Authority";
import Role from "../views/system_management/Role";
// 第七部分,爬虫管理
import CrawlerList from "../views/crawler_management/CrawlerList";
import CrawlerMonitor from "../views/crawler_management/CrawlerMonitor";
import CrawlerInfo from "../views/crawler_management/CrawlerInfo";
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
    {
      path: '/',
      name: '主页',
      component: Home,
      hidden: true,
      meta:{
        requireAuth:true //此时表示进入这个路由是需要登录的
      }
    },
    //第一部分,数据管理
    {
      path:'/data',
      name:'数据管理',
      component:Home,
      show: true,
      children:[
        {
          path: '/data/structure',
          name: '结构化数据管理',
          component: StructuredData,
          show: true,
          children: [
            {
              path:'/data/structure/analysis',
              name:'数据分析',
              component:Analysis,
              show:true
            },
            {
              path: '/data/structure/arm',
              name: '武器装备数据',
              component: Arm,
              show: true,
              redirect:'Aircraft',
              children:[
                {
                  path: "/data/structure/arm/AddAircraft",
                  name: "添加飞机",
                  component: AddAircraft,
                },
                {
                  path: "/data/structure/arm/AddArtillery",
                  name: "添加火炮",
                  component: AddArtillery,
                },
                {
                  path: "/data/structure/arm/AddVessel",
                  name: "添加舰船",
                  component: AddVessel,
                },
                {
                  path: "/data/structure/arm/AddMisile",
                  name: "添加导弹",
                  component: AddMisile,
                },
                {
                  path: "/data/structure/arm/AddBomb",
                  name: "添加爆炸物",
                  component: AddBomb,
                },
                {
                  path: "/data/structure/arm/AircraftUpdate",
                  name: "编辑飞机",
                  component: AircraftUpdate,
                },
                {
                  path: "/data/structure/arm/ArtilleryUpdate",
                  name: "编辑火炮",
                  component: ArtilleryUpdate,
                },
                {
                  path: "/data/structure/arm/BombUpdate",
                  name: "编辑爆炸物",
                  component: BombUpdate,
                },
                {
                  path: "/data/structure/arm/MisileUpdate",
                  name: "编辑导弹",
                  component: MisileUpdate,
                },
                {
                  path: "/data/structure/arm/VesselUpdate",
                  name: "编辑舰船",
                  component: VesselUpdate,
                },
                {
                  path: "/data/structure/arm/ArmAnalysis",
                  name: "武器装备数据分析",
                  component: ArmAnalysis,
                },
                {
                  path: "/data/structure/arm/Aircraft",
                  name: "飞机",
                  component: Aircraft,
                },
                {
                  path: "/data/structure/arm/Artillery",
                  name: "火炮",
                  component: Artillery
                },
                {
                  path: "/data/structure/arm/Bomb",
                  name: "爆炸物",
                  component: Bomb
                },
                {
                  path: "/data/structure/arm/Vessel",
                  name: "舰船",
                  component: Vessel
                },
                {
                  path: "/data/structure/arm/Misile",
                  name: "舰船",
                  component: Misile
                },
              ]
            },
            {
              path: "/data/structure/people",
              name: "人员数据",
              component: People,
              show: true,
              children: [
                {
                  path: "/data/structure/people/PersonAnalysis",
                  name: "人员分析",
                  component: PersonAnalysis
                },
                {
                  path: "/data/structure/people/person",
                  name: "人员信息",
                  component: Person
                },
                {
                  path: "/data/structure/people/AddPerson",
                  name: "增加人员信息",
                  component: AddPerson
                },
                {
                  path: "/data/structure/people/PersonUpdate",
                  name: "编辑人员信息",
                  component: PersonUpdate
                },
                {
                  path: "/data/structure/people/PersonDetail",
                  name: "人员详情",
                  component: PersonDetail
                },
              ]
            },
            {
              path: "/data/structure/plan",
              name: "计划与任务",
              component: Summary,
              show: true,
              children: [
                {
                  path: "/data/structure/plan/plan",
                  name: "作战计划",
                  component: Plan
                },
                {
                  path: "/data/structure/plan/AddPlan",
                  name: "添加作战计划",
                  component: AddPlan
                },
                {
                  path: "/data/structure/plan/PlanUpdate",
                  name: "编辑作战计划",
                  component: PlanUpdate
                },
                {
                  path: "/data/structure/plan/PlanDetail",
                  name: "作战计划详情",
                  component: PlanDetail
                },
                {
                  path: "/data/structure/plan/TaskDetail",
                  name: "作战任务详情",
                  component: TaskDetail
                },
              ]
            },
          ]
        },
        {
          path: '/data/semistructure',
          name: '半结构化数据管理',
          component: SemiStructuredData,
          show: true,
          children: [
            {
              path: '/data/semistructure/SemiStructureShow',
              name: '半结构化数据展示',
              component: SemiStructureShow,
            },
            {
              path: '/data/semistructure/SemiStructureDetail',
              name: '半结构化数据详情',
              component: SemiStructureDetail,
            }
          ]
        },
        {
          path: '/data/unstructure',
          name: '非结构化数据管理',
          component: UnstructuredData,
          show: true,
          children: [
            {
              path: '/data/unstructure/UnstructureText',
              name: '非结构文档',
              component: UnstructureText,
            },
            {
              path: '/data/unstructure/UnstructureTextDetail',
              name: '非结构文档详情',
              component: UnstructureTextDetail,
            },
            {
              path: '/data/unstructure/UnstructureAlbum',
              name: '非结构图片',
              component: UnstructureAlbum,
            },
            {
              path: '/data/unstructure/UnstructurePicture',
              name: '图片详情',
              component: UnstructurePicture,
            }
          ]
        },
      ]
    },
    //第二部分,候选生成管理
    {
      path:'/candidate',
      name:'候选生成管理',
      component:Home,
      show: true,
      children:[
        {
          path: '/candidate/kg',
          name: '图谱融合',
          component: CandidateKg,
          show: true,
          children: [
            {
              path:'/candidate/kg/show',
              name:'候选图谱展示',
              component:CandidateKgShow,
              show:true
            },
            {
              path:'/candidate/kg/build',
              name:'候选图谱构建',
              component:CandidateKgBuild,
              show: true
            },
            {
              path:'/candidate/kg/merge',
              name:'候选融合',
              component:CandidateMerge,
              show: true
            },
            {
              path:'/candidate/kg/ner',
              name:'实体抽取',
              component:NamedEntityRecognition,
              show:true
            },
            {
              path:'/candidate/kg/triplesExtraction',
              name:'三元组抽取',
              component:TriplesExtraction,
              show: true
            }
          ]
        },
        {
          path: '/candidate/ontology',
          name: '本体融合',
          component: CandidateOntology,
          show: true,
          children: [
            {
              path:'/candidate/ontology/show',
              name:'候选本体展示',
              component:CandidateOntologyShow,
              show:true
            },
            {
              path:'/candidate/ontology/build',
              name:'候选本体构建',
              component:CandidateOntologyBuild,
              show: true
            }
          ]
        }
      ]
    },
    //第三部分,融合管理
    {
      path:'/merge',
      name:'融合管理',
      component:Home,
      show: true,
      children:[
        {
          path: '/merge/kg',
          name: '图谱融合',
          component: KgMergeHome,
          show: true,
          children: [
            {
              path:'/merge/kg/merge',
              name:'图谱融合',
              component:KgMerge,
              show:true
            },
            {
              path:'/merge/kg/completion',
              name:'图谱补全',
              component:AutoCompletion,
              show: true
            },
            {
              path:'/merge/kg/evaluation',
              name:'质量评估',
              component:QualityEvaluation,
              show:true
            },
            {
              path:'/merge/kg/versionControl',
              name:'版本控制',
              component:CheckKg,
              show: true
            },
          ]
        },
        {
          path: '/merge/onotology',
          name: '本体融合',
          component: OntologyMergeHome,
          show: true,
          children: [
            {
              path:'/merge/onotology/merge',
              name:'融合',
              component:OntologyMerge,
              show:true
            },
            {
              path:'/merge/ontology/completion',
              name:'本体补全',
              component:OntologyCompletion,
              show: true
            },
            {
              path:'/merge/ontology/versionControl',
              name:'版本记录',
              component:OntologyVersionControl,
              show: true
            }
          ]
        }
      ]
    },
    //第四部分，核心数仓管理
    {
      path:'/coredata',
      name:'核心数仓管理',
      component:Home,
      show: true,
      children:[
        {
          path: '/coredata/mainkg',
          name: '核心图谱',
          component: CoreKg,
          show: true,
          children: [
            {
              path:'/coredata/mainkg/display',
              name:'核心图谱展示',
              component:CoreKgDisplay,
              show:true
            },
            {
              path:'/coredata/mainkg/topic',
              name:'主题图谱',
              component:TopicKg,
              show: true
            },
            {
              path:'/coredata/mainkg/situation',
              name:'态势认知图谱',
              component:SituationKg,
              show: true
            },
          ]
        },
        {
          path: '/coredata/mainontology',
          name: '核心本体',
          component: CoreOntology,
          show: true,
          children: [
            {
              path:'/coredata/mainontology/display',
              name:'核心本体展示',
              component:CoreOntologyShow,
              show:true
            }
          ]
        }
      ]
    },
    //第五部分，用户应用管理
    {
      path:'/applicationmanagement',
      name:'场景应用管理',
      component:Home,
      show: true,
      children:[
        {
          path: '/applicationmanagement/interface',
          name: '接口集成管理',
          component: Interface,
          show: true,
          children: [
            {
              path:'/applicationmanagement/interface/meta',
              name:'与元数据集成',
              component:MetaData,
              show:true
            },
            {
              path:'/applicationmanagement/interface/cognize',
              name:'与认知推理集成',
              component:Cognize,
              show: true
            },
            {
              path:'/applicationmanagement/interface/display',
              name:'与前端演示集成',
              component:Display,
              show: true
            },
          ]
        },
        {
          path: '/applicationmanagement/reason',
          name: '知识推理管理',
          component: Reason,
          show: true,
          children: [
            {
              path:'/applicationmanagement/reason/integration',
              name:'推理集成',
              component:Integration,
              show:true
            },
            {
              path:'/applicationmanagement/reason/verify',
              name:'推理验证',
              component:Verify,
              show: true
            },
            {
              path:'/applicationmanagement/reason/attack',
              name:'攻击预测',
              component:Attack,
              show:true
            },
            {
              path:'/applicationmanagement/reason/event',
              name:'事件预测',
              component:Event,
              show: true
            },
            {
              path:'/applicationmanagement/reason/hypergraph',
              name:'超图预测',
              component:Hypergraph,
              show:true
            }
          ]
        },
        {
          path: '/applicationmanagement/decision',
          name: '态势认知构建',
          component: Decision,
          show: true,
          children: [
            {
              path:'/applicationmanagement/decision/build',
              name:'态势认知构建',
              component:Build,
              show:true
            },
            {
              path:'/applicationmanagement/decision/situationAnalysis',
              name:'态势认知分析',
              component:SituationAnalysis,
              show: true
            },
            {
              path:'/applicationmanagement/decision/map',
              name:'态势要图展示',
              component:Map,
              show:true
            },
            {
              path:'/applicationmanagement/decision/evaluation',
              name:'态势评估',
              component:Evaluation,
              show: true
            },
            {
              path:'/applicationmanagement/decision/cognitiveDecision',
              name:'认知决策验证',
              component:CognitiveDecision,
              show: true
            }
          ]
        }
      ]
    },
    //第六部分，系统管理
    {
      path: '/system_management',
      name: '系统管理',
      component: Home,
      show: true,
      children: [
        {
          path:'/system_management/authority',
          name:'权限管理',
          component:Authority,
          show:true
        },
        {
          path:'/system_management/role',
          name:'角色管理',
          component:Role,
          show: true
        },
        {
          path:'/system_management/setting',
          name:'设置',
          component:Setting,
          show:true
        },
        {
          path:'/system_management/personal',
          name:'个人中心',
          component:Personal,
          show: true
        },
      ]
    },
    //第六部分,爬虫管理
    {
      path: '/crawler_management',
      name: '爬虫管理',
      component: Home,
      show: true,
      children: [
        {
          path:'/crawler_management/CrawlerMonitor',
          name:'爬虫监控',
          component:CrawlerMonitor,
          show:true
        },
        {
          path:'/crawler_management/CrawlerList',
          name:'爬虫列表',
          component:CrawlerList,
          show: true
        },
        {
          path:'/crawler_management/CrawlerInfo',
          name:'爬虫信息',
          component:CrawlerInfo,
          show:true
        },
      ]
    },
  ],
})
