import { getSendGrpcFunList } from "./webGrpcRequestFunList"

export function initMap (ExcavatorCmdClientBaseUrl) {
  let {
    stopFun, underpanChangeFun, robotArmRotateFun, bucketChangeFun, smallChangeFun,
    bigChangeFun, cockpitTurnFun, bulldozingUpFun, bulldozingDowmFun, shockHammerFun,
    resetFun, pushFun, excavateFun, nav_readyFun, nav_startFun, nav_stopFun,
    auto_working_startFun, auto_working_endFun, selectUnloadingPointFun
  } = getSendGrpcFunList(ExcavatorCmdClientBaseUrl)

  let directionMap = new Map()
  let actionMap = new Map()
  // 辅助map
  let assistMap = new Map()
  // 冲突map
  let collideMap = new Map()
  // 方向组合map
  let directionGroupMap = new Map()
  // 驾驶舱旋转映射map
  let cockpitTurnTransformationMap = new Map()

  let finalSendMap = new Map()

  // 前后左右 keycode
  directionMap.set("ArrowUp", {
    type: "ArrowUp",
    fn: underpanChangeFun
  })
  directionMap.set("ArrowDown", {
    type: "ArrowDown",
    fn: underpanChangeFun
  })
  directionMap.set("ArrowLeft", {
    type: "ArrowLeft",
    fn: underpanChangeFun
  })
  directionMap.set("ArrowRight", {
    type: "ArrowRight",
    fn: underpanChangeFun
  })
  directionMap.set("ArrowDown_ArrowLeft", {
    type: "ArrowDown_ArrowLeft",
    fn: underpanChangeFun
  })
  directionMap.set("ArrowDown_ArrowRight", {
    type: "ArrowDown_ArrowRight",
    fn: underpanChangeFun
  })
  directionMap.set("ArrowUp_ArrowLeft", {
    type: "ArrowUp_ArrowLeft",
    fn: underpanChangeFun
  })
  directionMap.set("ArrowUp_ArrowRight", {
    type: "ArrowUp_ArrowRight",
    fn: underpanChangeFun
  })

  // 旋转
  directionMap.set("KeyS", {
    type: "ARM_LEFT",
    fn: stopFun
  })
  directionMap.set("KeyW", {
    type: "ARM_RIGHT",
    fn: stopFun
  })

  directionGroupMap.set("ArrowDown_ArrowLeft", ["ArrowUp", "ArrowLeft"])
  directionGroupMap.set("ArrowDown_ArrowRight", ["ArrowUp", "ArrowRight"])
  directionGroupMap.set("ArrowUp_ArrowLeft", ["ArrowDown", "ArrowLeft"])
  directionGroupMap.set("ArrowUp_ArrowRight", ["ArrowDown", "ArrowRight"])


  cockpitTurnTransformationMap.set("KeyS", "COCKPIT_LEFT")
  cockpitTurnTransformationMap.set("KeyW", "COCKPIT_RIGHT")

  // 铲斗
  actionMap.set("KeyL", {
    fn: bucketChangeFun,
    type: "increment",
  })
  actionMap.set("KeyJ", {
    fn: bucketChangeFun,
    type: "decrement"
  })

  // 小臂
  actionMap.set("KeyA", {
    fn: smallChangeFun,
    type: "increment"
  })
  actionMap.set("KeyD", {
    fn: smallChangeFun,
    type: "decrement"
  })
  // 大臂
  actionMap.set("KeyK", {
    fn: bigChangeFun,
    type: "increment"
  })
  actionMap.set("KeyI", {
    fn: bigChangeFun,
    type: "decrement"
  })

  // 左回转 右回转
  actionMap.set("KeyS", {
    fn: cockpitTurnFun,
    type: "COCKPIT_LEFT"
  })
  actionMap.set("KeyW", {
    fn: cockpitTurnFun,
    type: "COCKPIT_RIGHT"
  })

  actionMap.set("KeyT", {
    fn: bulldozingUpFun,
    type: "TT_UP"
  })
  actionMap.set("KeyG", {
    fn: bulldozingDowmFun,
    type: "TT_DOWN"
  })
  actionMap.set("KeyF", {
    fn: shockHammerFun,
    type: "HAMMER"
  })

  assistMap.set("Digit1", {
    fn: selectUnloadingPointFun,
    type: 1
  })
  assistMap.set("Digit2", {
    fn: selectUnloadingPointFun,
    type: 2
  })
  assistMap.set("Digit3", {
    fn: selectUnloadingPointFun,
    type: 3
  })
  assistMap.set("Digit4", {
    fn: selectUnloadingPointFun,
    type: 4
  })
  assistMap.set("Enter", {
    fn: auto_working_startFun,
    type: "auto_working_start"
  })
  assistMap.set("Backspace", {
    fn: auto_working_endFun,
    type: "auto_working_end"
  })

  // 冲突map
  collideMap.set("ArrowUp", "ArrowDown")
  collideMap.set("ArrowDown", "ArrowUp")
  collideMap.set("ArrowLeft", "ArrowRight")
  collideMap.set("ArrowRight", "ArrowLeft")

  collideMap.set("KeyQ", "KeyA")
  collideMap.set("KeyA", "KeyQ")
  collideMap.set("KeyW", "KeyS")
  collideMap.set("KeyS", "KeyW")
  collideMap.set("KeyE", "KeyD")
  collideMap.set("KeyD", "KeyE")
  collideMap.set("KeyZ", "KeyC")
  collideMap.set("KeyC", "KeyZ")
  collideMap.set("KeyT", "KeyG")
  collideMap.set("KeyG", "KeyT")

  finalSendMap.set("ArrowUp", "FORWARD")
  finalSendMap.set("ArrowDown", "BACKWARD")
  finalSendMap.set("ArrowLeft", "LEFT")
  finalSendMap.set("ArrowRight", "RIGHT")

  finalSendMap.set("ArrowUp_ArrowLeft", "FORWARD_LEFT")
  finalSendMap.set("ArrowUp_ArrowRight", "FORWARD_RIGHT")
  finalSendMap.set("ArrowDown_ArrowLeft", "BACKWARD_LEFT")
  finalSendMap.set("ArrowDown_ArrowRight", "BACKWARD_RIGHT")


  //
  //
  finalSendMap.set("KeyL", "increment")
  finalSendMap.set("KeyA", "increment")
  finalSendMap.set("KeyK", "increment")
  finalSendMap.set("KeyJ", "decrement")
  finalSendMap.set("KeyD", "decrement")
  finalSendMap.set("KeyI", "decrement")


  finalSendMap.set("KeyS", "COCKPIT_LEFT")
  finalSendMap.set("KeyW", "COCKPIT_RIGHT")





  return {
    directionMap,
    actionMap,
    assistMap,
    collideMap,
    directionGroupMap,
    cockpitTurnTransformationMap,
    finalSendMap
  }
}
