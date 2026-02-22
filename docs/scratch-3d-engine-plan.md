# Scratch 风格 3D 游戏引擎（MMD/VMD）实现方案

这个仓库目前还是 2D Scratch 架构，本次先提供一个 **可运行的 3D 扩展骨架**，让你可以用积木描述 3D 场景数据，再逐步补齐渲染器。

## 已完成（当前提交）

- 新增 VM 内建扩展 `engine3d`，提供以下积木：
  - 导入 MMD 模型 URL
  - 导入 VMD 动作 URL
  - 设置物体 3D 坐标（x/y/z）
  - 设置摄像机位置
  - 设置摄像机注视点
  - 设置光照（强度、颜色）
  - 触发场景渲染事件
  - 读取物体某一坐标轴数值
- 扩展会在 `render 3D scene` 时向 runtime 派发 `ENGINE_3D_SCENE_CHANGED` 事件。

## 目标能力和落地路径

### 1) MMD/PMX 与 VMD 导入

建议在 GUI 侧引入 three.js + mmd-loader 或同等能力模块，监听 VM 派发的 `ENGINE_3D_SCENE_CHANGED` 事件并加载：

- `modelUrl` -> PMX/PMD 解析
- `motionUrl` -> VMD 动作绑定

### 2) 原生 3D 坐标系

当前扩展已把对象状态以 `{x, y, z}` 保存，后续建议：

- 在 target 或 runtime 层增加 `threeDTransform` 结构
- 序列化到 sb3（扩展字段）
- 为积木新增旋转（欧拉角/四元数）与缩放

### 3) 3D 舞台与摄像机系统

- 在 `scratch-gui` 舞台区域挂载 WebGL Canvas（three.js 渲染）
- 支持透视/正交相机切换
- 提供“跟随目标”“轨道控制”“第一人称”积木

### 4) 渲染与光照系统

建议先实现：

- 环境光、方向光、点光源
- 阴影开关与质量档位
- 后处理（Bloom/FXAA）可选

## 推荐下一步

1. 在 `scratch-gui` 增加 3D 扩展卡片入口并可视化预览。
2. 在 `scratch-render` 旁新增 `scratch-render-3d` 包，专门处理 WebGL 场景。
3. 增加 sb3 工程序列化/反序列化支持，保证项目保存后可恢复 3D 场景。
4. 补齐碰撞体、物理（Ammo.js / Rapier）与事件积木（碰撞开始/结束）。
