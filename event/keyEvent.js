import { reactive } from "vue"
import { ClientControlCarUrl } from "@/api"
import { initMap } from "./keyCodeToTypeMap"

export default function (isDirection, isAction, isOuter, isAgreeFn) {
  let tempDirectionArray = reactive([])
  let continueDirectionArray = reactive([])
  let tempActionArray = reactive([])
  let continueActionArray = reactive([])
  // 记录上一次执行的时间戳
  let time = new Date().getTime()
  // 方向键定时器
  let directionTimer = null;
  // 方向键临时定时器
  let directionTempTimer = null;
  // 字母键定时器
  let actionTimer = null;
  // 字母键临时定时器
  let actionTempTimer = null;
  let { directionMap, actionMap, assistMap,
    collideMap, directionGroupMap, finalSendMap,
  }
    = initMap(ClientControlCarUrl)

  /**
   * 判断是否存在冲突
   * @param {Array} array 临时和活跃数组
   * @param {Map} collideMap 冲突的集合
   * @returns true 存在冲突 false 不存在冲突
   */
  function ifFountCollide (array, collideMap) {
    if (array.length < 2) return false
    for (let i = 0; i < array.length; i++) {
      for (let ii = i + 1; ii < array.length; ii++) {
        let firstType = array[i].type
        let lastType = array[ii].type
        if (collideMap.get(firstType) === lastType) {
          console.log("冲突");
          return true
        }
      }
    }
    return false
  }
  /**
   * 发送请求
   * @param {Object} obj
   */
  function sendFn ({ fn, type }) {
    let finalType = finalSendMap.get(type)
    console.log("finalType:", finalType);
    if ([1, 2, 3, 4].includes(type)) {
      fn({
        actor_id: 1,
        type: finalType
      })
    } else {
      fn({
        actor_id: 1,
        movement: 10,
        type: finalType
      })
    }
  }
  function verifyKeyCode ({ keyCode, map }) {
    return map.get(keyCode)
  }
  /**
   * 转换类型
   * @param {String} type 类型
   * @returns 转换后的type
   */
  function transformType (type) {
    switch (type) {
      case "ArrowUp": {
        type = "FORWARD"
        break
      }
      case "ArrowDown": {
        type = "BACKWARD"
        break
      }
      case "ArrowLeft": {
        type = "LEFT"
        break
      }
      case "ArrowRight": {
        type = "RIGHT"
        break
      }
    }
    return type
  }
  /**
   * 组合方向
   * @param {Array} array 临时数组+活跃数组
   * @returns
   */
  function groupKeyCode (array) {
    if (array.length === 1) return
    for (const [key, value] of directionGroupMap) {
      let [firstType, lastType] = value
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if (element.type === firstType || element.type === lastType) {
          let nextNeedFindType = element.type === firstType ? lastType : firstType
          // 另一个组合对象在数组中的索引
          let findIndex = array.findIndex(item => nextNeedFindType === item.type)
          if (findIndex === -1) break
          array.splice(index, 1)
          // 删除了一个后，数组总长度-1了
          findIndex = findIndex > index ? findIndex - 1 : findIndex
          array.splice(findIndex, 1)
          array.push({ isGroup: true, startTime: Date.now(), ...directionMap.get(key) })
        }
      }
    }
  }
  // 在临时数组、活跃数组中通过keyCode查找元素
  function findObjFn ({ keyCode, tempArray, continueArray, map }) {
    let tempObj = tempArray.find(item => item.type === keyCode)
    let continuObj = continueArray.find(item => item.type === keyCode)
    let isFoundGroup = false
    for (let index = 0; index < continueArray.length; index++) {
      // 活跃数组中的对象
      const element = continueArray[index];
      // 不是组合对象就continue
      if (!element.isGroup) continue
      for (const [key, value] of map) { // map  directionMap
        if (keyCode === value[0] || keyCode === value[1])
          isFoundGroup = true
      }
    }
    for (let index = 0; index < tempArray.length; index++) {
      const element = tempArray[index];
      if (!Object.keys(element).includes("isGroup") || !element.isGroup) continue
      for (const [key, value] of map) {
        if (keyCode === value.firstType || keyCode === value.lastType)
          isFoundGroup = true
      }
    }

    return {
      tempObj,
      continuObj,
      isFoundGroup
    }
  }

  function initDirectionFun ({ keyCode, event, tempArray, continueArray }) {
    // 不是指定按键不监听
    let o = verifyKeyCode({ keyCode, map: directionMap })
    if (!o) return
    // 阻止事件默认行为
    event.preventDefault();
    let { type, fn } = o
    // 在数组中查找对象元素
    let { tempObj, continuObj, isFoundGroup } = findObjFn({
      keyCode,
      tempArray,
      continueArray,
      map: directionGroupMap
    })
    // 添加到临时数组
    // 在临时数组跟活跃数组中都不存在, 并且数组长度小于2时, 不存在跟当前事件相关组合事件
    if (!tempObj && !continuObj && tempArray.length + continueArray.length < 2
      && !isFoundGroup) {
      tempArray.push({
        type: keyCode,
        fn,
        startTime: Date.now()
      })
    }
    // 遍历临时数组中的每个元素
    // 触发时间>=150ms的元素加入活跃数组, <150ms直接执行
    for (let i = 0; i < tempArray.length; i++) {
      let obj = tempArray[i]
      if (Date.now() - obj.startTime >= 150) {
        let tempIndex = i
        let continueIndex = continueArray.
          findIndex(item => item.type === obj.type)
        // 将对象加入活跃数组中
        if (continueIndex === -1 && continueArray.length < 2) continueArray.push(obj)
        // 临时数组中删除对象
        if (tempIndex !== -1) tempArray.splice(tempIndex, 1)
        clearInterval(directionTempTimer)
        directionTempTimer = null
      } else {
        let collideResult = ifFountCollide(continueArray.concat(tempArray),
          collideMap)
        if (collideResult || directionTempTimer) return
        sendFn(obj)
        directionTempTimer = setInterval(() => {
          sendFn(obj)
        }, 150)
      }
    }

    // 开启定时器 遍历出活跃数组中的每一个元素,不存在冲突就执行
    if (directionTimer) return
    directionTimer = setInterval(() => {
      let collideResult = ifFountCollide(continueArray.concat(tempArray), collideMap)
      if (collideResult) return
      groupKeyCode(continueArray)
      for (const obj of continueArray) {
        sendFn(obj)
      }
    }, 150)
  }
  function initActionFun ({ keyCode, event, tempArray, continueArray }) {
    let o = verifyKeyCode({ keyCode, map: actionMap })
    // 阻止事件默认行为 在数组中查找对象元素
    if (!o) return
    event.preventDefault();
    let { fn } = o
    let { tempObj, continuObj } = findObjFn({
      keyCode,
      tempArray,
      continueArray
    })

    // 添加到临时数组
    // 在临时数组跟活跃数组中都不存在, 并且两个数组总长度小于3时
    if (!tempObj && !continuObj && tempArray.length + continueArray.length < 3) {
      tempArray.push({
        type: keyCode,
        fn,
        startTime: Date.now()
      })
    }
    // 遍历临时数组中的每个元素
    // 触发时间>=150ms的元素加入活跃数组, <150ms直接执行
    for (let i = 0; i < tempArray.length; i++) {
      let obj = tempArray[i]
      if (Date.now() - obj.startTime >= 150) {
        let tempIndex = i
        let continueIndex = continueArray.
          findIndex(item => item.type === obj.keyCode)
        // 将对象加入活跃数组中
        if (continueIndex === -1 && continueArray.length < 3) continueArray.push(obj)
        // 临时事件数组中删除对象
        if (tempIndex !== -1) tempArray.splice(tempIndex, 1)
        clearInterval(actionTempTimer)
        actionTempTimer = null
      } else {
        let collideResult = ifFountCollide(continueArray.concat(tempArray), collideMap)
        // 判断是否存在冲突按键组、字母的临时数组
        if (collideResult || actionTempTimer) return
        sendFn(obj)
        actionTempTimer = setInterval(() => {
          sendFn(obj)
        }, 150)
      }
    }
    // 开启定时器 遍历出活跃数组中的每一个元素,不存在冲突就执行
    if (actionTimer) return
    actionTimer = setInterval(() => {
      let collideResult = ifFountCollide(continueArray.concat(tempArray), collideMap)
      if (collideResult) return
      for (const obj of continueArray) {
        sendFn(obj)
      }
    }, 150)
  }

  function removeDirectionFun ({ keyCode, event, tempArray, continueArray }) {
    // 不是指定按键不监听
    let o = verifyKeyCode({ keyCode, map: directionMap })
    if (!o) return
    // 阻止事件默认行为
    event.preventDefault();
    let { fn, type } = o
    let tempIndex = tempArray.findIndex(item => item.type === keyCode)
    let continueIndex = continueArray.findIndex(item => item.type === keyCode)
    // 过滤出组合事件
    let continuGroupArray = continueArray.filter(item => !!item.isGroup)
    // 存在组合事件数组
    if (continuGroupArray.length) {
      // 遍历组合事件数组
      for (const item of continuGroupArray) {
        // 拿到组合事件对应的子事件类型
        let types = directionGroupMap.get(item.type)
        if (types.includes(keyCode)) {
          // 找到应该加入定时器去执行的事件对象
          let existsType = types.find(item => item !== keyCode)
          // 添加到活跃数组中
          continueArray.push({
            type: existsType,
            fn,
            startTime: Date.now()
          })
          // 找到组合事件对象的索引
          let groupIndex = continueArray.findIndex(item2 => item2.type === item.type)
          // 删除组合事件
          continueArray.splice(groupIndex, 1)
          break
        }
      }
    } else {
      // 删除活跃数组和临时数组中的一个对象
      if (tempIndex !== -1) tempArray.splice(tempIndex, 1)
      if (continueIndex !== -1) continueArray.splice(continueIndex, 1)
    }
    // continue数组为空时清除定时器
    if (!continueArray.length) {
      clearInterval(directionTimer)
      directionTimer = null
      clearInterval(directionTempTimer)
      directionTempTimer = null
    }
  }
  function removeActionFun ({ keyCode, event, tempArray, continueArray }) {
    let o = verifyKeyCode({ keyCode, map: actionMap })
    if (!o) return
    event.preventDefault();

    let tempIndex = tempArray.findIndex(item => item.type === keyCode)
    let continueIndex = continueArray.findIndex(item => item.type === keyCode)
    // 删除活跃数组和临时数组中的一个对象
    if (continueIndex !== -1) continueArray.splice(continueIndex, 1)
    if (tempIndex !== -1) tempArray.splice(tempIndex, 1)
    // continue数组为空时清除定时器
    if (!continueArray.length) {
      clearInterval(actionTimer)
      actionTimer = null
      clearInterval(actionTempTimer)
      actionTempTimer = null
    }
  }
  function initOuterFun ({ keyCode }) {
    let o = verifyKeyCode({ keyCode, map: assistMap })
    if (!o) return
    event.preventDefault();
    sendFn(o)
  }
  document.addEventListener('keydown', (event = window.event) => {
    if (isAgreeFn?.()) return
    isDirection ? initDirectionFun({
      // keyCode: transformType(event.code),
      keyCode: (event.code),
      event,
      tempArray: tempDirectionArray,
      continueArray: continueDirectionArray
    }) : ""
    isAction ? initActionFun({
      keyCode: event.code,
      event,
      tempArray: tempActionArray,
      continueArray: continueActionArray
    }) : ""
    isOuter ? initOuterFun({
      keyCode: event.code
    }) : ""
  })
  document.addEventListener('keyup', (event = window.event) => {
    if (isAgreeFn?.()) return
    isDirection ? removeDirectionFun({
      // keyCode: transformType(event.code),
      keyCode: (event.code),
      event,
      tempArray: tempDirectionArray,
      continueArray: continueDirectionArray
    }) : ""
    isAction ? removeActionFun({
      keyCode: event.code,
      event,
      tempArray: tempActionArray,
      continueArray: continueActionArray
    }) : ""
  })
}
