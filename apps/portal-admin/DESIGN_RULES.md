# Design System

## Product Context

本规范用于“深圳国际科技信息中心 / 国科信”相关后台、数据平台和业务系统页面生成。Figma 来源为 `国科信-设计规范`，当前可读取到的文件封面与组件库信息显示：品牌主视觉以深蓝为核心，组件体系基于 Arco Design System，并在国科信组件库中定制了按钮、输入框、单选、卡片、标签、标签页、上传与图标资产。

页面应呈现政府科技、信息服务、数据治理类产品的稳定、清晰、可信气质。界面优先服务高频操作、数据扫描、表单录入和状态判断，不做营销化、插画化或过度装饰的表达。

## Current Implementation Contract / 当前实现合同

### 唯一规范与优先级

本文件是“门户后台管理系统”当前唯一主规范，同时包含视觉系统、页面内容结构和已实现交互。项目内 DESIGN_RULES.md 为主文件，桌面上的“国科信 design.md”只作为同内容镜像，不再作为另一套独立规则维护。

发生冲突时，固定按以下顺序处理：

1. 当前已实现页面，即 src/App.tsx 与 src/styles.css 中可见、可操作的结果。
2. 用户在当前任务中最后一次明确确认的内容或样式。
3. 本节“当前实现合同”中的页面与组件规则。
4. 本文件后续章节中的通用设计系统规则。
5. 历史截图、旧组件示例和旧规范描述。

因此，本文件后续若存在与本节不同的旧尺寸、旧字段、旧流程或旧布局，必须以本节和当前页面为准。不得为了套用历史规范而改回已经确认的页面。

### 当前实现范围

当前前端是可交互演示系统，业务数据主要保存在浏览器运行时状态中；刷新页面后恢复示例数据。现有页面和交互由以下文件负责：

- 页面结构、数据、状态和交互：src/App.tsx。
- 全局视觉、组件和响应式规则：src/styles.css。
- 静态图标与图片：public/assets。
- 本规范：DESIGN_RULES.md。

当前系统名称固定为“门户后台管理系统”，字距为 0。页面不显示重复的页面大标题和副标题，只保留面包屑表达当前位置。

### 当前导航与页面树

- 系统管理
  - 报告管理
  - 公告管理
  - 审核管理
    - 流程中心
    - 表单中心
    - 审核内容管理
  - 埋点管理
    - 埋点信息管理
    - 埋点数据统计
- 权限管理
  - 用户管理
  - 角色管理
  - 页面管理
  - 资源管理
  - 权限配置

不存在“系统设置”菜单，不得补回。侧栏分组标题“系统管理”“权限管理”为 12px；同级菜单垂直间距为 4px。选中二级菜单时，其一级菜单仅以文字和图标颜色高亮，不显示蓝色玻璃框；被选中的二级菜单使用通栏选中背景。侧栏菜单字段、层级和顺序已经确认，后续调整右侧内容区时不得擅自修改。

- 侧栏菜单图标统一使用 `20px × 20px` 完整安全框；20px 包含图形自身的视觉安全边距，不得把内部路径强行撑满图标框。图标描边统一为 `1.2px`，颜色继承当前菜单文字色。
- 侧栏折叠后，每个菜单按钮宽 52px，20px 图标框必须在按钮和 84px 侧栏中水平居中；主菜单图标保持普通文档流定位，禁止复用箭头的绝对定位规则导致视觉偏移。
- 含二级菜单的一级项在折叠状态下不直接跳转。鼠标 hover 或键盘 focus 到一级项时，在右侧显示二级菜单浮层；浮层标题使用次要文字色，当前二级菜单继续保留侧栏既有的蓝色玻璃选中样式，其他项提供 hover 与 focus-visible 状态。

### 当前全局布局

- 桌面侧栏宽 200px，折叠宽 84px；顶栏高 64px。
- 主玻璃内容面板距右侧和底部 16px，面板内部 padding、模块间距统一为 16px。
- 页面内容区上下左右内边距为 16px。
- 内容区只保留一层白色工作面板；无必要时不再套卡片，不使用卡片套卡片。
- API 文档、目录 + 内容、权限控制台等左右分栏页面，右侧内容区不增加多余外框；去框后仍保持 16px 的正常上下左右节奏。
- 只让需要滚动的工作区、表格或弹窗 Body 滚动；侧栏、顶栏、面包屑和操作区按现有实现保持稳定。

### 当前面包屑规则

- 面包屑固定在玻璃内容面板顶部、白色工作面板之前；面包屑行高为 20px，文字统一为 12px。
- 面包屑与下方白色工作面板的垂直间距必须精确为 16px；字号收紧后同步收紧面包屑容器高度，不得保留旧的 22px 空行高导致实际间距变成 18px。
- 当前页面使用主文字色 #1D2129，不可点击，并设置 aria-current="page"。
- 所有非当前层级统一使用 #86909C；斜杠分隔符同样使用 #86909C。
- 只有确实存在可返回页面的历史层级才可点击。可点击层级 hover/focus 时使用品牌蓝，并提供 focus-visible 轮廓。
- “系统管理”“权限管理”是导航分组，没有独立页面，因此仅作为不可点击的首级文本展示。
- 当前系统没有真正的首页，因此不显示首页图标。面包屑按“系统管理 / 当前页面”“系统管理 / 审核管理 / 当前页面”“权限管理 / 当前页面”等真实层级呈现。
- 如果未来新增真实首页，才恢复首页图标入口；必须使用 assets/breadcrumb-home.svg，图标保持 20px × 20px，不得因为面包屑文字改为 12px 而同步缩小。
- 深层工作区需要逐级返回。例如“系统管理 / 审核管理 / 表单中心 / 表单设计器”中，“审核管理”和“表单中心”可点击，“系统管理”不可点击，“表单设计器”为当前页。

### 当前视觉令牌覆盖

- 品牌蓝：#165DFF；hover：#4080FF；active：#0E42D2；浅蓝：#E8F3FF。
- 页面背景：#D8E7FC；主表面：#FFFFFF；浅模块底：#F7F8FA；分段控件底：#F2F3F5。
- 主文字：#1D2129；次文字：#4E5969；三级文字：#86909C；禁用文字：#C9CDD4。
- 边框：#E5E6EB。
- 成功：#00B42A；警告：#FF7D00；危险：#F53F3F。
- 基础间距阶梯：4 / 8 / 16 / 24px。
- 工作卡片圆角 6px；玻璃面板圆角 8px；控件圆角 4px。
- 常规页面卡片不使用阴影。只允许弹窗、下拉浮层、Tooltip 和全局轻提示使用克制阴影。

### 当前筛选区规则

- 筛选区只呈现 PRD 或已确认页面中存在的字段，不自动加入“查询”“重置”按钮。
- 简单筛选采用即时生效：搜索型输入支持模糊搜索，并可与同一区域的简单筛选条件聚合过滤；下拉框在选项确认后立即触发筛选。
- 只有条件数量较多、存在跨字段复杂组合、需要先完成一组条件配置后统一提交的复杂筛选场景，才显示“查询”“重置”按钮。不得仅因页面存在输入框或下拉框就添加这两个按钮。
- 简单筛选的清空通过输入框清除按钮、下拉框“全部”选项或逐项恢复默认值完成，不额外占用工具栏空间。
- 同一筛选行的 label 视觉长度一致，但不再规定固定 96px；根据该页面最长标签统一，并保证控件主体等宽。
- 输入框、选择器、日期控件统一为 32px 高。
- 搜索型输入框的搜索图标放在控件右侧，与下拉箭头位置一致。
- 下拉筛选需要“全部”时，将“全部”作为第一项和默认值。
- 输入搜索 placeholder 统一使用“请输入”，选择器使用“请选择”或当前默认项。
- 报告管理筛选固定为：报告类型、所属领域、报告来源。报告来源为搜索输入。
- 报告管理的数据排序直接放在可排序字段的表头中，不使用额外的排序下拉框。报告类型、报告来源、所属领域、上传时间右侧始终显示向上和向下箭头；点击向上箭头执行正序，点击向下箭头执行倒序，当前生效箭头使用品牌蓝高亮。

### 当前 Tab 规则

- 一级 Tab 使用标准下划线式：单项高 36px，文字 14px/22px，左右 padding 16px，项间距 0；选中项蓝字、500 字重、底部 2px 通项宽蓝线；不保留整行灰色底线。
- 二级 Tab 使用分段式：外层 #F2F3F5，padding 4px，圆角 4px；单项高 32px、左右 padding 16px，选中项白底蓝字、无下划线；未选项之间使用 1px 中性分隔线。
- 一级与二级 Tab 不得混用视觉层级。资源管理、权限配置、用户管理、审核内容等页面继续遵循相同规则。
- 左侧侧栏的一级/二级菜单选中样式不属于内容区 Tab，按侧栏规则处理。

### 当前表格合同

- 表头和数据行高度均为 40px；单元格左右 padding 为 16px。
- 内容字段左对齐；操作列固定在最右侧，操作内容左对齐，但整列右边缘距表格内边距 16px。
- 多选列固定 52px，操作列宽度根据最长一组操作文字、12px 操作间距和左右各 16px padding 计算。多选列和操作列不参与内容 Fill。
- 业务内容列填满剩余宽度，按语义分配：名称、标题、摘要、完整 ID 和路径更宽；状态、枚举、布尔、日期更窄。禁止简单等分。
- 普通文本不高于 16 个字时完整显示；高于 16 个字单行省略，hover 或键盘 focus 时以黑色 Tooltip 展示完整内容。
- 页面明确要求完整展示的列可以突破 16 字规则。例如流程中心“流程ID”和表单中心“表单ID”完整展示。
- 表格宽度不足时允许横向滚动；只有发生横向溢出时才固定多选列和操作列。滚动到最左或最右边界时，对应侧不得出现悬浮阴影。
- 只有存在真实批量操作时才显示多选框列。没有批量操作、只读表格或只有行内操作的表格均不得显示空选择列。
- 勾选后显示批量操作条，至少包含“已选 N 条”和“取消选择”；只有页面确实支持时才出现批量删除等按钮。
- 操作使用精简文字链接，按高频到低频排列；相关操作相邻；删除、注销、驳回等危险操作排在后面。
- 表头排序使用紧邻字段名右侧的上下箭头按钮，必须同时提供 hover、focus-visible、当前方向高亮和准确的无障碍标签；不得用独立下拉框替代表头排序。
- 禁用操作仍可保持可见，但使用禁用灰色、not-allowed 光标和 Tooltip 解释原因；不显示虚线或点状下划线，也不能触发。
- 详情型长内容不常驻占列。例如接口调用日志的请求参数通过操作列“查看”打开详情弹窗。
- 分页器根据真实数据数量计算页数；页项高宽 32px，当前页使用蓝字浅蓝背景，不使用实心蓝块。

### 当前弹窗、提示与状态反馈

- 标准弹窗分为 560 / 640 / 960 / 1280px：危险操作短确认 560px；普通新增、生成、编辑 640px；复杂配置和穿梭框 960px；表格或多列权限内容 1280px。
- 弹窗使用固定 Header、可滚动 Body、固定 Footer。Header 常规高 56px、左右 24px；Body 四周 24px；Footer 高 64px、左右 24px、按钮右对齐且间距 12px。
- 新增、生成、编辑弹窗必须在实现前逐字段判断必填性：名称/标题、唯一标识、文件或路径、业务类型、状态、所属关系等缺失后会导致对象无法识别、无法保存或后续流程无法执行的字段为必填；描述、摘要、补充说明以及创建人、关联时间等系统自动生成字段默认可选。
- 必填字段在字段标签最前显示红色 `*`，星号与字段名间距 3px；只读详情弹窗不显示必填星号。禁止所有字段一律标必填，也禁止只显示星号却仍允许保存空值。
- 必填标识必须与校验联动：字段未完成时禁用主要提交按钮，或在提交后于对应控件下方显示明确错误文案；手机号、邮箱、URL、文件格式等还需继续执行格式校验。禁用的主要按钮统一使用 `#F7F8FA` 背景、`#C9CDD4` 文字、`#E5E6EB` 边框和 `not-allowed` 光标，不得继续呈现为可点击的品牌蓝。
- 条件必填按当前操作判断：新建报告时 PDF 文件必填，编辑报告时已有文件可不重新上传；新建页面的子级页面父页面必填，一级页面父页面可空；启用属性、状态等有默认值的字段仍属于必填业务字段并显示 `*`。
- 提示性副文案若只是上下文说明，放在弹窗标题下方；表单或业务过程中的风险、警告、成功、错误信息在 Body 顶部使用 Alert。危险操作二次确认弹窗是例外，使用独立的纯文字确认结构。
- Token 生成提示“Token 生成后仅在当前操作中完整复制，请妥善保存。”使用警告 Alert，不作为普通标题副文案。
- 删除、注销、撤销等不可逆操作必须二次确认。确认弹窗不使用 Alert 色块，采用固定三段式：Header 标题为“确认删除 / 确认注销”等明确动作；Body 第一行为 16px 主确认文案，第二行为 14px `#86909C` 不可撤销说明；Footer 右侧依次为灰底取消按钮和危险色确认按钮。
- 全局轻提示使用页面顶部居中的白底消息条，左侧为语义色实心圆形图标，右侧可关闭。信息/成功 3 秒自动关闭，警告/错误 4.5 秒自动关闭，最多同时 3 条。
- 成功操作必须给出对应反馈，例如上传成功、新增成功、编辑成功、删除成功、上架成功、下架成功、发布成功、置顶成功、复制成功和权限保存成功。
- 全局业务状态不得使用带底色、内边距或圆角的 Tag / 胶囊标签。状态统一使用“语义色圆点 + 状态文字”的行内结构：圆点 `6px × 6px`、圆角 `50%`，圆点与文字间距 `6px`；整体 `padding: 0`、`background: transparent`、`border: 0`、`border-radius: 0`，文字 `14px/22px`，保持单行。
- 状态圆点与文字使用同一语义色：成功/通过/上架/启用/已发布使用 `#00B42A`；待审核/等待/风险使用 `#FF7D00`；失败/驳回/取消展示/下架/禁用/注销使用 `#F53F3F`；处理中/未发布等信息状态使用 `#165DFF`；中性状态使用 `#86909C`。
- 状态规则适用于表格、详情页、工具栏及其他业务区域中的“状态、发布状态、账号状态、调用结果”等状态值。必须同时显示文字，不能只用颜色或圆点表达含义。分类、类型、关键词等非状态 Tag 只有在来源明确使用标签时才可保留标签外观。
- 所有可点击控件必须有 hover 与 focus-visible 状态；键盘用户能完成 Tab、表格操作、下拉选择、弹窗关闭和图表数据查看。

## Current Page Inventory / 当前页面内容与交互

本节记录当前页面已经实现的内容。未来更新页面时，字段、列、按钮、Tab 和弹窗必须先从本节与实际页面中核对，不得用通用后台经验补字段。

### 报告管理

- 面包屑：系统管理 / 报告管理。“系统管理”不可点击。
- 筛选：报告类型下拉、所属领域下拉、报告来源搜索输入。两个下拉默认“全部”；报告来源 placeholder 为“请输入”。
- 排序：报告类型、报告来源、所属领域、上传时间四个表头右侧显示向上和向下箭头；点击对应箭头直接按该字段正序或倒序排列，当前方向以品牌蓝高亮。置顶报告始终优先显示，同一置顶状态内再执行所选排序。
- 主操作：报告上传。
- 表格列：报告标题、报告类型、报告来源、所属领域、上传时间、内容摘要、状态、是否置顶。
- 行内操作：上架/下架、编辑、删除、置顶/取消置顶。
- 置顶后数据立即移至列表顶部，并显示置顶状态与成功提示。
- 已置顶报告的删除按钮保持展示但不可点击，Tooltip 提示“已置顶的报告不能删除，请先取消置顶”。
- 报告上传/信息修改弹窗字段：PDF格式文件、报告标题、报告类型、报告来源、所属领域、上传时间、内容摘要。

### 公告管理

- 面包屑：系统管理 / 公告管理。“系统管理”不可点击。
- 页面顶部展示“当前首页公告”，复用门户首页导航下方公告栏的视觉样式，直接呈现当前已发布内容、发布时间与计划下线时间；同一时刻只展示一条已发布公告。
- 简单筛选：公告内容模糊搜索、发布状态下拉（全部/草稿/待发布/已发布/已下线），均即时生效，不显示“查询”“重置”按钮。
- 主操作：新建公告。
- 表格列：公告内容、跳转方式、发布时间、下线时间、状态。
- 行内操作：预览、编辑，以及按状态显示发布/下线/取消定时；草稿和已下线公告可以删除，已发布和待发布公告不可直接删除。
- 新建/编辑字段：公告内容、展示位置、跳转方式、发布方式、条件显示的链接地址与定时发布时间、可选的自动下线时间。展示位置固定为“首页导航下方公告栏”，公告内容最多 60 字。
- 跳转方式支持无跳转、站内链接、外部链接；站内地址以 `/` 或 `#` 开头，外部地址使用完整 `http(s)` URL。
- 发布方式支持立即发布和定时发布。立即发布新公告时，当前已发布公告自动转为已下线并保留历史记录；定时发布在到达设定时间前不影响当前公告。
- 编辑已发布公告后使用“保存并更新”，内容立即同步首页；已发布公告的发布方式固定为立即发布。
- 新建和非发布态编辑支持“保存草稿”。发布、定时、更新、取消定时、下线、删除均提供全局轻提示，删除使用危险操作二次确认弹窗。
- 预览弹窗模拟门户导航及公告条，并展示位置、状态、跳转、发布和下线元数据。

### 审核流程管理 / 流程中心

- 入口先显示“流程实例管理页”，不是直接进入设计器。
- 面包屑：系统管理 / 审核管理 / 流程中心。“系统管理”不可点击，“审核管理”可返回流程中心入口。
- 主操作：新建流程；流程建模、控制和发布能力进入设计器完成，不在列表页用静态说明卡片代替。
- 表格列：流程ID、流程名称、发布时间、发布状态。
- 行内操作：编辑、删除、下架、发布。
- 流程ID完整展示。已发布时“发布”禁用；未发布时“下架”禁用；禁用原因通过 Tooltip 说明。
- 点击表格行、点击编辑或新建流程后进入“流程设计器”；流程名称可直接编辑。
- 设计器节点：流程发起节点、流程结束节点、流程节点、抄送节点。发起和结束为默认节点，不可删除。
- 流程节点和抄送节点可添加、选择和删除；发起、结束节点仅显示默认节点说明，不混入审批控制项。
- 流程节点配置字段：节点名称、负责人多选、节点提交条件、有多位负责人时、找不到节点负责人时、按条件流转；抄送节点只配置节点名称和抄送人。
- 多负责人规则：所有负责人提交后进入下一节点 / 任一负责人提交后进入下一节点。
- 找不到负责人处理：自动提交当前待办 / 将待办转给指定人员进行处理；选择转交时必须明确待办转交人。
- 条件流转支持添加、修改和删除条件；未配置条件时按默认路径流转。
- 发布前校验流程名称、默认节点、流程节点负责人、转交人和条件完整性；发布后回写发布时间、发布状态，并可在实例列表下架。

### 审核流程管理 / 表单中心

- 入口先显示表单管理列表。
- 主操作：新建表单；表单设计、规则和打印进入同一工作区完成，不在列表页重复堆放能力名称。
- 表格列：表单ID、表单名称、组件数量、最近修改时间。
- 行内操作：设计、打印、删除；点击行也可进入设计工作区。
- 设计工作区顶部只保留一处可修改的表单名称；不在设计器内部重复显示第二个表单名称。
- 顶部操作：预览、打印、保存表单；设计工作区显性标注表单规则。
- 三栏结构：左侧组件库、中间设计画布、右侧字段配置。
- 组件：单行文本、多行文本、数字字段、日期时间、单选按钮组、复选框组、下拉框。
- 画布支持选择、上移、下移、删除组件。
- 字段配置包含字段名称、组件类型和表单规则。
- 文本规则：最大长度；数字规则：最小值、最大值；日期规则：最小日期、最大日期；单选/复选/下拉规则：可选项；下拉额外支持“允许多选”开关。规则输入即时校验，并实际作用于预览控件。
- 表单预览使用可填写控件；打印先展示纵向表格预览，再调用浏览器打印。没有组件或规则不合法时显示明确提醒，不生成空表单。

### 审核内容管理 / 评论审核

- 一级内容 Tab：评论审核、认证学者审核、报告审核。
- 评论审核列：评论内容、渠道、状态；操作：通过、取消展示。
- 认证学者审核列：学者姓名、机构、职称、手机号；操作：通过、驳回。
- 报告审核列：报告信息、提交人；操作：通过、驳回。
- 操作后立即更新或移除对应待审数据，保持当前 Tab。

### 埋点管理 / 埋点信息管理

- 面包屑：系统管理 / 埋点管理 / 埋点信息管理。“系统管理”不可点击，“埋点管理”可返回埋点信息管理入口。
- 筛选：模块下拉、事件ID输入；事件ID右侧提供“查询”按钮，点击或按回车后应用事件ID条件，模块选择仍即时生效。
- 主次操作：新增埋点事件为主要按钮，批量上传为线框按钮。
- 表格列：事件ID、所属功能模块、埋点标签、埋点路径、触发机制、创建时间。
- 行内操作：查看、编辑、删除。
- 新增/修改/详情字段：事件ID、所属功能模块、埋点标签、埋点路径、触发机制。
- 所属功能模块和触发机制使用固定选项下拉；事件ID、埋点标签、埋点路径使用输入框。
- 批量上传接受 xlsx、xls、csv 文件。

### 埋点管理 / 埋点数据统计

- 模块标题：埋点数据统计；日期范围位于标题右侧，支持年、月、日快捷筛选。
- 页面功能名称：事件总量、活跃用户数、事件排行、事件增长趋势、事件转化率；按钮点击率作为过程指标保留在数据中。
- 指标组为白底，不使用卡片边框、灰底或阴影；相邻指标用 40px 高竖线分隔。
- 第二层左侧为“事件增长趋势”，右侧为“事件转化率”。两图各自使用一层线框。
- 折线图 hover/focus 时联动同一横轴的两个系列点，显示竖向指示线和一个白底 Tooltip。
- 漏斗图 hover/focus 时显示阶段、数值和转化率，并弱化其他层。
- 第三层“事件排行”列：排名、事件ID、埋点标签、触发次数、页面停留均时。
- 排行表格与图表左右边界对齐，外层不额外增加卡片缩进，并继续遵守全局表格规范。

### 用户管理

- 页面采用“左树右表”自适应布局，不再拆分“组织管理 / 用户管理”内容 Tab。
- 左侧为组织管理树，支持无限层级展开/收起和组织检索；标题统一为“组织管理（组织列表查看）”，标题右侧不再重复堆放能力名称和组织数量。节点“...”菜单包含新增子组织、重命名、组织数据管理。
- 选择组织节点后，右侧用户列表立即按该组织及其下级组织聚合过滤。
- 右侧简单筛选为用户姓名模糊搜索、账号状态下拉（全部/启用/禁用），均即时生效，不显示“查询”“重置”按钮。
- 工具栏操作：用户注册（主要按钮）、用户数据对接（线框按钮）；用户列表显性标注用户列表展示。
- 用户表格列：用户ID、姓名、归属组织名称、手机号、邮箱、创建时间、账号状态；账号状态使用 Switch 控制启用/禁用，并在开关右侧同步显示“启用 / 禁用”文字，不能只依赖开关颜色表达状态。
- 行内操作按使用频率排列为：查看详情、分配角色、注销用户。注销用户位于末尾，使用危险操作文字色，点击后必须二次确认；确认成功后移除用户并显示“用户注销成功”轻提示。
- 创建用户字段：姓名、手机号、邮箱、所属组织；手机号和邮箱必须提供格式校验，所属组织使用不超过三级的级联选择器。

### 角色管理

- 筛选：角色ID、角色名称、状态。
- 主操作：创建。
- 表格列：角色ID、角色名称、角色描述、状态、创建人、创建时间、最近修改人、最近修改时间。
- 行内操作：编辑、删除、配置。删除只在状态为“废弃”时出现；配置进入权限配置页面。
- 新建/编辑字段：角色名称、角色描述、状态。

### 页面管理

- 页面采用树形网格表格，直观展示“一级菜单 > 二级菜单 > 三级页面”；行首使用展开/收起箭头与层级缩进，最多支持三级。
- 表头字段：菜单/页面标题、路由地址(URL)、父级页面、启用状态、操作。
- 主操作：新建页面。
- 行内操作：新建页面、修改页面、删除页面。三级页面的“新建页面”保留显示但为禁用状态，并提示“最多支持三级页面”。
- 新建/修改弹窗字段：标题、地址(URL)、父页面、启用属性；父页面使用级联选择器。
- 删除页面代表隐藏对应前端访问入口，必须使用全局危险操作二次确认弹窗。

### 资源管理

- 一级 Tab：接口资源管理、人才库资源、报告资源、智库资源，使用一级下划线样式。
- 接口资源管理二级 Tab：令牌管理、接口调用文档展示、接口调用日志，使用二级分段样式。

#### 令牌管理

- 主操作：生成Token。
- 表格列：应用名称、Token字符串、创建时间、到期时间、状态。
- Token 默认脱敏；复制图标紧随 Token 字符串内容，点击后显示复制结果轻提示。
- 行内操作：编辑、注销、删除；已注销时“注销”保持展示但禁用。
- 生成/编辑字段：应用名称、到期时间。
- 生成弹窗 Body 顶部使用警告 Alert，说明 Token 只在当前操作中完整展示。

#### 接口调用文档展示

- 左侧白底资源分类：人才库、报告、智库。
- 右侧内容不套额外卡片，展示接口名称、说明、GET/POST 状态色块、请求路径、路径复制、参数列表、返回 JSON 示例、错误码说明。
- 参数表与错误码表不显示多选列。

#### 接口调用日志

- 筛选：时间范围（近1小时/近7天）、调用结果（全部/成功/失败）、接口名称。
- 表格列：调用时间、调用方IP、接口地址、响应结果、调用耗时。
- 行内操作：查看。
- 查看弹窗展示调用时间、调用方IP、接口地址、响应结果、调用耗时、错误信息和完整请求参数。
- 请求参数不作为常驻表格列；没有批量操作，不显示多选列。

#### 业务资源

- 左侧使用白底分级目录，支持新增、选择、编辑、删除；至少保留一个目录。
- 右侧不套额外外框，顶部展示当前资源名称、描述、数量和创建人，下方为新增按钮和数据表格。
- 人才库表格列：学者名称、所属学科、职称、关联时间；操作：查看、编辑、删除。
- 报告资源表格列：报告名称、报告类型ID、所属学科、领域、关联时间；操作：编辑、删除。
- 智库资源表格列：智库名称、所属领域、创建人、关联时间；操作：查看、编辑、删除。
- 目录与资源的新增/编辑/详情均使用规范弹窗；操作成功显示轻提示。

### 权限配置

- 一级 Tab：用户、角色。
- 用户包含用户检索和用户列表；表格列：用户ID、用户姓名、所属组织名称、手机号、当前角色；操作：分配角色。
- 分配角色使用穿梭框弹窗，左侧“可选角色”、右侧“已选角色”，支持普通用户、机构用户、政府用户多选分配。
- 角色使用左侧角色列表 + 右侧权限工作区。
- 右侧二级 Tab：页面、资源。
- 页面使用勾选树；页面管理中已经禁用的页面优先覆盖角色页面权限。
- 资源按人才库资源、报告资源、智库资源分组，分别配置“可见”和“可维护”。
- 保存配置后显示“权限配置保存成功”轻提示。

### 后续页面更新规则

- 修改任何页面前，先读取本文件和当前实现，不从历史聊天记忆补规则。
- 先保持已确认侧栏、全局布局、Tab、表格、弹窗和提示不变，再修改目标页面右侧内容。
- 新增页面或弹窗时，必须把新增字段、列、按钮、状态和交互同步回本节。
- 发现本文件与页面不一致时，先以页面为准修正文档；除非用户明确要求修改页面本身。
- 每次发布前至少检查：导航、面包屑、筛选、Tab、表格滚动、多选、操作列、弹窗尺寸、成功/失败反馈、键盘 focus、窄屏可用性。

## Prototype Content Authority / 原型内容最高优先级

这一段是所有 AI / 设计 / 代码生成工具使用本规范时的最高优先级，覆盖本文件中所有组件示例、状态示例、预览页示例和生成建议。

**原型图管内容，`design.md` 只管样式。**
当根据原型图、截图或 Figma 节点生成页面时，业务内容只能来自原型本身，不能来自 `design.md`、可视化规范页、组件示例、常见后台页面经验或模型补全。

**高保真不等于重新设计页面。**
高保真只表示视觉精度更高：布局、间距、组件样式、颜色、字号、圆角、阴影、交互状态更接近规范。高保真不能改变原型内容，不能重组字段，不能补全业务流程，不能把一个简单原型扩展成完整后台页面。

内容来源优先级固定为：

1. 用户明确给出的原型图 / 截图 / Figma 节点。
2. 用户在当前 prompt 中明确补充的字段或文案。
3. `design.md` 只提供视觉规范、布局规范、组件样式和交互规则，不提供业务内容。

必须使用两步制生成。**没有经过用户确认的“来源内容清单”，不得直接绘制页面，也不得直接生成高保真页面。**

Step 1 只做内容提取，不生成界面：先从原型中提取“来源内容清单”，并把清单展示给用户确认。清单只允许包含原型中可见的信息：

- 页面类型判断和判断依据。
- 左侧导航名称、当前激活菜单、是否有二级菜单。
- 面包屑文字。
- 筛选字段名称、筛选 placeholder、筛选字段数量、查询/重置按钮是否存在。
- 页面操作按钮名称、数量、顺序、主次关系。
- Tab 名称、Tab 数量、当前激活 Tab。
- 表格列名、列数、可见行数、单元格文字、操作列链接。
- 表单分组标题、字段名称、placeholder、默认值、说明文字、错误文字、按钮文字。
- 弹窗/抽屉标题、正文可见字段、正文文案、表格列、Footer 按钮。
- 卡片/模块标题、模块数量、模块内可见文本。
- AI 对话页的会话标题、消息角色、消息内容、输入框 placeholder、快捷问题、工具按钮、引用/来源卡片。
- 文章页的标题、副标题、作者/来源/时间、摘要、正文段落、小标题、目录、标签、引用、图片/附件/相关链接。

Step 2 才能生成界面：只有当用户确认来源内容清单正确后，才能根据已确认清单生成页面。生成时不得新增、删除、改名、改顺序。高保真生成也必须完全基于这份已确认清单。

高保真生成输入要求：

- 必须同时具备两项输入：已确认来源内容清单 + `design.md` 样式规范。
- 已确认来源内容清单负责业务内容，`design.md` 负责视觉样式。
- 如果没有已确认来源内容清单，只能输出清单或待确认问题，不能生成页面。
- 如果原型截图与已确认清单冲突，以用户确认后的清单为准。

页面类型判定：

所有 AI / 设计 / 代码生成工具在生成前必须先判定页面类型，并说明判定依据。页面类型只能从原型中可见的结构判断，不能从模块名称、业务想象或常见后台经验推断。

| 页面类型 | 判定依据 | 生成骨架 |
| --- | --- | --- |
| 管理列表页 | 可见筛选区、可选的复杂筛选提交操作、操作按钮、表格/列表、分页或批量操作 | 单白色工作卡片内按 `筛选区 -> 操作区 -> 表格/列表 -> 分页` 排布；简单筛选即时生效 |
| 表单/编辑页 | 主要内容是输入框、选择器、上传、字段分组、保存/提交/取消按钮 | 单白色工作卡片或弹窗 Body 内按表单分组排布，字段顺序严格按原型 |
| 详情/阅读页 | 主要内容是只读字段、标题、标签、长文本、分区标题、返回入口、关联信息 | 详情卡或详情分区，保留原型可见分区，不主动补摘要/附件/关联列表 |
| 文章页 | 可见文章标题、作者/来源/时间、摘要、正文段落、小标题、目录、标签、引用、图片或附件 | 使用阅读型正文版式；严格保留原型可见文字，不自行撰写正文或扩写段落 |
| AI 对话页 | 可见聊天消息、用户/AI 角色、输入框、发送按钮、快捷问题、引用来源、工具按钮或会话列表 | 使用对话工作区；严格保留可见消息，不自行编写用户问题、AI 回复或引用内容 |
| 仪表盘/图表页 | 可见指标卡、图表区域、图例、坐标轴、统计图或可视化占位 | 按图表规范生成图表视觉；只有已有图表区域时才能补假图表数据 |
| 弹窗 Modal | 可见居中遮罩弹窗、Header/Body/Footer、取消/确认按钮 | 使用 Modal 尺寸分级和固定 Header/Body/Footer 规则 |
| 抽屉 Drawer | 可见侧边面板、长详情/编辑区域、关闭按钮或侧滑结构 | 使用 Drawer/侧边工作区，不改成普通 Modal |
| 流程/导入页 | 可见步骤条、上传、校验、结果、批量处理或多步骤流程 | 使用流程页、Drawer 或全屏工作区；不压缩成普通 Modal |
| 设置/配置页 | 可见多组配置项、开关、权限、规则、参数、模块分组 | 使用分组表单/配置区；多模块时先进入灰底模块区 |
| 混合页面 | 同时可见多个主结构，例如详情 + 表格、表单 + 预览 | 选择原型中占主导面积/主任务的类型；保留可见组合，不补不可见区域 |

页面类型判断规则：

- 页面类型只决定布局骨架，不改变内容清单。
- 筛选区里有输入框不代表表单页；如果输入框后面是表格/分页，它仍然是管理列表页。
- 表格存在不代表可以新增管理列；表格列仍严格按原型。
- 有少量字段不代表可以扩展成完整表单；字段数量仍严格按原型。
- 有图表风格背景或空白占位不代表可以新增仪表盘模块；必须原型中有明确图表区域。
- 有长文本不一定是文章页；只有原型呈现标题、作者/时间、正文阅读结构时才判定为文章页。
- 有输入框不一定是 AI 对话页；只有原型呈现聊天气泡、消息流、发送输入区、快捷问题或 AI 工具区时才判定为 AI 对话页。
- AI 对话页和文章页的可见正文属于严格内容，不能由模型自由续写、总结、改写或补段落。
- 如果页面类型无法判断，Step 1 必须输出“页面类型待确认”和疑问点，不能直接生成页面。

AI 对话页专项规则：

- 只有原型中可见聊天消息、用户/AI 角色、消息流、发送输入区、快捷问题、引用来源、工具按钮或会话列表时，才判定为 AI 对话页。普通搜索框、普通备注输入框、普通表单输入框不能判定为 AI 对话页。
- AI 对话页仍使用统一后台壳：左侧菜单、顶部工具区、玻璃内容面板和唯一白色工作卡片不变。只替换工作卡片内的对话内容。
- 会话列表、消息角色、消息内容、输入框 placeholder、发送按钮、快捷问题、引用来源、工具按钮、空会话提示都属于原型严格内容。原型没有显示就不能生成。
- 原型有消息时，只能按可见消息逐条还原。不能补新的用户问题、AI 回复、结论摘要、追问建议、引用卡片、工具调用结果或历史会话。
- 原型是空会话时，只能生成空会话结构和原型可见 placeholder。不能为了“像 AI 产品”主动填充示例问答。
- 输入区通常固定在白色工作卡片底部或对话工作区底部；消息流只在对话 Body 内滚动，不让全局页面随消息滚动。
- 快捷问题、引用来源和工具按钮如果可见，应按原型数量、名称、顺序还原；不可用 `design.md` 的示例内容替换。

文章页专项规则：

- 只有原型中可见文章标题、作者/来源/发布时间、摘要、正文段落、小标题、目录、标签、引用、图片、附件或相关阅读结构时，才判定为文章页。普通详情长文本、说明块、弹窗正文不能自动判定为文章页。
- 文章页仍使用统一后台壳：面包屑和唯一白色工作卡片保留，白色工作卡片内使用阅读型正文版式。
- 文章标题、副标题、作者、来源、时间、摘要、正文、小标题、目录、标签、引用、图片说明、附件名、相关链接都属于原型严格内容，必须逐字还原。
- 不允许主动撰写文章正文、扩写段落、总结摘要、改写标题、补作者/时间、添加目录、推荐阅读、相关阅读、标签或下载附件。
- 原型正文较短时，保持短正文；不能为了“高保真”把文章扩展成完整长文。
- 原型已有图片/附件/引用时，可按规范优化间距、边框和排版；但文件名、图片说明、引用来源和出现顺序必须来自原型。
- 如果文章正文看不清，必须在 Step 1 标记【无法识别】或询问用户，不能用模型生成的行业文章补空。

内容权限分类：

| 类型 | 处理方式 | 例子 |
| --- | --- | --- |
| 严格按照原型内容 | 必须逐字、逐项、按顺序还原，不能自行编写 | 导航名称、面包屑、字段名、placeholder、默认值、说明文字、表格列名、可见单元格、按钮文案、Tab 名称、模块标题、弹窗正文、AI 对话消息、文章正文 |
| 可按 `design.md` 自行生成 | 只允许生成不改变业务含义的视觉和实现细节 | CSS class、布局容器、间距、颜色、圆角、阴影、响应式规则、滚动区域、hover/focus 样式、Arco 组件覆盖样式、无可见文案的结构层 |
| 可生成示意数据 | 只在原型已经存在表格/列表/图表区域时，用于表现数据密度；不能改变字段、列名、模块和操作 | 在已有表格列下补充同类型假数据行；在已有图表区域生成符合图表规范的假图表、坐标轴、图例和数据系列 |
| 需要用户确认后才能生成 | 原型没显示但业务上可能需要的内容，必须先问或放入待确认清单 | 新增字段、额外表格列、额外按钮、空态/错误/加载文案、校验规则、确认弹窗文案、导入流程、批量操作、详情/编辑抽屉 |

判断原则：

- 只要会被用户看到、会表达业务含义、会改变字段/数据/流程，就属于“严格按照原型内容”或“需要用户确认”，不能自由编写。AI 回复、用户消息、文章标题、文章正文、摘要和引用来源都属于严格内容。
- 只有不影响业务内容的样式、布局、代码结构、组件覆盖和响应式行为，才可以按 `design.md` 自行生成。
- 表格或列表已经在原型中出现，但可见数据较少时，可以补充同字段结构、同语义类型的假数据，用来呈现大量数据效果。补数据只能增加行数，不能新增列、改列名、改操作按钮、改筛选条件或新增模块。
- 原型中已经存在图表区域、图表标题、指标图卡或可视化占位时，可以按图表规范生成假图表数据。图表主题、标题、维度名、图例名若在原型中可见必须保留；不可凭空新增原型没有的图表模块。
- 假数据必须保持低风险和中性，不得引入真实个人隐私、真实机构敏感数据、真实金额结论或误导性业务结论。必要时使用示意型数据，如 `示例机构 A`、`样本数据 01`。
- 图标只有在原型明确展示或组件规范固定要求时可以自动选择；否则不要用图标替代原型中的文字内容。
- 辅助无障碍文本可以生成，但必须复用对应可见文本，不得新增业务含义。

字段锁定规则：

- 字段数量必须等于原型。原型有 3 个筛选字段，就只能生成 3 个筛选字段；原型有 8 个表单字段，就只能生成 8 个表单字段。
- 字段名称必须逐字匹配原型。不能改名、翻译、概括、同义替换、补充括号说明或改成更常见的后台字段名。
- 字段顺序必须按原型视觉顺序，从左到右、从上到下排列。
- 表格列名和列数必须逐字匹配原型。不能主动添加 `状态`、`类型`、`创建时间`、`更新时间`、`负责人`、`备注`、`权限`、`操作` 等常见列，除非原型中明确可见。
- 表格列名和首批可见行内容必须匹配原型；当原型表格可见数据较少且需要呈现大量数据效果时，可以在相同列结构下追加同类型假数据行。不能为了补数据新增列、改列名、改操作链接或新增筛选字段。原型没有数据行且没有要求展示数据密度时，表格体保持空白或使用原型自带空态文案。
- 按钮和操作链接必须匹配原型。不能主动添加 `新增`、`导入`、`导出`、`详情`、`编辑`、`删除`、`保存`、`取消`，除非原型中可见或用户明确要求。
- AI 对话页必须匹配原型可见消息。不能主动编写新的用户问题、AI 回复、来源引用、快捷问题或建议操作。若原型只显示空会话，则只生成空会话结构和原型可见 placeholder。
- 文章页必须匹配原型可见正文。不能主动撰写、续写、总结、改写文章内容，也不能新增作者、来源、时间、目录、推荐阅读或相关链接，除非原型可见或用户确认。
- 页面标题、副标题、统计摘要、说明文案、图表模块、状态面板、弹窗、抽屉、导入流程、批量选择条等，原型中没有就不能生成。若原型已有图表区域，则可以按图表规范生成假图表数据来填充该区域。
- 如果原型文字看不清或信息缺失，保持空白、使用原型已有 placeholder，或向用户确认；绝对不能用 `design.md` 的示例数据、演示字段或常见后台内容补空。

生成结果验收：

- 逐项数一遍生成页面里的筛选字段、表单字段、表格列、表格行、Tab、模块、按钮和操作链接。
- 与原型图逐项对照：数量、名称、顺序、可见文案必须一致。
- 任何原型中不存在的字段、列、模块、按钮、说明文字或状态，都是生成错误，必须删除。只有在原型已有表格/列表/图表区域时，才允许按既有结构补充示意数据行或假图表数据。

推荐给 AI / 设计 / 代码生成工具的 prompt 前缀：

```text
第一步只提取页面类型判断和内容清单，不生成页面。请先判断页面类型（管理列表页/表单页/详情页/文章页/AI 对话页/仪表盘/弹窗/抽屉/流程页/配置页/混合页）并说明判定依据，再从原型图中列出：导航、当前激活菜单、菜单层级、菜单是否有二级箭头、面包屑、筛选字段、表格列、可见行、表单字段、按钮、Tab、模块、弹窗/抽屉内容、AI 对话消息、文章标题/正文、图表区域和所有可见文案。原型图管内容，design.md 只管样式。左侧菜单样式固定，但菜单文案、数量、顺序、层级和激活项不固定，必须来自原型或确认清单，禁止套用 design.md / design-preview.html / 参考文件里的示例菜单。字段数量、字段名称、字段顺序、表格列名、按钮名称、Tab 名称、模块标题和可见文案必须逐项列出。原型已有表格/列表但数据较少时，可在确认后按相同字段结构补充同类型假数据行来表现大量数据；原型已有图表区域时，可按图表规范生成假图表数据。禁止新增原型没有的常见后台字段、额外列、额外模块、说明文字、统计摘要、状态面板、弹窗、抽屉、导入流程、AI 回复、文章正文或 design.md 示例内容。如果页面类型或原型文字看不清，标记为【待确认】或【无法识别】，不要自行编写。等我确认清单后，再生成页面。
```

确认清单后，再使用这个生成提示：

```text
内容清单已确认。请根据已确认的来源内容清单生成高保真页面。高保真只表示视觉、布局、组件和交互状态更接近 design.md，不允许改写、扩展或重组内容。业务字段、表格列、按钮、Tab、模块、文案、弹窗内容、AI 对话消息、文章正文必须严格来自已确认清单。左侧菜单只复用 design.md 的视觉样式和展开/收起规则；菜单文案、数量、顺序、层级、激活项和箭头只能来自已确认清单。页面内不要生成泛命名 `Frame` / `Frame 1` / `Group` 作为业务层级；如 Figma 为 Auto Layout 必须创建技术容器，必须语义化命名且不能带额外可见背景、边框或阴影。可以按 design.md 生成样式、间距、颜色、圆角、阴影、响应式、滚动区和 Arco 组件覆盖。只有在清单中已有表格/列表且需要数据密度时，才可在同列结构下补充同类型假数据行；只有在清单中已有图表区域时，才可生成假图表数据。不得新增清单外字段、列、模块、按钮、说明文字、流程、状态、AI 回复或文章段落。
```

## Design Principles

- 稳定可信：以深蓝、白色、浅灰为基础，减少高饱和大面积色块。
- 信息优先：表格、筛选、卡片、指标和表单必须比装饰更醒目。
- 组件一致：优先复用 Arco/国科信组件语义，不随意重造按钮、输入框、弹窗、表格等基础控件。
- 密度适中：后台页面保持紧凑但留足分组间距，避免看起来像营销落地页。
- 状态明确：组件库和完整流程需要覆盖默认、悬停、聚焦、禁用、错误、加载、空态；单张原型还原只生成原型中可见的状态，不主动补状态页或状态面板。

## Visual Language

产品组件主色以 Figma 色彩页 `☑️ 色彩 Color` 为准：`Brand1-6 / 常规` 是 `#165DFF`，悬浮为 `#4080FF`，点击为 `#0E42D2`，浅色背景为 `#E8F3FF`。此前从封面读取到的 `#0A3888` 是封面背景深蓝，可用于封面、品牌展示或特殊深色背景，但不作为常规组件主色。

整体界面应采用浅色工作台：页面背景浅灰，内容区域白底，边框使用中性灰，文本以深灰黑为主。图标统一使用 Arco IconBox 图标库的线性风格，描边为 1.2px，常用尺寸为 16px 或 20px。

## Tokens

### Color

```css
:root {
  --gkx-brand: #165dff;
  --gkx-brand-hover: #4080ff;
  --gkx-brand-active: #0e42d2;
  --gkx-brand-special: #6aa1ff;
  --gkx-brand-disabled: #94bfff;
  --gkx-brand-text-disabled: #bedaff;
  --gkx-brand-light: #e8f3ff;
  --gkx-cover-blue: #0a3888;

  --gkx-bg-page: #f7f8fa;
  --gkx-bg-surface: #ffffff;
  --gkx-bg-subtle: #f2f3f5;
  --gkx-bg-hover: #f2f3f5;

  --gkx-text-primary: #1d2129;
  --gkx-text-secondary: #4e5969;
  --gkx-text-tertiary: #86909c;
  --gkx-text-disabled: #c9cdd4;
  --gkx-text-inverse: #ffffff;

  --gkx-border-heavy: #86909c;
  --gkx-border-hover: #c9cdd4;
  --gkx-border: #e5e6eb;
  --gkx-border-light: #f2f3f5;
  --gkx-icon: #4e5969;
  --gkx-icon-muted: #86909c;

  --gkx-success: #00b42a;
  --gkx-success-hover: #23c343;
  --gkx-success-active: #009a29;
  --gkx-success-disabled: #7be188;
  --gkx-success-soft: #aff0b5;
  --gkx-success-light: #e8ffea;

  --gkx-warning: #ff7d00;
  --gkx-warning-hover: #ff9a2e;
  --gkx-warning-active: #d25f00;
  --gkx-warning-disabled: #ffcf8b;
  --gkx-warning-soft: #ffe4ba;
  --gkx-warning-light: #fff7e8;

  --gkx-danger: #f53f3f;
  --gkx-danger-hover: #f76560;
  --gkx-danger-active: #cb2634;
  --gkx-danger-disabled: #fbaca3;
  --gkx-danger-soft: #fdcdc5;
  --gkx-danger-light: #ffece8;

  --gkx-info: #165dff;

  --gkx-chart-1: #4180fd;
  --gkx-chart-2: #58a8f9;
  --gkx-chart-3: #fd7e03;
  --gkx-chart-4: #4dd164;
  --gkx-chart-5: #a872e2;
  --gkx-chart-6: #f6ba21;
  --gkx-chart-7: #9ed91f;
  --gkx-chart-8: #f779b6;
  --gkx-chart-9: #16c7c7;
  --gkx-chart-10: #e665de;

  --gkx-chart-ext-1: #4180fd;
  --gkx-chart-ext-2: #4ed264;
  --gkx-chart-ext-3: #95bffe;
  --gkx-chart-ext-4: #7ce088;
  --gkx-chart-ext-5: #59aafb;
  --gkx-chart-ext-6: #a973e3;
  --gkx-chart-ext-7: #9fd3fb;
  --gkx-chart-ext-8: #c397ed;
  --gkx-chart-ext-9: #fd7d02;
  --gkx-chart-ext-10: #ffd08d;
  --gkx-chart-ext-11: #f5b91f;
  --gkx-chart-ext-12: #16c8c8;
  --gkx-chart-ext-13: #f9dc6e;
  --gkx-chart-ext-14: #8ae8df;
  --gkx-chart-ext-15: #9fda1f;
  --gkx-chart-ext-16: #e665dd;
  --gkx-chart-ext-17: #c7e768;
  --gkx-chart-ext-18: #f6baee;
  --gkx-chart-ext-19: #f87bb7;
  --gkx-chart-ext-20: #f99cc5;
}
```

Use `#165DFF` for primary actions, active tabs, focused form controls, links, and selected states. Use `#0A3888` only for cover-like deep brand backgrounds unless the design explicitly calls for it. Neutral gray tokens should carry most borders, secondary text, placeholders, disabled states, table dividers, and icon strokes.

### Chart Colors

Figma node `2308:353` (`图表颜色`) defines the chart palette. Use these colors for charts only: line, bar, pie, legend markers, and comparable data-series marks. Do not substitute component brand colors, semantic status colors, or random ECharts defaults for chart series.

- For `N≤10`, use the base 10 series in order: `#4180FD`, `#58A8F9`, `#FD7E03`, `#4DD164`, `#A872E2`, `#F6BA21`, `#9ED91F`, `#F779B6`, `#16C7C7`, `#E665DE`.
- For `0≤N≤20`, use the extended 20 series in order: `#4180FD`, `#4ED264`, `#95BFFE`, `#7CE088`, `#59AAFB`, `#A973E3`, `#9FD3FB`, `#C397ED`, `#FD7D02`, `#FFD08D`, `#F5B91F`, `#16C8C8`, `#F9DC6E`, `#8AE8DF`, `#9FDA1F`, `#E665DD`, `#C7E768`, `#F6BAEE`, `#F87BB7`, `#F99CC5`.
- If a chart has more than 20 categories, redesign the chart: group minor categories into `其他`, add filtering, or switch to ranked/scrollable presentation instead of cycling colors indefinitely.
- Preserve series color consistency across one dashboard page. The same metric/category should not change color between related charts.
- Status colors such as success/warning/danger are reserved for state meaning. Use them in charts only when the chart is explicitly about status categories.

### Typography

- Default Chinese UI font is PingFang. All generated B-end pages must inherit this stack from `body` or the app root: `PingFang SC`, `PingFang HK`, `Microsoft YaHei`, `Helvetica Neue`, `Arial`, sans-serif.
- Do not set page modules, cards, forms, tables, buttons, or modal content to a different Chinese font unless the source design explicitly requires it.
- English and numeric content may use the same PingFang stack by default. Only use a separate Latin/numeric font for component-internal cases already confirmed by Arco/Figma, such as pagination number rendering.
- Page title: 20px, line-height 28px, weight 600.
- Section title: 16px, line-height 24px, weight 600.
- Body: 14px, line-height 22px, weight 400.
- Secondary/helper text: 12px, line-height 20px.
- Data tables: 14px body; header may use 13px or 14px, weight 500.
- Do not use viewport-scaled type. Keep letter spacing at `0`.

### Text Wrapping And Ellipsis

Unexpected wrapping is a layout failure. Generated pages must decide text behavior by content type, not by whatever width the current generation tool happens to create.

- UI labels are single-line by default: sidebar menu labels, breadcrumbs, page/content tabs, filter labels, form labels, button text, toolbar actions, status indicators, table headers, table cells, operation links, card captions, right-side resource-card titles, pagination text, and TOC/page-index labels must use `white-space: nowrap`, `overflow: hidden`, and `text-overflow: ellipsis`.
- Prose content may wrap: article body, abstract, description, notes, comments, long rich text, AI messages, citation excerpts, and detail long-text fields may wrap naturally with readable line-height.
- A long UI label must not wrap into two or three lines just because the column is too narrow. First allocate the correct column width, then use ellipsis and expose the full value through tooltip, detail panel, drawer, expanded row, or hover title.
- If the source prototype visibly wraps a UI label, keep that source behavior. Otherwise, do not introduce wrapping in sidebar menus, TOC rows, tabs, buttons, table cells, filter labels, or form labels.
- For two-column or three-column workspaces, each column must define a minimum width. If the viewport is too narrow, the content area should scroll horizontally inside the work card or collapse a side pane; do not squeeze labels until they wrap.
- Chinese and English mixed labels should still follow the same rule. Do not let English words in TOC, titles, or buttons wrap at arbitrary characters; use ellipsis for UI labels.
- CSS baseline:

```css
.gkx-ui-text,
.gkx-sidebar-tab,
.gkx-page-tab,
.gkx-filter-label,
.gkx-form-label,
.gkx-toolbar-item,
.gkx-toc-row,
.gkx-resource-title,
.arco-table-cell {
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.gkx-prose,
.gkx-article-body,
.gkx-ai-message,
.gkx-long-description {
  white-space: normal;
  overflow-wrap: break-word;
}
```

Figma 封面标题为 32px、白色、PingFang Medium。此尺度只用于封面、登录页或品牌页，不用于普通后台内容区。

### Spacing

- Use a four-step spacing scale only:
  - `mini`: 4px
  - `small`: 8px, default gap for compact controls and inline items
  - `medium`: 16px, default section/control group spacing
  - `large`: 24px, default major section spacing and outer safe spacing
- Avoid ad hoc spacing values such as 10px, 12px, 20px, or 32px unless matching a measured Figma component internals or a fixed component size.
- White work-card content padding: `medium` / 16px on all four sides.
- Form row gap: `medium` / 16px vertical, `small` / 8px between label/control or compact inline items.
- Toolbar/filter gap: `small` / 8px between controls, `medium` / 16px between control groups.

### Layout Tokens

Use these key size tokens in both prototypes and production pages. Do not duplicate these values as one-off hardcoded numbers in generated page shells.

```css
:root {
  --space-mini: 4px;
  --space-small: 8px;
  --space-medium: 16px;
  --space-large: 24px;
  --breadcrumb-content-gap: 16px;
  --sidebar-width: 200px;
  --sidebar-collapsed-width: 84px;
  --sidebar-brand-x: 16px;
  --sidebar-brand-y: 16px;
  --sidebar-brand-width: 136px;
  --sidebar-logo-size: 28px;
  --sidebar-menu-x: 16px;
  --sidebar-menu-y: 72px;
  --sidebar-item-width: 168px;
  --sidebar-collapsed-item-width: 52px;
  --sidebar-item-height: 40px;
  --topbar-height: 64px;
  --panel-gap: 16px;
  --glass-radius: 8px;
  --card-radius: 6px;
  --control-height: 32px;
  --filter-actions-width: 136px;
  --table-row-height: 40px;
  --modal-width-confirm: 560px;
  --modal-width-form: 640px;
  --modal-width-config: 960px;
  --modal-width-table: 1280px;
  --modal-scrim: rgba(0, 0, 0, 0.50);
  --modal-safe-gap: 24px;
  --modal-max-width: calc(100vw - 48px);
  --modal-max-height: calc(100vh - 48px);
  --modal-padding-x: 24px;
  --modal-header-height: 56px;
  --modal-footer-height: 64px;
  --modal-button-gap: 12px;
}
```

- `--space-mini`: 4px, used for hairline offsets, tiny icon/text adjustments, and compact visual nudges.
- `--space-small`: 8px, the default spacing between compact controls and inline items.
- `--space-medium`: 16px, the default spacing between form rows, toolbar groups, cards, and major controls.
- `--space-large`: 24px, the default major section spacing and outer safe spacing.
- `--breadcrumb-content-gap`: 16px, required vertical gap between the breadcrumb row and the first content/work-card area when content exists.
- `--sidebar-width`: fixed global sidebar width.
- `--sidebar-collapsed-width`: collapsed sidebar width from the menu reference.
- `--sidebar-brand-x` / `--sidebar-brand-y`: top-left origin for the brand block.
- `--sidebar-brand-width`: expanded brand block width for the logo and title. The fold icon is outside this brand block.
- `--sidebar-logo-size`: logo size in the brand block.
- `--sidebar-menu-x` / `--sidebar-menu-y`: top-left origin for the first-level navigation group.
- `--sidebar-item-width` / `--sidebar-item-height`: default first-level sidebar item size.
- `--sidebar-collapsed-item-width`: collapsed icon-only menu item width.
- `--topbar-height`: fixed transparent utility/header height.
- `--panel-gap`: right and bottom margin for the glass panel; also used for the inner card side/bottom spacing.
- `--glass-radius`: radius for the glass content shell.
- `--card-radius`: radius for the white working card and ordinary panels.
- Filter equal-length rule: filter condition pairs in the same row use equal-width columns. Label width is content-adaptive and right-aligned; do not hard-code a fixed label width unless the source Figma component explicitly requires one.
- `--filter-actions-width`: reserved width for the query/reset action group on the first filter row, so extra filter rows can align to the same three-column rhythm.
- `--control-height`: default button, input, select, and compact toolbar control height.
- `--table-row-height`: default management table row height.
- `--modal-width-confirm`: confirm / 提示确认类弹窗宽度.
- `--modal-width-form`: 普通表单、详情、编辑类弹窗宽度.
- `--modal-width-config`: 复杂配置类弹窗宽度.
- `--modal-width-table`: 表格、权限、多列内容类弹窗宽度.
- `--modal-scrim`: modal overlay background. Batch import and validation examples use a 50% black scrim.
- `--modal-max-width`: all Modal instances must keep at least 24px viewport side margin.
- `--modal-max-height`: all Modal instances must keep at least 24px viewport top/bottom margin.
- `--modal-padding-x`: Modal safe padding. Header title, Body content, and Footer actions align to this 24px side distance from the panel edges; Body uses the same 24px value vertically.
- `--modal-header-height`: standard one-line Modal Header height. A Header with a subtitle grows to at least 72px.
- `--modal-footer-height`: fixed Modal footer height.
- `--modal-button-gap`: gap between footer buttons.

### Radius And Shadow

- Default control radius: 2px to 4px.
- Cards and panels: 4px to 6px, never overly rounded.
- Modals, dropdowns, popovers: 4px to 6px with the Figma style `阴影/高层阴影`, described for 弹窗、下拉选择框.
- Avoid soft floating card stacks. Use shadows only to express elevation, overlays, dropdowns, and active popups.

## Layout System

Desktop admin pages must use the real application shell from Figma node `3937:126` (`论文管理`) as the default layout contract. Node `1785:304` only explains the broad T geometry; `3937:126` defines the visual style to reproduce.

- Baseline artboard: 1440px wide by 800px high.
- Left sidebar / slider: fixed 200px width, starts at `x=0, y=0`, spans the full viewport height.
- Top utility region: fixed 64px height, starts at `x=200, y=0`, visually transparent over the page background; top actions live at the right.
- Content glass panel: starts at `x=200, y=64`, with `right: 16px` and `bottom: 16px`; width and height adapt to the viewport while keeping those margins fixed.
- The sidebar and header are persistent shell regions. Future generated pages should keep the shell geometry and visual treatment unchanged, but the sidebar menu content is not fixed. Menu labels, item count, hierarchy, active item, product title, and user name must come from the source prototype, confirmed content checklist, or product information architecture.
- Do not switch between left-sidebar, top-only, or card-shell layouts from page to page. Keep the T-shaped structure consistent across modules.
- The global shell itself must not rely on a large page-level `min-width` that causes the sidebar or brand block to be horizontally clipped in the browser. Horizontal overflow belongs inside wide tables/content areas, not on the whole page shell.
- Page background is a clean `#D8E7FC`. Remove decorative circular line motifs in generated pages unless the user explicitly asks for decorative background graphics.
- The main content shell is a glass panel: `rgba(255,255,255,0.48)`, 1px white border, 8px radius, `backdrop-filter: blur(8px)`.
- Inside the glass panel, keep exactly one white work card below the breadcrumb. Do not add a second full-page white background, nested oversized card, or extra shell-like container inside that work card.
- Content inside the white work card must keep `medium` / 16px padding on all four sides: top, right, bottom, and left.

Reference measurements from `3937:126`: brand block at `16,16` with 28px logo and 16px title; nav starts at `16,72`; top actions start at `1111,12` on the 1440px baseline; glass panel starts at `200,64`; breadcrumb starts at `216,80`; the single white work card starts 16px below the breadcrumb when content exists and contains filters, actions, tables, and page content. Keep the glass panel and white work card pinned 16px from the right and bottom edges.

Top-right utility area must follow Figma `Untitled` node `1:1087`, not screenshot zoom scale:

- Top actions stay in the transparent 64px top utility region and align to the right with `right: 16px`.
- Utility group top position is `12px`; the whole right-side group is 40px high because the user pill is 32px avatar plus 4px vertical padding.
- Top action outer gap between the tool group and user pill is `16px`.
- The `帮助` / `应用` tool group uses an internal gap of `8px` between tools.
- Each tool uses `padding: 6px 11px`, `gap: 6px`, `border-radius: 22px`, no default background.
- Tool text (`帮助`, `应用`) uses 14px text, 20px line-height, secondary color `#4E5969`.
- Tool icons use 16px size. The help icon is a circular question mark style; the app icon is a 2x2 grid.
- User pill uses `padding: 4px 8px 4px 4px`, `gap: 8px`, `border-radius: 30px`, and background `rgba(255,255,255,0.48)`.
- User avatar uses `assets/user-avatar.png`, displayed at 32px by 32px inside the pill.
- User name uses 14px text, 22px line-height, primary text color `#1D2129`.
- User dropdown caret uses 12px size and tertiary gray `#86909C`.

For sidebar visual styling, use Figma `国科信-设计规范` node `473:16` as the source of truth. It contains two full shell states: `展开样式` node `4112:249` and `收起样式` node `4112:649`. The menu fold icon is positioned on the content/glass-panel edge, not inside the brand block.

Important content rule: node `473:16` defines the sidebar visual style, expanded/collapsed behavior, spacing, icon size, active state, and arrow behavior. It does not define a fixed menu information architecture for every product. Do not copy its menu labels into unrelated pages unless those labels are visible in the source prototype or confirmed by the user.

Recommended shell CSS contract:

```css
:root {
  --sidebar-width: 200px;
  --sidebar-collapsed-width: 84px;
  --sidebar-brand-x: 16px;
  --sidebar-brand-y: 16px;
  --sidebar-brand-width: 136px;
  --sidebar-logo-size: 28px;
  --sidebar-menu-x: 16px;
  --sidebar-menu-y: 72px;
  --sidebar-item-width: 168px;
  --sidebar-collapsed-item-width: 52px;
  --sidebar-item-height: 40px;
  --topbar-height: 64px;
  --panel-gap: 16px;
  --glass-radius: 8px;
  --card-radius: 6px;
  --control-height: 32px;
  --table-row-height: 40px;
}

.gkx-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: var(--sidebar-width) minmax(0, 1fr);
  grid-template-rows: var(--topbar-height) minmax(0, 1fr);
  grid-template-areas:
    "sidebar header"
    "sidebar content";
  background: #d8e7fc;
  overflow: hidden;
}

.gkx-sidebar {
  grid-area: sidebar;
  width: var(--sidebar-width);
  min-height: 100vh;
  background: transparent;
}

.gkx-header {
  grid-area: header;
  height: var(--topbar-height);
  background: transparent;
}

.gkx-content {
  grid-area: content;
  margin: 0 var(--panel-gap) var(--panel-gap) 0;
  min-height: 0;
  padding: var(--panel-gap);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  row-gap: var(--breadcrumb-content-gap);
  border: 1px solid #fff;
  border-radius: var(--glass-radius);
  background: rgba(255, 255, 255, 0.48);
  backdrop-filter: blur(8px);
  overflow: hidden;
}

.gkx-breadcrumb {
  min-height: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  line-height: 20px;
}

.gkx-work-card {
  min-height: 0;
  padding: var(--space-medium);
  border-radius: var(--card-radius);
  background: rgba(255, 255, 255, 0.90);
  overflow: auto;
}

.gkx-control {
  min-height: var(--control-height);
}

.gkx-table-row {
  min-height: var(--table-row-height);
}
```

Inside the content region, data-heavy pages use this rhythm:

- Breadcrumb row: required on list and detail pages. It starts 16px from the content glass panel, top 16px, and must sit before filters or content.
- When a breadcrumb is followed by visible content, the vertical gap from the bottom of the breadcrumb row to the white work card or first content area must be `medium` / 16px.
- The glass content panel itself owns the 16px internal inset. Do not create this spacing by giving the work card arbitrary margins.
- The white work card must be the second child inside the glass panel after the breadcrumb. Its right, bottom, and left edges must remain exactly 16px from the glass panel border.
- Each page must have one and only one full-size `.gkx-work-card`. Smaller internal groups can use headings, form sections, table blocks, and necessary internal dividers, but not another full-page white card.
- When the page needs multiple boxed business modules inside `.gkx-work-card`, first create a gray module zone (`#F7F8FA`, or `#F2F3F5` when stronger separation is needed). The gap between modules inside this gray zone is always `medium` / 16px. Simple data blocks should sit directly on this gray zone without adding another white card. Complex modules can use smaller white inner cards inside the gray zone.
- Use dividers only inside a module to separate closely related rows, metadata groups, or repeated detail blocks when spacing/title alone is not enough. Do not use many horizontal dividers to create the main page hierarchy; page-level hierarchy must come from the white work card, gray module zone, module spacing, headings, and content grouping.
- The gray-zone rule does not apply to filter/query rows. Filter rows stay plain layout inside `.gkx-work-card`, with no gray background, no enclosing border, and no extra card.
- Filter/query area: horizontal label + control pairs. On the 1440px baseline, the first row shows at most three filter conditions. Query/reset actions are rendered only when the source prototype explicitly contains them; additional conditions start from the second row and continue in rows of up to three conditions.
- Create/action buttons: placed below filters on the left side of the working area.
- Table or list: main work surface.
- Pagination and batch actions: fixed below table content.
- Detail/edit flows: drawer for side inspection, modal for short confirmation, full page for complex forms.

## Page Patterns

The Figma file `情报管理系统`, nodes `1998:23720`, `1998:23719`, and `2012:27978`, provides real product examples for list pages, batch operations, confirmation dialogs, large detail/edit/create overlays, independent detail pages, and import flows. Use these examples to guide composition, not just isolated component styling.

### Management List Page

The list page pattern is represented by `论文管理`.

- Keep the global shell unchanged.
- The content glass panel contains one white work card for page-specific controls. Do not add another full-width/full-height white background card inside that work card.
- The white work card content area uses 16px padding on all four sides. Filters, action rows, tables, and pagination must start inside this 16px inset.
- Always include a breadcrumb at the top of the content area, before the filter row. Build it from the real information architecture, not from a generic home pattern.
- When the product has no standalone homepage, do not show a home icon. Start with the current top-level navigation group, such as 系统管理 or 权限管理; navigation-group labels without standalone pages are non-clickable.
- When a real homepage exists, use assets/breadcrumb-home.svg at 20px by 20px. The icon size is independent from the 12px breadcrumb text and must not be reduced with the text.
- Breadcrumb text is 12px/20px. Current-page text is #1D2129 and non-clickable; every non-current level and separator is #86909C. Only historical levels backed by a real return destination are interactive.
- Do not add a separate page title, subtitle, or record-count summary above the filter/table area unless the source page explicitly contains it. The breadcrumb and active sidebar item already establish page context.
- Filter row starts at `x=232, y=133` on the 1440px baseline and must remain horizontal: source-defined label + input pairs, plus only the source-defined filter actions.
- On the 1440px baseline, a filter area may place only three filter conditions in the first row. Simple search inputs and dropdowns update results immediately. Add `查询` and `重置` only for genuinely complex multi-condition filters that require one explicit submission.
- If there are more than three filter conditions, the fourth condition starts on the second row. Continue stacking filters downward in rows of up to three conditions. Extra rows keep the same label-left/control-right pattern and use `medium` / 16px vertical row gap.
- The recommended implementation is `repeat(3, minmax(0, 1fr))` for filter conditions. Add an action column only for confirmed complex filter submission; otherwise do not reserve empty query/reset space.
- Filter conditions use equal-width condition columns. Each condition is an inline label + fill container control pair; the complete condition pair fills its column, the label is content-adaptive and right-aligned, and text inputs, selects, cascaders, date pickers, and date-range pickers fill the remaining space.
- All filter spacing is 16px: condition-to-condition gap, row-to-row gap, and label-to-control gap. Do not use arbitrary 8px/10px gaps in multi-condition filter areas.
- The filter row sits directly inside the single white work card. Do not wrap the filter row in an additional bordered card, fieldset, or outlined container; use spacing and the controls' own borders to express structure.
- The vertical gap from the filter row to the next block is always `medium` / 16px. If an action row exists, filter row to action row is 16px and action row to table is also 16px; if there is no action row, filter row to table is 16px.
- Filter labels sit inline to the left of controls, not above inputs. Labels are right-aligned and content-adaptive; controls fill the rest of the condition column. The important result is that filter condition pairs in the same row are equal length while the filter area stretches with the container.
- Filter/search inputs must visually match the form input spec: 32px high, 4px radius, white background, `#E5E6EB` border, 14px text, placeholder `#86909C`, brand-blue focus border/ring, and the same disabled/error treatment as forms. Arco implementation may use `Input` or `Input.Search`, but the visual result cannot look like a separate Arco search component.
- When a filter dropdown means "all values", include `全部` as the first option and make it the default selected value. Do not add a separate sorting filter such as `排序规则` unless the source prototype explicitly shows it.
- Search-type filter inputs use placeholder `请输入`. The search icon is a right-side suffix icon aligned to the same right inset as the Select arrow, not a left prefix icon.
- When a complex filter requires a `查询` action, render it as a blue primary text-only button rather than a gray weak/disabled button. Do not create this action for simple search or direct-select filters.
- When a complex filter requires `查询` and `重置`, keep them as clear text buttons without icons; reserve icons for source-defined action buttons such as `新增` or `批量导入`.
- Create/action row starts below filters around `y=181` on the left side: primary `新增` button first, then secondary/batch actions such as `批量导入`.
- Main table starts around `x=232, y=229`, width 1160px, row height 40px.
- Pagination normally sits at the lower right of the table/content area. In normal list pages it starts around `x=848, y=685`; in batch-selection mode it shares a full-width bottom bar.
- Column pattern from the reference: checkbox 52px, ID 168px, title 256px, keywords 231px, author 96px, organization 209px. Treat these as baseline proportions; adapt column widths only to fit new data meaningfully.
- Operation cells must use text links, not icon-only actions. Their width is the visible action text widths plus 12px gaps plus 16px left and right cell padding; do not hard-code a wide operation column, truncate, hide, or wrap visible actions. Normal links use brand blue and destructive links use danger red.

### Standalone Detail Page

The standalone detail page pattern is confirmed from `情报管理系统` node `2012:27978`, named `专利-专利详情（默认）`. Use this for record details that need long reading, related lists, AI summaries, original document links, or multiple downstream actions. Do not force this amount of content into a Modal.

- Keep the same global shell and glass content region.
- The top content breadcrumb is replaced by a back link at `x=216, y=80`, with a 16px left arrow icon and 14px text such as `返回专利主页`.
- The white detail card starts at `x=216, y=118`, width 1192px, height 650px on the 1440px baseline.
- Inner content starts at `x=248, y=146`, width 1128px; use 32px card padding on the left/right and top.
- The detail content can exceed the visible card height. The page card scrolls vertically; the shell/sidebar/header do not scroll.
- Title row: 24px title, line-height 32px, weight 600; a status indicator may sit to the right of the title. It uses the global 6px semantic dot + 14px/22px status text pattern with no tint background, padding, border, or pill radius; review states such as `实质审查` use the warning semantic color.
- Entity row: label/value inline groups for applicant, inventor, assignee/receiver, etc. Labels use tertiary text and values use primary text; linked entities can show a 16px jump icon.
- Use a full-width divider after the title/entity summary.
- Metadata grid: multiple label/value pairs arranged across the 1128px content width. Labels are secondary/tertiary text; values use primary text and ellipsis when needed.
- Action row appears below metadata: primary action such as `加入知识库`, secondary action such as `译文修正`, and text link such as `查看原文`.
- Long text sections use section titles with a 3px by 14px brand-blue marker, 16px title text, and body text at 14px/24px.
- Candidate detail sections may include `摘要`, `权利要求书`, AI read/速读 empty state, citation/source tree, and related records list, but only when those sections are visible in the source prototype or explicitly requested. Do not add these sections to fill a detail page.
- Related list sections may use text-list rows with pagination instead of dense table rows when content is bibliographic.
- Use this page pattern when the detail view includes long-form reading, more than one content section, related records, AI tools, source/citation relations, or frequent navigation to linked entities.

### Document / Paper Reading Workspace

Use this pattern for `论文解析`, paper reading, PDF parsing, article analysis, citation review, image/table library, knowledge graph side panels, and similar reading workbenches. It still lives inside the standard shell and exactly one white work card.

- Work-card structure: vertical Auto Layout with `padding: 16px` and `gap: 16px`. Top parsing/reader toolbar is the first row; the reading body is the second row and fills the remaining height.
- Top reader toolbar: height 44px, 4px radius, neutral border `#E5E6EB`, background `#F7F8FA` or white. Status indicators, zoom controls, page controls, share/export actions, and icon buttons are all single-line and vertically centered. Status indicators follow the global dot + text rule and never become pills. Toolbar groups use 16px group gap and 8px internal icon/text gap.
- Reading body uses a three-pane layout when source content shows left outline and right resources: left TOC pane fixed 220px, center document pane `minmax(520px, 1fr)`, right resource pane fixed 272px. Pane gap is 16px; vertical dividers are 1px `#E5E6EB`.
- If the white work-card inner width cannot fit `220 + 16 + 1 + 520 + 16 + 1 + 272`, collapse the right pane first, then the left pane; do not squeeze the TOC/resource panes until their labels wrap.
- Left TOC / outline rows: row height 40px baseline, indentation 20px per level, page number column 32px fixed, title column Fill with single-line ellipsis. Long section names such as English paper headings must not wrap; expose full titles by tooltip or active detail panel.
- TOC tabs such as `目录 / 缩略图 / 笔记` use the content tab style and stay single-line. Do not let tab labels wrap or change to sidebar tab styling.
- Center document pane is the only area where paper title, author line, abstract, headings, and prose may wrap. Keep readable body width and 14px/24px body line-height; do not compress prose into narrow columns.
- Center document title uses 24px or 20px depending on source scale, line-height 32px/28px, weight 600. Author/meta line is 14px/22px secondary text and may ellipsis if extremely long.
- Figure/table/citation blocks inside the document pane use 16px vertical spacing from surrounding text, 4px radius, 1px brand or neutral border only when shown by source. Captions are single-line ellipsis unless the source shows multiline captions.
- Right resource pane cards: card width fills the pane, thumbnail area fixed height, caption/page row single-line with ellipsis. Card-to-card gap is 16px. Do not let `图 2: ...` or `表 1: ...` wrap into multiple lines inside a compact resource card.
- Pane scrolling: the center document pane scrolls vertically; left TOC and right resource pane may scroll independently when their content exceeds height. The global shell, glass panel, and white work card do not scroll.
- This reading workspace is not a generic dashboard. Do not add extra metrics, unrelated summary cards, or generated knowledge modules unless visible in the source prototype or confirmed by the user.

### Batch Selection Page

The batch-selection example is represented by `批量删除`.

- Selecting rows changes the bottom area into a full-width action/status bar inside the table/content area.
- Left side shows selection count, for example `已选 4 条`.
- Batch action follows the count, for example `批量删除`.
- Provide a `取消选择` action next to batch actions.
- Keep pagination on the right side of the same bottom bar so selection and paging remain visible together.
- Do not move batch actions into a floating toolbar or top hero area.

### Confirmation Dialogs

The deletion examples use a focused confirmation dialog over a dimmed page. All destructive confirm dialogs follow the shared three-part structure and responsive constraints.

- Confirmation modal size: 560px wide.
- Always set `max-width: calc(100vw - 48px)` and `max-height: calc(100vh - 48px)`.
- Place it centered in the viewport; reference position is around `x=520, y=280`.
- Use it for irreversible short decisions: delete one, batch delete, cancel import, overwrite, revoke.
- Keep the body copy concise and action-oriented: one primary confirmation sentence followed by one muted irreversible-effect sentence.
- Header and Footer stay fixed; only Body may scroll. The Modal panel itself must use `overflow: hidden` and must not scroll as a whole.
- Header title is left-aligned at 20px/28px, semibold. The destructive-confirm Header is 64px high with 32px horizontal padding and a 1px bottom border. Body uses 32px vertical and 40px horizontal padding; primary copy is 16px/24px and secondary copy is 14px/22px `#86909C` with a 12px gap. Footer is 72px high with 32px horizontal padding and a 1px top border.
- Footer actions align right; cancel button is left of the confirm button; button gap is 12px.
- The underlying page remains visible but blocked by an overlay scrim.

### Detail / Edit / Create Large Overlay

The detail modal style is confirmed from `情报管理系统` node `1998:23719` / modal frame `2012:27627`. It is a centered Arco-style modal over a dimmed list page, not a side drawer.

- Ordinary form/detail/edit Modal size: 640px wide, with `max-width: calc(100vw - 48px)` and `max-height: calc(100vh - 48px)`.
- The `1998:23719` detail example uses a 640px by 704px centered modal on the 1440px baseline.
- Reference position: `x=400, y=48` on the 1440px baseline.
- Modal radius: 8px; background white; high-layer shadow around `0 2px 6px rgba(0,0,0,0.16)`.
- Content width inside overlay: 592px, with 24px internal safe padding.
- Header: fixed 56px height for a one-line title, `0 24px` padding, 1px bottom border `#E5E6EB`, 16px/24px medium title, and a 20px close icon inside a 32px target at the right. A title plus subtitle Header grows to at least 72px with 12px vertical padding.
- Body starts below the fixed Header, uses 24px padding on every side and 16px internal field/module gaps, and is the only scrollable region.
- Detail section title: 14px medium text with a 3px by 14px brand-blue vertical bar and 8px gap.
- Detail mode groups information into sectioned blocks. Repeated detail blocks use `#F7F8FA` background, 4px radius, and 12px padding.
- Detail label/value rows use 14px text, 22px line-height, 8px gap; labels are `#4E5969`, right-aligned, 128px wide; values are `#1D2129`.
- Long intro fields span the remaining 456px content width and may wrap to multiple 22px lines.
- Section separators are 1px `#E5E6EB`, full 592px width.
- Footer is fixed inside the modal bottom: 64px high, 1px top border `#E5E6EB`, actions aligned right, 24px horizontal padding, and 12px button gap. Detail mode usually has one primary `关闭` button.
- In Modal footers, the cancel button uses `#F2F3F5` background with secondary text and no visible border; confirm/save uses the brand primary button, while destructive confirmation uses the danger button.
- Edit and create modes use the same structure, replacing read-only rows with `数据输入/输入框`, upload blocks, add-more controls, and delete controls.
- For multi-block content, use repeated 592px-wide sections rather than nested cards.
- Use this pattern when a user needs focused side/edit work without leaving the list context. If the workflow becomes long, multi-step, or requires many validations, use Drawer, full-screen modal, or a full page instead.

### Modal Size Scale

Use these widths by scenario. Do not invent one-off modal widths.

- `confirm` / 危险操作提示确认类: 560px. This tier is only for short irreversible decisions.
- 新增、生成、编辑等普通表单类: 640px.
- 复杂配置、穿梭框等复合交互类: 960px.
- 表格 / 权限 / 多列内容类: 1280px.
- More complex editor or workbench scenarios: use Drawer, full-screen modal, or an independent page instead of a normal Modal.

All Modal implementations must follow this structure:

- Header: fixed.
- Body: scrollable, the only scroll region.
- Footer: fixed.
- The Modal panel itself must not scroll. Set panel overflow to hidden; put all vertical overflow inside Body.
- Modal must not have horizontal scrolling. Set Modal Body `overflow-x: hidden`.
- When Modal content does not fit horizontally, do not add a horizontal scrollbar. Promote the Modal to the next width tier in the scale until it reaches the maximum suitable Modal width, 1280px.
- If content still does not fit at the maximum Modal width, wrap the content, abbreviate secondary copy, or change the interaction to Drawer, full-screen modal, or an independent page.
- Width: fixed recommended width by scenario.
- Modal size classes must override the base Modal width. Use a two-class selector such as `.arco-modal.arco-modal-size-config`, or place size rules after the base `.arco-modal` rule.
- Business-page styles must not reintroduce one-off legacy widths such as 420px for forms or 720px for complex configuration. Reuse only the scenario tiers above.
- Do not write a later generic `.arco-modal { width: 560px; }` rule that collapses every Modal back to the confirm width.
- `max-width`: `calc(100vw - 48px)`.
- `max-height`: `calc(100vh - 48px)`.
- Header title: left-aligned.
- Header / Body / Footer horizontal padding: 24px. Body vertical padding is also 24px.
- Header and Body are separated by a 1px line. The first Body content block starts 24px below the Body edge and has `margin-top: 0`.
- The first direct content block inside Modal Body must have `margin-top: 0`; do not reuse page-level section wrappers that add extra top margin inside a Modal.
- Modal form fields use vertical field groups, not left-right label/control rows. One group is `label above + control below`.
- Field labels sit above the control, left-aligned. Controls fill the full width of their field group.
- Input spacing is measured between control boxes after excluding label text. Do not let label text length consume or distort the 16px group spacing.
- Inside one vertical field group, label-to-control gap is 8px. Field group-to-group gap is 16px.
- Default Modal form layout is one field group per row.
- Use two field groups per row only when the content is relatively dense, the fields are short, and side-by-side scanning improves efficiency.
- In two-column Modal forms, each column is a complete vertical field group; keep 16px column gap and 16px row gap, and keep controls equal length within their columns.
- Ordinary form modals and complex config modals must use the same field-group layout rules.
- Footer button gap: 12px.
- Footer button order: cancel on the left, confirm on the right.

Do not continue using a normal Modal when content exceeds any of these limits:

- More than 15 fields.
- Contains a complex table.
- Contains a tree structure.
- Contains a multi-step flow.
- Contains complex permission configuration.
- Requires frequent editing or viewing large amounts of content.

### Import Flow

- Treat import as a staged flow, not a single upload button.
- Because import usually includes upload, validation, result review, and retry states, do not use an ordinary Modal for multi-step import.
- Multi-step import, data validation, and batch operation flows should use Drawer, full-screen modal, or an independent page.
- If a very small single-step upload confirmation truly needs a Modal, use the ordinary form width `640px`; do not introduce a separate 480px Modal size.
- Overlay scrim is `rgba(0,0,0,0.50)` when the flow is presented as an overlay. The underlying page remains visible but visually blocked.
- Header uses 24px horizontal padding, title 16px medium, and a 16px close icon at the top right. Header is fixed.
- Body is the only scrollable region if content grows.
- Footer is fixed at the bottom, 64px high, 1px top border `#E5E6EB`, white background, actions right-aligned, 24px horizontal padding, and 12px button gap.
- Step 1: choose/upload file and provide template/download affordance.
- Import steps are compact and centered: steps container width 320px, step icon 28px circle, 12px gap between icon/title/tail.
- Completed step icon uses `#E8F3FF` background with brand-blue check. Current step icon uses `#165DFF` background with white number. Inactive step icon uses `#F2F3F5` background with `#4E5969` number.
- The initial upload step may include an Info Alert: background `#E8F3FF`, padding 16px, 2px radius, 16px info icon, 16px title and 14px ordered copy.
- Upload dropzone uses `#F2F3F5` background, dashed `#E5E6EB` border, 2px radius, 16px horizontal padding, 50px vertical padding, centered text, and no heavy shadow.
- File list row uses `#F7F8FA` background, 2px radius, 12px horizontal padding, 7px vertical padding, 16px file/status/delete icons, and 14px filename text.
- Step 2: validate data and show validation results before commit.
- Validation failure state uses a centered 48px status icon. Title is 16px medium `#1D2129`; description is 14px `#86909C` with 2px gap below title.
- Error details block is full body width (`432px`), `#F7F8FA` background, 4px radius, 16px padding, title 14px medium `#4E5969`, description 12px `#4E5969`, divider `#E5E6EB`, and error row links/items with 16px gap.
- Step 3: success state clearly reports completion and next action.
- Step 4: failure state clearly reports failed rows/reasons and offers correction or retry.
- Do not collapse validation and success/failure into a toast only; use a visible modal body state when the operation affects many records.

## Components

Component behavior and naming should align with Arco React components. Reference: `https://arco.design/react/docs/start`.

### Connected Figma Component Sources

The following Figma nodes are treated as directly connected component-spec sources for this `design.md`. When any AI / design / code generation workflow needs component details, prefer these nodes before inventing local shapes.

| Component area | Figma source | Node / component names | Implementation mapping |
| --- | --- | --- | --- |
| Slider / 滑动输入条 | `国科信-设计规范` file `ULDE3XTXMtmZafqnocb6uQ`, page node `1905:241` (`滑动输入条 Slider（可用 待完善）`) | `slider`, `slider/default`, `.components/slider`, `.components`, `components/slider-mark`, `components/marks`, `.components/tick` | Arco React `Slider` with 国科信 visual override |

This source registration is not the same as a published Figma library binding. If the target Figma file still says it has no reusable 国科信 component binding, use these connected node rules as the authoritative local reconstruction contract.

There are two preview surfaces:

- `design-preview.html`: static visual specification and rule checker. It mirrors the shell, tokens, spacing, and page patterns without requiring a build step.
- `index.html` / React demo: real Arco component verification surface. It imports `@arco-design/web-react` and should be used to inspect true Pagination, Checkbox, Table rowSelection, Button, Input, Breadcrumb, and other component behavior while preserving the same 国科信 shell, color tokens, spacing, and layout contract.

When a rule involves component internals such as pagination items, checkbox selection, table row selection, input clear icons, or disabled/loading states, validate it in the React/Arco demo rather than relying only on hand-drawn static CSS.
The static `状态规范` preview may use lightweight HTML, but its checkbox, pagination, table selection, and action-link visuals must match the imported Arco component demo. Do not keep simplified placeholder pagination dots, custom checkbox ticks, or non-Arco selection states in the state preview.

### Arco Component Fidelity Rules

- Real implementation pages should prefer imported Arco React components for `Table`, `Pagination`, `Checkbox`, `Input`, `Button`, `Breadcrumb`, `Modal`, `Drawer`, `Upload`, and form controls. When Arco is unavailable in the current project, use semantic native/local equivalents that reproduce the same 国科信 visual and interaction contract; never leave browser-default controls unstyled.
- The global shell sidebar is an exception: do not use Arco `Tabs` or Arco default `Menu` visuals for the sidebar. If Arco `Menu` is used for behavior, it must be fully reset to the `.gkx-sidebar-*` contract below.
- Static previews may use HTML/CSS only, but component internals must mirror Arco DOM/class semantics when the component is being inspected. Use Arco class names such as `.arco-table`, `.arco-checkbox`, `.arco-pagination`, `.arco-pagination-list`, and `.arco-pagination-item` instead of arbitrary custom placeholders.
- Pagination must follow Arco: page item size 32px, item gap 8px, active item is `#165DFF` text on `#E8F3FF`, disabled prev/next arrows use `#C9CDD4` on transparent background, and pagination stays aligned to the lower right of the table area.
- Pagination total text uses 14px text, 22px line-height, secondary color `#4E5969`; do not shrink the bottom pagination area to 12px helper text.
- Table row selection is opt-in and appears only when the confirmed page provides one or more batch operations. When enabled, use Arco `Table` `rowSelection={{ type: 'checkbox' }}` in React pages; static previews show an Arco-like 14px checkbox in the fixed 52px selection column, selected state with brand-blue fill and white checkmark, and batch-selected rows with the light brand selected background. Read-only tables, view-only tables, and tables with only row-level actions must not render a checkbox column.
- Table header cells use background `#F7F8FA`, text color `#4E5969`, 14px text, 500 weight, row height 40px, and 16px horizontal cell padding.
- Table header and body cells must use single-line auto layout by default: `white-space: nowrap`, `overflow: hidden`, and `text-overflow: ellipsis`. Do not let ordinary names, titles, IDs, organizations, statuses, dates, or actions wrap and increase row height.
- Prefer fixed or proportion-based column widths with `table-layout: fixed` and horizontal scroll for overflow. Do not solve dense table content by allowing header/body text to wrap.
- Table operation cells use text links, not icon-only controls: `详情`, `编辑`, `删除`. Normal actions use brand blue; destructive actions use `#F53F3F`.
- Sidebar fold icons are fixed assets, not component-library substitutions: `assets/sidebar-expanded.svg` (`111.svg`) for expanded state and `assets/sidebar-collapsed.svg` (`222.svg`) for collapsed state, both 16px by 16px.
- Sidebar menu items must not inherit Arco default Menu visuals. Wrong signs include default Arco blue selected background, left active bar, default submenu indentation, default arrow on every item, a built-in collapse button, or an item height different from 40px.
- The app shell cannot use a large page-level `min-width` that clips the sidebar or brand area. Wide content should scroll inside table/content containers only.

### Generated Component Override Guardrails

Generation tools may correctly choose Arco components but keep Arco default visual styles. That is not enough. Arco provides component behavior; the final visual layer must follow the 国科信 rules below.

- All primary page controls share `--control-height: 32px`. Standard `Button`, `Input`, `Select`, `DatePicker`, search inputs, and form controls must visually resolve to 32px height.
- Button standard: 32px height, 4px radius, `0 16px` horizontal padding, 14px text, 22px line-height, 4px icon/text gap. Primary background `#165DFF`, hover `#4080FF`, active `#0E42D2`, white text. Secondary/default uses white or `#F2F3F5` background with primary/secondary text according to emphasis.
- Compact button: 28px height only for dense table row tools, compact toolbar tools, or imported Figma compact button instances. Do not use 28px for page filter actions, modal footers, or standard form actions.
- Text buttons and table action links are 22px line-height, no filled background, no pill shape, no icon unless the source design explicitly shows one.
- Input standard: 32px height, 4px radius, `#E5E6EB` border, white background, `0 12px` padding, 14px text, 22px line-height, placeholder `#86909C`.
- Input internal alignment is mandatory: the text, placeholder, prefix icon, suffix icon, clear icon, Select arrow, and DatePicker icon must all be vertically centered inside the 32px control. Do not rely on Arco defaults if the input text appears high/low, the clear icon floats, or the suffix icon is misaligned.
- Input focus: border `#165DFF` plus a subtle `0 0 0 2px rgba(22,93,255,0.10)` ring. Do not use heavy glow, thick outline, or browser-default outline as the main visual.
- Input error: border `#F53F3F`, optional helper text at 12px/20px danger color. Disabled input uses `#F7F8FA` background and tertiary/disabled text.
- Form item layout: labels use 14px/22px primary text; form row vertical gap is 16px; label-control gap is 8px in compact layouts. Required mark stays attached to the label.
- Search/filter inputs are not a separate visual component. They must use the same input standard above even if implemented with Arco `Input.Search`.
- Page content primary/standard tabs use the confirmed 36px Hug tab component: each item is 36px high, width hugs its label, has `0 16px` horizontal padding and zero inter-item gap, with 14px/22px text. Active text is `#165DFF` at weight 500, inactive text is `#4E5969` at weight 400, and a 2px `#165DFF` underline spans the full tab-item width at the bottom. Do not use filled pills, cards, borders, sidebar-style glass highlights, or a text-only short underline for this tab level.
- Page content secondary/category tabs use a compact segmented control derived from node `4192:20293`: the wrapper has `#F2F3F5` background, `4px` padding, `4px` radius, and zero gap; each item is 32px high with `0 16px` horizontal padding and 14px/22px text. Active category uses white background, text `#165DFF`, weight 500, and no underline. Inactive category has transparent background and text `#4E5969`, weight 400; adjacent inactive items may use a 1px `#E5E6EB` divider, which disappears next to the active item. This secondary style applies consistently below primary tabs in modules such as Resource Management and Permission Configuration. Never render secondary tabs with the primary underline style.
- Any page content tab row inside `.gkx-work-card` must sit inside the work-card safe area. If a tab row is the first content block, its top and left edges are still 16px away from the white card edge because `.gkx-work-card` owns `padding: 16px`. Do not use negative margins, absolute positioning, `left: 0`, `top: 0`, or `width: calc(100% + 32px)` to make tabs touch the white card border.
- The vertical gap after a content tab row is 16px before the next filter, action, table, card, or form block. Tabs never collapse into the table header or touch the card edge.
- Sidebar tabs are different from page content tabs: 168px by 40px item, 20px icon, 14px text, active glass/blue state from the sidebar rules. Do not reuse page tab underline styling in the sidebar.
- Sidebar expand/collapse must not use Arco's default Menu collapse output. Expanded state is 200px sidebar with 168px items and visible labels; collapsed state is 84px sidebar with 52px icon-only items. Fold icon remains the provided SVG asset at `top: 28px`.
- Arco Table visual override is mandatory. `.arco-table-container` uses `1px solid #E5E6EB`, `4px` radius, white background, and `overflow: hidden`; the native table uses `table-layout: fixed`, `border-collapse: separate`, and `border-spacing: 0`.
- Table cells and header cells use `height: 40px`, `padding: 0 16px`, `border-bottom: 1px solid #E5E6EB`, `white-space: nowrap`, `overflow: hidden`, and `text-overflow: ellipsis`. Header background is `#F7F8FA`; header text is `#4E5969`, 14px/22px, weight 500.
- A generated table is wrong if it renders row cards, zebra blocks, tall wrapped rows, gray strip modules behind the table, icon-only action cells, blue filled pagination buttons, or a second white table card inside the single white work card.
- Modal visual and scroll override is mandatory. Arco Modal behavior is allowed, but the visual shell must use the modal width scale, `max-width: calc(100vw - 48px)`, `max-height: calc(100vh - 48px)`, left-aligned fixed Header, scrollable Body, fixed Footer, 24px horizontal padding, and 12px Footer button gap. The whole modal must not scroll, and the Modal Body must not scroll horizontally.
- If generated output shows different button heights, input heights, input internal misalignment, default Arco search styling, pill-shaped page tabs, solid filled tab bars, tabs touching the white work-card edge, Arco default table visuals, arbitrary modal width, or a modal whose whole panel scrolls, treat it as a style error and override the component CSS.

Minimal override CSS for generated React / Arco / static preview output:

```css
.arco-btn {
  height: var(--control-height);
  border-radius: 4px;
  padding: 0 16px;
  font-size: 14px;
  line-height: 22px;
}

.arco-btn-primary {
  background-color: var(--gkx-brand);
  border-color: var(--gkx-brand);
}

.arco-input-inner-wrapper,
.arco-select-view,
.arco-picker {
  height: var(--control-height);
  min-height: var(--control-height);
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  border-radius: 4px;
  border-color: var(--gkx-border);
  background: #fff;
  padding: 0 12px;
  font-size: 14px;
  line-height: 22px;
}

.arco-input-inner-wrapper .arco-input,
.arco-select-view-value,
.arco-picker input {
  height: 22px;
  min-height: 22px;
  padding: 0;
  color: var(--gkx-text-primary);
  font-size: 14px;
  line-height: 22px;
}

.arco-input-prefix,
.arco-input-suffix,
.arco-input-clear-icon,
.arco-select-suffix,
.arco-picker-suffix {
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--gkx-text-tertiary);
  line-height: 16px;
  flex: 0 0 16px;
}

.arco-input-inner-wrapper-focus,
.arco-select-view-focus,
.arco-picker-focused {
  border-color: var(--gkx-brand);
  box-shadow: 0 0 0 2px rgba(22, 93, 255, .10);
}

.arco-input::placeholder {
  color: var(--gkx-text-tertiary);
}

.arco-tabs-header-title {
  height: 36px;
  color: var(--gkx-text-secondary);
  font-size: 14px;
  line-height: 22px;
  padding: 0 16px;
  margin-right: 0;
}

.arco-tabs-header-title-active {
  color: var(--gkx-brand);
  font-weight: 500;
}

.arco-tabs-header-ink {
  height: 2px;
  background-color: var(--gkx-brand);
}

.gkx-category-tabs {
  display: flex;
  align-items: center;
  gap: 0;
  min-height: 40px;
  padding: 4px;
  background: #F2F3F5;
  border-radius: 4px;
}

.gkx-category-tab {
  height: 32px;
  padding: 0 16px;
  border-radius: 4px;
  color: var(--gkx-text-secondary);
  font-size: 14px;
  line-height: 22px;
  background: transparent;
}

.gkx-category-tab.is-active {
  color: var(--gkx-brand);
  font-weight: 500;
  background: rgba(255, 255, 255, .72);
}

.gkx-work-card > .gkx-page-tabs,
.gkx-work-card > .arco-tabs,
.gkx-work-card > .gkx-category-tabs {
  margin: 0 0 16px;
}

.gkx-work-card {
  padding: 16px;
}

.arco-table-container {
  border: 1px solid var(--gkx-border);
  border-radius: 4px;
  background: #fff;
  overflow: hidden;
}

.arco-table-content {
  overflow: auto;
}

.arco-table table {
  table-layout: fixed;
  border-collapse: separate;
  border-spacing: 0;
}

.arco-table-th,
.arco-table-td {
  height: var(--table-row-height);
  padding: 0 16px;
  border-bottom: 1px solid var(--gkx-border);
  color: var(--gkx-text-secondary);
  font-size: 14px;
  line-height: 22px;
  text-align: left;
  vertical-align: middle;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.arco-table-th {
  color: #4E5969;
  font-weight: 500;
  background: #F7F8FA;
}

.arco-table-cell {
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.arco-modal {
  width: var(--modal-width-form);
  max-width: var(--modal-max-width);
  max-height: var(--modal-max-height);
  padding: 0;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.arco-modal.arco-modal-size-confirm { width: var(--modal-width-confirm); }
.arco-modal.arco-modal-size-form { width: var(--modal-width-form); }
.arco-modal.arco-modal-size-config { width: var(--modal-width-config); }
.arco-modal.arco-modal-size-table { width: var(--modal-width-table); }

.arco-modal-header {
  flex: 0 0 auto;
  min-height: var(--modal-header-height);
  padding: 0 var(--modal-padding-x);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--gkx-border);
  text-align: left;
}

.arco-modal-body {
  flex: 1 1 auto;
  min-height: 0;
  padding: 24px;
  overflow-y: auto;
  overflow-x: hidden;
}

.arco-modal-body > :first-child {
  margin-top: 0;
}

.arco-modal-footer {
  flex: 0 0 var(--modal-footer-height);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--modal-button-gap);
  padding: 16px var(--modal-padding-x);
  border-top: 1px solid var(--gkx-border);
  background: #fff;
}

.arco-modal-footer .arco-btn-secondary {
  color: var(--gkx-text-secondary);
  background: var(--gkx-bg-subtle);
  border-color: var(--gkx-bg-subtle);
}
```

### Buttons

Confirmed Figma components include `按钮`, `按钮样式`, `Butto/32（主）`, and `Butto/28`.

- Primary button: brand blue background, white text, height 32px for standard actions.
- Small/compact button: height 28px for dense table rows and toolbars.
- Secondary/default button: white background, neutral border, primary text color.
- Danger button: use danger red only for destructive actions.
- Text/link button: use in table action cells; keep spacing tight and separate destructive actions visually.
- Disabled buttons should lower contrast, preserve shape, and remain non-interactive.
- Modal and confirmation-dialog footers use a light-gray filled cancel button (`#F2F3F5`) followed by a primary or danger confirm button.
- Batch bars use text-like actions for low-emphasis commands such as `取消选择`.
- Batch selection bottom bar uses 14px text, 22px line-height, and a 16px gap between `已选 N 条`, destructive batch action, and `取消选择`. Batch actions are text links, not pill buttons.

### Forms

Confirmed Figma component: `数据输入/输入框`. The library also references Arco input, input group, textarea, password, search box, form item, upload, radio, checkbox-style table cells, and related controls.

- Follow Arco React Form semantics first: form item, label, required mark, help text, validate status, feedback message, disabled/readonly controls, upload field, and footer actions should stay structurally consistent. When Arco is unavailable, use semantic native controls with the same visual and interaction contract rather than browser-default Select, Checkbox, Radio, or file-input styling. Reference: `https://arco.design/react/components/form`.
- Standard input height: 32px.
- Filter/search inputs in management pages must use the same visual spec as the standard form input: 32px height, 4px radius, `#E5E6EB` border, white background, 14px text, and placeholder `#86909C`. Do not let Arco `Search` or `Input.Search` introduce a different height, radius, border, icon treatment, or compact visual style.
- In generated output, always verify input internal alignment: input text uses 22px line-height and the wrapper uses `display: inline-flex; align-items: center;`. Prefix/suffix/clear icons are 16px and vertically centered. If a generated input looks visually off-center, override the inner component classes rather than moving the whole field.
- Compact input height: 28px only inside dense table cells, inline editing, or very tight component internals; do not use 28px for the main page filter/search row.
- Labels: 14px, primary text; required mark in danger red.
- Current-page form rhythm: normal page forms use `16px` panel padding; modal form bodies use `24px` padding on all sides; label-to-control gap is `8px`; field-to-field and two-column field gaps are `16px`. Keep fields in one semantic form rather than styling each page independently.
- Placeholder and icons: `#86909C`.
- Select, DatePicker, and other single-line native fallbacks use the same 32px / 4px / `#E5E6EB` input shell. A Select arrow is a 16px muted suffix aligned at the 12px right inset; DatePicker icons remain vertically centered. Textarea keeps the same shell and typography with an 80px minimum height.
- For local Select fallbacks, use a semantic trigger + `listbox` menu rather than relying on the browser's native dropdown popup: the closed trigger is 32px high with 14px/22px text, the menu is white with a 1px neutral border, 4px radius, 4px internal padding, 32px option rows, muted-hover state, and primary-blue/light-blue selected state. Render the menu above modal/body clipping when necessary. A multi-select uses the same trigger and option rows, with 14px square selection marks; selected values stay in the trigger with single-line ellipsis.
- Local date fallbacks retain a real date input for keyboard and picker behavior, but hide the browser indicator and render one muted 16px calendar suffix at the 12px right inset; the suffix becomes brand blue with the focused input.
- Form Checkbox is a 14px square with 2px radius; Radio is 16px circular. Both use neutral borders when clear and `#165DFF` fill plus a white check/dot when selected. Do not style field checkboxes as toggle switches unless the source explicitly calls for a Switch.
- Focus: brand-blue border or ring, no heavy glow.
- Error: danger border plus 12px helper text below.
- Disabled: subtle gray background, tertiary text.
- Read-only: render as plain value or borderless input in the same label/value grid; do not make readonly look editable.
- Required: use the Arco-style required mark before the label and keep it visually tied to the label, not floating inside the field.
- Validation: invalid fields show danger border plus 12px helper text; keep validation copy specific and actionable.
- Upload fields must follow the dedicated upload rules below. Show accepted file type, size/format expectations, and the next validation step when the source prototype provides that helper content; do not invent helper copy that is absent from the source.
- Form footer: align actions right; secondary cancel first, primary save/submit last. In large overlays, footer should remain inside the overlay panel.
- Modal forms use `Header + Body + Footer`: Header and Footer are flex-fixed, only Body scrolls vertically, and the Footer does not scroll away with form fields.
- Multi-section forms: use section titles/dividers inside one panel instead of nested cards.
- Use search-capable inputs in filter bars when query intent exists, but their visual styling must still match the standard form input shown in this section.
- In large edit/create overlays, group fields into 592px-wide sections with 24px overlay padding.
- Repeated file/resource blocks can use a 592px-wide section about 196px high; include more/delete icon actions inside the block instead of adding external controls.
- Detail overlays should use label/value rows; edit/create overlays should keep the same section order and swap values for inputs.

### Slider

Source reference: `国科信-设计规范` node `1905:241`, page `滑动输入条 Slider（可用 待完善）`. Real implementation should use Arco React `Slider`; static previews can mirror the Figma component structure.

- Primary component set: `slider`, node `1905:32247`. Variants are `范围=false/true`, `图标=false/true`, and `提示=false/true`.
- Exposed boolean component properties include `输入框`, `步长`, and `标签`. Use them only when the source prototype shows a number input, step/tick marks, or labels.
- Track baseline: 320px wide in the main component variants, 32px interaction height, with the actual rail centered vertically at `y=15`.
- Rail visual: 2px height, 10px radius. Unselected rail is `#E5E6EB`; selected rail is `#165DFF`.
- Default standalone track component `slider/default` can use 200px width when the source prototype shows the compact example; otherwise let the slider fill the form/control column.
- Handle component set `.components` uses circular handles: default 12px by 12px, hover 14px by 14px, radius 999. Default/active handle uses `#F2F3F5` fill and `#165DFF` stroke.
- Disabled handle keeps `#F2F3F5` fill with `#E5E6EB` stroke. Disabled sliders should also mute the selected rail and prevent pointer interaction.
- Range mode uses two handles and a selected segment between them. Do not fake range mode by drawing two independent sliders.
- Tooltip mode uses the existing `Tooltip` component above the handle. Show tooltip only when the prototype or component variant has `提示=true`; do not add tooltips by default to every slider.
- Mark/step components come from `components/slider-mark`, `components/marks`, and `.components/tick`. Mark text uses the normal 14px/22px form typography and aligns to the tick. Keep mark/tick spacing from the component; do not crowd marks to fit long labels.
- The component supports equal division examples `等分=3`, `等分=4`, and `等分=5`; use the division count visible in the source, or omit marks if the source does not show them.
- Icon mode uses 16px linear icons at slider ends with an 8px gap to the track area. Do not use decorative icons unless `图标=true` or the source prototype shows them.
- Number-input mode pairs the slider with a 32px-high input/number control. The slider and input stay in one horizontal row; keep a 16px gap between control groups unless the Figma variant itself defines a tighter internal gap.
- In forms, the slider belongs inside the same form item/grid as other controls and follows the form row spacing rules. Do not wrap it in an extra card, gray module, or oversized custom control.

### Upload

Source reference: `国科信-设计规范` node `1741:29`, `上传 Upload（可用）`. Real implementation should use Arco React `Upload`; static previews can mirror the Arco visual structure with `arco-upload` classes.

- Supported trigger patterns: file list, image list, and picture wall; each can be triggered by a button or drag area depending on task density.
- Button trigger: 32px high primary button, `#165DFF` background, white text, 2px radius, `5px 16px` padding, 8px icon/text gap, 14px upload icon, and label `点击上传`.
- Drag trigger: use a 400px baseline width when placed in a form section; background `#F2F3F5`; 1px dashed border `#E5E6EB`; 2px radius; `50px 16px` padding; centered vertical layout; 24px internal gap.
- Drag trigger title: `点击或拖拽文件到此处上传`, 14px/22px, `#1D2129`, weight 400.
- Drag trigger hint: file type, format, and size copy at 12px/20px, `#86909C`; example copy: `Only pdf, png, jpg can be uploaded, and the size does not exceed 100MB`.
- File list rows: 400px baseline width, 36px height, `#F7F8FA` background, 2px radius, `7px 12px` padding, 12px internal gap, 16px file/status/action icons, filename text 14px/22px `#1D2129`.
- File list states must include default, uploading, and error. Uploading uses the loading/status icon position; error keeps the row geometry and uses danger color only for the failed state affordance.
- Picture wall items: 80px by 80px, 2px radius, neutral dashed or subtle border, centered add/preview content, with default, hover, uploading, and error states.
- File list status/action icons must be constrained inside their own 16px icon boxes. They must not float into the drag upload area or picture wall status area.
- Button trigger, file list, drag trigger, and picture wall status examples are separate visual groups with 16px group spacing. Do not stack status icons inside the drag trigger itself.
- Upload controls belong inside the same white work card or modal body as the form. Do not add a large extra upload card, heavy shadow, marketing-style dropzone, or another nested white panel.
- Batch import upload is a staged flow: upload file first, then validate data, then show success or failure. Do not collapse upload validation into a toast-only result.

### Dashboard Surfaces

This dashboard surface pattern applies only to Data Dashboard pages and confirmed statistical-analysis pages containing a KPI row followed by peer charts and a ranking table. Do not apply it to ordinary list, form, detail, or other business pages. It is an explicit dashboard exception to the generic gray module-zone rule.

- Dashboard content background is `#FFFFFF`. Do not place KPI cards, chart panels, or ranking tables on a gray dashboard canvas.
- The dashboard module begins with one responsive title toolbar: place the module title on the left and date-range or period filters on the right; stack them only when the available width cannot preserve usable controls.
- The top KPI/stat row is visually unboxed: each metric uses white/transparent background with no outer border and no shadow. Use typography, icon treatment, and the layout grid to group each metric.
- Separate adjacent KPI items with one neutral vertical divider only. The divider is `1px` wide, exactly `40px` high, vertically centered in the gap between items, and omitted after the last item. Recompute or remove dividers when the responsive column count changes; never leave a divider at the outer edge of a row.
- Do not use gray fills, floating-card shadows, or a full rectangular border around each KPI. The 16px divider is the only separation mark in the KPI row.
- Peer chart panels below the KPI row use one standard line box each: white background, `1px solid #E5E6EB`, 4px radius, 16px internal padding, no shadow. Do not add an extra chart-zone wrapper border around both panels.
- Chart hover is mandatory within Data Dashboard pages. Follow the Arco Charts interaction pattern: one x-axis position highlights every related series point, shows a subtle vertical guide, and opens one white tooltip containing the category plus every series marker/name/value. The tooltip uses a neutral border, 4px radius, restrained high-level elevation, and primary/secondary text rather than a black bubble. Funnel segments highlight with a restrained translate/brightness response, de-emphasize peer segments, and expose stage, value, and conversion rate; keyboard focus must receive the same state.
- A ranking or metrics table below charts follows the standard Table rules rather than the KPI/chart surface rules. Its heading and table container align to the same left and right boundaries as the chart row, with no extra card padding around the ranking section. Use one Arco-style table container with the neutral 1px border, 4px radius, `#F7F8FA` header, 40px rows, 16px horizontal cell padding, single-line ellipsis, and pagination only when the actual data volume requires it.
- Do not wrap the ranking table in another bordered card. The table container supplies the single required line box.

### Tables

Tables are the default presentation for records, tasks, logs, organizations, users, and metrics lists.

- Follow Arco React Table semantics first: use a table container, native `table`, `thead`, `tbody`, row selection, text-link action cells, loading/empty states, and pagination instead of rebuilding tables with arbitrary div grids. Reference: `https://arco.design/react/components/table`.
- For real implementation checks, use `Table` with `rowSelection={{ type: 'checkbox' }}` and pair it with Arco `Pagination` when Arco is available. Otherwise, use semantic native/local equivalents that match the checkbox, pagination, selection, keyboard, and disabled-state rules in this section rather than browser defaults.
- Header background: `--gkx-bg-subtle`.
- Header text: `#4E5969`, 13px/14px, weight 500.
- Row height: 40px for the default management-table pattern shown in `3937:126`.
- Table visual surface must match the visual preview exactly: one Arco table container with `1px` neutral border, `4px` radius, white background, and clipped corners. Do not wrap the table in another white card or render table rows as independent cards.
- Header cells use `#F7F8FA` background, `#4E5969` text, 14px/22px, weight 500, and 16px horizontal padding. Body cells use the same 40px height and 16px horizontal padding.
- Header cells and body cells use auto layout with single-line ellipsis by default. The default cell CSS is `white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`.
- The table/list surface stays inside the work card's `16px` left and right inset even when it has only a few columns or rows. When the semantic minimum widths do not fill the container, only the business-content columns use Fill to absorb the remaining width. Fill is proportional to each column's semantic/content-safe width, so key names, titles, long text, and full-display identifiers retain more space while enum, Boolean, status, and date fields retain less; never turn all content columns into equal-width columns. Do not create a blank spacer column.
- Row-selection and operation columns never participate in Fill. The checkbox column stays fixed at `52px`. The operation column stays fixed to its longest visible action row plus 12px action gaps and 16px left/right cell padding, remains at the far right, and keeps the `操作` header and operation links left-aligned. All business field content also remains left-aligned. When semantic/content-safe widths exceed the container, stop Fill expansion and use horizontal scrolling with the selection and operation columns fixed only while content is hidden.
- The table component defaults to no row selection. A page must explicitly enable the 52px checkbox column only together with confirmed batch actions and the corresponding selected-state batch action bar. Do not infer selection from the presence of a table or from row-level `查看` / `编辑` / `删除` links. A table with no batch workflow has no checkbox column.
- Long detail payloads that are inspected one row at a time, such as request parameters, response payloads, or expanded technical details, belong behind a `查看` action in the far-right operation column. Do not consume a permanent business column with an `展开查看` pseudo-value; open the complete content in the standard detail Modal.
- Column width is semantic-first and content-safe: `final width = max(column-specific minimum, semantic-category minimum, header/longest plain-text display width)`. Do not make all columns the same width, and do not derive width solely from column count. Plain-text width includes 16px left/right cell padding; reserve about one 14px unit per Chinese glyph, `0.58` unit per Latin letter/digit, and `0.35` unit per space, capped at the visual budget of 16 Chinese characters. A value that needs more room within this 16-character budget wins over the semantic minimum.

  | 字段类别 | 典型字段 | 最小宽度 |
  | --- | --- | --- |
  | Fixed enum / Boolean / status indicator | 状态、发布状态、账号状态、启用属性、是否置顶、请求方法、触发机制、响应结果、调用耗时、学者数量、职称 | `96px` |
  | Type / short classification | 报告类型 | `128px`；所属领域、领域、渠道、返回格式为 `120px` |
  | Short identifier / person | 用户ID、角色ID、报告类型ID、用户姓名、学者姓名、提交人、创建人、上传时间、发布时间、创建时间 | `120px`；手机号为 `128px`，调用时间/最近修改时间为 `144px` |
  | Normal organization / module / page field | 角色名称、一级/二级/三级页面、所属功能模块、报告来源、接口名称、所属学科、组织/机构名称 | `140px`–`180px`，按字段重要性取值 |
  | Key title / name / URL-like field | 报告标题、报告信息、报告名称、人才库名称、邮箱、接口地址、示例请求、埋点路径、地址(URL) | `200px`–`240px`；路径和地址优先 `220px`–`240px` |
  | Long text / detail field | 内容摘要、评论内容、角色描述、描述、参数列表、请求参数、错误信息、错误码说明 | `200px`–`240px`，默认优先 `240px` |

- Plain text table data of up to 16 characters must display in full whenever its semantic minimum or calculated content width allows it. When a value exceeds 16 characters, show a single-line ellipsis at the 16-character boundary. Status indicators, category tags, switches, operation links, and other non-text cell nodes use their semantic column width and do not participate in the plain-text character calculation.
- Columns explicitly confirmed as full-display fields, such as a process ID on a sparse process-instance page, are exceptions to the 16-character ellipsis threshold: calculate the complete plain-text width plus cell padding and show the entire value. This exception is column-specific and must not disable the default 16-character rule for names, descriptions, organizations, titles, or other ordinary table fields.
- Only truncated plain text values show a hover Tooltip with the full original copy. The Tooltip uses near-black `#1D2129` / `rgba(0,0,0,.85)` background, white text, 12px/20px typography, 4px radius, and must escape the table scroll container; status indicators, category tags, operation links, and other non-text cell nodes do not use this character threshold.
- Long description, abstract, remark, introduction, or rich text fields are the exception. They should not be forced into the default 40px management table row; use a detail page, drawer, expanded row, multiline list card, or explicit multiline column pattern.
- Table columns should be planned before rendering: assign fixed/proportional widths for ID, title, status, time, organization, and action columns, then let the table horizontally scroll when total width exceeds the container.
- Borders: 1px `--gkx-border`.
- Hover: `--gkx-bg-hover`.
- Loading: keep the table geometry visible and place a light Arco spin mask over the content area.
- Empty: show a centered empty state with concise recovery action, not a blank table body.
- Error: preserve query context and show retry; do not replace the whole page shell with an error screen.
- Sorting/filtering: use compact indicators in the table header, aligned with header text.
- Enable horizontal scrolling and sticky columns only when `scrollWidth > clientWidth`: the 52px checkbox column fixes left and the operation column fixes right. When the table is fully visible, both columns return to ordinary flow with no fixed-column shadow.
- Fixed-column shadows reflect real scroll position: at `scrollLeft = 0`, the left checkbox column has no right-edge shadow; at the far-right scroll boundary, the right operation column has no left-edge shadow. Show a subtle edge shadow only for a fixed column that is covering still-hidden content in that direction.
- Use status indicators, text links, switches, checkboxes, avatar/text cells, and action cells consistently. Status indicators are always the global semantic dot + text pattern, not Tag components.
- Operation column is text-link layout; links use 14px/22px text, 12px gap, brand blue for normal actions, `#F53F3F` for destructive actions. Keep like actions adjacent; without changing the source action set, place common read/edit actions first, state actions next, and destructive actions last. Do not use only icons in the operation column. Buttons and operation links never use dotted/dashed underlines to indicate Tooltip availability.
- Disabled buttons and disabled operation links use `--gkx-text-disabled`, `cursor: not-allowed`, and `disabled` or `aria-disabled="true"`; they remain visible when the confirmed interaction requires the action to stay discoverable, but cannot trigger the action. Disabled states never use dotted/dashed underlines. Explanatory Tooltips remain available through hover/focus without adding an underline.
- Place pagination below the table aligned right unless batch operations require left-side controls.
- In React pages, use Arco `Pagination` directly for page items, arrows, disabled states, total text, and page-size behavior. Match layout through the parent `table-footer`; do not recreate pagination with custom spans.
- Arco Pagination active state is primary-blue text on `--gkx-brand-light` / `#E8F3FF`, not a solid blue filled button. Disabled prev/next arrows use tertiary gray and transparent background.
- Static previews that represent pagination should visually mirror Arco DOM/classes: `.arco-pagination`, `.arco-pagination-list`, `.arco-pagination-item`, `.arco-pagination-item-active`, `.arco-pagination-item-disabled`. Use 32px page items, active page as brand-blue text on light-blue background, disabled arrows in tertiary gray, and no handmade pill/dot pagination.
- Static previews must include `.arco-pagination-total-text` before the page list when showing totals, with the same 14px/22px typography as Arco Pagination.
- Pagination totals and page count derive from the actual current filtered records: `pageCount = ceil(total / pageSize)`. Never hard-code a second page, a placeholder total, or a page count; when filters or data change, reset or clamp the current page to a valid value.
- Keep checkbox column at about 52px when row selection exists. Use a 14px square Checkbox with 2px radius, white fill and neutral border; checked and indeterminate states use `#165DFF` with a white check/dash, and selected rows use `#E8F3FF` background.
- Use ellipsis for long titles, keywords, and organization names; do not wrap management-table rows beyond 40px in the default list view.
- When at least one row is selected, use a bottom selection bar with `已选 N 条`, only source-allowed batch actions, and `取消选择` on the left and pagination on the right. Do not leave an empty batch bar when no records are selected.
- Batch selection controls must remain in the same 32px-high bottom row as pagination: left batch text group, right Arco pagination.
- Do not hide pagination during selection mode.

### Cards And Panels

Confirmed Figma component: `Card`.

- Use cards for KPI blocks, grouped settings, record summaries, and dashboard panels.
- Cards should have white background, thin neutral border, 4px to 6px radius, and no default heavy shadow.
- Do not nest cards inside cards. Use dividers or section headers inside a panel.
- KPI cards should keep label, value, delta, and optional icon in a compact layout.

### Navigation And Tabs

Confirmed Figma component: `Tab`; library search also returns menu-related components through Arco. The current sidebar/menu source of truth is Figma `国科信-设计规范` node `473:16`, with expanded state node `4112:249` and collapsed state node `4112:649`.

- Sidebar lives inside the fixed `200px` shell column and uses the page blue background behind it; do not render it as a solid dark/brand block.
- Sidebar navigation is a shell-specific menu, not Arco `Tabs` and not Arco default `Menu` visual styling. Arco may provide interaction semantics only; the rendered sidebar must use `.gkx-sidebar-*` geometry, spacing, active background, and fold icon rules.
- Sidebar expand/collapse is controlled by the global shell state `.gkx-shell.is-sidebar-collapsed`, not by Arco Menu's default collapsed layout. The content glass panel, fold icon, brand block, menu item width, label visibility, and arrow visibility all change together from the shell tokens.
- Expanded brand block starts at `left: 16px; top: 16px; width: 136px; height: 40px`. It contains the official `28px` logo asset at `assets/gkx-logo.png`, `8px` gap, and the 16px medium product title. In the reference title is `情报管理系统`.
- Sidebar logo must use the provided bitmap directly. Do not redraw it with gradients, generic app icons, placeholder circles, or generated vector approximations.
- Sidebar fold icons must use the provided SVG assets directly: `assets/sidebar-expanded.svg` from `111.svg` represents the expanded-sidebar state, and `assets/sidebar-collapsed.svg` from `222.svg` represents the collapsed-sidebar state. Do not replace them with Arco default menu icons, CSS-drawn lines, or rotated arrows.
- Fold icon size is always 16px by 16px, color remains the SVG asset color `#86909C`. It sits on the glass/content panel edge: expanded state at `left: 200px; top: 28px`; collapsed state at `left: 84px; top: 28px`. It is not part of the brand block.
- Brand title uses the product name; the reference title is `情报管理系统`. Use 16px, line-height 24px, weight 500, color `#1D2129`, letter-spacing `0px`.
- The sidebar menu starts at `left: 16px; top: 72px; width: 168px`, uses vertical layout and `4px` item gap. The `4px` gap applies consistently between first-level tabs, between a parent tab and its second-level list, and between second-level tabs.
- Collapsed sidebar width is `84px`. The brand logo moves to `left: 26px; top: 16px`, title is hidden, menu still starts at `left: 16px; top: 72px`, and item width becomes `52px`.
- First-level menu item width is `168px`; default height is `40px`; the reference allows a `38px` compact item only when matching an imported Figma instance.
- Menu item layout: icon `20px`, label `14px`, icon-label gap `8px`, left padding `16px`, right padding usually flexible; default radius `4px`.
- Collapsed menu item layout: width `52px`, height `40px`, left padding `16px`, icon `20px`; text label and right arrow are hidden. Active collapsed item keeps the same glass highlight within the 52px item.
- Sidebar tab icons must come from the Arco IconBox style (`https://arco.design/iconbox/lib/89/0`): linear, 20px, 1.2px stroke, `currentColor`.
- Default menu text uses 14px, line-height 22px, weight 400, color `#1D2129`; default icon uses `#4E5969`.
- Hover state uses a subtle translucent white background only; do not invert text or add a left indicator bar.
- Active item uses text/icon color `#165DFF`, label weight 500, 1px white border, 4px radius, soft white/blue gradient background, and `0 1px 12px rgba(83,98,144,0.08)` shadow.
- If a second-level sidebar item is active, the active second-level item uses the full-width sidebar active glass highlight across the `168px` menu column while keeping its second-level text indentation. Its parent first-level item is a context highlight only: text, icon, and arrow turn `#165DFF` with weight 500, but it must not show the active glass background, white border, or shadow.
- Arrow rule: only sidebar items with a second-level menu may show a 16px direction icon at the far right (`right: 12px`). Items without children must not display an arrow icon. In collapsed mode all labels and arrows are hidden.
- Keep sidebar labels short and single-line. Do not wrap labels inside the 200px sidebar.
- Sidebar menu content is dynamic. The visual style, item size, icon treatment, active state, and collapse behavior are fixed, but the actual labels, item count, order, hierarchy, active item, and child-menu existence must come from the source prototype or confirmed information architecture.
- Reference labels such as `首页`, `资讯`, `论文`, `专利`, `学者`, `期刊`, `机构`, `AI阅读`, `社区` are examples from a reference file only. Do not copy them into a generated page unless they are visible in the source or explicitly confirmed.
- If the source prototype only shows a partial sidebar, reproduce only the visible menu items and mark unseen/unclear items as pending rather than inventing a full navigation tree.
- Tabs inside page content are separate from sidebar navigation. Page primary/standard tabs use brand blue active text and a full-item-width 2px underline, not the sidebar glass highlight.
- Page primary/standard tabs use the current confirmed 36px Hug component: 36px item height, `0 16px` horizontal padding, zero item gap, 14px/22px text, active medium weight, and a 2px underline spanning the full item width.
- Page secondary/category tabs source: `科技情报挖掘平台` node `4192:20293`. Use a `#F2F3F5` segmented wrapper with 4px padding and 4px radius; items are 32px high with `0 16px` padding and no gap. The active item is white with `#165DFF` text and no underline. Apply this same hierarchy to Resource Management and Permission Configuration: top-level tabs use the standard 36px underline style, while nested tabs use the segmented style.
- Page content tabs must respect the white work card safe area. In a list, detail, dashboard, or settings page, tabs live inside `.gkx-work-card` padding and stay 16px away from the card's top/left/right edges. A tab row touching the white card edge is a layout failure.
- When tabs control content below, the gap from the tab row to the next block is 16px. Do not let tabs touch the filter row, table header, or first form row.
- Breadcrumbs belong above page title on deep pages.
- Breadcrumbs must reflect real navigation depth. Top-level navigation groups without standalone pages, including the current 系统管理 and 权限管理, are rendered as non-interactive #86909C text rather than fake links.
- Use the provided assets/breadcrumb-home.svg (Group 1635095863.svg) at 20px by 20px only when a real homepage exists. Do not redraw it with CSS, replace it with a generic Arco home icon, or shrink it with breadcrumb typography.
- Sidebar collapse previews should show both shell states: expanded state keeps the 200px sidebar with logo, title, labels, and active glass tab while the fold icon sits at `x=200, y=28`; collapsed state uses an 84px icon rail, keeps the logo, hides labels/arrows, uses 52px menu items, places the fold icon at `x=84, y=28`, and moves the content glass panel left edge to 84px.
- If implementation uses Arco `Menu`, reset `.arco-menu`, `.arco-menu-inner`, `.arco-menu-item`, `.arco-menu-inline-header`, `.arco-menu-selected`, `.arco-menu-icon`, and `.arco-menu-icon-suffix` to this sidebar contract. Do not keep Arco default blue left border, filled selected row, built-in collapse button, submenu indentation, dark mode, item margin, or default arrow placement.
- A generated sidebar is wrong if it shows Arco's default selected row, default submenu arrows on items without children, a Menu collapse trigger inside the brand row, `arco-tabs` underline/pill visuals, clipped product title, or a fold icon that pushes layout instead of sitting at `x=200/84, y=28`.

Sidebar CSS contract:

```css
.gkx-sidebar-brand {
  position: absolute;
  left: var(--sidebar-brand-x);
  top: var(--sidebar-brand-y);
  width: var(--sidebar-brand-width);
  height: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.gkx-sidebar-brand-main {
  height: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 2px;
}

.gkx-sidebar-logo {
  width: var(--sidebar-logo-size);
  height: var(--sidebar-logo-size);
  display: block;
  object-fit: contain;
}

.gkx-sidebar-title {
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
  color: #1d2129;
  white-space: nowrap;
}

.gkx-sidebar-fold {
  position: absolute;
  left: var(--sidebar-width);
  top: 28px;
  width: 16px;
  height: 16px;
  display: block;
  object-fit: contain;
}

.gkx-sidebar-tabs {
  position: absolute;
  left: var(--sidebar-menu-x);
  top: var(--sidebar-menu-y);
  width: var(--sidebar-item-width);
  display: grid;
  gap: 4px;
}

.gkx-sidebar-tab {
  position: relative;
  width: var(--sidebar-item-width);
  height: var(--sidebar-item-height);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  border-radius: 4px;
  color: #1d2129;
  font-size: 14px;
  line-height: 22px;
  font-weight: 400;
}

.gkx-shell.is-sidebar-collapsed {
  --sidebar-width: var(--sidebar-collapsed-width);
  --sidebar-item-width: var(--sidebar-collapsed-item-width);
}

.gkx-shell.is-sidebar-collapsed .gkx-sidebar-brand {
  left: 26px;
  width: 32px;
}

.gkx-shell.is-sidebar-collapsed .gkx-sidebar-title {
  display: none;
}

.gkx-shell.is-sidebar-collapsed .gkx-sidebar-fold {
  left: var(--sidebar-collapsed-width);
}

.gkx-shell.is-sidebar-collapsed .gkx-sidebar-tab {
  width: var(--sidebar-collapsed-item-width);
  padding: 0 16px;
  overflow: hidden;
}

.gkx-shell.is-sidebar-collapsed .gkx-sidebar-tab-label,
.gkx-shell.is-sidebar-collapsed .gkx-sidebar-tab-arrow {
  display: none;
}

.gkx-sidebar-tab-icon {
  width: 20px;
  height: 20px;
  flex: 0 0 20px;
  color: #4e5969;
}

.gkx-sidebar-tab-arrow {
  position: absolute;
  right: 12px;
  top: 12px;
  width: 16px;
  height: 16px;
  color: #4e5969;
}

.gkx-sidebar-tab:hover {
  background: rgba(255, 255, 255, 0.28);
}

.gkx-sidebar-tab[aria-current="page"],
.gkx-sidebar-tab.is-active {
  color: #165dff;
  font-weight: 500;
  border: 1px solid #fff;
  border-radius: 4px;
  background:
    linear-gradient(-8.38deg, rgba(255,255,255,0) 39.256%, rgba(22,93,255,.2) 114.2%),
    linear-gradient(90deg, rgba(255,255,255,.48) 0%, rgba(255,255,255,.48) 100%);
  box-shadow: 0 1px 12px rgba(83, 98, 144, .08);
}

.gkx-sidebar-tab[aria-current="page"] .gkx-sidebar-tab-icon,
.gkx-sidebar-tab.is-active .gkx-sidebar-tab-icon {
  color: #165dff;
}

.gkx-sidebar .arco-menu,
.gkx-sidebar .arco-menu-inner {
  width: var(--sidebar-item-width);
  padding: 0;
  margin: 0;
  border: 0;
  background: transparent;
  box-shadow: none;
}

.gkx-sidebar .arco-menu-item,
.gkx-sidebar .arco-menu-inline-header {
  width: var(--sidebar-item-width);
  height: var(--sidebar-item-height);
  min-height: var(--sidebar-item-height);
  margin: 0 0 4px;
  padding: 0 16px;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
  color: #1d2129;
  font-size: 14px;
  line-height: 22px;
  font-weight: 400;
}

.gkx-sidebar .arco-menu-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  color: #4e5969;
}

.gkx-sidebar .arco-menu-icon-suffix {
  right: 12px;
  width: 16px;
  height: 16px;
  color: #4e5969;
}

.gkx-sidebar .arco-menu-selected,
.gkx-sidebar .arco-menu-item.arco-menu-selected,
.gkx-sidebar .arco-menu-inline-header.arco-menu-selected {
  color: #165dff;
  font-weight: 500;
  border-color: #fff;
  background:
    linear-gradient(-8.38deg, rgba(255,255,255,0) 39.256%, rgba(22,93,255,.2) 114.2%),
    linear-gradient(90deg, rgba(255,255,255,.48) 0%, rgba(255,255,255,.48) 100%);
  box-shadow: 0 1px 12px rgba(83, 98, 144, .08);
}

.gkx-shell.is-sidebar-collapsed .gkx-sidebar .arco-menu,
.gkx-shell.is-sidebar-collapsed .gkx-sidebar .arco-menu-inner,
.gkx-shell.is-sidebar-collapsed .gkx-sidebar .arco-menu-item,
.gkx-shell.is-sidebar-collapsed .gkx-sidebar .arco-menu-inline-header {
  width: var(--sidebar-collapsed-item-width);
}

.gkx-shell.is-sidebar-collapsed .gkx-sidebar .arco-menu-item,
.gkx-shell.is-sidebar-collapsed .gkx-sidebar .arco-menu-inline-header {
  padding: 0 16px;
  overflow: hidden;
}

.gkx-shell.is-sidebar-collapsed .gkx-sidebar .arco-menu-icon-suffix,
.gkx-shell.is-sidebar-collapsed .gkx-sidebar .arco-menu-item-inner,
.gkx-shell.is-sidebar-collapsed .gkx-sidebar .arco-menu-inline-header-title {
  display: none;
}
```

### Tags And Status

Confirmed Figma component: `Tag`.

- `Tag` is reserved for confirmed category, type, keyword, or classification labels. It is not the default component for business status values.
- Business status uses an inline indicator: `display: inline-flex; align-items: center; gap: 6px; padding: 0; background: transparent; border: 0; border-radius: 0; font-size: 14px; line-height: 22px; white-space: nowrap`.
- The leading status dot is `6px × 6px`, `border-radius: 50%`, and uses the same color as the status text.
- Success `#00B42A`: approved, online, completed, enabled, published.
- Warning `#FF7D00`: pending, risk, waiting, under review.
- Danger `#F53F3F`: failed, rejected, abnormal, disabled, off-shelf, cancelled.
- Info/brand `#165DFF`: running, processing, unpublished information state.
- Neutral `#86909C`: archived, inactive, or other neutral state.
- Never give a business status indicator a tinted background, internal horizontal padding, border, pill radius, or Tag container. Always retain the text label so the state does not depend on color alone.

### Overlays

Use the Figma high-level shadow style (`阴影/高层阴影`) for dialogs, dropdown selects, popovers, and menus.

- Global transient messages use a top-centered white message bar rather than a tinted banner: minimum height 48px, `padding: 11px 12px 11px 16px`, 12px content gap, `1px solid #E5E6EB`, 4px radius, and `0 2px 8px rgba(29,33,41,0.12)` shadow. Body text is 14px/22px `#1D2129`; a 24px close button remains at the right.
- The message icon is a 24px solid semantic circle with a white glyph: info `#165DFF` with `i`, success `#00B42A` with a check, warning `#FF7D00` with `!`, and error `#F53F3F` with an `x`. Do not tint the whole message background blue, green, orange, or red.
- Global messages are closeable and stack from the top with an 8px gap, showing no more than three at once. Info and success dismiss after 3 seconds; warning and error dismiss after 4.5 seconds. Long-running, batch, or multi-stage outcomes still require an inline or modal result state and must not be represented only by a transient message.
- Alerts inside a Modal are a separate component from global transient messages. A Modal Alert fills the Body width, has a 40px minimum height, `padding: 9px 12px`, 12px content gap, 4px radius, and no border or shadow. Info, success, warning, and error use tinted backgrounds `#E8F3FF`, `#E8FFEA`, `#FFF7E8`, and `#FFECE8`; the left icon is a 20px solid semantic circle with a white glyph. Text is 14px/22px `#1D2129`.
- Modal Alerts support a single-line body or a title plus description. Alert titles use 14px/22px at weight 600 with a 4px title-description gap. Use Alerts for semantic risk feedback inside forms or business flows, including a Token that can only be viewed or copied once. Destructive confirmation dialogs do not use an Alert; they use the dedicated primary-copy + muted irreversible-description structure. Keep a 16px gap between an Alert and the following form. Keep short neutral context tied to the dialog title as a Header subtitle. Never interchange Modal Alerts, destructive confirmation copy, Header subtitles, and top-centered global messages.

- Confirmation modal: short irreversible decisions, 560px wide, with the dedicated three-part text structure.
- Ordinary detail/edit/create modal: 640px wide, centered around the page, with a 56px fixed Header, 24px Body padding, 592px content sections, and a 64px fixed Footer.
- Complex config modal: 960px wide when the content is still modal-safe.
- Table / permission / multi-column content modal: 1280px wide only when the content remains simple enough for a modal.
- Drawer: detail preview, edit side panels, audit trails, or any scenario that exceeds normal Modal limits.
- Popover/dropdown: selection, lightweight filters, overflow actions.
- Keep overlay headers and footers fixed; only the Body may scroll.
- When a modal needs a short neutral prompt or explanatory sentence, place it directly below the modal title in the fixed Header using 12px/20px tertiary text. Security warnings, one-time visibility notices, and other semantic risks are not neutral descriptions: present them as the Modal Alert specified above at the top of the Body. Do not insert tinted notices for non-semantic helper copy.
- Keep footer actions right-aligned with cancel on the left and confirm on the right.
- Background page remains visible behind modal overlays but must be visually blocked by a scrim.

### Icons

Use the Arco IconBox library as the default icon source: `https://arco.design/iconbox/lib/89/0`. Figma also contains internal icon assets such as `图标资产/表单/手机`, `图标资产/操作/下载-按钮`, and `图标资产/数据/表格`.

- Icon style: linear / outline.
- Stroke width: 1.2px.
- Prefer exposed size components such as `图标/表单/手机` over internal asset nodes when available.
- Default icon size: 16px in inputs/buttons/tables, 20px in navigation or section headers.
- Default icon color: `#4E5969`.
- Muted icon color: `#86909C`.
- Active/primary icon color: `#165DFF`.
- Danger icon color: `#F53F3F`.
- Do not mix filled emoji-style icons with the line icon system.

### User Avatar

- Top-right user avatar uses the official bitmap asset `assets/user-avatar.png`.
- Avatar size: 32px by 32px inside the 40px user pill.
- Do not redraw the avatar with CSS gradients or generic placeholder icons.

## States And Interactions

- Hover states should be subtle: light gray surface changes or slight brand tint.
- Focus states must be visible for keyboard users and should use brand blue.
- Active/selected states should be unmistakable through color, indicator, and/or weight.
- Loading states: use skeletons for tables/cards and spinner only for short inline waits.
- Empty states: show concise explanation plus one primary recovery action when applicable.
- Error states: explain what failed and give retry or correction action.
- Destructive actions require confirmation when irreversible.
- Import states must include upload/select, validation, success, and failure views when importing many records.
- Validation state should list errors or invalid rows before final commit.
- Batch deletion and single deletion both require modal confirmation; do not execute immediately from a table link.

## Responsive Rules

- Desktop first for admin/workbench pages, then adapt down.
- At widths below 1024px, the desktop 200px sidebar may collapse to an icon rail or drawer, but the desktop breakpoint must return to the same T-shaped shell.
- At widths below 768px, stack filter controls vertically, make tables horizontally scrollable, and keep primary actions accessible.
- Inputs and buttons must never clip Chinese text. Allow wrapping where appropriate; fixed-height controls should use concise labels.
- Touch targets on mobile/tablet should be at least 40px high.

## Accessibility

- Body text and controls must meet WCAG AA contrast.
- Do not rely on color alone for status; include text labels.
- Form fields need programmatic labels and error messaging.
- Keyboard order should follow visual order.
- Focus outlines must not be removed.
- Table headers should be semantic; row actions need accessible names.

## Content Voice

Copy should be concise, professional, and operational.

- Use clear verbs: 查询、重置、新增、导入、导出、保存、提交、取消、删除、查看、编辑.
- Avoid marketing adjectives in work surfaces.
- Error messages should state cause and next step.
- Empty states should say what is missing and how to proceed.
- Keep labels short; avoid long button text in dense tables.

## Page Generation Rules

### Multi-Tool Usage Scope / 多工具使用范围

This `design.md` is not Figma Make-specific. It is the shared design contract for Figma Make, Codex, Open Design, frontend code generation, React/Arco implementation, low-code builders, design-to-code tools, and static visual previews.

Core rules are tool-independent:

- Prototype content remains the source of truth; this file controls style, spacing, structure, component behavior, and visual states.
- Every generation workflow must first classify the page type, then lock the source content checklist, then generate the visual surface.
- The global shell, single white work card, 16px glass/work-card spacing, sidebar rules, table rules, form rules, modal rules, and text wrapping rules must remain identical across tools.
- If a tool cannot express a specific concept directly, use an equivalent mechanism without changing the content or visual result.

Tool adaptation layer:

- Figma / design tools: use Auto Layout, semantic layer names, Fill/Hug sizing, component instances when available, and the connected Figma nodes as visual sources.
- Code / HTML / CSS: use semantic class names, CSS Grid/Flex, CSS variables, and the required DOM hierarchy.
- React / Arco: use Arco components for behavior and accessibility, then apply the 国科信 visual override rules in this file.
- Static preview: may use lightweight HTML/CSS, but it must mirror the same tokens, layout hierarchy, component states, and spacing checks.

### AI Generation Layout Guardrails

AI / design / code generation tools often treat spacing rules as decorative recommendations. Treat this block as mandatory. A generated admin page fails the spec if any rule in this block is violated.

### Component Binding And Local Fallback Policy

当 Figma Make 等设计工具提示“当前文件里没有可复用的国科信库组件绑定”时，表示当前文件没有启用、发布或绑定可直接复用的 `国科信组件库` 组件实例。这不是页面生成失败的理由，也不能成为改变样式或编写新内容的理由。对代码生成工具来说，同类问题表现为缺少本地封装组件或组件映射；处理原则相同：使用本规范的 token、结构和覆盖样式生成本地组件实现。

处理优先级：

1. 如果当前设计文件已经启用 `国科信组件库`，或代码项目已经存在同名本地封装组件，优先使用组件实例 / 封装组件，例如 `Button`、`Input`、`Select`、`Table`、`Pagination`、`Modal`、`Drawer`、`Upload`、`Tabs`、`Sidebar`、`Breadcrumb`。
2. 如果没有可复用组件绑定，不要中断任务，不要重复输出该提示；应按 `design.md` 的 token、布局、组件尺寸、Arco 语义和覆盖规则生成本地组件结构。
3. 没有组件绑定时，仍必须遵守国科信视觉规范：32px 控件、4px 圆角、40px 表格行高、唯一白色工作卡片、16px 安全距离、侧栏展开/收起规则、弹窗尺寸分级等。
4. 组件绑定缺失不影响“原型内容最高优先级”。不能因为没有组件库绑定就新增字段、改按钮、补模块、套用 Arco 默认样式或复制规范页示例内容。
5. 允许在任务说明末尾简短说明一次：`未检测到可复用组件绑定，已按 design.md 生成本地组件结构。` 不要每个任务、每个模块反复提示。

彻底解决方式：

- 在 Figma 中建立并发布真正的 `国科信组件库` 文件，至少包含 Shell、Sidebar、Breadcrumb、Button、Input、Select、DatePicker、Tabs、Table、Pagination、Form、Modal、Drawer、Upload、Tag、Empty、Loading 等组件。
- 在目标业务文件中启用该组件库，并尽量使用组件实例而不是散装图层。
- 在代码项目中建立对应的 React / Arco 封装组件，并把本规范的 token、class、尺寸和状态覆盖沉淀为可复用样式。
- 如果需要代码到设计的一致映射，再补充 Code Connect / 组件映射，把 Figma 组件名称对应到 Arco React 封装组件。
- 在没有完成组件库发布、启用、封装或映射前，生成工具应采用本规范的“本地组件结构 + 国科信视觉覆盖”作为正式降级方案。

### Layout Generation Contract

设计工具生成页面时必须优先使用 Auto Layout，而不是把图层用绝对坐标逐个摆放。代码实现必须使用等价的 CSS Grid / Flex / semantic DOM，而不是用绝对定位硬摆字段。结构化布局是页面稳定复用的基础规则，覆盖所有后台页面、弹窗、抽屉、表单、列表和详情页。

自动布局层级：

1. 页面根容器可固定为当前画布尺寸，例如 1440px 宽；根层只负责承载全局 Shell，不承载业务字段。
2. Shell 使用结构化布局：侧栏为固定宽度 `200px` / `84px`，右侧区域为填充宽度；顶部区域固定 `64px`，内容玻璃面板填充剩余空间。
3. Sidebar menu group uses vertical Auto Layout. Its frame width, item height, gap, padding, icon size, active style, collapse behavior, and arrow rule are fixed; its labels, item count, order, hierarchy, active item, and child-menu existence are data-driven from the source.
4. `.gkx-content` 玻璃面板使用纵向 Auto Layout：`padding: 16px`，`gap: 16px`，第一项为面包屑，第二项为唯一 `.gkx-work-card`，工作卡片设置为 Fill。
5. `.gkx-work-card` 使用纵向 Auto Layout：`padding: 16px`，`gap: 16px`，内部只放当前页面需要的 Tab、筛选区、动作区、表格、表单、详情模块、分页或状态反馈。
6. 筛选区使用 Auto Layout 行组。1440px 基准下第一行最多 3 个筛选条件；简单搜索与下拉选择即时生效，只有复杂多条件统一提交场景才加入查询/重置按钮；更多筛选条件从第二行开始继续排布。
7. 每个筛选条件是横向 Auto Layout：筛选条件整体等宽，label 按内容自适应并右对齐，控件 Fill；同一行筛选条件之间 gap 为 16px，筛选条件在填满容器时保持一致长度。
8. 动作区使用横向 Auto Layout：左侧批量/新增等动作按原型顺序排列，右侧只有原型可见的辅助动作；按钮高度统一 32px。
9. 表单页使用纵向 Auto Layout 分组；普通页面表单可以左右 label/control 布局，弹窗内表单使用上下布局。字段行、组间距和按钮区都必须由 Auto Layout gap 控制。
10. 多模块页面先使用灰底模块区作为纵向 Auto Layout 容器，模块间 gap 为 16px；简单模块直接放灰底中，复杂模块再使用小白卡。
11. Modal / Drawer 使用纵向 Auto Layout：Header 固定，Body Fill 且仅 Body 可滚动，Footer 固定。Footer 按钮使用横向 Auto Layout，按钮 gap 为 12px 或指定的弹窗按钮间距。

允许使用绝对定位的例外：

- 全局 Shell 的视口锚定，例如侧栏、顶部区域、玻璃内容面板在画布中的初始位置。
- 侧栏展开/收起图标必须作为独立资产固定在内容边缘：展开 `x=200, y=28`，收起 `x=84, y=28`。
- 表格固定列、浮层、Tooltip、Popover、Dropdown、Modal 遮罩等需要覆盖在内容之上的交互层。
- 图表内部坐标轴、折线、柱状条等可视化绘制层。

Frame / layout container boundary:

- 页面业务内容内不要使用泛命名的 `Frame`、`Frame 1`、`Frame 2`、`Group` 作为可见层级。生成结果里用户能看到或检查到的主要层级必须是语义化容器，例如 `gkx-shell`、`gkx-sidebar`、`gkx-content`、`gkx-breadcrumb`、`gkx-work-card`、`filter-row`、`action-row`、`table-section`、`form-section`、`detail-section`、`modal-body`。
- Figma 技术上为 Auto Layout 创建的容器可以是 Frame，但它只能作为无额外视觉的布局容器使用：不得新增 fill、stroke、shadow、radius 或额外 padding 来形成新的可见盒子，除非该层本身就是规范定义的玻璃面板、白色工作卡片、灰底模块区、弹窗、抽屉或组件本体。
- 页面内不允许用多个可见 Frame 包住筛选区、表格、表单或模块来“凑布局”。这些区域应直接作为语义化 Auto Layout 子层放在 `.gkx-work-card` 中。
- 图层 / DOM / 组件命名必须语义化。禁止交付含大量 `Frame` / `Group` / `Rectangle` / `div1` 泛名的页面；这类泛名会导致后续生成或复用时把布局容器当业务模块。

禁止事项：

- 禁止用大量独立 `x/y` 坐标摆放字段、按钮、表格列、卡片和模块。
- 禁止通过负 margin、手动 left/top、拉伸白色矩形或隐藏空图层来制造 16px 间距。
- 禁止在 `.gkx-work-card` 内放多个平级白色大卡片来代替自动布局。
- 禁止让 Tab、筛选区、表格或表单贴住白色工作卡片边缘；它们必须天然来自父级 `padding: 16px`。
- 禁止用手动画的散装矩形或泛命名 Frame 替代可复用组件结构；没有组件绑定时也要生成语义化本地组件容器。

验收标准：

- 选中生成页面的主要容器时，应能看到清晰的 Auto Layout 方向、padding、gap 和 Fill/Hug sizing。
- 修改一个字段名称、增加一行表格、切换侧栏收起状态或改变画布宽度时，页面应通过 Auto Layout 自适应，而不是出现重叠、漂移或贴边。
- 如果生成结果只有外层容器是 Auto Layout，内部字段、按钮、表格、模块仍然靠坐标散排，或页面内充满泛命名 Frame / Group，视为不合格。

- Required DOM hierarchy: `.gkx-shell` > `.gkx-sidebar` + `.gkx-header` + `.gkx-content`; inside `.gkx-content`, use exactly `.gkx-breadcrumb` followed by exactly one `.gkx-work-card`.
- Prototype restoration must run in two steps for every generation tool: first output the source content checklist only, wait for user confirmation, then generate the page from that confirmed checklist. Directly generating a page from an unconfirmed prototype is not allowed, including "high-fidelity" generation.
- Page type must be confirmed before generation. A generated page fails if it turns a list prototype into a form, dashboard, detail page, modal, or any other page type not supported by the confirmed source structure.
- AI conversation pages and article pages must be explicitly recognized when present. A generated page fails if it turns an AI conversation prototype into a generic form/search page, or turns an article prototype into a generic detail page with invented article text.
- Generation order is mandatory: create the immutable global shell first, then create breadcrumb, then create the single white work card, then place page-specific filters/tabs/forms/tables inside that card. Do not generate business content first and wrap a shell around it afterward.
- UI text wrapping must follow the Text Wrapping And Ellipsis rules. Sidebar labels, TOC rows, tabs, buttons, filter/form labels, table cells, resource-card captions, and toolbar items must stay single-line with ellipsis by default. Only prose/long-text content may wrap.
- Reading/document-analysis pages must reserve minimum pane widths before rendering content. Do not squeeze the left TOC or right resource library until labels wrap; collapse side panes or use internal scroll instead.
- 原型图管内容，`design.md` 只管样式。生成页面时，筛选字段、表格列、表格行、表单字段、按钮、Tab、模块、文案、弹窗内容只能来自原型图 / 截图 / Figma 节点中可见的内容。
- 来源字段必须锁定。生成页面必须保留原型的字段数量、字段名称、字段顺序、表格列数、列名、可见行数、按钮数量和按钮文案。即使某个字段看起来是后台常用字段，也不能额外添加。
- 数据密度可以补充，但结构不能补充。原型已有表格/列表且数据较少时，可以在同列结构下追加同类型假数据行；原型已有图表区域时，可以按图表规范生成假图表数据。不得新增原型没有的字段、列、模块、筛选条件、按钮或业务流程。
- 禁止自动补常见后台字段。除非原型中明确可见，否则不要添加 `状态`、`类型`、`时间`、`创建人`、`创建时间`、`更新时间`、`备注`、`负责人`、`排序`、`权限`、`操作` 等字段。
- 禁止编写原型没有的页面内容：额外标题、副标题、说明文字、统计摘要、示例模块、图表模块、额外按钮、额外 Tab、状态面板、导入流程、编辑抽屉、弹窗变体都不能主动生成。只有当原型已有表格/列表/图表区域时，才可以在既有结构下补充示意数据行或假图表数据。
- 来源原型内容不足时，保持空白、使用原型自己的 placeholder，或向用户确认；不能用 `design-preview.html` 或 `design.md` 里的示例数据补空。
- 单张原型还原任务只生成当前可见状态。批量选择、删除确认、详情弹窗、编辑/新增、导入流程、空态/加载/错误状态，只能在用户明确要求完整状态或组件库检查时单独生成。
- Do not infer the product shell from `design-preview.html`, component samples, or arbitrary screenshots. Use only the Figma shell references `3937:126` for the application page and `473:16` / `4112:249` / `4112:649` for the sidebar states.
- Sidebar brand must use the official logo asset directly. If the asset is not available to the current generation tool, create a named `gkx-logo.png` image placeholder with the correct 28px size instead of substituting a generic blue app icon.
- Sidebar title must stay single-line and visible at the 1440px baseline. Do not let generation tools mix reference names such as `科技情报挖掘平台` with the target product title unless the user explicitly asks for that product name.
- Sidebar menu style is fixed, but sidebar menu content is not fixed. Generation tools must extract menu labels, active item, item count, order, hierarchy, and child-menu arrows from the source prototype or confirmed content checklist. Do not copy the visual spec preview menu or reference file menu into unrelated generated pages.
- The fold icon is an independent 16px asset at `x=200, y=28` in expanded mode and `x=84, y=28` in collapsed mode. It must not be placed inside the brand title row, and it must not push or clip the sidebar title.
- `.gkx-content` is the glass module. In expanded menu mode it starts after the 200px sidebar and 64px header; in collapsed menu mode it starts after the 84px sidebar. It always keeps `right: 16px` and `bottom: 16px` to the viewport.
- `.gkx-content` must own `padding: 16px`, `display: grid`, `grid-template-rows: auto minmax(0, 1fr)`, and `row-gap: 16px`. This is the only source of the internal spacing between glass border, breadcrumb, and white work card.
- `.gkx-work-card` must fill the remaining glass-panel area and keep its four sides 16px away from the glass panel border. Do not position it with arbitrary `top`, `left`, `right`, `bottom`, or large margins.
- The white work card is the only white page-level panel. Do not add another `.page`, `.container`, `.content-card`, `.table-card`, `.filter-card`, or full-width white block inside it.
- Filters, action rows, tables, pagination, empty states, loading states, and page-specific content all live directly inside `.gkx-work-card`.
- Filter rows must not have borders or a separate background. The row is layout only; inputs and buttons carry their own borders/backgrounds.
- Filter/search inputs must reuse the standard form input visual spec. Do not accept Arco default search styling if it changes height, radius, border, placeholder color, focus state, or icon treatment.
- If a page contains several boxed business modules, use a gray module zone first. Do not jump straight to multiple sibling white cards. Simple content stays directly in the gray zone; complex content may use small white inner cards inside that gray zone.
- Module-to-module spacing inside the gray module zone is fixed at 16px. Do not use dense 8px stacks or arbitrary 20px/24px gaps between peer modules.
- Inside a module, use dividers only when they clarify closely related rows or repeated detail groups. Do not rely on many dividers as the primary page-level sectioning method.
- This gray module zone rule does not include the filter section. Search/filter rows must remain visually flat and cannot be wrapped in gray or white module containers.
- Page scrolling happens inside `.gkx-work-card` or the table body when needed. The sidebar, topbar, glass module, and page background do not scroll.
- If a generated page shows two nested white rectangles, if the white panel touches the glass panel edge, or if the right/bottom inset is not 16px, the layout is wrong and must be regenerated or corrected.
- Component visuals must pass the Component Override Guardrails: standard buttons and inputs are 32px high, compact controls are only used in dense internals, filter inputs reuse the form input spec, page tabs cannot use sidebar or default filled Arco styling, and the global sidebar cannot keep Arco Menu default styling.

- Build actual product screens first: dashboards, lists, forms, detail pages, and workflows rather than landing pages.
- Use Arco-style component behavior and国科信 visual tokens when implementing in code.
- Use the four-step spacing scale only: `mini` 4px, `small` 8px default, `medium` 16px, `large` 24px.
- Start every page from the `3937:126` / `473:16` shell: expanded 200px transparent sidebar over a light-blue page background, collapsed 84px sidebar when toggled, 64px transparent top utility region, and a right-side glass content panel.
- For future pages, keep the sidebar and header structure stable; only replace page content, filters, tables, cards, forms, and page-specific actions inside the content region.
- Do not hardcode arbitrary Modal sizes; use the modal width scale and responsive constraints from Layout Tokens.
- For long record details, prefer the standalone detail page pattern from node `2012:27978` instead of a Modal.

### Generated Page Audit

After generating a page in any AI / design / code tool, inspect these areas before accepting the output. These are the most common places where component behavior remains but the 国科信 visual layer or prototype content lock is lost.

- Layout shell: confirm `.gkx-content` keeps 16px right/bottom viewport spacing and `.gkx-work-card` is the only page-level white card.
- Sidebar brand: confirm the official logo is used, the product title is not clipped, and no generic blue app icon appears.
- Sidebar/content boundary: confirm the glass panel begins at the sidebar edge, the fold icon is fixed at `y=28`, and the breadcrumb/work-card content starts only after the glass panel's 16px internal padding.
- Sidebar menu override: confirm the sidebar is not using Arco default Menu/Tabs visuals. Expanded menu item is 168px by 40px; collapsed item is 52px by 40px; active item uses the glass gradient; only items with children show a right arrow; Arco default selected rows, left active bars, built-in collapse buttons, and submenu indentations are absent.
- Source isolation: confirm the generated business page did not copy visual-inspection-page elements, sample panels, or unrelated reference names from the design spec preview.
- Source field lock: confirm generated filters, form fields, table columns, rows, tabs, modules, and buttons have the same count, names, and order as the source prototype. Any extra generic admin field fails the output.
- Work-card safe area: tabs, filters, actions, tables, forms, pagination, and state feedback all begin inside the white card's 16px padding. No first child may touch the white card edge.
- Inputs: placeholder/text baseline, prefix/suffix/clear icons, Select arrows, and DatePicker icons must be vertically centered in the 32px control. A field with text that looks too high, too low, or icon-misaligned fails the spec.
- Filter row: labels stay inline on the left of controls; controls use the form input visual. Search buttons do not add icons unless the source design shows them.
- Buttons: standard actions are 32px high; 28px is allowed only for compact table/tool internals.
- Tabs: page tabs are underline tabs; category tabs are 30px compact tabs; sidebar tabs are 168px by 40px glass-highlight items. These three styles are never interchangeable and none of them may keep Arco default filled/pill/header styling.
- Tables: one Arco table container, 40px rows, `#F7F8FA` header, `#4E5969` header text, single-line ellipsis, text-link operation column, and Arco-style pagination.
- Modals: width comes from the modal scale; `max-width` and `max-height` preserve 24px viewport safety; Header and Footer are fixed; only Body scrolls vertically. A modal with page-level scrolling, horizontal scrolling, or arbitrary width fails.
- Multi-module content: when multiple boxed modules appear, use a gray module zone first; simple modules stay on gray, complex modules may use smaller white inner cards. This rule does not apply to filters.
- Overlay choice: more than 15 fields, trees, complex tables, multi-step flows, permission configuration, or frequent large editing should become Drawer, full-screen modal, or independent page.
- Prefer tables and structured panels for operational data; avoid decorative hero sections inside admin tools.
- Use `#165DFF` for primary intent, and reserve `#0A3888` for cover/deep-brand presentation only.
- Keep component radii restrained; no pill-shaped UI unless the component is a tag or segmented selector.
- Use icons in tool buttons where a familiar symbol exists, with tooltip/accessibility label.
- For reusable component/library work, include empty, loading, disabled, error, hover, active, and selected states. For single prototype restoration, do not add these states unless they are visible in the source or explicitly requested.
- For management list component/library work, include normal, batch-selected, delete-confirmation, detail overlay, edit/create overlay, and import-flow variants when the feature supports them. For single prototype restoration, include only the state visible in the provided source.
- Preserve the real page composition from `情报管理系统` node `1998:23720`: list pages use filter row + action row + table + pagination; overlays stay centered within the same global shell.
- Management list pages must include the top breadcrumb and must not add extra page titles, subtitles, or duplicate record-count headings above the working area.
- Management list pages must use exactly one white work card inside the glass panel and must not introduce a second full-page white background card inside it.
- Management list filters must be inline: equal-length condition pairs with content-adaptive right-aligned labels and fill-width controls. At the 1440px baseline the first row contains no more than three filter conditions. Simple search inputs support fuzzy/combined filtering and dropdown selection applies immediately; only complex multi-condition submission uses `查询` / `重置`, otherwise no action space is reserved. Remaining conditions stack below in rows of up to three.
- Management list filter rows must not have their own border or nested card background. The input controls already carry borders; the row itself is layout only.
- Management list vertical rhythm: filter row to action row or table is 16px; action row to table is 16px.
- Management list operation columns must use text links `详情`, `编辑`, `删除`; do not replace them with icon-only controls. Destructive action text is red.
- State preview demos must reuse the same management-list working area: the shell provides the breadcrumb, and the single white work card contains only filters, action row, table, pagination, and state feedback. Do not nest another page shell, blue stage, or duplicate work card inside the state demo.

## Design Preview QA

`design-preview.html` is the visual inspection surface for this design system. It should use the same Figma `3937:126` shell and expose left-sidebar tabs for:

- 页面规范
- 色彩规范
- 布局规范
- 组件规范
- 表格规范
- 表单规范
- 弹窗规范
- 状态规范
- 生成规则

The preview tabs must switch the white content-card content only. The active sidebar tab, URL hash, breadcrumb, and visible section title should stay synchronized. Do not restore old business form/table demo data into the preview; examples should be compact design-system samples used for checking tokens, component states, density, and generation constraints.

When new reusable page patterns are added, the preview should include an interactive check, not only written notes. Current interactive patterns include normal list, batch selection, delete confirmation, detail overlay, edit overlay, import flow states, a dedicated Modal visual check tab, Arco Table states, Arco Form states, and Upload trigger/list/picture-wall states. Preview demos should use Arco-aligned component semantics such as `arco-btn`, `arco-input`, `arco-form`, `arco-table`, `arco-modal`, `arco-detail-modal`, `arco-steps`, `arco-upload`, `arco-pagination`, and `arco-tag`, while keeping the 国科信 shell, token values, and spacing rules unchanged.

## Avoid

- Avoid purple/blue gradients, decorative blobs, oversized marketing cards, and illustration-heavy dashboards.
- Avoid using the brand blue as every background, border, and icon color at once.
- Avoid nested cards and floating card page sections.
- Avoid hidden interaction states or controls that only work by color.
- Avoid inventing new component shapes when Figma/Arco equivalents exist.
- Avoid mobile layouts that squeeze full desktop tables without horizontal scroll or summary alternatives.
- Avoid changing the global shell geometry or visual shell treatment per page. No page-specific sidebar widths, header heights, solid-blue sidebars, colored header bars, centered marketing containers, or full-width headers spanning over the sidebar unless explicitly requested.

## Figma Source Notes

- Figma file: `国科信-设计规范`
- Sidebar/menu visual reference file: `国科信-设计规范`, node `473:16`; expanded state node `4112:249`; collapsed state node `4112:649`. Confirmed expanded sidebar width `200px`, collapsed sidebar width `84px`, expanded menu item `168 x 40`, collapsed menu item `52 x 40`, menu start `16,72`, active glass-highlight state, and fold icon positioned at the content edge (`x=200, y=28` expanded; `x=84, y=28` collapsed). The fold icon assets are `assets/sidebar-expanded.svg` (`111.svg`) and `assets/sidebar-collapsed.svg` (`222.svg`).
- Additional product reference file: `情报管理系统`, nodes `1998:23720`, `1998:23719`, and `2012:27978`. Confirmed examples: `论文管理`, `批量删除`, `删除弹窗`, `批量删除弹窗`, `详情弹窗`, `编辑弹窗`, `新增弹窗`, `批量导入`, `数据验证`, `导入成功`, `导入失败`, and `专利-专利详情（默认）`. Node `1998:23719` confirms the 640px by 704px centered detail modal style. Node `2012:27978` confirms the independent long-form detail page pattern.
- Import flow reference file: `Untitled`, file key `Kwpwlj0VrqDKfnboHrKCgk`, frame `批量导入` node `1:3949`, validation-failure modal node `1:5601`. The original Figma reference used a compact centered import modal, but the current B-end rule treats multi-step import/validation as Drawer, full-screen modal, or independent page instead of ordinary Modal.
- Tab style reference file: `科技情报挖掘平台`, node `4192:20253`, plus the current confirmed global Tab screenshot. The current project override for primary/standard tabs is a 36px Hug item with `0 16px` padding, zero gap, 14px text, and a full-item-width 2px active underline. Category tabs retain the confirmed segmented hierarchy: `#F2F3F5` wrapper, 4px padding/radius, 32px items, active white background and no underline.
- Referenced node: `1521:99`, `图标资产/表单/手机`
- Primary page reference node: `3937:126`, `论文管理`. This is the source of truth for the application shell, glass panel, filter/table/pagination density, and page restoration preview. Sidebar/menu expanded and collapsed visual details should follow `国科信-设计规范` node `473:16`.
- Color reference node: `276:571`, page `☑️ 色彩 Color`. Confirmed brand ramp: `#165DFF`, `#4080FF`, `#0E42D2`, `#6AA1FF`, `#94BFFF`, `#BEDAFF`, `#E8F3FF`.
- Slider component reference node: `1905:241`, page `滑动输入条 Slider（可用 待完善）`. Confirmed component set `slider` node `1905:32247`; variants `范围=false/true`, `图标=false/true`, `提示=false/true`; boolean properties `输入框`, `步长`, `标签`; track 2px high with `#E5E6EB` rail and `#165DFF` selected segment.
- Layout reference node: `1785:304`, `“T”型布局`. Use it only for the abstract 200px + 64px T geometry; use `3937:126` for the actual visual restoration style.
- Confirmed neutral colors: border `#86909C`, `#C9CDD4`, `#E5E6EB`, `#F2F3F5`; fill `#4E5969`, `#C9CDD4`, `#E5E6EB`, `#F2F3F5`, `#F7F8FA`; text `#1D2129`, `#4E5969`, `#86909C`, `#C9CDD4`, `#FFFFFF`.
- Confirmed functional colors: Success `#00B42A / #23C343 / #009A29 / #7BE188 / #AFF0B5 / #E8FFEA`; Warning `#FF7D00 / #FF9A2E / #D25F00 / #FFCF8B / #FFE4BA / #FFF7E8`; Danger `#F53F3F / #F76560 / #CB2634 / #FBACA3 / #FDCDC5 / #FFECE8`.
- Cover frame: `1:2`, with background `#0A3888`, white title `设计规范`, PingFang-style typography. Treat this as cover/deep-brand presentation, not the default component primary color.
- Added libraries: `Arco Design System (Community)` and `国科信-设计规范`.
- Confirmed custom assets/components from search: `按钮`, `Butto/32（主）`, `Butto/28`, `数据输入/输入框`, `Radio`, `Card`, `Tag`, `Tab`, `上传触发类型`, selected icon assets, and `阴影/高层阴影`.
