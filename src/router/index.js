import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/

// 公用页面
export const constantRouterMap = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 大屏监控
  {
    path: '/monitor',
    component: () => import('@/views/monitor/index'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home/index',
    name: 'Home',
    hidden: true,
    children: [{
      path: 'home',
      component: () => import('@/views/home')
    }]
  },

  // 首页
  {
    path: '/home',
    component: Layout,
    redirect: '/home',
    name: 'home',
    children: [{
      path: 'index',
      name: 'homeIndex',
      component: () => import('@/views/home/index'),
      meta: {
        title: '首页',
        icon: 'home'
      }
    }]
  },
  // 日历
  {
    path: '/home',
    component: Layout,
    redirect: 'noredirect',
    name: 'calendar',
    hidden: true,
    children: [{
      path: 'eventCalendar',
      name: 'event-calendar',
      component: () => import('@/views/home/component/eventCalendar'),
      meta: {
        title: '日历',
        icon: 'home'
      }
    }]
  }

  // { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', // 后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap,
  base: '/AUMS/'
})

export const asyncRouterMap = [
  // 设备监控
  // {
  //   path: '/infoCollect',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'info-collect-matrix',
  //   meta: { title: '信息采集', icon: 'infoCollectIcon', roles: ['Menu_DevMonitorMatrix'] },
  //   children: [
  //     {
  //       path: 'devMonitorMatrix',
  //       name: 'dev-monitor-matrix',
  //       component: () => import('@/views/info-collect/devMonitorMatrix'),
  //       meta: { title: '设备监控', icon: 'infoCollectIcon', roles: ['Menu_DevMonitorMatrix'] }
  //     }
  //   ]
  // },
  // 交易监控
  {
    path: '/infoCollect',
    component: Layout,
    redirect: 'noredirect',
    name: 'info-collect-monitor',
    meta: {
      title: '信息采集',
      icon: 'infoCollectIcon',
      roles: ['Menu_DradeMonitor']
    },
    children: [{
      path: 'tradeMonitor',
      name: 'real-time-monitor',
      component: () => import('@/views/info-collect/tradeMonitor'),
      meta: {
        title: '交易监控',
        icon: 'infoCollectIcon',
        roles: ['Menu_DradeMonitor']
      }
    }]
  },
  // 用户管理
  {
    path: '/userManage',
    component: Layout,
    redirect: '/user-info-manage',
    name: 'user-manage',
    meta: {
      title: '用户管理',
      icon: 'example',
      roles: ['Menu_UserInfoManage', 'Menu_RoleInfoManage']
    },
    children: [
      {
        path: 'UserInfoManage',
        name: 'user-info-manage',
        component: () => import('@/views/user-manage/user-info-manage/UserInfoManage'),
        meta: {
          title: '用户管理',
          roles: ['Menu_UserInfoManage']
        }
      },
      {
        path: 'roleInfoManage',
        name: 'role-info-manage',
        component: () => import('@/views/user-manage/role-info-manage/roleInfoManage'),
        meta: {
          title: '角色管理',
          roles: ['Menu_RoleInfoManage']
        }
      }
    ]
  },
  // 设备维护
  {
    path: '/deviceInfo',
    component: Layout,
    redirect: '/device-info-manage',
    name: 'device-manage',
    meta: {
      title: '设备管理',
      icon: 'dev',
      roles: ['Menu_DeviceInfoManage', 'Menu_DeviceBrandManage', 'Menu_DeviceModelManage', 'Menu_DeviceSortManage', 'Menu_CProcedureManage']
    },
    children: [
      {
        path: 'deviceInfoManage',
        name: 'device-info-manage',
        component: () => import('@/views/device-info-manage/device-info-manage/deviceInfoManage'),
        meta: {
          title: '设备信息管理',
          roles: ['Menu_DeviceInfoManage']
        }
      },
      {
        path: 'deviceSortManage',
        name: 'device-sort-manage',
        component: () => import('@/views/device-info-manage/device-sort-manage/deviceSortInfo'),
        meta: {
          title: '设备分类信息管理',
          roles: ['Menu_DeviceSortManage']
        }
      },
      {
        path: 'deviceModelManage',
        name: 'device-model-manage',
        component: () => import('@/views/device-info-manage/device-model-manage/deviceModelInfo'),
        meta: {
          title: '设备型号信息管理',
          roles: ['Menu_DeviceModelManage']
        }
      },
      {
        path: 'deviceBrandManage',
        name: 'device-brand-manage',
        component: () => import('@/views/device-info-manage/device-brand-manage/deviceBrandManage'),
        meta: {
          title: '设备厂商信息管理',
          roles: ['Menu_DeviceBrandManage']
        }
      },
      {
        path: 'cProcedureManage',
        name: 'c-procedure-manage',
        component: () => import('@/views/device-info-manage/c-procedure-manage/cProcedureMgr'),
        meta: {
          title: 'C端程序信息管理',
          roles: ['Menu_CProcedureManage']
        }
      }
    ]
  },
  // 机构管理
  {
    path: '/branchManage',
    component: Layout,
    redirect: '/branch-info-manage',
    name: 'branch-manage',
    alwaysShow: true,
    meta: {
      title: '机构管理',
      icon: 'table',
      roles: ['Menu_BranchInfoManage', 'Menu_BranchGroupManage']
    },
    children: [
      {
        path: 'branchInfoManage',
        name: 'c',
        component: () => import('@/views/branch-manage/branch-info-manage/branchInfoManage'),
        meta: {
          title: '机构信息维护',
          roles: ['Menu_BranchInfoManage']
        }
      },
      {
        path: 'areaManage',
        name: 'areaManage',
        component: () => import('@/views/branch-manage/area-manage/areaManage'),
        meta: {
          title: '机构分组维护',
          roles: ['Menu_BranchGroupManage']
        }
      }
    ]
  },
  // 版本管理
  {
    path: '/versionManage',
    component: Layout,
    redirect: '/versionManage/versionFileUpload',
    name: 'version-manage',
    meta: {
      title: '版本管理',
      icon: 'version',
      roles: ['Menu_VersionFileUpload', 'Menu_VersionReleaseList', 'Menu_VersionRetreat', 'Menu_VersionReleaseHistory', 'Menu_VersionTemplateMaintenance']
    },
    children: [
      {
        path: 'versionFileUpload',
        name: 'version-file-upload',
        component: () => import('@/views/version-manage/version-file-upload/versionFileUpload'),
        meta: {
          title: '版本文件管理',
          roles: ['Menu_VersionFileUpload']
        }
      },
      {
        path: 'versionFileUpload2',
        name: 'version-file-upload2',
        component: () => import('@/views/version-manage/version-file-upload2/versionFileUpload'),
        meta: {
          title: '版本文件管理(分行)',
          roles: ['Menu_VersionFileUpload']
        }
      },
      {
        path: 'versionReleaseList',
        name: 'version-release-list',
        component: () => import('@/views/version-manage/version-release/versionReleaseList'),
        meta: {
          title: '版本发布',
          roles: ['Menu_VersionReleaseList']
        }
      },
      {
        path: 'versionRetreat',
        name: 'version-retraet',
        component: () => import('@/views/version-manage/version-retreat/versionRetreat'),
        meta: {
          title: '版本回退',
          roles: ['Menu_VersionRetreat']
        }
      },
      {
        path: 'releaseHistory',
        name: 'release-history',
        component: () => import('@/views/version-manage/release-history/releaseHistory'),
        meta: {
          title: '查看版本发布记录',
          roles: ['Menu_VersionReleaseHistory']
        }
      },
      {
        path: 'versionTemplateMaintenance',
        name: 'version-template-maintenance',
        component: () => import('@/views/version-manage/version-template-maintenance/versionTemplateMaintenance'),
        meta: {
          title: '版本策略维护',
          roles: ['Menu_VersionTemplateMaintenance']
        }
      }
    ]
  },
  // 资源管理
  {
    path: '/resourceManage',
    component: Layout,
    redirect: 'noredirect',
    name: 'menu-manage',
    meta: {
      title: '资源管理',
      icon: 'resourceMgr',
      roles: ['Menu_AdvertisingManage', 'Menu_MenuManage']
    },
    children: [
      {
        path: '/resourceManage/advertising',
        component: () => import('@/views/resource-manage/index'),
        redirect: 'noredirect',
        name: 'advertising',
        meta: {
          title: '广告',
          icon: 'adsvertising',
          roles: ['Menu_AdvertisingManage']
        },
        children: [
          {
            path: 'adsFileUpload',
            name: 'ads-file-upload',
            component: () => import('@/views/resource-manage/advertising/ads-file-upload/adsFileUpload'),
            meta: {
              title: '广告文件管理'
            }
          },
          {
            path: 'adsManage',
            name: 'ads-manage',
            component: () => import('@/views/resource-manage/advertising/ads-manage/adsManage'),
            meta: {
              title: '广告节目管理'
            }
          },
          {
            path: 'adsReleaseResult',
            name: 'ads-release-result',
            component: () => import('@/views/resource-manage/advertising/ads-release-result/adsReleaseResult'),
            meta: {
              title: '查看广告发布记录'
            }
          }
        ]
      },
      {
        path: '/resourceManage/menu',
        component: () => import('@/views/resource-manage/index'),
        redirect: 'noredirect',
        name: 'menu',
        meta: {
          title: '菜单',
          icon: 'menu',
          roles: ['Menu_MenuManage']
        },
        children: [
          {
            path: 'menuItemManage',
            name: 'menu-item-manage',
            component: () => import('@/views/resource-manage/menu/menu-item-mgr/menuItemManage'),
            meta: {
              title: '交易维护'
            }
          },
          {
            path: 'menuGroupManage',
            name: 'menu-group-manage',
            component: () => import('@/views/resource-manage/menu/menu-group-mgr/menuGroupManage'),
            meta: {
              title: '业务模块管理'
            }
          },
          {
            path: 'menuMOdelManage',
            name: 'menu-model-manage',
            component: () => import('@/views/resource-manage/menu/menu-model-mgr/menuMOdelManage'),
            meta: {
              title: '菜单管理'
            }
          }
        ]
      }

    ]
  },
  // 预警管理
  {
    path: '/alertManage',
    component: Layout,
    redirect: 'noredirect',
    name: 'alert-manage',
    alwaysShow: true,
    meta: {
      title: '预警管理',
      icon: 'alert',
      roles: ['Menu_AlertStrategyManage', 'Menu_MessageManage']
    },
    children: [
      {
        path: 'alertStrategy',
        name: 'alertStrategy',
        component: () => import('@/views/warning-manage/alert-manage/alertStrategyManage'),
        meta: {
          title: '预警策略管理',
          roles: ['Menu_AlertStrategyManage']
        }
      },
      {
        path: 'messageStrategy',
        name: 'messageStrategy',
        component: () => import('@/views/warning-manage/message-manage/messageManage'),
        meta: {
          title: '联系人管理',
          roles: ['Menu_MessageManage']
        }
      }
    ]
  },
  // 参数管理
  {
    path: '/parameterManage',
    component: Layout,
    redirect: 'noredirect',
    name: 'parameter-manage',
    alwaysShow: true,
    meta: {
      title: '参数管理',
      icon: 'parameter',
      roles: ['Menu_ParameterManage', 'Menu_QueryReleaseResult']
    },
    children: [
      {
        path: 'parameterManage',
        name: 'parameterManage',
        component: () => import('@/views/parameter-manage/parameterManage'),
        meta: {
          title: '参数管理',
          roles: ['Menu_ParameterManage']
        }
      }
      // {
      //   path: 'queryReleaseResult',
      //   name: 'queryReleaseResult',
      //   component: () => import('@/views/parameter-manage/queryReleaseResult'),
      //   meta: { title: '参数发布结果', roles: ['Menu_QueryReleaseResult'] }
      // }
    ]
  },
  // 报表管理
  {
    path: '/reportFormsManage',
    component: Layout,
    redirect: 'noredirect',
    name: 'reportforms-manage',
    alwaysShow: true,
    meta: {
      title: '报表管理',
      icon: 'reportForm',
      roles: ['Menu_DevNumberFormManage', 'Menu_SelfserDevFormManage', 'Menu_TradeInfoFormManage', 'Menu_SitTableFormManage', 'Menu_CashPlanFormManage', 'Menu_BootRateFormManage']
    },
    children: [
      {
        path: 'devNumberFormManage',
        name: 'dev-number-formManage',
        component: () => import('@/views/reportforms-manage/devNumberFormManage'),
        meta: {
          title: '设备数量统计',
          roles: ['Menu_DevNumberFormManage']
        }
      },
      {
        path: 'selfserDevFormManage',
        name: 'selfser-dev-form-manage',
        component: () => import('@/views/reportforms-manage/selfserDevFormManage'),
        meta: {
          title: '自助设备信息',
          roles: ['Menu_SelfserDevFormManage']
        }
      },
      {
        path: 'tradeInfoFormManage',
        name: 'trade-info-form-manage',
        component: () => import('@/views/reportforms-manage/tradeInfoFormManage'),
        meta: {
          title: '交易信息统计',
          roles: ['Menu_TradeInfoFormManage']
        }
      },
      {
        path: 'sitTableFormManage',
        name: 'sit-table-form-manage',
        component: () => import('@/views/reportforms-manage/sitTableFormManage'),
        meta: {
          title: '坐席业务量统计',
          roles: ['Menu_SitTableFormManage']
        }
      },
      {
        path: 'cashPlanFormManage',
        name: 'cash-plan-form-manage',
        component: () => import('@/views/reportforms-manage/cashPlanFormManage'),
        meta: {
          title: '加钞计划表',
          roles: ['Menu_CashPlanFormManage']
        }
      },
      {
        path: 'bootRateFormManage',
        name: 'boot-rate-form-manage',
        component: () => import('@/views/reportforms-manage/bootRateFormManage'),
        meta: {
          title: '开机率统计',
          roles: ['Menu_BootRateFormManage']
        }
      }
    ]
  },
  // 业务查询
  {
    path: '/businessQuery',
    component: Layout,
    redirect: '/businessQuery/queryCleanMachineRecord',
    name: 'business-query',
    meta: {
      title: '业务查询',
      icon: 'search',
      roles: ['Menu_QueryCleanMachineRecord', 'Menu_QueryTransactionDetail', ' Menu_QueryAddCard', 'Menu_QuerySwallowCard', 'Menu_QueryVideoFlow', 'Menu_QueryCardboxInfo', 'Menu_QueryManageOperating', 'Menu_QueryAbnormalInfo']
    },
    children: [
      {
        path: 'queryCleanMachineRecord',
        name: 'query-clean-machine-record',
        component: () => import('@/views/business-query/queryCleanMachineRecord'),
        meta: {
          title: '清机记录查询',
          roles: ['Menu_QueryCleanMachineRecord']
        }
      },
      {
        path: 'queryTransactionDetail',
        name: 'query-transaction-detail',
        component: () => import('@/views/business-query/queryTransactionDetail'),
        meta: {
          title: '交易明细查询',
          roles: ['Menu_QueryTransactionDetail']
        }
      },
      {
        path: 'queryAddCard',
        name: 'query-add-card',
        component: () => import('@/views/business-query/queryAddCard'),
        meta: {
          title: '加卡记录查询',
          roles: ['Menu_QueryAddCard']
        }
      },
      {
        path: 'querySwallowCard',
        name: 'query-swallow-card',
        component: () => import('@/views/business-query/querySwallowCard'),
        meta: {
          title: '吞卡记录查询',
          roles: ['Menu_QuerySwallowCard']
        }
      },
      {
        path: 'queryVideoFlow',
        name: 'query-video-flow',
        component: () => import('@/views/business-query/queryVideoFlow'),
        meta: {
          title: '视频流水查询',
          roles: ['Menu_QueryVideoFlow']
        }
      },
      {
        path: 'queryCardboxInfo',
        name: 'query-cardbox-info',
        component: () => import('@/views/business-query/queryCardboxInfo'),
        meta: {
          title: '卡箱信息查询',
          roles: ['Menu_QueryCardboxInfo']
        }
      },
      {
        path: 'queryManageOperating',
        name: 'query-manage-operating',
        component: () => import('@/views/business-query/queryManageOperating'),
        meta: {
          title: '管理端操作记录',
          roles: ['Menu_QueryManageOperating']
        }
      },
      {
        path: 'queryAbnormalInfo',
        name: 'query-abnormal-info',
        component: () => import('@/views/business-query/queryAbnormalInfo'),
        meta: {
          title: '异常信息查询',
          roles: ['Menu_QueryAbnormalInfo']
        }
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]
