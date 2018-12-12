import router from '../router'
import store from '../store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { setToken, setUserId } from '@/utils/auth'
import request from '@/utils/request'
import SSO from '@/message/login/sso'

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (Object.keys(to.query).length === 0) {
    next()
  } else {
    SSOLogin(to.query, next)
  }
  NProgress.done()
})

/**
 * @package SSO登录上送数据
 * @param val: URL参数
 * @param next: router设置项
 */
function SSOLogin(val, next) {
  const resBody = new SSO()
  resBody.data.userId = val.id
  resBody.data.token = val.token
  request(resBody)
    .then(response => {
      if (response.SYS_HEAD.ReturnCode === '000000') {
        const data = response.SYS_HEAD
        next({ path: '/' })
        setToken(data.aumsToken)
        setUserId(response.RSP_BODY.userId)
        store.dispatch('SSOLogin', data)
        Message.success(response.ReturnMessage || '登录成功')
      } else {
        Message.error(response.ReturnMessage || '登录失败')
        next({ path: '/' })
      }
    })
}
