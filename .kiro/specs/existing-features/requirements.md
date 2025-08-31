# Requirements Document - 现有功能

## Introduction

本文档记录古魂游戏伤害搭配模拟器当前已实现的功能需求。该应用是一个基于Next.js的Web应用，为古魂游戏玩家提供角色搭配模拟、旅团管理和个人设置功能。当前版本包含三个主要模块：模拟搭配、旅团信息和个人设置。

## Requirements

### Requirement 1: 卡牌搭配模拟系统

**User Story:** 作为游戏玩家，我希望能够选择不同类型的卡牌进行搭配组合，以便我能够模拟和测试不同的角色配置方案。

#### Acceptance Criteria

1. WHEN 用户访问模拟搭配页面 THEN 系统 SHALL 显示主卡、赋能、羁绊、套装、装备、远古词条、黄印词条、符文、符文之语等9个卡牌类别选项卡
2. WHEN 用户点击任意选项卡 THEN 系统 SHALL 显示该类别下的所有可用卡牌列表
3. WHEN 用户选择卡牌 THEN 系统 SHALL 将选中的卡牌添加到中央搭配区域
4. WHEN 用户查看卡牌详情 THEN 系统 SHALL 显示卡牌的属性、技能描述、品质等级和预览图片
5. IF 用户选择了冲突的卡牌组合 THEN 系统 SHALL 允许选择但不进行冲突检测

### Requirement 2: 卡牌数据展示系统

**User Story:** 作为游戏玩家，我希望能够查看每张卡牌的详细信息，包括属性数值、技能效果和品质等级，以便我能够做出明智的搭配选择。

#### Acceptance Criteria

1. WHEN 用户查看主卡信息 THEN 系统 SHALL 显示卡牌的攻击力、属性伤害、暴击相关数值等详细属性
2. WHEN 用户查看卡牌品质 THEN 系统 SHALL 通过颜色和标识区分至臻、传说、史诗等不同品质等级
3. WHEN 用户查看技能描述 THEN 系统 SHALL 显示主动技能、常驻技能和临时技能的具体效果
4. WHEN 用户查看卡牌类型 THEN 系统 SHALL 显示进攻、防御、灵能、生存、守护等角色定位
5. IF 卡牌包含特殊效果 THEN 系统 SHALL 在技能描述中明确标注持续时间和数值

### Requirement 3: 旅团信息管理系统

**User Story:** 作为旅团成员，我希望能够查看和管理旅团的成员信息、分组情况和积分记录，以便更好地进行团队协作和管理。

#### Acceptance Criteria

1. WHEN 用户访问旅团信息页面 THEN 系统 SHALL 显示三栏布局：历史分组、当前分组编辑区、临时分组
2. WHEN 用户查看当前分组 THEN 系统 SHALL 以3x2网格形式显示6个小队，每个小队最多3名成员
3. WHEN 用户拖拽成员头像 THEN 系统 SHALL 支持成员在不同小队间的拖拽移动
4. WHEN 用户编辑小队积分 THEN 系统 SHALL 支持点击积分数字进行内联编辑
5. IF 成员被设置为队长 THEN 系统 SHALL 显示特殊的金色高亮效果和标签

### Requirement 4: 成员拖拽管理功能

**User Story:** 作为旅团管理员，我希望能够通过拖拽操作来重新分配成员到不同的小队，以便快速调整团队配置。

#### Acceptance Criteria

1. WHEN 用户拖拽成员头像到其他小队 THEN 系统 SHALL 将成员移动到目标小队
2. WHEN 用户拖拽成员到未分组池 THEN 系统 SHALL 将成员从当前小队移除
3. WHEN 小队已满3人时 THEN 系统 SHALL 拒绝新成员的拖入操作
4. WHEN 成员是队长时 THEN 系统 SHALL 禁止该成员的拖拽操作
5. IF 拖拽操作失败 THEN 系统 SHALL 将成员返回到原始位置

### Requirement 5: 分组数据持久化

**User Story:** 作为用户，我希望我的分组配置能够被保存，以便下次访问时能够恢复之前的设置。

#### Acceptance Criteria

1. WHEN 用户修改分组配置 THEN 系统 SHALL 自动将数据保存到localStorage
2. WHEN 用户刷新页面 THEN 系统 SHALL 从localStorage恢复之前的分组状态
3. WHEN 用户保存临时分组 THEN 系统 SHALL 将分组数据添加到临时分组列表
4. WHEN 用户加载历史分组 THEN 系统 SHALL 从JSON文件读取历史分组数据
5. IF localStorage数据损坏 THEN 系统 SHALL 使用默认的空分组状态

### Requirement 6: 分组导出功能

**User Story:** 作为用户，我希望能够将当前的分组配置导出为图片，以便分享给其他团队成员。

#### Acceptance Criteria

1. WHEN 用户点击分组标题 THEN 系统 SHALL 触发图片导出功能
2. WHEN 导出图片时 THEN 系统 SHALL 使用html2canvas库生成PNG格式图片
3. WHEN 图片生成完成 THEN 系统 SHALL 自动下载图片到用户设备
4. WHEN 导出过程中 THEN 系统 SHALL 包含所有可见的分组信息和成员头像
5. IF 导出失败 THEN 系统 SHALL 在控制台输出错误信息

### Requirement 7: 个人设置系统

**User Story:** 作为游戏玩家，我希望能够查看和管理个人的角色信息和搭配配置，以便跟踪我的游戏进度。

#### Acceptance Criteria

1. WHEN 用户访问个人设置页面 THEN 系统 SHALL 显示角色信息展示区和搭配详情区
2. WHEN 用户查看角色信息 THEN 系统 SHALL 显示角色头像、昵称、等级和职业信息
3. WHEN 用户切换角色 THEN 系统 SHALL 通过右下角悬浮按钮支持多角色切换
4. WHEN 用户查看搭配详情 THEN 系统 SHALL 以只读模式显示当前角色的装备配置
5. IF 用户选择不同角色 THEN 系统 SHALL 更新显示对应角色的属性和搭配信息

### Requirement 8: 响应式界面布局

**User Story:** 作为移动设备用户，我希望应用能够在不同屏幕尺寸下正常显示和操作，以便我能够随时随地使用该工具。

#### Acceptance Criteria

1. WHEN 用户在桌面端访问 THEN 系统 SHALL 显示完整的三栏或多栏布局
2. WHEN 用户在移动端访问 THEN 系统 SHALL 自动调整为单栏布局
3. WHEN 屏幕尺寸改变时 THEN 系统 SHALL 动态调整卡牌网格的列数
4. WHEN 用户在触屏设备操作 THEN 系统 SHALL 支持触摸拖拽和点击操作
5. IF 屏幕空间不足 THEN 系统 SHALL 提供滚动和折叠功能

### Requirement 9: 导航和页面切换

**User Story:** 作为用户，我希望能够在不同功能模块间快速切换，以便高效地使用各项功能。

#### Acceptance Criteria

1. WHEN 用户访问应用 THEN 系统 SHALL 在顶部显示模拟搭配、旅团信息、个人设置三个导航选项
2. WHEN 用户点击导航按钮 THEN 系统 SHALL 立即切换到对应的功能页面
3. WHEN 当前页面激活时 THEN 系统 SHALL 高亮显示对应的导航按钮
4. WHEN 用户切换页面时 THEN 系统 SHALL 保持页面状态不丢失
5. IF 页面加载失败 THEN 系统 SHALL 显示友好的错误提示

### Requirement 10: 数据加载和错误处理

**User Story:** 作为用户，我希望应用能够稳定地加载游戏数据，并在出现问题时给出清晰的提示信息。

#### Acceptance Criteria

1. WHEN 应用启动时 THEN 系统 SHALL 从public/data目录加载所有卡牌和成员数据
2. WHEN 数据加载中时 THEN 系统 SHALL 显示"加载中..."的提示信息
3. WHEN 数据加载失败时 THEN 系统 SHALL 在控制台输出详细的错误信息
4. WHEN 网络请求超时时 THEN 系统 SHALL 尝试重新加载数据
5. IF 关键数据缺失 THEN 系统 SHALL 使用默认数据确保基本功能可用