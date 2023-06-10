import { ElMessage } from 'element-plus'

const {
  ExcavatorCmdPromiseClient
} = require('./excavator_control_grpc_web_pb.js')
const { MetaAction, MissionAction = function () { } } = require('./excavator_control_pb.js')

let MetaActionType = []
let MissionActionType = []
for (const key in MetaAction.ActionType) {
  MetaActionType.push(key)
}

for (const key in MissionAction.ActionType) {
  MissionActionType.push(key)
}

/**
 * 返回grpc参数对象
 * @param {*} dataType
 * @param {Object} values
 * @returns Object
 */
function verifyType (dataType, values) {
  let { actor_id = 1, timestamp, movement = 1, type } = values
  dataType.setActorId(actor_id)
  dataType.setTimestamp(timestamp)
  dataType.setType(MetaActionType.findIndex((item) => item === type))
  if (dataType instanceof MetaAction) {
    dataType.setMovement(movement)
  } else if (dataType instanceof MissionAction) {
  }
  return dataType
}

export function setExcavatorCmdClient (baseUrl) {
  let client = new ExcavatorCmdPromiseClient(baseUrl)
  let meta = new MetaAction()
  let mission = new MissionAction()
  return function (rpcType, values) {
    // rpcCmd: 调用的类型
    let rpcCmd = rpcType === 'meta_cmd' ? client.meta_cmd : client.mission_cmd
    let dataType = rpcType === 'meta_cmd' ? meta : mission
    return rpcCmd.call(
      client,
      verifyType(dataType, {
        timestamp: new Date().getTime().toString(),
        ...values
      }),
      {}
    )
  }
}
export function responseHandler (response, text) {
  let status = response.getStatus() === 0 ? '失败' : '成功'
  let message = response.getMessage()
  ElMessage({
    type: status === '成功' ? 'success' : 'warning',
    message: `${text}:${status},${message}`,
    offset: -10,
    duration: 400,
    customClass: "warningBubbleBox"
  })
}
export function successHandler () {
}
export function errorHandler (errorText) {
  ElMessage.info({
    message: `操作失败`,
    offset: -10,
    duration: 400,
    customClass: "warningBubbleBox"
  })
}
