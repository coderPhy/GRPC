import {
  setExcavatorCmdClient,
  responseHandler,
  errorHandler
} from '@/protobuf'

export function getSendGrpcFunList (ExcavatorCmdClientBaseUrl) {
  let sendGrpc = setExcavatorCmdClient(ExcavatorCmdClientBaseUrl)
  // Meta类型
  // 停止
  const stopFun = (values) => (
    sendGrpc('meta_cmd', {
      actor_id: 1,
      movement: 10,
      ...values
    })
      .then((response) => responseHandler(response, '停止操作'))
      .catch(errorHandler)
  )
  // 底盘前后左右
  const underpanChangeFun = (values) => (
    sendGrpc('meta_cmd', {
      ...values
    })
      .then((response) => {
        let text = ''
        switch (values.type) {
          case 'FORWARD': {
            text = '底盘前进'
            break
          }
          case 'RIGHT': {
            text = '底盘右旋转'
            break
          }
          case 'BACKWARD': {
            text = '底盘后退'
            break
          }
          case 'LEFT': {
            text = '底盘左旋转'
            break
          }
          default: {
            text = '底盘组合方向键操作'
          }
        }
        responseHandler(response, `${text}操作`)
      })
      .catch(errorHandler)
  )
  // 挖臂旋转操作 (未通过按键触发)
  const robotArmRotateFun = (values) => (
    sendGrpc('meta_cmd', {
      actor_id: 1,
      movement: 10,
      ...values
    })
      .then((response) => responseHandler(response, '挖臂旋转操作'))
      .catch(errorHandler)
  )
  // 铲斗操作
  const bucketChangeFun = (values) => (
    sendGrpc('meta_cmd', {
      actor_id: 1,
      movement: 10,
      ...values
    })
      .then((response) => responseHandler(response, '铲斗操作'))
      .catch(errorHandler)
  )
  // 小臂操作
  const smallChangeFun = (values) => (
    sendGrpc('meta_cmd', {
      actor_id: 1,
      movement: 10,
      ...values
    })
      .then((response) => responseHandler(response, '小臂操作'))
      .catch(errorHandler)
  )
  // 大臂操作
  const bigChangeFun = (values) => {
    sendGrpc('meta_cmd', {
      actor_id: 1,
      movement: 10,
      ...values
    })
      .then((response) => responseHandler(response, '大臂操作'))
      .catch(errorHandler)
  }

  // 驾驶舱旋转
  const cockpitTurnFun = (values) => (
    sendGrpc('meta_cmd', {
      actor_id: 1,
      movement: 10,
      ...values
    })
      .then((response) => responseHandler(response, '驾驶舱旋转操作'))
      .catch(errorHandler)
  )
  // 推土上抬
  const bulldozingUpFun = (values) => (
    sendGrpc('meta_cmd', {
      actor_id: 1,
      movement: 10,
      ...values
    })
      .then((response) => responseHandler(response, '推土上抬操作'))
      .catch(errorHandler)
  )
  // 推土下方
  const bulldozingDowmFun = (values) => (
    sendGrpc('meta_cmd', {
      actor_id: 1,
      movement: 10,
      ...values
    })
      .then((response) => responseHandler(response, '推土下方操作'))
      .catch(errorHandler)
  )
  // 冲击锤
  const shockHammerFun = (values) => (
    sendGrpc('meta_cmd', {
      actor_id: 1,
      movement: 10,
      ...values
    })
      .then((response) => responseHandler(response, '冲击锤操作'))
      .catch(errorHandler)
  )

  // Mission类型
  // 返回初始状态
  const resetFun = (values) => (
    sendGrpc('mission_cmd', { ...values })
      .then((response) => responseHandler(response, '返回初始状态'))
      .catch(errorHandler)
  )

  // 往前推土
  const pushFun = (values) => (
    sendGrpc('mission_cmd', { ...values })
      .then((response) => responseHandler(response, '往前推土操作'))
      .catch(errorHandler)
  )
  // 挖土
  const excavateFun = (values) => (
    sendGrpc('mission_cmd', { ...values })
      .then((response) => responseHandler(response, '挖土操作'))
      .catch(errorHandler)
  )
  // 开启导航模式
  const nav_readyFun = (values) => (
    sendGrpc('mission_cmd', { ...values })
      .then((response) => responseHandler(response, '开始导航操作'))
      .catch(errorHandler)
  )

  // 开始执行导航
  const nav_startFun = (values) => (
    sendGrpc('mission_cmd', { ...values })
      .then((response) => responseHandler(response, '开始执行导航操作'))
      .catch(errorHandler)
  )

  // 停止导航
  const nav_stopFun = (values) => (
    sendGrpc('mission_cmd', { ...values })
      .then((response) => responseHandler(response, '停止导航操作'))
      .catch(errorHandler)
  )
  // 自动挖掘开始
  const auto_working_startFun = (values) => {
    let callback = ""
    sendGrpc('mission_cmd', { ...values })
      .then((response) => responseHandler(response, '自动挖掘开始', callback))
      .catch(errorHandler)
  }
  // 自动挖掘结束
  const auto_working_endFun = (values) => {
    let callback = ""
    sendGrpc('mission_cmd', {
      actor_id: 1,
      movement: 10,
      ...values,
    })
      .then((response) => responseHandler(response, '自动挖掘结束'), callback)
      .catch(errorHandler)
  }

  // 选择卸料点
  const selectUnloadingPointFun = (values) => ("")
  return {
    stopFun, underpanChangeFun, robotArmRotateFun, bucketChangeFun,
    smallChangeFun, bigChangeFun, cockpitTurnFun, bulldozingUpFun,
    bulldozingDowmFun, shockHammerFun, resetFun, pushFun, excavateFun,
    nav_readyFun, nav_startFun, nav_stopFun, auto_working_startFun,
    auto_working_endFun, selectUnloadingPointFun
  }
}
