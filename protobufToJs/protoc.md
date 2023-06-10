# 1.protoc工具配置

1. **protoc-gen-grpc-web**是用来生成web js文件的工具
2. 新建个文件夹为(**protobuf**) 
3. 在https://github.com/grpc/grpc-web/releases找到**protoc-gen-grpc-web-1.2.0-windows-x86_64.exe**并且下载
4. 然后改名为 **protoc-gen-grpc-web.exe** 并且移动到 **protobuf** 目录下
5. 在https://github.com/protocolbuffers/protobuf/releases/ 找到  **protoc-3.20.0-win64.zip**并且下载
6. 把zip解压到这个文件夹(**protobuf**)下 
7. 右键此电脑 => 配置高级系统设置=>环境变量=>系统变量 => path新建一个,配置到**protobuf/bin**目录下
8. 把**proto**文件放置在**protobuf**目录下, **cmd**打开当前目录
9. 执行**protoc --version** , 出现 **libprotoc 3.19.4** 表示 **protoc** 安装成功
10. 继续执行下面命令

```+js
protoc -I=./ ./excavator_control.proto --js_out=import_style=commonjs:./ --plugin=protoc-gen-grpc=./protoc-gen-grpc-web.exe --grpc-web_out=import_style=commonjs,mode=grpcwebtext:./
```

11. 生成两个js文件

```+js
excavator_control_pb.js
excavator_control_web_pb.js
```

12.拷贝两个js文件到项目src里面对应的目录内

13.继续在项目安装**grpc-web**以及**google-protobuf**

```+js
npm i grpc-web -S 
npm install google-protobuf
```



proto文件

```+js
syntax = "proto3";

// 服务定义
service ExcavatorCmd {
  rpc meta_cmd (MetaAction) returns (Response) {};
  rpc mission_cmd (MissionAction) returns (Response) {}
}

// 元指令
message MetaAction {
  int32 actor_id = 1;  // 目标挖掘机id
  string timestamp = 2;
  int32 movement = 3;  // 可正可负，单位由具体运动type决定
  enum ActionType {
    STOP = 0;  // 停止，应有最高优先级
    FORWARD = 1;  // 底盘前进
    BACKWARD = 2;  // 底盘后推
    LEFT = 3;  // 底盘左旋转
    RIGHT = 4;  // 底盘右旋转
    ARM_LEFT = 5;  // 挖臂左旋转
    ARM_RIGHT = 6;  // 挖臂右旋转
    BUCKET_ROT = 7;  // 铲斗，movement是角度，往前俯为正。
    ARM_1_ROT = 8;  // 大臂，movement是角度，往前俯为正。
    ARM_2_ROT = 9; // 小臂，movement是角度，往前俯为正。
  }
  ActionType type = 4;
}

// 任务指令
message MissionAction {
  int32 actor_id = 1;
  string timestamp = 2;
  enum ActionType {  // 待设计
    RESET = 0; // 返回初始状态
    PUSH = 1; // 往前推土
    NAV_READY = 2; // 开启导航模式（保留）
    NAV_START = 3; // 开始执行导航 (已从别处获得导航目标)
    NAV_STOP = 4;  //停止导航
  }
  ActionType action = 4;
}

// 返回消息定义
message Response {
  int32 status = 1;
  int32 actor_id = 2;
  string timestamp = 3;
  string message = 4;
}
```
