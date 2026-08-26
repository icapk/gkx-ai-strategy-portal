import {
  Activity,
  ArrowDown,
  ArrowUp,
  BarChart3,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  ClipboardCheck,
  Copy,
  Database,
  Eye,
  FileBarChart,
  FileText,
  FolderOpen,
  GripVertical,
  KeyRound,
  LayoutGrid,
  LockKeyhole,
  LogOut,
  Megaphone,
  Menu,
  MessageSquareMore,
  Minus,
  MoreHorizontal,
  Network,
  Pin,
  Plus,
  Printer,
  Save,
  Search,
  ShieldCheck,
  Trash2,
  Upload,
  Users,
  X,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { cloneElement, isValidElement, useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

type PageKey =
  | "report-management"
  | "announcement-management"
  | "workflow-center"
  | "form-center"
  | "audit-content"
  | "event-info"
  | "event-dashboard"
  | "org-management"
  | "user-management"
  | "role-management"
  | "page-management"
  | "resource-management"
  | "permission-config";

type ModalType =
  | "report"
  | "tracking"
  | "user"
  | "role"
  | "page"
  | "delete"
  | null;

type ModalMode = "create" | "edit" | "detail" | "batch";
type ModalPayload = Record<string, string>;
type ModalSave = (values: ModalPayload) => void;
type ModalOptions = {
  mode?: ModalMode;
  payload?: ModalPayload;
  onConfirm?: () => void;
  onSave?: ModalSave;
};
type OpenModal = (type: ModalType, options?: ModalOptions) => void;

type FeedbackNotice = {
  id: number;
  message: string;
  tone: FeedbackTone;
};

type FeedbackTone = "info" | "success" | "warning" | "error";
type Notify = (message: string, tone?: FeedbackTone) => void;

type NavChild = { key: PageKey; label: string };

type NavItem = {
  label: string;
  icon: LucideIcon;
  key?: PageKey;
  children?: NavChild[];
};

type NavSection = {
  label: string;
  items: NavItem[];
};

const navSections: NavSection[] = [
  {
    label: "系统管理",
    items: [
      { key: "report-management", label: "报告管理", icon: FileText },
      { key: "announcement-management", label: "公告管理", icon: Megaphone },
      {
        label: "审核管理",
        icon: ShieldCheck,
        children: [
          { key: "workflow-center", label: "审核流程管理 / 流程中心" },
          { key: "form-center", label: "审核流程管理 / 表单中心" },
          { key: "audit-content", label: "审核内容管理 / 评论审核" },
        ],
      },
      {
        label: "埋点管理",
        icon: Activity,
        children: [
          { key: "event-info", label: "埋点信息管理" },
          { key: "event-dashboard", label: "埋点数据统计" },
        ],
      },
    ],
  },
  {
    label: "权限管理",
    items: [
      { key: "user-management", label: "用户管理", icon: Users },
      { key: "role-management", label: "角色管理", icon: ShieldCheck },
      { key: "page-management", label: "页面管理", icon: LayoutGrid },
      { key: "resource-management", label: "资源管理", icon: Database },
      { key: "permission-config", label: "权限配置", icon: KeyRound },
    ],
  },
];

const allMenuItems = navSections.flatMap((section) =>
  section.items.flatMap((item) => item.key ? [{ key: item.key, label: item.label }] : item.children ?? [])
);

const pageLabels: Record<PageKey, string> = {
  "report-management": "报告管理",
  "announcement-management": "公告管理",
  "workflow-center": "流程中心",
  "form-center": "表单中心",
  "audit-content": "评论审核",
  "event-info": "埋点信息管理",
  "event-dashboard": "埋点数据统计",
  "org-management": "组织管理",
  "user-management": "用户管理",
  "role-management": "角色管理",
  "page-management": "页面管理",
  "resource-management": "资源管理",
  "permission-config": "权限配置",
};

const breadcrumbParents: Partial<Record<PageKey, string>> = {
  "workflow-center": "审核管理",
  "form-center": "审核管理",
  "audit-content": "审核内容管理",
  "event-info": "埋点管理",
  "event-dashboard": "埋点管理",
};

const breadcrumbParentTargets: Partial<Record<PageKey, PageKey>> = {
  "workflow-center": "workflow-center",
  "form-center": "workflow-center",
  "audit-content": "audit-content",
  "event-info": "event-info",
  "event-dashboard": "event-info",
};

const breadcrumbSections: Record<PageKey, "系统管理" | "权限管理"> = {
  "report-management": "系统管理",
  "announcement-management": "系统管理",
  "workflow-center": "系统管理",
  "form-center": "系统管理",
  "audit-content": "系统管理",
  "event-info": "系统管理",
  "event-dashboard": "系统管理",
  "org-management": "权限管理",
  "user-management": "权限管理",
  "role-management": "权限管理",
  "page-management": "权限管理",
  "resource-management": "权限管理",
  "permission-config": "权限管理",
};

const reportTypeOptions = ["TR报告", "战略咨询报告", "洞察分析报告", "未来产业报告"];
const reportSortFieldOptions = ["上传时间", "报告类型", "所属领域", "报告来源"] as const;
type ReportSortField = (typeof reportSortFieldOptions)[number];
type ReportSortDirection = "正序" | "倒序";
const reportSortCollator = new Intl.Collator("zh-CN", { numeric: true, sensitivity: "base" });
const statusOptions = ["启用", "禁用"];
const roleOptions = ["普通用户", "机构用户", "政府用户"];
const resourcePermissionOptions = ["人才库资源", "报告资源", "智库资源"];

const reportRows = [
  { 报告标题: "未来产业报告：智能制造", 报告类型: "未来产业报告", 报告来源: "国科信", 所属领域: "智能制造", 上传时间: "2026-07-08", 内容摘要: "未来产业报告内容摘要", 状态: "上架", 是否置顶: "是" },
  { 报告标题: "TR报告：人工智能", 报告类型: "TR报告", 报告来源: "研究中心", 所属领域: "人工智能", 上传时间: "2026-07-06", 内容摘要: "TR报告内容摘要", 状态: "下架", 是否置顶: "否" },
  { 报告标题: "战略咨询报告：新材料", 报告类型: "战略咨询报告", 报告来源: "战略咨询组", 所属领域: "新材料", 上传时间: "2026-07-01", 内容摘要: "战略咨询报告内容摘要", 状态: "上架", 是否置顶: "否" },
  { 报告标题: "洞察分析报告：低空经济", 报告类型: "洞察分析报告", 报告来源: "洞察分析组", 所属领域: "低空经济", 上传时间: "2026-06-28", 内容摘要: "洞察分析报告内容摘要", 状态: "下架", 是否置顶: "是" },
];

type AnnouncementStatus = "草稿" | "待发布" | "已发布" | "已下线";
type AnnouncementLinkType = "无跳转" | "站内链接" | "外部链接";

type Announcement = {
  id: string;
  content: string;
  linkType: AnnouncementLinkType;
  linkUrl: string;
  publishAt: string;
  offlineAt: string;
  status: AnnouncementStatus;
  updatedAt: string;
};

const initialAnnouncementRows: Announcement[] = [
  {
    id: "ANN-202608-001",
    content: "门户服务持续优化中，欢迎体验智能科研、智能阅读与综合科技服务。",
    linkType: "无跳转",
    linkUrl: "",
    publishAt: "2026-08-16 09:00",
    offlineAt: "",
    status: "已发布",
    updatedAt: "2026-08-16 08:42",
  },
  {
    id: "ANN-202608-002",
    content: "科研数据服务将于8月20日22:00进行例行维护，预计30分钟。",
    linkType: "站内链接",
    linkUrl: "/service-status",
    publishAt: "2026-08-20 18:00",
    offlineAt: "2026-08-21 08:00",
    status: "待发布",
    updatedAt: "2026-08-17 15:20",
  },
  {
    id: "ANN-202608-003",
    content: "新用户使用指南已更新，欢迎查看门户常用功能说明。",
    linkType: "站内链接",
    linkUrl: "/help/getting-started",
    publishAt: "",
    offlineAt: "",
    status: "草稿",
    updatedAt: "2026-08-17 11:05",
  },
  {
    id: "ANN-202607-004",
    content: "门户首页功能升级已完成，感谢您的关注与支持。",
    linkType: "无跳转",
    linkUrl: "",
    publishAt: "2026-07-28 10:00",
    offlineAt: "2026-08-16 09:00",
    status: "已下线",
    updatedAt: "2026-08-16 09:00",
  },
];

const ANNOUNCEMENT_STORAGE_KEY = "gkx-portal-announcements-v1";

type StoredAnnouncement = {
  id: string;
  content: string;
  linkMode: "none" | "internal" | "external";
  link: string;
  publishMode: "immediate" | "scheduled";
  publishAt: string;
  autoOffline: boolean;
  offlineAt: string;
  status: "draft" | "scheduled" | "published" | "offline";
  updatedAt: string;
};

const announcementStatusFromStorage: Record<StoredAnnouncement["status"], AnnouncementStatus> = {
  draft: "草稿",
  scheduled: "待发布",
  published: "已发布",
  offline: "已下线",
};

const announcementStatusToStorage: Record<AnnouncementStatus, StoredAnnouncement["status"]> = {
  草稿: "draft",
  待发布: "scheduled",
  已发布: "published",
  已下线: "offline",
};

const announcementLinkFromStorage: Record<StoredAnnouncement["linkMode"], AnnouncementLinkType> = {
  none: "无跳转",
  internal: "站内链接",
  external: "外部链接",
};

const announcementLinkToStorage: Record<AnnouncementLinkType, StoredAnnouncement["linkMode"]> = {
  无跳转: "none",
  站内链接: "internal",
  外部链接: "external",
};

function announcementDateFromStorage(value: string) {
  return value ? value.replace("T", " ") : "";
}

function announcementDateToStorage(value: string) {
  return value ? value.replace(" ", "T") : "";
}

function reconcileAnnouncementRows(rows: Announcement[]) {
  const now = Date.now();
  const nowText = formatAnnouncementDate();
  let nextRows = rows.map((row) => {
    const expiresAt = row.offlineAt ? new Date(row.offlineAt.replace(" ", "T")).getTime() : Number.POSITIVE_INFINITY;
    if (["已发布", "待发布"].includes(row.status) && expiresAt <= now) {
      return { ...row, status: "已下线" as const, updatedAt: nowText };
    }
    return row;
  });

  const dueRows = nextRows
    .filter((row) => row.status === "待发布" && new Date(row.publishAt.replace(" ", "T")).getTime() <= now)
    .sort((a, b) => b.publishAt.localeCompare(a.publishAt));

  if (dueRows.length) {
    const activeId = dueRows[0].id;
    nextRows = nextRows.map((row) => {
      if (row.id === activeId) return { ...row, status: "已发布" as const, updatedAt: nowText };
      if (row.status === "已发布" || (row.status === "待发布" && dueRows.some((due) => due.id === row.id))) {
        return { ...row, status: "已下线" as const, offlineAt: row.offlineAt || nowText, updatedAt: nowText };
      }
      return row;
    });
  }

  const publishedRows = nextRows
    .filter((row) => row.status === "已发布")
    .sort((a, b) => b.publishAt.localeCompare(a.publishAt));
  if (publishedRows.length > 1) {
    const activeId = publishedRows[0].id;
    nextRows = nextRows.map((row) => row.status === "已发布" && row.id !== activeId
      ? { ...row, status: "已下线" as const, offlineAt: row.offlineAt || nowText, updatedAt: nowText }
      : row);
  }
  return nextRows;
}

function readAnnouncementRows() {
  try {
    const raw = localStorage.getItem(ANNOUNCEMENT_STORAGE_KEY);
    if (raw === null) return reconcileAnnouncementRows(initialAnnouncementRows);
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return reconcileAnnouncementRows(initialAnnouncementRows);
    const rows = parsed
      .filter((item): item is StoredAnnouncement => Boolean(item && typeof item.id === "string" && typeof item.content === "string" && announcementStatusFromStorage[item.status as StoredAnnouncement["status"]]))
      .map((item) => ({
        id: item.id,
        content: item.content.slice(0, 60),
        linkType: announcementLinkFromStorage[item.linkMode] || "无跳转",
        linkUrl: item.linkMode === "none" ? "" : String(item.link || ""),
        publishAt: announcementDateFromStorage(String(item.publishAt || "")),
        offlineAt: announcementDateFromStorage(String(item.offlineAt || "")),
        status: announcementStatusFromStorage[item.status],
        updatedAt: announcementDateFromStorage(String(item.updatedAt || item.publishAt || "")),
      }));
    return reconcileAnnouncementRows(rows);
  } catch {
    return reconcileAnnouncementRows(initialAnnouncementRows);
  }
}

function writeAnnouncementRows(rows: Announcement[]) {
  const storedRows: StoredAnnouncement[] = rows.map((row) => ({
    id: row.id,
    content: row.content,
    linkMode: announcementLinkToStorage[row.linkType],
    link: row.linkType === "无跳转" ? "" : row.linkUrl,
    publishMode: row.status === "待发布" ? "scheduled" : "immediate",
    publishAt: announcementDateToStorage(row.publishAt),
    autoOffline: ["待发布", "已发布"].includes(row.status) && Boolean(row.offlineAt),
    offlineAt: announcementDateToStorage(row.offlineAt),
    status: announcementStatusToStorage[row.status],
    updatedAt: announcementDateToStorage(row.updatedAt),
  }));
  try {
    localStorage.setItem(ANNOUNCEMENT_STORAGE_KEY, JSON.stringify(storedRows));
  } catch {
    // The page remains usable when storage is disabled; changes then last for this tab only.
  }
}

function isValidInternalAnnouncementLink(value: string) {
  const link = value.trim();
  return Boolean(link) && !/^[a-z][a-z\d+.-]*:/i.test(link) && !link.startsWith("//");
}

const initialWorkflowRows = [
  { id: "workflow-report", 流程ID: "FLOW-202607-001", 流程名称: "报告审核流程", 发布时间: "2026-07-08", 发布状态: "已发布" },
  { id: "workflow-scholar", 流程ID: "FLOW-202607-002", 流程名称: "认证学者审核流程", 发布时间: "2026-07-05", 发布状态: "未发布" },
  { id: "workflow-comment", 流程ID: "FLOW-202607-003", 流程名称: "评论审核流程", 发布时间: "2026-07-01", 发布状态: "已发布" },
];

const commentRows = [
  { 用户名: "李安", 评论内容: "这篇论文对人工智能发展趋势的分析很有参考价值。", 审核渠道: "门户论文", 提交时间: "2026-07-13 10:24", 状态: "待审核", 驳回意见: "" },
  { 用户名: "王宁", 评论内容: "希望社区后续可以增加更多智能制造案例。", 审核渠道: "社区评论", 提交时间: "2026-07-13 09:48", 状态: "待审核", 驳回意见: "" },
];

const scholarRows = [
  {
    学者姓名: "张明远",
    机构: "中国科学院",
    职称: "研究员",
    手机号: "13800000001",
    申请资料: [
      { 材料名称: "身份证明", 文件名称: "张明远_身份证明.pdf", 上传时间: "2026-07-12 09:18" },
      { 材料名称: "机构任职证明", 文件名称: "中国科学院任职证明.pdf", 上传时间: "2026-07-12 09:20" },
      { 材料名称: "职称证明", 文件名称: "研究员职称证明.pdf", 上传时间: "2026-07-12 09:21" },
      { 材料名称: "学术成果材料", 文件名称: "代表性学术成果汇总.pdf", 上传时间: "2026-07-12 09:25" },
    ],
    状态: "待审核",
  },
  {
    学者姓名: "陈思敏",
    机构: "北京大学",
    职称: "教授",
    手机号: "13800000002",
    申请资料: [
      { 材料名称: "身份证明", 文件名称: "陈思敏_身份证明.pdf", 上传时间: "2026-07-11 15:06" },
      { 材料名称: "机构任职证明", 文件名称: "北京大学任职证明.pdf", 上传时间: "2026-07-11 15:08" },
      { 材料名称: "职称证明", 文件名称: "教授职称证明.pdf", 上传时间: "2026-07-11 15:09" },
      { 材料名称: "学术成果材料", 文件名称: "代表性学术成果汇总.pdf", 上传时间: "2026-07-11 15:12" },
    ],
    状态: "待审核",
  },
];

const auditReportRows = [
  {
    报告名称: "TR报告：人工智能",
    报告类型: "TR报告",
    摘要预览: "围绕人工智能技术演进、应用进展与发展趋势开展系统分析。",
    提交人: "张明远",
    报告稿: [
      { 标题: "一、研究背景", 内容: "人工智能正在从单点算法能力向多模态理解、复杂推理与智能体协同方向演进。报告围绕技术体系、产业应用和治理需求，对当前发展阶段进行梳理。" },
      { 标题: "二、技术与应用进展", 内容: "基础模型能力持续提升，数据、算力、模型和工程平台形成协同体系。人工智能已在科研辅助、工业质检、知识服务和公共服务等场景中形成可验证的应用路径。" },
      { 标题: "三、趋势研判", 内容: "未来需要重点关注模型可靠性、专业数据供给、推理成本和安全治理。建议持续建设高质量领域数据集，完善评测机制，并推动技术能力与真实业务流程深度结合。" },
    ],
  },
  {
    报告名称: "未来产业报告：智能制造",
    报告类型: "未来产业报告",
    摘要预览: "分析智能制造关键技术、典型应用与产业发展路径。",
    提交人: "陈思敏",
    报告稿: [
      { 标题: "一、产业背景", 内容: "制造业数字化转型正由设备联网向生产过程优化和全链路协同延伸。智能制造通过工业软件、智能装备和数据平台联动，提升生产系统的感知、分析与决策能力。" },
      { 标题: "二、重点方向", 内容: "柔性生产、数字孪生、智能检测和预测性维护是当前重点应用方向。企业正在通过统一数据底座连接研发、生产、质量和供应链环节，形成可持续优化的生产闭环。" },
      { 标题: "三、发展建议", 内容: "建议加强工业数据标准与接口体系建设，推动关键工业软件和核心装备协同创新，并以可量化的质量、效率和能耗指标评估智能化改造效果。" },
    ],
  },
];

const trackingRows = [
  { 事件ID: "EVT_REPORT_VIEW", 所属功能模块: "报告管理", 埋点标签: "报告查看", 埋点路径: "/report/detail", 触发机制: "点击", 创建时间: "2026-07-08 10:20" },
  { 事件ID: "EVT_USER_REGISTER", 所属功能模块: "用户管理", 埋点标签: "用户注册", 埋点路径: "/user/register", 触发机制: "提交", 创建时间: "2026-07-06 14:35" },
  { 事件ID: "EVT_ROLE_CONFIG", 所属功能模块: "权限配置", 埋点标签: "权限配置", 埋点路径: "/permission/config", 触发机制: "保存", 创建时间: "2026-07-03 09:18" },
  { 事件ID: "EVT_FORM_PRINT", 所属功能模块: "审核管理", 埋点标签: "表单打印", 埋点路径: "/audit/form/print", 触发机制: "点击", 创建时间: "2026-07-02 16:42" },
];

type TimeInterval = "年" | "月" | "日";

type DashboardData = {
  stats: {
    eventTotal: { value: string; trend: string; direction: "up" | "down" };
    activeUsers: { value: string; trend: string; direction: "up" | "down" };
    clickRate: { value: string; trend: string; direction: "up" | "down" };
    pathConversion: { value: string; trend: string; direction: "up" | "down" };
  };
  trend: Array<{ label: string; eventValue: number; userValue: number }>;
  funnel: Array<{ label: string; value: string; rate: number }>;
  ranking: Array<{ 事件ID: string; 埋点标签: string; 触发次数: string; 页面停留均时: string }>;
};

const eventDashboardData: Record<TimeInterval, DashboardData> = {
  年: {
    stats: {
      eventTotal: { value: "248,600", trend: "+18.6% 较上年", direction: "up" },
      activeUsers: { value: "64,200", trend: "DAU/MAU 21.4%", direction: "up" },
      clickRate: { value: "46.8%", trend: "+6.2% 环比", direction: "up" },
      pathConversion: { value: "32.8%", trend: "+3.6% 较上年", direction: "up" },
    },
    trend: [{ label: "1月", eventValue: 18200, userValue: 4860 }, { label: "3月", eventValue: 23600, userValue: 6280 }, { label: "5月", eventValue: 31800, userValue: 5720 }, { label: "7月", eventValue: 40200, userValue: 7640 }, { label: "9月", eventValue: 47700, userValue: 6980 }, { label: "11月", eventValue: 53600, userValue: 8420 }],
      funnel: [{ label: "页面访问", value: "186,420", rate: 100 }, { label: "按钮点击", value: "87,256", rate: 68 }, { label: "业务提交", value: "52,938", rate: 48 }, { label: "完成转化", value: "32,846", rate: 32.8 }],
    ranking: [
      { 事件ID: "EVT_REPORT_VIEW", 埋点标签: "报告查看", 触发次数: "68,420", 页面停留均时: "3分18秒" },
      { 事件ID: "EVT_USER_REGISTER", 埋点标签: "用户注册", 触发次数: "42,600", 页面停留均时: "2分46秒" },
      { 事件ID: "EVT_ROLE_CONFIG", 埋点标签: "权限配置", 触发次数: "31,800", 页面停留均时: "4分12秒" },
      { 事件ID: "EVT_FORM_PRINT", 埋点标签: "表单打印", 触发次数: "18,620", 页面停留均时: "1分28秒" },
    ],
  },
  月: {
    stats: {
      eventTotal: { value: "28,460", trend: "+12.4% 较上月", direction: "up" },
      activeUsers: { value: "8,180", trend: "DAU/MAU 19.8%", direction: "up" },
      clickRate: { value: "43.6%", trend: "+2.8% 环比", direction: "up" },
      pathConversion: { value: "30.6%", trend: "-1.2% 较上月", direction: "down" },
    },
    trend: [{ label: "第1周", eventValue: 6260, userValue: 1800 }, { label: "第2周", eventValue: 7420, userValue: 1520 }, { label: "第3周", eventValue: 6780, userValue: 2140 }, { label: "第4周", eventValue: 8050, userValue: 1960 }],
      funnel: [{ label: "页面访问", value: "21,680", rate: 100 }, { label: "按钮点击", value: "9,452", rate: 70 }, { label: "业务提交", value: "5,816", rate: 50 }, { label: "完成转化", value: "3,548", rate: 30.6 }],
    ranking: [
      { 事件ID: "EVT_REPORT_VIEW", 埋点标签: "报告查看", 触发次数: "8,280", 页面停留均时: "3分06秒" },
      { 事件ID: "EVT_USER_REGISTER", 埋点标签: "用户注册", 触发次数: "5,460", 页面停留均时: "2分32秒" },
      { 事件ID: "EVT_ROLE_CONFIG", 埋点标签: "权限配置", 触发次数: "3,980", 页面停留均时: "4分08秒" },
      { 事件ID: "EVT_FORM_PRINT", 埋点标签: "表单打印", 触发次数: "2,120", 页面停留均时: "1分22秒" },
    ],
  },
  日: {
    stats: {
      eventTotal: { value: "1,286", trend: "+8.6% 较昨日", direction: "up" },
      activeUsers: { value: "438", trend: "DAU/MAU 18.6%", direction: "up" },
      clickRate: { value: "41.8%", trend: "+1.6% 环比", direction: "up" },
      pathConversion: { value: "28.4%", trend: "-0.8% 较昨日", direction: "down" },
    },
    trend: [{ label: "09:00", eventValue: 126, userValue: 52 }, { label: "11:00", eventValue: 214, userValue: 88 }, { label: "13:00", eventValue: 168, userValue: 60 }, { label: "15:00", eventValue: 246, userValue: 110 }, { label: "17:00", eventValue: 312, userValue: 84 }, { label: "19:00", eventValue: 220, userValue: 96 }],
      funnel: [{ label: "页面访问", value: "986", rate: 100 }, { label: "按钮点击", value: "412", rate: 72 }, { label: "业务提交", value: "268", rate: 50 }, { label: "完成转化", value: "186", rate: 28.4 }],
    ranking: [
      { 事件ID: "EVT_REPORT_VIEW", 埋点标签: "报告查看", 触发次数: "362", 页面停留均时: "3分12秒" },
      { 事件ID: "EVT_USER_REGISTER", 埋点标签: "用户注册", 触发次数: "216", 页面停留均时: "2分28秒" },
      { 事件ID: "EVT_ROLE_CONFIG", 埋点标签: "权限配置", 触发次数: "148", 页面停留均时: "4分16秒" },
      { 事件ID: "EVT_FORM_PRINT", 埋点标签: "表单打印", 触发次数: "96", 页面停留均时: "1分18秒" },
    ],
  },
};

type OrganizationNode = {
  id: string;
  label: string;
  children?: OrganizationNode[];
};

const initialOrganizationTree: OrganizationNode[] = [
  {
    id: "gkx",
    label: "国科信",
    children: [
      {
        id: "research-center",
        label: "研究中心",
        children: [
          { id: "ai-research", label: "人工智能研究部" },
          { id: "smart-manufacturing", label: "智能制造研究部" },
          { id: "strategy-group", label: "战略咨询组" },
        ],
      },
      {
        id: "operation-center",
        label: "运营中心",
        children: [
          { id: "data-operation", label: "数据运营部" },
          { id: "portal-operation", label: "门户运营部" },
        ],
      },
    ],
  },
];

const userRows = [
  { 用户ID: "U20260001", 用户姓名: "张明远", 所属组织名称: "研究中心", 手机号: "13800000001", 邮箱: "zhangmingyuan@gkx.cn", 创建时间: "2026-07-01", 账号状态: "启用" },
  { 用户ID: "U20260002", 用户姓名: "陈思敏", 所属组织名称: "战略咨询组", 手机号: "13800000002", 邮箱: "chensimin@gkx.cn", 创建时间: "2026-07-03", 账号状态: "禁用" },
  { 用户ID: "U20260003", 用户姓名: "王若琳", 所属组织名称: "人工智能研究部", 手机号: "13800000003", 邮箱: "wangruolin@gkx.cn", 创建时间: "2026-07-05", 账号状态: "启用" },
  { 用户ID: "U20260004", 用户姓名: "李致远", 所属组织名称: "智能制造研究部", 手机号: "13800000004", 邮箱: "lizhiyuan@gkx.cn", 创建时间: "2026-07-07", 账号状态: "启用" },
  { 用户ID: "U20260005", 用户姓名: "周岚", 所属组织名称: "数据运营部", 手机号: "13800000005", 邮箱: "zhoulan@gkx.cn", 创建时间: "2026-07-09", 账号状态: "禁用" },
];

const roleRows = [
  { 角色ID: "R001", 角色名称: "普通用户", 角色描述: "普通用户", 状态: "启用", 创建人: "系统管理员", 创建时间: "2026-07-01", 最近修改人: "系统管理员", 最近修改时间: "2026-07-08" },
  { 角色ID: "R002", 角色名称: "机构用户", 角色描述: "机构用户", 状态: "禁用", 创建人: "系统管理员", 创建时间: "2026-07-02", 最近修改人: "系统管理员", 最近修改时间: "2026-07-07" },
  { 角色ID: "R003", 角色名称: "政府用户", 角色描述: "政府用户", 状态: "废弃", 创建人: "系统管理员", 创建时间: "2026-07-03", 最近修改人: "系统管理员", 最近修改时间: "2026-07-06" },
];

type PageMenuNode = {
  id: string;
  title: string;
  url: string;
  enabled: "启用" | "禁用";
  children?: PageMenuNode[];
};

const initialPageMenuTree: PageMenuNode[] = [
  {
    id: "system-menu",
    title: "系统管理",
    url: "/system-management",
    enabled: "启用",
    children: [
      { id: "report-page", title: "报告管理", url: "/report-management", enabled: "启用" },
      {
        id: "audit-menu",
        title: "审核管理",
        url: "/audit-management",
        enabled: "启用",
        children: [
          { id: "workflow-page", title: "流程中心", url: "/workflow-center", enabled: "启用" },
          { id: "form-page", title: "表单中心", url: "/form-center", enabled: "启用" },
          { id: "audit-content-page", title: "评论审核", url: "/audit-content", enabled: "启用" },
        ],
      },
      { id: "tracking-page", title: "埋点管理", url: "/event-tracking", enabled: "启用" },
    ],
  },
  {
    id: "permission-menu",
    title: "权限管理",
    url: "/permission-management",
    enabled: "启用",
    children: [
      { id: "user-page", title: "用户管理", url: "/user-management", enabled: "启用" },
      { id: "role-page", title: "角色管理", url: "/role-management", enabled: "启用" },
      { id: "page-page", title: "页面管理", url: "/page-management", enabled: "启用" },
      { id: "resource-page", title: "资源管理", url: "/resource-management", enabled: "启用" },
      { id: "permission-page", title: "权限配置", url: "/permission-config", enabled: "禁用" },
    ],
  },
];

const apiLogRows = [
  { 调用时间: "2026-07-13 14:38:22", 调用方IP: "10.0.0.18", 接口名称: "查询人才库学者", 接口地址: "/api/v1/talents/scholars", 请求参数: "{\"talentPoolId\":\"TP-AI-001\",\"page\":1}", 响应结果: "成功", 调用耗时: "86ms", 错误信息: "-", 时间范围: "近1小时" },
  { 调用时间: "2026-07-13 14:21:08", 调用方IP: "10.0.0.32", 接口名称: "获取报告详情", 接口地址: "/api/v1/reports/TR001", 请求参数: "{\"includeSummary\":true}", 响应结果: "成功", 调用耗时: "112ms", 错误信息: "-", 时间范围: "近1小时" },
  { 调用时间: "2026-07-12 09:16:45", 调用方IP: "10.0.0.46", 接口名称: "查询智库列表", 接口地址: "/api/v1/think-tanks", 请求参数: "{\"keyword\":\"未来产业\"}", 响应结果: "失败", 调用耗时: "328ms", 错误信息: "请求参数 keyword 长度超出限制", 时间范围: "近7天" },
  { 调用时间: "2026-07-10 16:05:11", 调用方IP: "10.0.0.21", 接口名称: "查询人才库学者", 接口地址: "/api/v1/talents/scholars", 请求参数: "{\"talentPoolId\":\"TP-MAT-002\",\"page\":2}", 响应结果: "成功", 调用耗时: "94ms", 错误信息: "-", 时间范围: "近7天" },
];

const initialTokenRows = [
  { id: "token-portal", 应用名称: "国科信门户", Token字符串: "eyJhbGciOiJIUzI1NiJ9.portal.gkx.2026", 创建时间: "2026-07-01 09:30", 到期时间: "2027-07-01 09:30", 状态: "正常" },
  { id: "token-report", 应用名称: "报告服务", Token字符串: "eyJhbGciOiJIUzI1NiJ9.report.gkx.2026", 创建时间: "2026-06-18 14:20", 到期时间: "2026-12-18 14:20", 状态: "正常" },
  { id: "token-talent", 应用名称: "人才库同步服务", Token字符串: "eyJhbGciOiJIUzI1NiJ9.talent.gkx.2026", 创建时间: "2026-05-09 11:08", 到期时间: "2026-11-09 11:08", 状态: "已注销" },
];

type ApiDocument = {
  id: string;
  name: string;
  method: "GET" | "POST";
  path: string;
  description: string;
  parameters: Array<{ 参数名: string; 类型: string; 必填: string; 说明: string }>;
  response: string;
  errors: Array<{ 错误码: string; 说明: string }>;
};

const apiDocumentCatalog: Record<string, ApiDocument[]> = {
  人才库: [{
    id: "talent-list",
    name: "查询人才库学者",
    method: "GET",
    path: "/api/v1/talents/scholars",
    description: "按人才库查询已关联的学者数据。",
    parameters: [
      { 参数名: "talentPoolId", 类型: "string", 必填: "是", 说明: "人才库ID" },
      { 参数名: "page", 类型: "number", 必填: "否", 说明: "页码，默认 1" },
      { 参数名: "pageSize", 类型: "number", 必填: "否", 说明: "每页数量，默认 20" },
    ],
    response: `{
  "code": 0,
  "data": {
    "total": 128,
    "items": [{ "scholarId": "S10021", "name": "张明远" }]
  }
}`,
    errors: [{ 错误码: "40001", 说明: "人才库ID不能为空" }, { 错误码: "40401", 说明: "人才库不存在" }],
  }],
  报告: [{
    id: "report-detail",
    name: "获取报告详情",
    method: "GET",
    path: "/api/v1/reports/{reportId}",
    description: "根据报告ID获取报告基本信息及内容摘要。",
    parameters: [
      { 参数名: "reportId", 类型: "string", 必填: "是", 说明: "报告ID，路径参数" },
      { 参数名: "includeSummary", 类型: "boolean", 必填: "否", 说明: "是否返回内容摘要" },
    ],
    response: `{
  "code": 0,
  "data": {
    "reportId": "TR001",
    "reportName": "TR报告：人工智能",
    "reportType": "TR报告"
  }
}`,
    errors: [{ 错误码: "40402", 说明: "报告不存在" }, { 错误码: "40301", 说明: "无报告资源访问权限" }],
  }],
  智库: [{
    id: "think-tank-list",
    name: "查询智库列表",
    method: "POST",
    path: "/api/v1/think-tanks/search",
    description: "按关键词和研究领域检索智库资源。",
    parameters: [
      { 参数名: "keyword", 类型: "string", 必填: "否", 说明: "智库名称关键词" },
      { 参数名: "field", 类型: "string", 必填: "否", 说明: "研究领域" },
    ],
    response: `{
  "code": 0,
  "data": [{ "thinkTankId": "TT001", "name": "未来产业智库" }]
}`,
    errors: [{ 错误码: "40002", 说明: "检索条件格式错误" }, { 错误码: "50001", 说明: "智库服务暂不可用" }],
  }],
};

type BusinessResourceType = "talent" | "report" | "thinktank";

const businessResourceConfigs = {
  talent: {
    tab: "人才库资源",
    directoryTitle: "人才库目录",
    directories: ["人工智能人才库", "新材料人才库", "生命科学人才库"],
    info: { 名称: "人工智能人才库", 描述: "聚合人工智能领域重点学者资源", 总数标签: "学者总数", 总数: "128", 创建人: "系统管理员" },
    columns: ["学者名称", "所属学科", "职称", "关联时间"],
    requiredColumns: ["学者名称", "所属学科", "职称"],
    rows: [
      { 学者名称: "张明远", 所属学科: "计算机科学", 职称: "研究员", 关联时间: "2026-07-08 10:20" },
      { 学者名称: "陈思敏", 所属学科: "人工智能", 职称: "教授", 关联时间: "2026-07-06 14:35" },
      { 学者名称: "李博文", 所属学科: "自动化", 职称: "副研究员", 关联时间: "2026-07-03 09:18" },
    ],
  },
  report: {
    tab: "报告资源",
    directoryTitle: "报告资源目录",
    directories: ["TR报告", "战略咨询报告", "洞察分析报告", "未来产业报告"],
    info: { 名称: "TR报告", 描述: "技术研究类报告资源集合", 总数标签: "报告总数", 总数: "46", 创建人: "系统管理员" },
    columns: ["报告名称", "报告类型ID", "所属学科", "领域", "关联时间"],
    requiredColumns: ["报告名称", "报告类型ID", "所属学科", "领域"],
    rows: [
      { 报告名称: "TR报告：人工智能", 报告类型ID: "TR001", 所属学科: "计算机科学", 领域: "人工智能", 关联时间: "2026-07-08 10:20" },
      { 报告名称: "TR报告：量子计算", 报告类型ID: "TR002", 所属学科: "物理学", 领域: "量子科技", 关联时间: "2026-07-05 16:42" },
    ],
  },
  thinktank: {
    tab: "智库资源",
    directoryTitle: "智库资源目录",
    directories: ["科技政策智库", "未来产业智库", "区域创新智库"],
    info: { 名称: "科技政策智库", 描述: "科技政策研究与决策咨询资源集合", 总数标签: "智库总数", 总数: "18", 创建人: "系统管理员" },
    columns: ["智库名称", "所属领域", "创建人", "关联时间"],
    requiredColumns: ["智库名称", "所属领域"],
    rows: [
      { 智库名称: "国家科技战略研究中心", 所属领域: "科技政策", 创建人: "系统管理员", 关联时间: "2026-07-02 11:18" },
      { 智库名称: "未来产业研究院", 所属领域: "未来产业", 创建人: "系统管理员", 关联时间: "2026-06-28 09:46" },
    ],
  },
} satisfies Record<BusinessResourceType, {
  tab: string;
  directoryTitle: string;
  directories: string[];
  info: { 名称: string; 描述: string; 总数标签: string; 总数: string; 创建人: string };
  columns: string[];
  requiredColumns: string[];
  rows: Array<Record<string, string>>;
}>;

const reportResourceRows = [
  { 报告类型: "TR报告", 报告名称: "TR报告：人工智能", 报告类型ID: "TR001", 所属学科: "计算机科学", 领域: "人工智能" },
  { 报告类型: "未来产业报告", 报告名称: "未来产业报告：智能制造", 报告类型ID: "FI001", 所属学科: "工程技术", 领域: "智能制造" },
];

function StatusTag({ value, tone: toneOverride }: { value: string; tone?: "success" | "warning" | "danger" | "info" | "neutral" }) {
  const tone = toneOverride ?? (
    ["未发布", "启用", "禁用", "下架", "废弃", "已注销"].includes(value)
      ? "neutral"
      : value === "待审核"
        ? "info"
      : value.includes("通过") || value === "上架" || value === "发布" || value === "已发布" || value === "成功" || value === "正常"
      ? "success"
      : value.includes("失败") || value.includes("驳回") || value.includes("取消展示")
        ? "danger"
        : value.includes("待")
          ? "warning"
          : "info"
  );
  return <span className={`status-tag ${tone}`}><i />{value}</span>;
}

function PinState({ pinned }: { pinned: boolean }) {
  return (
    <span className={`pin-state ${pinned ? "is-pinned" : ""}`}>
      {pinned && <Pin size={13} aria-hidden="true" />}
      {pinned ? "是" : "否"}
    </span>
  );
}

function FeedbackToasts({ notices, onDismiss }: { notices: FeedbackNotice[]; onDismiss: (id: number) => void }) {
  if (notices.length === 0) return null;
  return createPortal(
    <div className="feedback-viewport" aria-live="polite" aria-atomic="true">
      {notices.map((notice) => (
        <div className={`feedback-toast ${notice.tone}`} role={notice.tone === "error" ? "alert" : "status"} key={notice.id}>
          <span className="feedback-icon" aria-hidden="true">
            {notice.tone === "success" && <Check size={14} strokeWidth={3} />}
            {notice.tone === "error" && <X size={14} strokeWidth={3} />}
            {notice.tone === "info" && <b>i</b>}
            {notice.tone === "warning" && <b>!</b>}
          </span>
          <span className="feedback-message">{notice.message}</span>
          <button type="button" aria-label="关闭提示" onClick={() => onDismiss(notice.id)}><X size={15} /></button>
        </div>
      ))}
    </div>,
    document.body,
  );
}

function ModalAlert({ tone = "info", title, children }: { tone?: FeedbackTone; title?: string; children: ReactNode }) {
  return (
    <div className={`modal-alert ${tone}`} role={tone === "error" || tone === "warning" ? "alert" : "status"}>
      <span className="modal-alert-icon" aria-hidden="true">
        {tone === "success" && <Check size={13} strokeWidth={3} />}
        {tone === "error" && <X size={13} strokeWidth={3} />}
        {tone === "info" && <b>i</b>}
        {tone === "warning" && <b>!</b>}
      </span>
      <div className="modal-alert-content">
        {title && <strong>{title}</strong>}
        <p>{children}</p>
      </div>
    </div>
  );
}

function Button({
  children,
  variant = "default",
  icon: Icon,
  onClick,
  type = "button",
  disabled = false,
}: {
  children: ReactNode;
  variant?: "primary" | "default" | "text" | "danger";
  icon?: LucideIcon;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button type={type} className={`btn ${variant}`} disabled={disabled} onClick={onClick}>
      {Icon && <Icon size={16} strokeWidth={1.9} />}
      {children}
    </button>
  );
}

const compactActionLabels: Record<string, string> = {
  "报告上架": "报告上架",
  "报告下架": "报告下架",
  "报告删除": "报告删除",
  "信息修改": "信息修改",
  "查看详情": "查看",
  "查看资料": "查看",
  "权限配置": "配置",
  "审核通过": "通过",
  "审核驳回": "驳回",
  "审核失败/取消展示": "取消展示",
};

const actionPriorities: Record<string, number> = {
  "查询": 1,
  "预览": 2,
  "查看": 2,
  "编辑": 3,
  "配置": 4,
  "新增": 5,
  "上架": 6,
  "下架": 6,
  "下线": 6,
  "发布": 6,
  "取消定时": 7,
  "置顶": 7,
  "取消置顶": 7,
  "启用": 8,
  "禁用": 8,
  "通过": 8,
  "取消展示": 8,
  "驳回": 8,
  "注销": 90,
  "删除": 99,
};

const actionTips: Record<string, string> = {
  置顶: "置顶后，该报告将在列表顶部优先展示",
  取消置顶: "取消置顶后，该报告将恢复默认排序",
};

type ActionSource = Array<string | false | null | undefined>;

type TableAction = {
  originalLabel: string;
  label: string;
  index: number;
  priority: number;
  isDanger: boolean;
  isDisabled: boolean;
};

function getOrderedActions(actions: ActionSource, disabledActions: string[] = []): TableAction[] {
  return actions
    .filter(Boolean)
    .map((action, index) => {
      const originalLabel = action as string;
      const label = compactActionLabels[originalLabel] ?? originalLabel;
      const isDanger = label.includes("删除") || label.includes("注销") || label.includes("驳回") || label.includes("失败") || label.includes("禁用") || label.includes("取消展示");
      return { originalLabel, label, index, priority: actionPriorities[label] ?? 50, isDanger, isDisabled: disabledActions.includes(originalLabel) };
    })
    .sort((a, b) => a.priority - b.priority || a.index - b.index);
}

function ActionLinks({ actions, disabledActions = [], actionTipOverrides = {}, onAction }: { actions: ActionSource; disabledActions?: string[]; actionTipOverrides?: Record<string, string>; onAction?: (action: string) => void }) {
  const orderedActions = getOrderedActions(actions, disabledActions);
  const [actionTooltip, setActionTooltip] = useState<{ content: string; left: number; top: number } | null>(null);
  return (
    <>
      <div className="inline-actions">
        {orderedActions.map(({ originalLabel, label, isDanger, isDisabled }) => {
          const tip = actionTipOverrides[originalLabel] ?? (isDisabled && originalLabel === "报告删除" ? "已置顶的报告不能删除，请先取消置顶" : actionTips[originalLabel]);
          return (
            <button
              aria-label={originalLabel}
              aria-disabled={isDisabled || undefined}
              className={`${isDanger ? "danger-action" : ""} ${tip ? "has-action-tip" : ""} ${isDisabled ? "disabled-action" : ""}`.trim()}
              key={originalLabel}
              title={tip}
              onMouseEnter={tip ? (event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                setActionTooltip({ content: tip, left: Math.max(8, Math.min(rect.left + rect.width / 2, window.innerWidth - 8)), top: rect.top - 8 });
              } : undefined}
              onMouseLeave={tip ? () => setActionTooltip(null) : undefined}
              onFocus={tip ? (event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                setActionTooltip({ content: tip, left: Math.max(8, Math.min(rect.left + rect.width / 2, window.innerWidth - 8)), top: rect.top - 8 });
              } : undefined}
              onBlur={tip ? () => setActionTooltip(null) : undefined}
              onClick={(event) => {
                event.stopPropagation();
                setActionTooltip(null);
                if (isDisabled) return;
                onAction?.(originalLabel);
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
      {actionTooltip && createPortal(
        <div className="action-tooltip" role="tooltip" style={{ left: actionTooltip.left, top: actionTooltip.top }}>{actionTooltip.content}</div>,
        document.body,
      )}
    </>
  );
}

function getActionItems(actionNode: ReactNode): TableAction[] {
  if (isValidElement<{ actions: ActionSource; disabledActions?: string[] }>(actionNode) && actionNode.type === ActionLinks) {
    return getOrderedActions(actionNode.props.actions, actionNode.props.disabledActions);
  }
  return [];
}

function getActionColumnWidth(actionRows: TableAction[][]) {
  return Math.max(60, ...actionRows.map((actions) => {
    const contentWidth = actions.reduce((width, action) => width + Array.from(action.label).length * 14, 0);
    return contentWidth + Math.max(0, actions.length - 1) * 12 + 32;
  }));
}

function FilterInput({
  label,
  placeholder = label,
  searchable = false,
  value,
  onChange,
}: {
  label: string;
  placeholder?: string;
  searchable?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="filter-field">
      <span className="filter-label">{label}</span>
      {searchable ? (
        <span className="filter-search-control">
          <input aria-label={label} placeholder={placeholder} value={value} onChange={(event) => onChange?.(event.target.value)} />
          <Search aria-hidden="true" size={16} />
        </span>
      ) : (
        <input className="filter-control" aria-label={label} placeholder={placeholder} value={value} onChange={(event) => onChange?.(event.target.value)} />
      )}
    </label>
  );
}

function FilterSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
}) {
  const [internalSelected, setInternalSelected] = useState(options[0]);
  const [open, setOpen] = useState(false);
  const selected = value ?? internalSelected;
  return (
    <div className="filter-field">
      <span className="filter-label">{label}</span>
      <div
        className={`filter-select-control ${open ? "open" : ""}`}
        onBlur={(event) => {
          const nextTarget = event.relatedTarget;
          if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
            setOpen(false);
          }
        }}
      >
        <button
          type="button"
          className="filter-select-trigger"
          aria-label={label}
          aria-expanded={open}
          aria-haspopup="listbox"
          onClick={() => setOpen((value) => !value)}
        >
          <span>{selected}</span>
          <ChevronDown aria-hidden="true" size={16} />
        </button>
        {open && (
          <div className="filter-select-menu" role="listbox" aria-label={label}>
            {options.map((option) => (
              <button
                type="button"
                role="option"
                aria-selected={selected === option}
                className={selected === option ? "active" : ""}
                key={option}
                onClick={() => {
                  if (value === undefined) setInternalSelected(option);
                  onChange?.(option);
                  setOpen(false);
                }}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SelectField({ label }: { label: string }) {
  return (
    <button className="select-field">
      <span>{label}</span>
      <ChevronDown size={15} />
    </button>
  );
}

function getPaginationItems(totalPages: number, currentPage: number) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);
  const items: Array<number | "ellipsis"> = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  if (start > 2) items.push("ellipsis");
  for (let page = start; page <= end; page += 1) items.push(page);
  if (end < totalPages - 1) items.push("ellipsis");
  items.push(totalPages);
  return items;
}

function Pagination({
  total,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: {
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageItems = getPaginationItems(totalPages, currentPage);
  return (
    <nav className="pagination" aria-label="分页">
      <span>共 {total} 条</span>
      <button aria-label="上一页" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}><ChevronLeft size={16} /></button>
      {pageItems.map((item, index) => (
        item === "ellipsis"
          ? <span className="pagination-ellipsis" key={`ellipsis-${index}`}>…</span>
          : <button className={item === currentPage ? "active" : ""} aria-current={item === currentPage ? "page" : undefined} key={item} onClick={() => onPageChange(item)}>{item}</button>
      ))}
      <button aria-label="下一页" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}><ChevronRight size={16} /></button>
      <label className="pagination-size">
        <select aria-label="每页条数" value={pageSize} onChange={(event) => onPageSizeChange(Number(event.target.value))}>
          {[10, 20, 50].map((size) => <option key={size} value={size}>{size} 条/页</option>)}
        </select>
        <ChevronDown aria-hidden="true" size={16} />
      </label>
    </nav>
  );
}

function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <header className="card-header">
      <div><h3>{title}</h3>{subtitle && <span>{subtitle}</span>}</div>
      {action}
    </header>
  );
}

function getTableText(value: ReactNode) {
  if (typeof value === "string" || typeof value === "number") return String(value);
  return null;
}

type TableColumnWidthKind = "long" | "name" | "date" | "identifier" | "contact" | "numeric" | "compact" | "default";

const tableColumnMinimumWidths: Record<string, number> = {
  流程ID: 200,
  流程名称: 240,
  报告标题: 200,
  报告类型: 128,
  报告来源: 160,
  所属领域: 120,
  上传时间: 120,
  内容摘要: 240,
  状态: 96,
  是否置顶: 96,
  名称: 200,
  发布时间: 120,
  发布状态: 96,
  评论内容: 240,
  渠道: 120,
  学者姓名: 120,
  机构: 180,
  职称: 96,
  手机号: 128,
  报告信息: 220,
  提交人: 120,
  事件ID: 180,
  所属功能模块: 140,
  埋点标签: 160,
  埋点路径: 220,
  触发机制: 96,
  组织姓名: 180,
  父组织名称: 180,
  用户ID: 120,
  用户姓名: 120,
  所属组织名称: 180,
  邮箱: 200,
  创建时间: 120,
  账号状态: 96,
  角色ID: 96,
  角色名称: 140,
  角色描述: 220,
  创建人: 128,
  最近修改人: 128,
  最近修改时间: 144,
  一级页面: 140,
  二级页面: 140,
  三级页面: 140,
  "地址(URL)": 240,
  启用属性: 96,
  接口名称: 160,
  请求方法: 96,
  参数列表: 240,
  返回格式: 120,
  示例请求: 200,
  响应结果: 96,
  错误码说明: 200,
  调用时间: 144,
  调用方IP: 128,
  接口地址: 220,
  请求参数: 200,
  调用耗时: 96,
  错误信息: 200,
  应用名称: 180,
  Token字符串: 220,
  到期时间: 144,
  人才库名称: 220,
  描述: 240,
  学者数量: 96,
  学者名称: 160,
  所属学科: 160,
  关联时间: 144,
  当前角色: 220,
  智库名称: 220,
  报告名称: 220,
  报告类型ID: 120,
  领域: 120,
};

const tableColumnMinimumWidthByKind: Record<TableColumnWidthKind, number> = {
  long: 224,
  name: 192,
  date: 144,
  identifier: 128,
  contact: 128,
  numeric: 104,
  compact: 96,
  default: 144,
};

function getTableColumnWidthKind(column: string): TableColumnWidthKind {
  if (/(时间|日期)/.test(column)) return "date";
  if (/(ID|编号)/.test(column)) return "identifier";
  if (/(手机号|邮箱|IP)/.test(column)) return "contact";
  if (/(数量|耗时)/.test(column)) return "numeric";
  if (/(状态|是否|渠道|领域|职称|属性|方法|机制|格式|结果)/.test(column)) return "compact";
  if (/(内容|摘要|描述|地址|路径|参数|错误|说明|示例请求|信息)/.test(column)) return "long";
  if (/(标题|名称)/.test(column)) return "name";
  return "default";
}

function getTextDisplayWidth(text: string, maximumUnits = 16) {
  const units = Array.from(text).reduce((total, character) => (
    total + (/^[\u2E80-\u9FFF\uF900-\uFAFF]$/.test(character) ? 1 : character === " " ? .35 : .58)
  ), 0);
  return Math.ceil(Math.min(units, maximumUnits) * 14 + 32);
}

function getColumnWidth<T extends Record<string, ReactNode>>(column: string, rows: T[], showFullText = false) {
  const contentWidth = rows.reduce((longest, row) => {
    const value = getTableText(row[column]);
    return Math.max(longest, value ? getTextDisplayWidth(value, showFullText ? Number.POSITIVE_INFINITY : 16) : 0);
  }, getTextDisplayWidth(column));
  const minimumWidth = tableColumnMinimumWidths[column] ?? tableColumnMinimumWidthByKind[getTableColumnWidthKind(column)];
  return Math.max(minimumWidth, contentWidth + (showFullText ? 24 : 0));
}

function TableCellContent({
  value,
  showFullText = false,
  onShowTooltip,
  onHideTooltip,
}: {
  value: ReactNode;
  showFullText?: boolean;
  onShowTooltip: (content: string, target: HTMLElement) => void;
  onHideTooltip: () => void;
}) {
  const text = getTableText(value);
  const shouldTruncate = Boolean(!showFullText && text && Array.from(text).length > 16);
  if (!shouldTruncate || !text) return <>{value}</>;
  const displayText = `${Array.from(text).slice(0, 16).join("")}…`;
  return (
    <span
      className="table-cell-text is-truncated"
      title={text}
      tabIndex={0}
      onMouseEnter={(event) => onShowTooltip(text, event.currentTarget)}
      onMouseLeave={onHideTooltip}
      onFocus={(event) => onShowTooltip(text, event.currentTarget)}
      onBlur={onHideTooltip}
    >
      {displayText}
    </span>
  );
}

function SortableTableHeader({
  field,
  activeField,
  activeDirection,
  onSort,
}: {
  field: ReportSortField;
  activeField: ReportSortField;
  activeDirection: ReportSortDirection;
  onSort: (field: ReportSortField, direction: ReportSortDirection) => void;
}) {
  const isActive = activeField === field;
  return (
    <span className={`sortable-table-header ${isActive ? "is-active" : ""}`}>
      <span>{field}</span>
      <span className="table-sort-buttons" aria-label={`${field}排序`}>
        <button
          type="button"
          className={`table-sort-button ${isActive && activeDirection === "正序" ? "is-active" : ""}`}
          aria-label={`排序规则设置：${field}正序`}
          aria-pressed={isActive && activeDirection === "正序"}
          title={`排序规则设置：${field}正序`}
          onClick={() => onSort(field, "正序")}
        >
          <ArrowUp aria-hidden="true" size={12} />
        </button>
        <button
          type="button"
          className={`table-sort-button ${isActive && activeDirection === "倒序" ? "is-active" : ""}`}
          aria-label={`排序规则设置：${field}倒序`}
          aria-pressed={isActive && activeDirection === "倒序"}
          title={`排序规则设置：${field}倒序`}
          onClick={() => onSort(field, "倒序")}
        >
          <ArrowDown aria-hidden="true" size={12} />
        </button>
      </span>
    </span>
  );
}

function DataTable<T extends Record<string, ReactNode>>({
  columns,
  rows,
  actions,
  rowKey,
  onRowClick,
  activeRowKey,
  fullTextColumns = [],
  selectable = false,
  batchActions,
  actionWidth,
  renderHeader,
}: {
  columns: string[];
  rows: T[];
  actions?: (row: T) => ReactNode;
  rowKey?: (row: T, index: number) => string | number;
  onRowClick?: (row: T, index: number) => void;
  activeRowKey?: string | number | null;
  fullTextColumns?: string[];
  selectable?: boolean;
  batchActions?: (selectedRows: T[], clearSelection: () => void) => ReactNode;
  actionWidth?: number;
  renderHeader?: (column: string) => ReactNode;
}) {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(() => new Set());
  const [scrollState, setScrollState] = useState({ hasOverflow: false, showLeftShadow: false, showRightShadow: false });
  const [tableViewportWidth, setTableViewportWidth] = useState(0);
  const [tooltip, setTooltip] = useState<{ content: string; left: number; top: number } | null>(null);
  const tableWrapRef = useRef<HTMLDivElement>(null);
  const selectAllRef = useRef<HTMLInputElement>(null);
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const pageStart = (activePage - 1) * pageSize;
  const pageRows = rows.slice(pageStart, pageStart + pageSize);
  const visibleRowIndexes = pageRows.map((_, index) => pageStart + index);
  const allVisibleRowsSelected = visibleRowIndexes.length > 0 && visibleRowIndexes.every((index) => selectedRows.has(index));
  const someVisibleRowsSelected = visibleRowIndexes.some((index) => selectedRows.has(index));
  const columnWidths = columns.map((column) => getColumnWidth(column, rows, fullTextColumns.includes(column)));
  const actionRows = actions ? rows.map((row) => getActionItems(actions(row))) : [];
  const actionColumnWidth = actions ? Math.max(actionWidth ?? 0, getActionColumnWidth(actionRows)) : 0;
  const selectedActionRows = Array.from(selectedRows, (rowIndex) => actionRows[rowIndex]).filter((actionItems): actionItems is TableAction[] => Boolean(actionItems));
  const selectedDataRows = Array.from(selectedRows, (rowIndex) => rows[rowIndex]).filter((row): row is T => Boolean(row));
  const canBatchDelete = selectedActionRows.length > 0 && selectedActionRows.every((actionItems) => actionItems.some((action) => action.label.includes("删除") && !action.isDisabled));
  const contentColumnsWidth = columnWidths.reduce((total, width) => total + width, 0);
  const fixedColumnsWidth = (selectable ? 52 : 0) + actionColumnWidth;
  const tableMinWidth = fixedColumnsWidth + contentColumnsWidth;
  const renderedTableWidth = actions ? Math.max(tableMinWidth, tableViewportWidth) : tableMinWidth;
  const contentFillWidth = actions ? Math.max(0, renderedTableWidth - tableMinWidth) : 0;
  const tableWidth = `${renderedTableWidth}px`;
  const renderedColumnWidths = actions
    ? columnWidths.map((width) => width + contentFillWidth * (width / contentColumnsWidth))
    : columnWidths;

  const updateScrollState = () => {
    const tableWrap = tableWrapRef.current;
    if (!tableWrap) return;
    setTableViewportWidth((current) => current === tableWrap.clientWidth ? current : tableWrap.clientWidth);
    const maxScrollLeft = Math.max(0, tableWrap.scrollWidth - tableWrap.clientWidth);
    const hasOverflow = maxScrollLeft > 1;
    const nextState = {
      hasOverflow,
      showLeftShadow: hasOverflow && tableWrap.scrollLeft > 1,
      showRightShadow: hasOverflow && tableWrap.scrollLeft < maxScrollLeft - 1,
    };
    setScrollState((current) => (
      current.hasOverflow === nextState.hasOverflow
      && current.showLeftShadow === nextState.showLeftShadow
      && current.showRightShadow === nextState.showRightShadow
        ? current
        : nextState
    ));
  };

  useEffect(() => {
    const tableWrap = tableWrapRef.current;
    if (!tableWrap) return undefined;
    updateScrollState();
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(tableWrap);
    window.addEventListener("resize", updateScrollState);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScrollState);
    };
  }, [actions, columns.length, pageSize, rows.length, tableMinWidth]);

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someVisibleRowsSelected && !allVisibleRowsSelected;
    }
  }, [allVisibleRowsSelected, someVisibleRowsSelected]);

  const toggleVisibleRows = () => {
    setSelectedRows((current) => {
      const next = new Set(current);
      if (allVisibleRowsSelected) visibleRowIndexes.forEach((index) => next.delete(index));
      else visibleRowIndexes.forEach((index) => next.add(index));
      return next;
    });
  };

  const toggleRow = (rowIndex: number) => {
    setSelectedRows((current) => {
      const next = new Set(current);
      if (next.has(rowIndex)) next.delete(rowIndex);
      else next.add(rowIndex);
      return next;
    });
  };

  const showTooltip = (content: string, target: HTMLElement) => {
    const rect = target.getBoundingClientRect();
    const maxLeft = Math.max(8, window.innerWidth - 368);
    setTooltip({ content, left: Math.min(Math.max(8, rect.left), maxLeft), top: rect.bottom + 8 });
  };

  const pagination = (
    <Pagination
      total={rows.length}
      currentPage={activePage}
      pageSize={pageSize}
      onPageChange={setCurrentPage}
      onPageSizeChange={(nextPageSize) => {
        setPageSize(nextPageSize);
        setCurrentPage(1);
      }}
    />
  );

  return (
    <>
      <div
        className={`table-wrap ${actions ? "has-actions" : ""} ${scrollState.hasOverflow ? "is-scrollable" : ""} ${scrollState.showLeftShadow ? "has-left-shadow" : ""} ${scrollState.showRightShadow ? "has-right-shadow" : ""}`}
        ref={tableWrapRef}
        onScroll={updateScrollState}
      >
        <table style={{ width: tableWidth, minWidth: `${tableMinWidth}px` }}>
          <colgroup>
            {selectable && <col className="table-select-column" style={{ width: 52 }} />}
            {renderedColumnWidths.map((width, index) => <col key={columns[index]} style={{ width }} />)}
            {actions && <col className="table-action-column" style={{ width: actionColumnWidth }} />}
          </colgroup>
          <thead>
            <tr>
              {selectable && <th className="table-select-cell table-sticky-left">
                <input ref={selectAllRef} type="checkbox" aria-label="选择当前页全部数据" checked={allVisibleRowsSelected} onChange={toggleVisibleRows} />
              </th>}
              {columns.map((column) => <th key={column}>{renderHeader?.(column) ?? column}</th>)}
              {actions && <th className="table-action-cell table-sticky-right">操作</th>}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row, pageIndex) => {
              const rowIndex = pageStart + pageIndex;
              const key = rowKey?.(row, rowIndex) ?? rowIndex;
              const isActiveRow = activeRowKey !== undefined && activeRowKey === key;
              return (
                <tr
                  className={`${selectedRows.has(rowIndex) ? "is-selected" : ""} ${isActiveRow ? "is-active" : ""}`.trim()}
                  key={key}
                  onClick={onRowClick ? () => onRowClick(row, rowIndex) : undefined}
                >
                  {selectable && <td className="table-select-cell table-sticky-left">
                    <input type="checkbox" aria-label={`选择第 ${rowIndex + 1} 条数据`} checked={selectedRows.has(rowIndex)} onClick={(event) => event.stopPropagation()} onChange={() => toggleRow(rowIndex)} />
                  </td>}
                  {columns.map((column) => (
                    <td key={column}>
                      <TableCellContent value={row[column]} showFullText={fullTextColumns.includes(column)} onShowTooltip={showTooltip} onHideTooltip={() => setTooltip(null)} />
                    </td>
                  ))}
                  {actions && <td className="table-action-cell table-sticky-right">{actions(row)}</td>}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {selectable && selectedRows.size > 0 ? (
        <div className="table-bottom-bar batch-selection-bar">
          <div className="batch-selection-actions">
            <span>已选 {selectedRows.size} 条</span>
            {batchActions?.(selectedDataRows, () => setSelectedRows(new Set()))}
            {canBatchDelete && <button type="button" className="danger-action">批量删除</button>}
            <button type="button" onClick={() => setSelectedRows(new Set())}>取消选择</button>
          </div>
          {pagination}
        </div>
      ) : pagination}
      {tooltip && createPortal(
        <div className="table-cell-tooltip" role="tooltip" style={{ left: tooltip.left, top: tooltip.top }}>{tooltip.content}</div>,
        document.body,
      )}
    </>
  );
}

function ReportManagement({ openModal, notify }: { openModal: OpenModal; notify: Notify }) {
  const [reports, setReports] = useState(reportRows);
  const [sortField, setSortField] = useState<ReportSortField>("上传时间");
  const [sortDirection, setSortDirection] = useState<ReportSortDirection>("倒序");

  const sortedReports = useMemo(() => reports
    .map((report, index) => ({ report, index }))
    .sort((a, b) => {
      const pinnedOrder = Number(b.report.是否置顶 === "是") - Number(a.report.是否置顶 === "是");
      if (pinnedOrder !== 0) return pinnedOrder;

      const comparison = sortField === "上传时间"
        ? a.report.上传时间.localeCompare(b.report.上传时间)
        : reportSortCollator.compare(a.report[sortField], b.report[sortField]);
      return (sortDirection === "正序" ? comparison : -comparison) || a.index - b.index;
    })
    .map(({ report }) => report), [reports, sortDirection, sortField]);

  const updateReport = (title: string, patch: Partial<(typeof reportRows)[number]>) => {
    setReports((list) => list.map((report) => (report.报告标题 === title ? { ...report, ...patch } : report)));
  };

  return (
    <section className="card page-card">
      <div className="filters">
        <FilterSelect label="报告类型" options={["全部", ...reportTypeOptions]} />
        <FilterSelect label="所属领域" options={["全部", "人工智能", "智能制造", "新材料", "低空经济"]} />
        <FilterInput label="报告来源" placeholder="请输入" searchable />
      </div>
      <div className="table-toolbar">
        <div>
          <Button
            variant="primary"
            icon={Upload}
            onClick={() => openModal("report", {
              mode: "create",
              onSave: (values) => setReports((list) => [
                ...list,
                {
                  报告标题: values.报告标题,
                  报告类型: values.报告类型,
                  报告来源: values.报告来源,
                  所属领域: values.所属领域,
                  上传时间: values.上传时间,
                  内容摘要: values.内容摘要,
                  状态: "上架",
                  是否置顶: "否",
                },
              ]),
            })}
          >报告上传</Button>
        </div>
      </div>
      <DataTable
        key={`${sortField}-${sortDirection}`}
        columns={["报告标题", "报告类型", "报告来源", "所属领域", "上传时间", "内容摘要", "状态", "是否置顶"]}
        rows={sortedReports.map((row) => ({ ...row, 原始状态: row.状态, 状态: <StatusTag value={row.状态} />, 是否置顶: <PinState pinned={row.是否置顶 === "是"} />, 原始置顶状态: row.是否置顶 }))}
        renderHeader={(column) => reportSortFieldOptions.includes(column as ReportSortField)
          ? (
            <SortableTableHeader
              field={column as ReportSortField}
              activeField={sortField}
              activeDirection={sortDirection}
              onSort={(field, direction) => {
                setSortField(field);
                setSortDirection(direction);
              }}
            />
          )
          : column}
        selectable
        rowKey={(row) => String(row.报告标题)}
        actions={(row) => (
          <ActionLinks
            actions={[
              row.原始状态 === "下架" ? "报告上架" : "报告下架",
              "信息修改",
              (row.原始状态 === "下架" || row.原始置顶状态 === "是") && "报告删除",
              row.原始置顶状态 === "是" ? "取消置顶" : "置顶",
            ]}
            disabledActions={row.原始置顶状态 === "是" ? ["报告删除"] : []}
            onAction={(action) => {
              const title = String(row.报告标题);
              const report = reports.find((item) => item.报告标题 === title);
              if (!report) return;
              if (action === "报告上架" || action === "报告下架") {
                updateReport(title, { 状态: action === "报告上架" ? "上架" : "下架" });
                notify(action === "报告上架" ? "上架成功" : "下架成功");
              }
              if (action === "置顶" || action === "取消置顶") {
                if (action === "置顶") {
                  setReports((list) => {
                    const target = list.find((item) => item.报告标题 === title);
                    return target ? [{ ...target, 是否置顶: "是" }, ...list.filter((item) => item.报告标题 !== title)] : list;
                  });
                } else {
                  updateReport(title, { 是否置顶: "否" });
                }
                notify(action === "置顶" ? "置顶成功，已移至列表顶部" : "取消置顶成功");
              }
              if (action === "信息修改") {
                openModal("report", {
                  mode: "edit",
                  payload: report,
                  onSave: (values) => updateReport(title, values),
                });
              }
              if (action === "报告删除") {
                openModal("delete", {
                  payload: { message: `确认删除${title}？` },
                  onConfirm: () => setReports((list) => list.filter((item) => item.报告标题 !== title)),
                });
              }
            }}
          />
        )}
      />
    </section>
  );
}

const announcementStatusTones: Record<AnnouncementStatus, "success" | "warning" | "danger" | "neutral"> = {
  草稿: "neutral",
  待发布: "warning",
  已发布: "success",
  已下线: "danger",
};

type AnnouncementEditorValues = {
  content: string;
  linkType: AnnouncementLinkType;
  linkUrl: string;
  publishAt: string;
  offlineAt: string;
};

function formatAnnouncementDate(date = new Date()) {
  const part = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${part(date.getMonth() + 1)}-${part(date.getDate())} ${part(date.getHours())}:${part(date.getMinutes())}`;
}

function toDateTimeInput(value: string) {
  return value ? value.replace(" ", "T") : "";
}

function fromDateTimeInput(value: string) {
  return value ? value.replace("T", " ") : "";
}

function AnnouncementStrip({ announcement, emptyText }: { announcement?: Announcement | AnnouncementEditorValues; emptyText?: string }) {
  const hasLink = Boolean(announcement && announcement.linkType !== "无跳转" && announcement.linkUrl);
  return (
    <div className={`announcement-strip-preview ${announcement ? "" : "is-empty"}`} aria-label="首页公告展示预览">
      <span className="announcement-strip-label">公告</span>
      <span className="announcement-strip-copy">{announcement?.content || emptyText || "当前暂无正在展示的公告"}</span>
      {hasLink && <span className="announcement-strip-link">查看详情 <ChevronRight size={14} aria-hidden="true" /></span>}
    </div>
  );
}

function AnnouncementEditorModal({
  announcement,
  hasAnotherPublished,
  close,
  onSave,
}: {
  announcement: Announcement | null;
  hasAnotherPublished: boolean;
  close: () => void;
  onSave: (values: AnnouncementEditorValues, status: "草稿" | "待发布" | "已发布") => void;
}) {
  const [content, setContent] = useState(announcement?.content ?? "");
  const [linkType, setLinkType] = useState<AnnouncementLinkType>(announcement?.linkType ?? "无跳转");
  const [linkUrl, setLinkUrl] = useState(announcement?.linkUrl ?? "");
  const [publishMode, setPublishMode] = useState<"立即发布" | "定时发布">(announcement?.status === "待发布" ? "定时发布" : "立即发布");
  const [publishAt, setPublishAt] = useState(toDateTimeInput(announcement?.status === "待发布" ? announcement.publishAt : ""));
  const [offlineAt, setOfflineAt] = useState(toDateTimeInput(announcement && ["待发布", "已发布"].includes(announcement.status) ? announcement.offlineAt : ""));
  const trimmedContent = content.trim();
  const isPublished = announcement?.status === "已发布";
  const linkIsValid = linkType === "无跳转"
    || (linkType === "站内链接" ? isValidInternalAnnouncementLink(linkUrl) : /^https:\/\//i.test(linkUrl.trim()));
  const scheduledDate = publishAt ? new Date(publishAt) : null;
  const scheduleIsValid = publishMode === "立即发布" || Boolean(scheduledDate && scheduledDate.getTime() > Date.now());
  const offlineDate = offlineAt ? new Date(offlineAt) : null;
  const publishReference = publishMode === "定时发布" && scheduledDate ? scheduledDate.getTime() : Date.now();
  const offlineIsValid = !offlineDate || offlineDate.getTime() > publishReference;
  const canSave = Boolean(trimmedContent) && linkIsValid && offlineIsValid;
  const canPublish = canSave && scheduleIsValid;
  const previewValues: AnnouncementEditorValues = {
    content: trimmedContent,
    linkType,
    linkUrl: linkType === "无跳转" ? "" : linkUrl.trim(),
    publishAt: fromDateTimeInput(publishAt),
    offlineAt: fromDateTimeInput(offlineAt),
  };
  const publishStatus = publishMode === "定时发布" ? "待发布" : "已发布";

  return createPortal(
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && close()}>
      <div className="modal form-modal announcement-editor-modal">
        <ModalHeader title={announcement ? "编辑公告" : "新建公告"} subtitle="公告展示在门户首页导航下方，同一时刻仅展示一条。" close={close} />
        <form className="modal-form" onSubmit={(event) => { event.preventDefault(); if (canPublish) onSave(previewValues, publishStatus); }}>
          <div className="modal-form-body">
            {(isPublished || (publishMode === "立即发布" && hasAnotherPublished)) && (
              <ModalAlert tone="warning" title={isPublished ? "将同步更新首页公告" : "将替换当前首页公告"}>
                {isPublished ? "保存后，修改内容会立即同步到门户首页。" : "发布成功后，当前正在展示的公告将自动下线并保留在历史记录中。"}
              </ModalAlert>
            )}
            {publishMode === "定时发布" && (
              <ModalAlert>到达设定时间前，当前已发布公告仍会继续展示。</ModalAlert>
            )}
            <div className="announcement-content-field">
              <FormField label="公告内容" required><textarea autoFocus maxLength={60} placeholder="请输入首页公告内容" value={content} onChange={(event) => setContent(event.target.value)} /></FormField>
              <span className="announcement-character-count">{Array.from(content).length}/60</span>
            </div>
            <FormField label="展示位置"><input disabled value="首页导航下方公告栏" /></FormField>
            <div className="form-row">
              <FormField label="跳转方式" required><FormSelect options={["无跳转", "站内链接", "外部链接"]} value={linkType} onChange={(value) => { setLinkType(value as AnnouncementLinkType); if (value === "无跳转") setLinkUrl(""); }} /></FormField>
              <FormField label="发布方式" required><FormSelect options={["立即发布", "定时发布"]} value={publishMode} disabled={isPublished} onChange={(value) => setPublishMode(value as "立即发布" | "定时发布")} /></FormField>
            </div>
            {linkType !== "无跳转" && (
              <FormField label="链接地址" required>
                <div className="validated-control">
                  <input className={linkUrl && !linkIsValid ? "is-error" : ""} placeholder={linkType === "站内链接" ? "例如 recommendations.html 或 /service-status" : "请输入完整的 https:// 地址"} value={linkUrl} onChange={(event) => setLinkUrl(event.target.value)} />
                  {linkUrl && !linkIsValid && <span className="form-error-message">{linkType === "站内链接" ? "请填写门户内相对路径，不能包含外部协议" : "外部链接仅支持 https:// 安全地址"}</span>}
                </div>
              </FormField>
            )}
            <div className="form-row">
              {publishMode === "定时发布" && (
                <FormField label="定时发布时间" required>
                  <div className="validated-control">
                    <input type="datetime-local" value={publishAt} onChange={(event) => setPublishAt(event.target.value)} />
                    {publishAt && !scheduleIsValid && <span className="form-error-message">定时发布时间需晚于当前时间</span>}
                  </div>
                </FormField>
              )}
              <FormField label="自动下线时间">
                <div className="validated-control">
                  <input type="datetime-local" value={offlineAt} onChange={(event) => setOfflineAt(event.target.value)} />
                  {offlineAt && !offlineIsValid && <span className="form-error-message">下线时间需晚于发布时间</span>}
                </div>
              </FormField>
            </div>
            <div className="announcement-editor-preview">
              <div className="announcement-editor-preview-title"><span>首页效果预览</span><small>实际宽度随门户页面自适应</small></div>
              <AnnouncementStrip announcement={trimmedContent ? previewValues : undefined} emptyText="请输入公告内容" />
            </div>
          </div>
          <div className="modal-footer">
            <Button onClick={close}>取消</Button>
            {!isPublished && <Button disabled={!canSave} onClick={() => canSave && onSave(previewValues, "草稿")}>保存草稿</Button>}
            <Button type="submit" variant="primary" disabled={!canPublish}>{isPublished ? "保存并更新" : publishMode === "定时发布" ? (announcement?.status === "待发布" ? "保存定时" : "定时发布") : "立即发布"}</Button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

function AnnouncementPreviewModal({ announcement, close }: { announcement: Announcement; close: () => void }) {
  return createPortal(
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && close()}>
      <div className="modal form-modal announcement-preview-modal">
        <ModalHeader title="公告预览" subtitle="模拟门户首页导航下方的实际展示位置。" close={close} />
        <div className="modal-form">
          <div className="modal-form-body">
            <div className="announcement-home-preview">
              <div className="announcement-home-preview-nav"><strong>深圳国际科技信息中心</strong><span>首页</span><span>AI科研</span><span>战略咨询</span><span>未来教育</span></div>
              <AnnouncementStrip announcement={announcement} />
            </div>
            <dl className="announcement-preview-meta">
              <div><dt>展示位置</dt><dd>首页导航下方公告栏</dd></div>
              <div><dt>当前状态</dt><dd><StatusTag value={announcement.status} tone={announcementStatusTones[announcement.status]} /></dd></div>
              <div><dt>跳转方式</dt><dd>{announcement.linkType}{announcement.linkUrl ? ` · ${announcement.linkUrl}` : ""}</dd></div>
              <div><dt>发布时间</dt><dd>{announcement.publishAt || "—"}</dd></div>
              <div><dt>下线时间</dt><dd>{announcement.offlineAt || "不自动下线"}</dd></div>
            </dl>
          </div>
          <div className="modal-footer"><Button variant="primary" onClick={close}>关闭</Button></div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function AnnouncementManagement({ openModal, notify }: { openModal: OpenModal; notify: Notify }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>(readAnnouncementRows);
  const [contentQuery, setContentQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("全部");
  const [editorAnnouncement, setEditorAnnouncement] = useState<Announcement | null | undefined>(undefined);
  const [previewAnnouncement, setPreviewAnnouncement] = useState<Announcement | null>(null);
  useEffect(() => {
    writeAnnouncementRows(announcements);
  }, [announcements]);
  useEffect(() => {
    const syncFromStorage = (event: StorageEvent) => {
      if (event.key === ANNOUNCEMENT_STORAGE_KEY) setAnnouncements(readAnnouncementRows());
    };
    const reconcileTimer = window.setInterval(() => {
      setAnnouncements((rows) => {
        const nextRows = reconcileAnnouncementRows(rows);
        return JSON.stringify(nextRows) === JSON.stringify(rows) ? rows : nextRows;
      });
    }, 30000);
    window.addEventListener("storage", syncFromStorage);
    return () => {
      window.clearInterval(reconcileTimer);
      window.removeEventListener("storage", syncFromStorage);
    };
  }, []);
  const publishedAnnouncement = announcements.find((announcement) => announcement.status === "已发布");
  const statusOrder: Record<AnnouncementStatus, number> = { 已发布: 0, 待发布: 1, 草稿: 2, 已下线: 3 };
  const filteredAnnouncements = useMemo(() => announcements
    .filter((announcement) => !contentQuery.trim() || announcement.content.includes(contentQuery.trim()))
    .filter((announcement) => statusFilter === "全部" || announcement.status === statusFilter)
    .sort((a, b) => statusOrder[a.status] - statusOrder[b.status] || b.updatedAt.localeCompare(a.updatedAt)), [announcements, contentQuery, statusFilter]);

  const nextAnnouncementId = () => {
    const nextNumber = announcements.reduce((maximum, announcement) => {
      const value = Number(announcement.id.split("-").at(-1));
      return Number.isFinite(value) ? Math.max(maximum, value) : maximum;
    }, 0) + 1;
    const now = new Date();
    return `ANN-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}-${String(nextNumber).padStart(3, "0")}`;
  };

  const persistAnnouncement = (values: AnnouncementEditorValues, status: "草稿" | "待发布" | "已发布") => {
    const now = formatAnnouncementDate();
    const existing = editorAnnouncement ?? null;
    const isPublishedRevision = existing?.status === "已发布";
    const id = isPublishedRevision ? nextAnnouncementId() : existing?.id ?? nextAnnouncementId();
    const nextRecord: Announcement = {
      id,
      content: values.content,
      linkType: values.linkType,
      linkUrl: values.linkType === "无跳转" ? "" : values.linkUrl,
      publishAt: status === "已发布" ? (existing?.status === "已发布" ? existing.publishAt : now) : status === "待发布" ? values.publishAt : "",
      offlineAt: status === "草稿" ? "" : values.offlineAt,
      status,
      updatedAt: now,
    };
    setAnnouncements((list) => {
      const withCurrentDownlined = status === "已发布"
        ? list.map((item) => item.status === "已发布" && item.id !== id ? { ...item, status: "已下线" as const, offlineAt: now, updatedAt: now } : item)
        : list;
      const exists = withCurrentDownlined.some((item) => item.id === id);
      return exists ? withCurrentDownlined.map((item) => item.id === id ? nextRecord : item) : [nextRecord, ...withCurrentDownlined];
    });
    setEditorAnnouncement(undefined);
    if (status === "草稿") notify("草稿保存成功");
    else if (status === "待发布") notify("定时发布设置成功");
    else notify(existing?.status === "已发布" ? "公告更新成功，首页展示已同步" : "发布成功，首页公告已同步更新");
  };

  const publishNow = (id: string) => {
    const now = formatAnnouncementDate();
    setAnnouncements((list) => list.map((announcement) => {
      if (announcement.id === id) {
        const futureOfflineAt = announcement.offlineAt && new Date(announcement.offlineAt.replace(" ", "T")).getTime() > Date.now() ? announcement.offlineAt : "";
        return { ...announcement, status: "已发布" as const, publishAt: now, offlineAt: futureOfflineAt, updatedAt: now };
      }
      if (announcement.status === "已发布") return { ...announcement, status: "已下线" as const, offlineAt: now, updatedAt: now };
      return announcement;
    }));
    notify("发布成功，首页公告已同步更新");
  };

  const updateStatus = (id: string, status: AnnouncementStatus) => {
    const now = formatAnnouncementDate();
    setAnnouncements((list) => list.map((announcement) => announcement.id === id ? {
      ...announcement,
      status,
      publishAt: status === "草稿" ? "" : announcement.publishAt,
      offlineAt: status === "已下线" ? now : status === "草稿" ? "" : announcement.offlineAt,
      updatedAt: now,
    } : announcement));
    notify(status === "草稿" ? "已取消定时发布并转为草稿" : "公告已下线");
  };

  return (
    <section className="card page-card announcement-management-page">
      <section className="announcement-live-panel" aria-labelledby="current-announcement-title">
        <div className="announcement-live-heading">
          <div><strong id="current-announcement-title">当前首页公告</strong><span>门户首页导航下方仅展示一条已发布公告 · 当前在线原型数据保存在本浏览器</span></div>
          {publishedAnnouncement ? <StatusTag value="已发布" tone="success" /> : <StatusTag value="未发布" tone="neutral" />}
        </div>
        <AnnouncementStrip announcement={publishedAnnouncement} />
        {publishedAnnouncement && <div className="announcement-live-meta"><span>发布时间 {publishedAnnouncement.publishAt}</span><span>{publishedAnnouncement.offlineAt ? `计划下线 ${publishedAnnouncement.offlineAt}` : "不自动下线"}</span></div>}
      </section>
      <div className="filters announcement-filters">
        <FilterInput label="公告内容" placeholder="请输入" searchable value={contentQuery} onChange={setContentQuery} />
        <FilterSelect label="发布状态" options={["全部", "草稿", "待发布", "已发布", "已下线"]} value={statusFilter} onChange={setStatusFilter} />
      </div>
      <div className="table-toolbar">
        <div><Button variant="primary" icon={Plus} onClick={() => setEditorAnnouncement(null)}>新建公告</Button></div>
      </div>
      <DataTable
        columns={["公告内容", "跳转方式", "发布时间", "下线时间", "状态"]}
        rows={filteredAnnouncements.map((announcement) => ({
          公告ID: announcement.id,
          公告内容: announcement.content,
          跳转方式: announcement.linkType,
          发布时间: announcement.publishAt || "—",
          下线时间: announcement.offlineAt || "—",
          状态: <StatusTag value={announcement.status} tone={announcementStatusTones[announcement.status]} />,
          原始状态: announcement.status,
        }))}
        rowKey={(row) => String(row.公告ID)}
        actions={(row) => {
          const id = String(row.公告ID);
          const announcement = announcements.find((item) => item.id === id);
          const status = row.原始状态 as AnnouncementStatus;
          return (
            <ActionLinks
              actions={["预览", "编辑", status === "待发布" ? "取消定时" : status === "已发布" ? "下线" : "发布", status !== "已发布" && status !== "待发布" && "删除"]}
              onAction={(action) => {
                if (!announcement) return;
                if (action === "预览") setPreviewAnnouncement(announcement);
                if (action === "编辑") setEditorAnnouncement(announcement);
                if (action === "发布") publishNow(id);
                if (action === "下线") updateStatus(id, "已下线");
                if (action === "取消定时") updateStatus(id, "草稿");
                if (action === "删除") openModal("delete", {
                  payload: {
                    title: "确认删除公告",
                    message: "确认删除这条公告？",
                    description: "此操作无法撤销，删除后公告数据将无法恢复。",
                    successMessage: "公告删除成功",
                  },
                  onConfirm: () => setAnnouncements((list) => list.filter((item) => item.id !== id)),
                });
              }}
            />
          );
        }}
      />
      {editorAnnouncement !== undefined && (
        <AnnouncementEditorModal
          announcement={editorAnnouncement}
          hasAnotherPublished={Boolean(publishedAnnouncement && publishedAnnouncement.id !== editorAnnouncement?.id)}
          close={() => setEditorAnnouncement(undefined)}
          onSave={persistAnnouncement}
        />
      )}
      {previewAnnouncement && <AnnouncementPreviewModal announcement={previewAnnouncement} close={() => setPreviewAnnouncement(null)} />}
    </section>
  );
}

type WorkflowNodeType = "start" | "process" | "cc" | "end";

type WorkflowCondition = {
  id: string;
  field: string;
  operator: "包含" | "等于";
  value: string;
};

type WorkflowNode = {
  id: string;
  type: WorkflowNodeType;
  节点名称: string;
  负责人: string[];
  节点提交条件: string;
  多位负责人规则: "所有负责人提交后进入下一节点" | "任一负责人提交后进入下一节点";
  找不到负责人处理: "自动提交当前待办" | "将待办转给指定人员进行处理";
  流转条件: WorkflowCondition[];
};

const workflowNodeLabels: Record<WorkflowNodeType, string> = {
  start: "流程发起节点",
  process: "流程节点",
  cc: "抄送节点",
  end: "流程结束节点",
};

function createWorkflowNodes(workflowId: string): WorkflowNode[] {
  const createNode = (type: WorkflowNodeType, suffix: string): WorkflowNode => ({
    id: `${workflowId}-${suffix}`,
    type,
    节点名称: workflowNodeLabels[type],
    负责人: [],
    节点提交条件: "",
    多位负责人规则: "所有负责人提交后进入下一节点",
    找不到负责人处理: "自动提交当前待办",
    流转条件: type === "process" ? [{ id: `${workflowId}-${suffix}-condition`, field: "", operator: "包含", value: "" }] : [],
  });
  return [createNode("start", "start"), createNode("process", "process"), createNode("end", "end")];
}

function WorkflowCenter({ openModal, notify }: { openModal: OpenModal; notify: Notify }) {
  const [view, setView] = useState<"management" | "designer">("management");
  const [workflowList, setWorkflowList] = useState(initialWorkflowRows);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);
  const [nodesByWorkflow, setNodesByWorkflow] = useState<Record<string, WorkflowNode[]>>(() => Object.fromEntries(initialWorkflowRows.map((workflow) => [workflow.id, createWorkflowNodes(workflow.id)])));
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [canvasZoom, setCanvasZoom] = useState(100);
  const [nodeMenuOpen, setNodeMenuOpen] = useState(false);
  const [propertyCollapsed, setPropertyCollapsed] = useState(false);
  const selectedWorkflow = workflowList.find((workflow) => workflow.id === selectedWorkflowId) ?? null;
  const currentNodes = selectedWorkflowId ? nodesByWorkflow[selectedWorkflowId] ?? [] : [];
  const selectedNode = currentNodes.find((node) => node.id === selectedNodeId) ?? currentNodes[0] ?? null;

  const openDesigner = (workflowId: string) => {
    const nodes = nodesByWorkflow[workflowId] ?? createWorkflowNodes(workflowId);
    if (!nodesByWorkflow[workflowId]) setNodesByWorkflow((current) => ({ ...current, [workflowId]: nodes }));
    setSelectedWorkflowId(workflowId);
    setSelectedNodeId(nodes[0]?.id ?? null);
    setCanvasZoom(100);
    setNodeMenuOpen(false);
    setPropertyCollapsed(false);
    setView("designer");
  };

  const updateWorkflowStatus = (workflowId: string, 发布状态: string) => {
    setWorkflowList((list) => list.map((workflow) => (workflow.id === workflowId ? { ...workflow, 发布状态 } : workflow)));
  };

  const createWorkflowModel = () => {
    const id = `workflow-${Date.now()}`;
    const nextNumber = workflowList.reduce((maximum, item) => {
      const current = Number(item.流程ID.split("-").at(-1));
      return Number.isFinite(current) ? Math.max(maximum, current) : maximum;
    }, 0) + 1;
    const nextIndex = String(nextNumber).padStart(3, "0");
    const workflow = {
      id,
      流程ID: `FLOW-202607-${nextIndex}`,
      流程名称: "未命名流程",
      发布时间: "-",
      发布状态: "未发布",
    };
    const nodes = createWorkflowNodes(id);
    setWorkflowList((list) => [...list, workflow]);
    setNodesByWorkflow((current) => ({ ...current, [id]: nodes }));
    setSelectedWorkflowId(id);
    setSelectedNodeId(nodes[0]?.id ?? null);
    setCanvasZoom(100);
    setNodeMenuOpen(false);
    setPropertyCollapsed(false);
    setView("designer");
  };

  const updateNode = (nodeId: string, patch: Partial<WorkflowNode>) => {
    if (!selectedWorkflowId) return;
    setNodesByWorkflow((current) => ({
      ...current,
      [selectedWorkflowId]: (current[selectedWorkflowId] ?? []).map((node) => (node.id === nodeId ? { ...node, ...patch } : node)),
    }));
  };

  const addNode = (type: "process" | "cc") => {
    if (!selectedWorkflowId) return;
    const nodeId = `${selectedWorkflowId}-${type}-${Date.now()}`;
    const nextNode: WorkflowNode = {
      id: nodeId,
      type,
      节点名称: workflowNodeLabels[type],
      负责人: [],
      节点提交条件: "",
      多位负责人规则: "所有负责人提交后进入下一节点",
      找不到负责人处理: "自动提交当前待办",
      流转条件: type === "process" ? [{ id: `${nodeId}-condition`, field: "", operator: "包含", value: "" }] : [],
    };
    setNodesByWorkflow((current) => {
      const nodes = current[selectedWorkflowId] ?? [];
      const endIndex = Math.max(0, nodes.findIndex((node) => node.type === "end"));
      const next = [...nodes];
      next.splice(endIndex, 0, nextNode);
      return { ...current, [selectedWorkflowId]: next };
    });
    setSelectedNodeId(nextNode.id);
    setNodeMenuOpen(false);
    setPropertyCollapsed(false);
  };

  const updateCondition = (conditionId: string, patch: Partial<WorkflowCondition>) => {
    if (!selectedNode) return;
    updateNode(selectedNode.id, { 流转条件: selectedNode.流转条件.map((condition) => (condition.id === conditionId ? { ...condition, ...patch } : condition)) });
  };

  const addCondition = () => {
    if (!selectedNode) return;
    updateNode(selectedNode.id, { 流转条件: [...selectedNode.流转条件, { id: `${selectedNode.id}-${Date.now()}`, field: "", operator: "包含", value: "" }] });
  };

  const removeCondition = (conditionId: string) => {
    if (!selectedNode || selectedNode.流转条件.length <= 1) return;
    updateNode(selectedNode.id, { 流转条件: selectedNode.流转条件.filter((condition) => condition.id !== conditionId) });
  };

  if (view === "management") {
    return (
      <section className="card page-card workflow-management">
        <div className="workflow-management-label">流程设计器 · 流程建模 · 流程控制 · 流程发布 · 流程实例管理</div>
        <div className="table-toolbar workflow-toolbar">
          <div><Button variant="primary" icon={Plus} onClick={createWorkflowModel}>流程建模</Button></div>
        </div>
        <DataTable
          columns={["流程ID", "流程名称", "发布时间", "发布状态"]}
          fullTextColumns={["流程ID"]}
          rows={workflowList.map((workflow) => ({ ...workflow, 原始发布状态: workflow.发布状态, 发布状态: <StatusTag value={workflow.发布状态} /> }))}
          selectable
          rowKey={(row) => String(row.id)}
          activeRowKey={selectedWorkflowId}
          onRowClick={(row) => openDesigner(String(row.id))}
          actions={(row) => (
            <ActionLinks
              actions={["编辑", row.原始发布状态 === "已发布" ? "下架" : "发布", "删除"]}
              onAction={(action) => {
                const workflowId = String(row.id);
                if (action === "编辑") openDesigner(workflowId);
                if (action === "发布" || action === "下架") {
                  updateWorkflowStatus(workflowId, action === "发布" ? "已发布" : "未发布");
                  notify(action === "发布" ? "发布成功" : "下架成功");
                }
                if (action === "删除") {
                  openModal("delete", {
                    payload: { message: `确认删除${row.流程名称}？` },
                    onConfirm: () => setWorkflowList((list) => list.filter((workflow) => workflow.id !== workflowId)),
                  });
                }
              }}
            />
          )}
        />
      </section>
    );
  }

  return (
    <section className={`process-designer workflow-designer ${propertyCollapsed ? "is-property-collapsed" : ""}`}>
      <header className="process-designer-header">
        <div className="workflow-designer-back">
          <Button variant="text" icon={ChevronLeft} onClick={() => setView("management")}>返回</Button>
        </div>
        <strong className="workflow-designer-heading">流程设计器{selectedWorkflow ? ` · ${selectedWorkflow.流程名称}` : ""}</strong>
        <div className="workflow-designer-publish">
          <Button onClick={() => notify("保存成功")}>保存</Button>
          <Button variant="primary" onClick={() => {
            if (!selectedWorkflow) return;
            updateWorkflowStatus(selectedWorkflow.id, "已发布");
            notify("保存并发布成功");
          }}>保存并发布</Button>
        </div>
      </header>
      <div className="process-designer-main">
        <section className="designer-canvas" aria-label="流程设计器">
          <div className="designer-canvas-scroll">
            <div className="flow-strip" style={{ transform: `scale(${canvasZoom / 100})` }}>
              {currentNodes.map((node, index) => (
                <div className="flow-node-group" key={node.id}>
                  <button type="button" className={`workflow-canvas-node ${node.type} ${selectedNode?.id === node.id ? "active" : ""}`} onClick={() => { setSelectedNodeId(node.id); setPropertyCollapsed(false); }}>
                    <span className="workflow-node-card-head">
                      <span className={`workflow-node-card-icon ${node.type}`}>{node.type === "process" ? <CircleUserRound size={16} /> : node.type === "cc" ? <FileText size={16} /> : <i />}</span>
                      <strong>{node.节点名称}</strong>
                      <MoreHorizontal aria-hidden="true" size={16} />
                    </span>
                    <span className="workflow-node-card-meta">
                      {node.type === "start" || node.type === "end"
                        ? "系统默认，不可删除"
                        : `负责人：${node.负责人.length ? node.负责人.join("、") : "待配置"}`}
                    </span>
                  </button>
                  {index < currentNodes.length - 1 && <i className="flow-connector" />}
                </div>
              ))}
            </div>
          </div>
          <div className="canvas-node-toolbar" onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setNodeMenuOpen(false);
          }}>
            <div className="canvas-zoom-controls" aria-label="画布比例">
              <button type="button" aria-label="缩小画布" disabled={canvasZoom <= 60} onClick={() => setCanvasZoom((value) => Math.max(60, value - 10))}><Minus size={16} /></button>
              <span aria-live="polite">{canvasZoom}%</span>
              <button type="button" aria-label="放大画布" disabled={canvasZoom >= 140} onClick={() => setCanvasZoom((value) => Math.min(140, value + 10))}><Plus size={16} /></button>
            </div>
            <span className="toolbar-divider" aria-hidden="true" />
            <div className="canvas-add-node">
              <button type="button" className="canvas-add-node-trigger" aria-haspopup="menu" aria-expanded={nodeMenuOpen} onClick={() => setNodeMenuOpen((open) => !open)}><Plus size={16} />添加节点<ChevronDown size={14} /></button>
              {nodeMenuOpen && (
                <div className="canvas-node-menu" role="menu" aria-label="选择节点类型">
                  <button type="button" role="menuitem" onClick={() => addNode("process")}><CircleUserRound size={16} /><span><b>流程节点</b><small>配置负责人及流转条件</small></span></button>
                  <button type="button" role="menuitem" onClick={() => addNode("cc")}><FileText size={16} /><span><b>抄送节点</b><small>将流程信息抄送给负责人</small></span></button>
                </div>
              )}
            </div>
          </div>
        </section>

        <aside className={`node-property ${propertyCollapsed ? "is-collapsed" : ""}`}>
          <div className="node-property-title">
            <span className="node-property-title-copy">
              <span>{propertyCollapsed ? "节点配置" : "节点配置表单"}</span>
              {!propertyCollapsed && <em>（流程控制）</em>}
            </span>
            <button type="button" aria-label={propertyCollapsed ? "展开节点配置" : "收起节点配置"} onClick={() => setPropertyCollapsed((collapsed) => !collapsed)}>{propertyCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}</button>
          </div>
          {!propertyCollapsed && selectedNode && (
            <div className="node-property-body">
              <label className="designer-field"><span>节点名称</span><input type="text" value={selectedNode.节点名称} onChange={(event) => updateNode(selectedNode.id, { 节点名称: event.target.value })} /></label>
              <div className="designer-field"><span>负责人</span><FormMultiSelect ariaLabel="负责人" options={roleOptions} value={selectedNode.负责人} onChange={(负责人) => updateNode(selectedNode.id, { 负责人 })} /></div>
              <label className="designer-field"><span>节点提交条件</span><input type="text" value={selectedNode.节点提交条件} onChange={(event) => updateNode(selectedNode.id, { 节点提交条件: event.target.value })} /></label>
              <div className="designer-field">
                <span>有多位负责人时</span>
                <div className="radio-stack">
                  {(["所有负责人提交后进入下一节点", "任一负责人提交后进入下一节点"] as const).map((rule) => (
                    <label key={rule}><input type="radio" name={`multi-user-${selectedNode.id}`} checked={selectedNode.多位负责人规则 === rule} onChange={() => updateNode(selectedNode.id, { 多位负责人规则: rule })} />{rule}</label>
                  ))}
                </div>
              </div>
              <div className="designer-field">
                <span>找不到节点负责人时</span>
                <FormSelect ariaLabel="找不到节点负责人时" options={["自动提交当前待办", "将待办转给指定人员进行处理"]} value={selectedNode.找不到负责人处理} onChange={(找不到负责人处理) => updateNode(selectedNode.id, { 找不到负责人处理: 找不到负责人处理 as WorkflowNode["找不到负责人处理"] })} />
              </div>
              <div className="condition-panel">
                <h3>按条件流转</h3>
                {selectedNode.流转条件.map((condition) => (
                  <div className="condition-row" key={condition.id}>
                    <input type="text" aria-label="流转条件字段" placeholder="字段名称" value={condition.field} onChange={(event) => updateCondition(condition.id, { field: event.target.value })} />
                    <FormSelect ariaLabel="流转条件运算符" options={["包含", "等于"]} value={condition.operator} onChange={(operator) => updateCondition(condition.id, { operator: operator as WorkflowCondition["operator"] })} />
                    <input type="text" aria-label="流转条件值" placeholder="条件值" value={condition.value} onChange={(event) => updateCondition(condition.id, { value: event.target.value })} />
                    <button type="button" className="delete-condition" onClick={() => removeCondition(condition.id)} aria-label="删除"><Trash2 size={16} /></button>
                  </div>
                ))}
                <button type="button" className="add-condition" onClick={addCondition}><Plus size={14} />添加流转条件</button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

const formComponentTypes = ["单行文本", "多行文本", "数字字段", "日期时间", "单选按钮组", "复选框组", "下拉框"] as const;
type FormComponentType = (typeof formComponentTypes)[number];

type FormComponentRules = {
  最大长度: string;
  最小值: string;
  最大值: string;
  最小日期: string;
  最大日期: string;
  可选项: string[];
  多选: boolean;
};

type FormDesignerComponent = {
  id: string;
  类型: FormComponentType;
  字段名称: string;
  规则: FormComponentRules;
};

type FormDefinition = {
  id: string;
  表单ID: string;
  表单名称: string;
  最近修改时间: string;
  组件: FormDesignerComponent[];
};

function createFormDesignerComponent(类型: FormComponentType, index: number, id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`): FormDesignerComponent {
  return {
    id,
    类型,
    字段名称: `${类型}${index}`,
    规则: {
      最大长度: 类型 === "多行文本" ? "500" : "100",
      最小值: "0",
      最大值: "100",
      最小日期: "",
      最大日期: "",
      可选项: ["选项一", "选项二"],
      多选: false,
    },
  };
}

const initialFormDefinitions: FormDefinition[] = [
  {
    id: "form-report",
    表单ID: "FORM-202607-001",
    表单名称: "报告审核表单",
    最近修改时间: "2026-07-10 14:30",
    组件: [
      createFormDesignerComponent("单行文本", 1, "form-report-title"),
      createFormDesignerComponent("下拉框", 2, "form-report-type"),
      createFormDesignerComponent("多行文本", 3, "form-report-summary"),
    ],
  },
  {
    id: "form-scholar",
    表单ID: "FORM-202607-002",
    表单名称: "认证学者审核表单",
    最近修改时间: "2026-07-09 10:15",
    组件: [
      createFormDesignerComponent("单行文本", 1, "form-scholar-name"),
      createFormDesignerComponent("日期时间", 2, "form-scholar-date"),
      createFormDesignerComponent("单选按钮组", 3, "form-scholar-radio"),
    ],
  },
];

const formComponentIcons: Record<FormComponentType, LucideIcon> = {
  单行文本: FileText,
  多行文本: FileText,
  数字字段: BarChart3,
  日期时间: CalendarDays,
  单选按钮组: CheckCircle2,
  复选框组: ClipboardCheck,
  下拉框: ChevronDown,
};

function FormComponentPreview({ component }: { component: FormDesignerComponent }) {
  const options = component.规则.可选项.length > 0 ? component.规则.可选项 : ["选项"];
  return (
    <div className="form-component-preview">
      <label>{component.字段名称}</label>
      {component.类型 === "单行文本" && <input type="text" placeholder="请输入" readOnly />}
      {component.类型 === "多行文本" && <textarea placeholder="请输入" readOnly />}
      {component.类型 === "数字字段" && <input type="number" placeholder="请输入" readOnly />}
      {component.类型 === "日期时间" && <input type="datetime-local" readOnly />}
      {(component.类型 === "单选按钮组" || component.类型 === "复选框组") && (
        <div className="form-preview-options">
          {options.map((option, index) => (
            <label key={`${option}-${index}`}>
              <input
                type={component.类型 === "单选按钮组" ? "radio" : "checkbox"}
                name={`${component.id}-preview-options`}
                aria-disabled="true"
                tabIndex={-1}
                readOnly
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      )}
      {component.类型 === "下拉框" && <select disabled><option>{component.规则.多选 ? "请选择，可多选" : "请选择"}</option></select>}
    </div>
  );
}

function FormOptionEditor({ options, onChange }: { options: string[]; onChange: (options: string[]) => void }) {
  return (
    <div className="form-option-editor">
      {options.map((option, index) => (
        <div className="form-option-row" key={`${index}-${option}`}>
          <input aria-label={`选项 ${index + 1}`} value={option} onChange={(event) => onChange(options.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} />
          <button type="button" aria-label={`删除选项 ${index + 1}`} disabled={options.length <= 1} onClick={() => onChange(options.filter((_, itemIndex) => itemIndex !== index))}><Trash2 size={15} /></button>
        </div>
      ))}
      <button type="button" className="form-add-option" onClick={() => onChange([...options, `选项${options.length + 1}`])}><Plus size={14} />添加选项</button>
    </div>
  );
}

function FormRuleEditor({ component, onChange }: { component: FormDesignerComponent; onChange: (patch: Partial<FormComponentRules>) => void }) {
  const rules = component.规则;
  if (component.类型 === "单行文本" || component.类型 === "多行文本") {
    return <label className="designer-field"><span>最大长度</span><input type="number" min="1" value={rules.最大长度} onChange={(event) => onChange({ 最大长度: event.target.value })} /></label>;
  }
  if (component.类型 === "数字字段") {
    return (
      <div className="form-rule-pair">
        <label className="designer-field"><span>最小值</span><input type="number" value={rules.最小值} onChange={(event) => onChange({ 最小值: event.target.value })} /></label>
        <label className="designer-field"><span>最大值</span><input type="number" value={rules.最大值} onChange={(event) => onChange({ 最大值: event.target.value })} /></label>
      </div>
    );
  }
  if (component.类型 === "日期时间") {
    return (
      <div className="form-rule-pair">
        <label className="designer-field"><span>最小日期</span><input type="date" value={rules.最小日期} onChange={(event) => onChange({ 最小日期: event.target.value })} /></label>
        <label className="designer-field"><span>最大日期</span><input type="date" value={rules.最大日期} onChange={(event) => onChange({ 最大日期: event.target.value })} /></label>
      </div>
    );
  }
  return (
    <>
      <div className="designer-field"><span>可选项</span><FormOptionEditor options={rules.可选项} onChange={(可选项) => onChange({ 可选项 })} /></div>
      {component.类型 === "下拉框" && (
        <div className="form-switch-setting">
          <span>允许多选</span>
          <button
            type="button"
            role="switch"
            aria-label="允许多选"
            aria-checked={rules.多选}
            className={`form-switch ${rules.多选 ? "checked" : ""}`}
            onClick={() => onChange({ 多选: !rules.多选 })}
          ><span /></button>
        </div>
      )}
    </>
  );
}

function FormPrintTable({ form }: { form: FormDefinition }) {
  return (
    <div className="form-print-table-wrap">
      <table className="form-print-table">
        <thead><tr>{form.组件.map((component) => <th key={component.id}>{component.字段名称}</th>)}</tr></thead>
        <tbody><tr>{form.组件.map((component) => <td key={component.id}>—</td>)}</tr></tbody>
      </table>
    </div>
  );
}

function FormCenter({ openModal, notify, onWorkspaceChange }: { openModal: OpenModal; notify: Notify; onWorkspaceChange: (open: boolean) => void }) {
  const [view, setView] = useState<"management" | "workspace">("management");
  const [forms, setForms] = useState<FormDefinition[]>(initialFormDefinitions);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const selectedForm = forms.find((form) => form.id === selectedFormId) ?? null;
  const selectedComponent = selectedForm?.组件.find((component) => component.id === selectedComponentId) ?? selectedForm?.组件[0] ?? null;

  useEffect(() => {
    onWorkspaceChange(view === "workspace");
  }, [onWorkspaceChange, view]);

  const updateSelectedForm = (updater: (form: FormDefinition) => FormDefinition) => {
    if (!selectedFormId) return;
    setForms((list) => list.map((form) => form.id === selectedFormId ? updater(form) : form));
  };

  const openWorkspace = (formId: string, showPreview = false) => {
    const form = forms.find((item) => item.id === formId);
    setSelectedFormId(formId);
    setSelectedComponentId(form?.组件[0]?.id ?? null);
    setPreviewOpen(showPreview);
    setView("workspace");
  };

  const createForm = () => {
    const nextNumber = forms.reduce((maximum, form) => {
      const current = Number(form.表单ID.split("-").at(-1));
      return Number.isFinite(current) ? Math.max(maximum, current) : maximum;
    }, 0) + 1;
    const id = `form-${Date.now()}`;
    const nextForm: FormDefinition = {
      id,
      表单ID: `FORM-202607-${String(nextNumber).padStart(3, "0")}`,
      表单名称: "未命名表单",
      最近修改时间: "2026-07-13 14:00",
      组件: [],
    };
    setForms((list) => [...list, nextForm]);
    setSelectedFormId(id);
    setSelectedComponentId(null);
    setPreviewOpen(false);
    setView("workspace");
  };

  const addComponent = (类型: FormComponentType) => {
    if (!selectedForm) return;
    const component = createFormDesignerComponent(类型, selectedForm.组件.length + 1);
    updateSelectedForm((form) => ({ ...form, 组件: [...form.组件, component] }));
    setSelectedComponentId(component.id);
    notify(`已添加${类型}`);
  };

  const updateComponent = (componentId: string, patch: Partial<FormDesignerComponent>) => {
    updateSelectedForm((form) => ({ ...form, 组件: form.组件.map((component) => component.id === componentId ? { ...component, ...patch } : component) }));
  };

  const updateComponentRules = (componentId: string, patch: Partial<FormComponentRules>) => {
    updateSelectedForm((form) => ({
      ...form,
      组件: form.组件.map((component) => component.id === componentId ? { ...component, 规则: { ...component.规则, ...patch } } : component),
    }));
  };

  const moveComponent = (componentId: string, direction: -1 | 1) => {
    updateSelectedForm((form) => {
      const index = form.组件.findIndex((component) => component.id === componentId);
      const targetIndex = index + direction;
      if (index < 0 || targetIndex < 0 || targetIndex >= form.组件.length) return form;
      const components = [...form.组件];
      [components[index], components[targetIndex]] = [components[targetIndex], components[index]];
      return { ...form, 组件: components };
    });
  };

  const removeComponent = (componentId: string) => {
    if (!selectedForm) return;
    const remaining = selectedForm.组件.filter((component) => component.id !== componentId);
    updateSelectedForm((form) => ({ ...form, 组件: remaining }));
    setSelectedComponentId(remaining[0]?.id ?? null);
    notify("组件已删除");
  };

  const saveForm = () => {
    updateSelectedForm((form) => ({ ...form, 最近修改时间: "2026-07-13 14:00" }));
    notify("保存成功");
  };

  const printForm = () => {
    if (!selectedForm || selectedForm.组件.length === 0) {
    notify("请先添加表单组件", "warning");
      return;
    }
    notify("正在打开打印预览");
    window.print();
  };

  if (view === "management") {
    return (
      <section className="card page-card form-management">
        <div className="workflow-management-label">表单设计器 · 表单规则 · 表单打印</div>
        <div className="table-toolbar workflow-toolbar"><div><Button variant="primary" icon={Plus} onClick={createForm}>表单设计器</Button></div></div>
        <DataTable
          columns={["表单ID", "表单名称", "组件数量", "最近修改时间"]}
          fullTextColumns={["表单ID"]}
          rows={forms.map((form) => ({ id: form.id, 表单ID: form.表单ID, 表单名称: form.表单名称, 组件数量: form.组件.length, 最近修改时间: form.最近修改时间 }))}
          selectable
          rowKey={(row) => String(row.id)}
          onRowClick={(row) => openWorkspace(String(row.id))}
          actions={(row) => (
            <ActionLinks
              actions={["表单设计器", "表单打印", "删除"]}
              onAction={(action) => {
                const formId = String(row.id);
                if (action === "表单设计器") openWorkspace(formId);
                if (action === "表单打印") openWorkspace(formId, true);
                if (action === "删除") openModal("delete", {
                  payload: { message: `确认删除${row.表单名称}？` },
                  onConfirm: () => setForms((list) => list.filter((form) => form.id !== formId)),
                });
              }}
            />
          )}
        />
      </section>
    );
  }

  if (!selectedForm) return null;

  return (
    <section className="form-workspace">
      <header className="form-workspace-header">
        <div className="form-workspace-identity">
          <Button variant="text" icon={ChevronLeft} onClick={() => { setPreviewOpen(false); setView("management"); }}>返回</Button>
          <label><span>表单名称</span><input aria-label="表单名称" value={selectedForm.表单名称} onChange={(event) => updateSelectedForm((form) => ({ ...form, 表单名称: event.target.value }))} /></label>
        </div>
        <div className="form-workspace-actions">
          <Button icon={Eye} onClick={() => setPreviewOpen(true)}>预览</Button>
          <Button icon={Printer} onClick={printForm}>表单打印</Button>
          <Button variant="primary" icon={Save} onClick={saveForm}>保存表单</Button>
        </div>
      </header>

      <div className="form-designer-layout">
          <aside className="form-component-palette">
            <div className="form-panel-title">组件库</div>
            <div className="form-component-list">
              {formComponentTypes.map((type) => {
                const Icon = formComponentIcons[type];
                return <button type="button" key={type} onClick={() => addComponent(type)}><Icon size={16} /><span>{type}</span><Plus size={14} /></button>;
              })}
            </div>
          </aside>

          <section className="form-designer-canvas" aria-label="表单设计画布">
            {selectedForm.组件.length === 0 ? (
              <div className="form-empty-state"><FileText size={34} /><b>暂无表单组件</b><span>从左侧组件库添加组件</span></div>
            ) : (
              <div className="form-canvas-fields">
                {selectedForm.组件.map((component, index) => (
                  <article className={`form-canvas-field ${selectedComponent?.id === component.id ? "active" : ""}`} key={component.id} onClick={() => setSelectedComponentId(component.id)}>
                    <GripVertical size={16} aria-hidden="true" />
                    <FormComponentPreview component={component} />
                    <div className="form-field-actions">
                      <button type="button" aria-label="上移组件" disabled={index === 0} onClick={(event) => { event.stopPropagation(); moveComponent(component.id, -1); }}><ArrowUp size={15} /></button>
                      <button type="button" aria-label="下移组件" disabled={index === selectedForm.组件.length - 1} onClick={(event) => { event.stopPropagation(); moveComponent(component.id, 1); }}><ArrowDown size={15} /></button>
                      <button type="button" aria-label="删除组件" onClick={(event) => { event.stopPropagation(); removeComponent(component.id); }}><Trash2 size={15} /></button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <aside className="form-component-property">
            <div className="form-panel-title">字段配置</div>
            {selectedComponent ? (
              <div className="form-property-body">
                <label className="designer-field"><span>字段名称</span><input value={selectedComponent.字段名称} onChange={(event) => updateComponent(selectedComponent.id, { 字段名称: event.target.value })} /></label>
                <div className="form-component-type"><span>组件类型</span><b>{selectedComponent.类型}</b></div>
                <section className="form-property-rules" aria-label="表单规则">
                  <div className="form-property-section-title">表单规则</div>
                  <FormRuleEditor component={selectedComponent} onChange={(patch) => updateComponentRules(selectedComponent.id, patch)} />
                </section>
              </div>
            ) : <div className="form-panel-empty">请选择或添加组件</div>}
          </aside>
      </div>

      {selectedForm.组件.length > 0 && <section className="form-print-panel form-print-source" aria-hidden="true"><FormPrintTable form={selectedForm} /></section>}

      {previewOpen && createPortal(
        <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setPreviewOpen(false)}>
          <section className="modal form-preview-modal" role="dialog" aria-modal="true" aria-labelledby="form-preview-title">
            <header className="modal-header"><div><h2 id="form-preview-title">表单预览</h2></div><button type="button" aria-label="关闭预览" onClick={() => setPreviewOpen(false)}><X size={20} /></button></header>
            <div className="form-preview-modal-body">
              {selectedForm.组件.length === 0
                ? <div className="form-empty-state"><Printer size={34} /><b>暂无可预览内容</b><span>请先在表单设计器中添加组件</span></div>
                : <FormPrintTable form={selectedForm} />}
            </div>
            <footer className="modal-footer"><Button onClick={() => setPreviewOpen(false)}>关闭</Button><Button variant="primary" icon={Printer} onClick={printForm}>表单打印</Button></footer>
          </section>
        </div>,
        document.body,
      )}
    </section>
  );
}

function AuditContent() {
  const [tab, setTab] = useState<"comments" | "scholars" | "reports">("comments");
  const [comments, setComments] = useState(commentRows);
  const [scholars, setScholars] = useState(scholarRows);
  const [reports, setReports] = useState(auditReportRows);
  const [selectedScholar, setSelectedScholar] = useState<(typeof scholarRows)[number] | null>(null);
  const [selectedScholarMaterial, setSelectedScholarMaterial] = useState<(typeof scholarRows)[number]["申请资料"][number] | null>(null);
  const [selectedReport, setSelectedReport] = useState<(typeof auditReportRows)[number] | null>(null);
  const [rejectingComment, setRejectingComment] = useState<(typeof commentRows)[number] | null>(null);
  const [rejectOpinion, setRejectOpinion] = useState("");
  return (
    <section className="card page-card audit-content-page">
      <div className="subtabs">
        <button className={tab === "comments" ? "active" : ""} onClick={() => setTab("comments")}>评论审核</button>
        <button className={tab === "scholars" ? "active" : ""} onClick={() => setTab("scholars")}>认证学者审核</button>
        <button className={tab === "reports" ? "active" : ""} onClick={() => setTab("reports")}>报告审核</button>
      </div>
      {tab === "comments" && (
        <DataTable
          columns={["用户名", "评论内容", "审核渠道", "提交时间", "状态"]}
          rows={comments.map((row) => ({ ...row, 原始评论内容: row.评论内容, 状态: <StatusTag value={row.状态} /> }))}
          selectable
          batchActions={(selectedRows, clearSelection) => (
            <button
              type="button"
              onClick={() => {
                const selectedComments = new Set(selectedRows.map((row) => String(row.原始评论内容)));
                setComments((list) => list.map((item) => (
                  selectedComments.has(item.评论内容) ? { ...item, 状态: "审核通过" } : item
                )));
                clearSelection();
              }}
            >
              批量通过
            </button>
          )}
          actions={(row) => (
            <ActionLinks
              actions={["审核通过", "审核驳回"]}
              disabledActions={String(comments.find((item) => item.评论内容 === String(row.原始评论内容))?.状态) === "待审核" ? [] : ["审核通过", "审核驳回"]}
              onAction={(action) => {
                const comment = comments.find((item) => item.评论内容 === String(row.原始评论内容));
                if (!comment) return;
                if (action === "审核驳回") {
                  setRejectingComment(comment);
                  setRejectOpinion("");
                  return;
                }
                setComments((list) => list.map((item) => (
                  item.评论内容 === comment.评论内容 ? { ...item, 状态: "审核通过" } : item
                )));
              }}
            />
          )}
        />
      )}
      {tab === "scholars" && (
        <DataTable
          columns={["学者姓名", "机构", "职称", "手机号", "申请资料", "状态"]}
          rows={scholars.map((scholar) => ({
            学者姓名: scholar.学者姓名,
            机构: scholar.机构,
            职称: scholar.职称,
            手机号: scholar.手机号,
            申请资料: `${scholar.申请资料.length} 项材料`,
            状态: <StatusTag value={scholar.状态} />,
          }))}
          actions={(row) => (
            <ActionLinks
              actions={["查看资料", "审核通过", "审核驳回"]}
              disabledActions={String(scholars.find((item) => item.学者姓名 === String(row.学者姓名))?.状态) === "待审核" ? [] : ["审核通过", "审核驳回"]}
              onAction={(action) => {
                const scholar = scholars.find((item) => item.学者姓名 === String(row.学者姓名));
                if (!scholar) return;
                if (action === "查看资料") {
                  setSelectedScholar(scholar);
                  setSelectedScholarMaterial(null);
                  return;
                }
                setScholars((list) => list.map((item) => (
                  item.学者姓名 === scholar.学者姓名
                    ? { ...item, 状态: action === "审核通过" ? "审核通过" : "审核驳回" }
                    : item
                )));
              }}
            />
          )}
        />
      )}
      {tab === "reports" && (
        <DataTable
          columns={["报告名称", "报告类型", "摘要预览", "提交人"]}
          rows={reports.map(({ 报告名称, 报告类型, 摘要预览, 提交人 }) => ({ 报告名称, 报告类型, 摘要预览, 提交人 }))}
          actions={(row) => (
            <ActionLinks
              actions={["查看详情", "审核通过", "审核驳回"]}
              onAction={(action) => {
                const report = reports.find((item) => item.报告名称 === String(row.报告名称));
                if (!report) return;
                if (action === "查看详情") {
                  setSelectedReport(report);
                  return;
                }
                setReports((list) => list.filter((item) => item.报告名称 !== report.报告名称));
              }}
            />
          )}
        />
      )}
      {selectedReport && createPortal(
        <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setSelectedReport(null)}>
          <div className="modal audit-report-detail-modal" role="dialog" aria-modal="true" aria-label="报告详情">
            <ModalHeader title="报告详情" close={() => setSelectedReport(null)} />
            <div className="modal-form">
              <div className="modal-form-body audit-report-detail">
                <dl>
                  <div><dt>报告名称</dt><dd>{selectedReport.报告名称}</dd></div>
                  <div><dt>报告类型</dt><dd>{selectedReport.报告类型}</dd></div>
                  <div className="audit-report-summary"><dt>摘要预览</dt><dd>{selectedReport.摘要预览}</dd></div>
                  <div><dt>提交人</dt><dd>{selectedReport.提交人}</dd></div>
                </dl>
                <article className="audit-report-manuscript">
                  <div className="audit-report-manuscript-heading">
                    <span>报告稿</span>
                    <h3>{selectedReport.报告名称}</h3>
                  </div>
                  {selectedReport.报告稿.map((section) => (
                    <section key={section.标题}>
                      <h4>{section.标题}</h4>
                      <p>{section.内容}</p>
                    </section>
                  ))}
                </article>
              </div>
              <div className="modal-footer"><Button onClick={() => setSelectedReport(null)}>关闭</Button></div>
            </div>
          </div>
        </div>,
        document.body,
      )}
      {selectedScholar && createPortal(
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target !== event.currentTarget) return;
            setSelectedScholar(null);
            setSelectedScholarMaterial(null);
          }}
        >
          <div className="modal scholar-material-modal" role="dialog" aria-modal="true" aria-label="学者认证资料">
            <ModalHeader
              title="学者认证资料"
              close={() => {
                setSelectedScholar(null);
                setSelectedScholarMaterial(null);
              }}
            />
            <div className="modal-form">
              <div className="modal-form-body scholar-material-detail">
                <dl className="scholar-material-profile">
                  <div><dt>学者姓名</dt><dd>{selectedScholar.学者姓名}</dd></div>
                  <div><dt>机构</dt><dd>{selectedScholar.机构}</dd></div>
                  <div><dt>职称</dt><dd>{selectedScholar.职称}</dd></div>
                  <div><dt>手机号</dt><dd>{selectedScholar.手机号}</dd></div>
                </dl>
                <section className="scholar-material-section">
                  <div className="scholar-material-section-title">
                    <h3>申请资料</h3>
                    <span>共 {selectedScholar.申请资料.length} 项</span>
                  </div>
                  <div className="scholar-material-list" role="list">
                    {selectedScholar.申请资料.map((material) => (
                      <div className="scholar-material-item" role="listitem" key={material.材料名称}>
                        <span className="scholar-material-icon"><FileText size={18} /></span>
                        <div className="scholar-material-file">
                          <strong>{material.材料名称}</strong>
                          <span>{material.文件名称}</span>
                        </div>
                        <time>{material.上传时间}</time>
                        <button type="button" className="table-detail-link" onClick={() => setSelectedScholarMaterial(material)}>查看</button>
                      </div>
                    ))}
                  </div>
                </section>
                {selectedScholarMaterial && (
                  <section className="scholar-material-preview" aria-label="资料预览">
                    <div>
                      <span>资料预览</span>
                      <strong>{selectedScholarMaterial.材料名称}</strong>
                    </div>
                    <div className="scholar-material-preview-page">
                      <FileText size={28} />
                      <b>{selectedScholarMaterial.文件名称}</b>
                      <span>已提交的认证资料文件</span>
                    </div>
                  </section>
                )}
              </div>
              <div className="modal-footer"><Button onClick={() => { setSelectedScholar(null); setSelectedScholarMaterial(null); }}>关闭</Button></div>
            </div>
          </div>
        </div>,
        document.body,
      )}
      {rejectingComment && createPortal(
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target !== event.currentTarget) return;
            setRejectingComment(null);
            setRejectOpinion("");
          }}
        >
          <div className="modal comment-reject-modal" role="dialog" aria-modal="true" aria-label="审核驳回">
            <ModalHeader
              title="审核驳回"
              close={() => {
                setRejectingComment(null);
                setRejectOpinion("");
              }}
            />
            <div className="modal-form">
              <div className="modal-form-body">
                <ModalAlert tone="warning">驳回后该评论将不予展示，请填写驳回意见。</ModalAlert>
                <FormField label="驳回意见" required>
                  <textarea value={rejectOpinion} placeholder="请输入驳回意见" onChange={(event) => setRejectOpinion(event.target.value)} />
                </FormField>
              </div>
              <div className="modal-footer">
                <Button onClick={() => { setRejectingComment(null); setRejectOpinion(""); }}>取消</Button>
                <Button
                  variant="primary"
                  disabled={!rejectOpinion.trim()}
                  onClick={() => {
                    const opinion = rejectOpinion.trim();
                    if (!opinion) return;
                    setComments((list) => list.map((item) => (
                      item.评论内容 === rejectingComment.评论内容
                        ? { ...item, 状态: "审核驳回", 驳回意见: opinion }
                        : item
                    )));
                    setRejectingComment(null);
                    setRejectOpinion("");
                  }}
                >
                  确定
                </Button>
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </section>
  );
}

function DashboardMetric({ label, value, trend, direction, iconSrc }: { label: string; value: string; trend: string; direction: "up" | "down"; iconSrc: string }) {
  const compactTrend = trend.match(/[+-]?\d+(?:\.\d+)?%/)?.[0] ?? trend;
  return (
    <article className="dashboard-metric">
      <div className="dashboard-metric-icon"><img src={iconSrc} alt="" aria-hidden="true" /></div>
      <div className="dashboard-metric-content">
        <span className="dashboard-metric-label">{label}</span>
        <div className="dashboard-metric-value-row">
          <strong>{value}</strong>
          <small className={direction} aria-label={trend} title={trend}>{direction === "up" ? <ArrowUp size={15} /> : <ArrowDown size={15} />}{compactTrend}</small>
        </div>
      </div>
    </article>
  );
}

function EventGrowthTrend({ data }: { data: DashboardData }) {
  const [hoveredPoint, setHoveredPoint] = useState<{ index: number; label: string; x: number } | null>(null);
  const width = 680;
  const height = 240;
  const chartTop = 20;
  const chartBottom = 42;
  const chartLeft = 20;
  const chartRight = 20;
  const makePoints = (key: "eventValue" | "userValue") => {
    const values = data.trend.map((point) => point[key]);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const span = Math.max(1, max - min);
    return data.trend.map((point, index) => ({
      ...point,
      index,
      x: chartLeft + (index / Math.max(1, data.trend.length - 1)) * (width - chartLeft - chartRight),
      y: chartTop + ((max - point[key]) / span) * (height - chartTop - chartBottom),
    }));
  };
  const eventPoints = makePoints("eventValue");
  const userPoints = makePoints("userValue");
  return (
    <section className="dashboard-panel trend-panel">
      <div className="dashboard-panel-heading">
        <h3>事件增长趋势</h3>
        <div className="chart-legend"><span className="event">事件增长趋势</span><span className="user">活跃用户数</span></div>
      </div>
      <div className="trend-chart">
        <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="事件增长趋势">
          {[0, 1, 2, 3].map((line) => {
            const y = chartTop + line * ((height - chartTop - chartBottom) / 3);
            return <line key={line} x1={chartLeft} x2={width - chartRight} y1={y} y2={y} className="trend-grid-line" />;
          })}
          <polyline className="trend-line event-line" points={eventPoints.map((point) => `${point.x},${point.y}`).join(" ")} />
          <polyline className="trend-line user-line" points={userPoints.map((point) => `${point.x},${point.y}`).join(" ")} />
          {eventPoints.map((point) => (
            <g key={`event-${point.label}`} className={`trend-point event-point ${hoveredPoint?.index === point.index ? "is-hovered" : ""}`}>
              <circle cx={point.x} cy={point.y} r="5" tabIndex={0} aria-label={`${point.label} 事件增长趋势 ${point.eventValue}`} onClick={() => setHoveredPoint({ index: point.index, label: point.label, x: point.x })} onFocus={() => setHoveredPoint({ index: point.index, label: point.label, x: point.x })} onBlur={() => setHoveredPoint(null)} onMouseEnter={() => setHoveredPoint({ index: point.index, label: point.label, x: point.x })} onMouseLeave={() => setHoveredPoint(null)}><title>{`${point.label} 事件 ${point.eventValue}`}</title></circle>
              <text x={point.x} y={height - 14} textAnchor="middle">{point.label}</text>
            </g>
          ))}
          {userPoints.map((point) => <circle key={`user-${point.label}`} className={`user-point ${hoveredPoint?.index === point.index ? "is-hovered" : ""}`} cx={point.x} cy={point.y} r="5" tabIndex={0} aria-label={`${point.label} 活跃用户数 ${point.userValue}`} onClick={() => setHoveredPoint({ index: point.index, label: point.label, x: point.x })} onFocus={() => setHoveredPoint({ index: point.index, label: point.label, x: point.x })} onBlur={() => setHoveredPoint(null)} onMouseEnter={() => setHoveredPoint({ index: point.index, label: point.label, x: point.x })} onMouseLeave={() => setHoveredPoint(null)}><title>{`${point.label} 活跃用户数 ${point.userValue}`}</title></circle>)}
          {hoveredPoint && (
            <g className="chart-hover-layer" pointerEvents="none">
              <line className="chart-hover-guide" x1={hoveredPoint.x} x2={hoveredPoint.x} y1={chartTop} y2={height - chartBottom} />
              <g transform={`translate(${Math.min(width - 172, Math.max(8, hoveredPoint.x - 80))},8)`}>
                <rect width="164" height="72" rx="4" />
                <text className="chart-hover-title" x="12" y="18">{hoveredPoint.label}</text>
                <circle className="chart-hover-marker event" cx="12" cy="38" r="3" />
                <text className="chart-hover-label" x="22" y="42">事件增长趋势</text>
                <text className="chart-hover-value" x="152" y="42" textAnchor="end">{data.trend[hoveredPoint.index].eventValue.toLocaleString()}</text>
                <circle className="chart-hover-marker user" cx="12" cy="58" r="3" />
                <text className="chart-hover-label" x="22" y="62">活跃用户数</text>
                <text className="chart-hover-value" x="152" y="62" textAnchor="end">{data.trend[hoveredPoint.index].userValue.toLocaleString()}</text>
              </g>
            </g>
          )}
        </svg>
      </div>
    </section>
  );
}

function EventFunnel({ data }: { data: DashboardData }) {
  return (
    <section className="dashboard-panel funnel-panel">
      <h3>事件转化率</h3>
      <div className="event-funnel" aria-label="事件转化率">
        {data.funnel.map((step, index) => (
          <div className={`funnel-step step-${index + 1}`} style={{ width: `${56 + (step.rate / 100) * 44}%` }} title={`${step.label}：${step.value}，转化率 ${step.rate}%`} tabIndex={0} key={step.label}>
            <span>{step.label}</span><strong>{step.value}</strong><small>{step.rate}%</small>
          </div>
        ))}
      </div>
    </section>
  );
}

function EventRankingTable({ data }: { data: DashboardData }) {
  return (
    <section className="dashboard-ranking-section">
      <h3>事件排行</h3>
      <div className="event-ranking-table-wrap">
        <table className="event-ranking-table">
          <thead><tr><th>排名</th><th>事件ID</th><th>埋点标签</th><th>触发次数</th><th>页面停留均时</th></tr></thead>
          <tbody>{data.ranking.map((item, index) => <tr key={item.事件ID}><td><span className={`event-rank-number rank-${index + 1}`}>{index + 1}</span></td><td>{item.事件ID}</td><td>{item.埋点标签}</td><td>{item.触发次数}</td><td>{item.页面停留均时}</td></tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}

function EventDashboard() {
  const [interval, setInterval] = useState<TimeInterval>("日");
  const presets: Record<TimeInterval, [string, string]> = {
    年: ["2026-01-01", "2026-12-31"],
    月: ["2026-07-01", "2026-07-31"],
    日: ["2026-07-13", "2026-07-13"],
  };
  const [dateRange, setDateRange] = useState<[string, string]>(presets.日);
  const data = eventDashboardData[interval];
  const selectInterval = (nextInterval: TimeInterval) => {
    setInterval(nextInterval);
    setDateRange(presets[nextInterval]);
  };
  return (
    <div className="event-dashboard">
      <div className="dashboard-topbar">
        <h2>埋点数据统计</h2>
        <div className="dashboard-date-toolbar">
          <span className="dashboard-date-label">日期范围</span>
          <label className="dashboard-date-input"><input aria-label="开始日期" type="date" value={dateRange[0]} onChange={(event) => setDateRange([event.target.value, dateRange[1]])} /><CalendarDays size={16} /></label>
          <i>—</i>
          <label className="dashboard-date-input"><input aria-label="结束日期" type="date" value={dateRange[1]} onChange={(event) => setDateRange([dateRange[0], event.target.value])} /><CalendarDays size={16} /></label>
          <div className="dashboard-date-shortcuts" aria-label="日期范围快捷筛选">
            {(["年", "月", "日"] as TimeInterval[]).map((item) => <button type="button" className={interval === item ? "active" : ""} aria-pressed={interval === item} onClick={() => selectInterval(item)} key={item}>{item}</button>)}
          </div>
        </div>
      </div>
      <div className="dashboard-metrics">
        <DashboardMetric label="事件总量" {...data.stats.eventTotal} iconSrc="./assets/dashboard-event-total-3d.png" />
        <DashboardMetric label="活跃用户数" {...data.stats.activeUsers} iconSrc="./assets/dashboard-active-users-3d.png" />
        <DashboardMetric label="按钮点击率" {...data.stats.clickRate} iconSrc="./assets/dashboard-click-rate-3d.png" />
        <DashboardMetric label="事件转化率" {...data.stats.pathConversion} iconSrc="./assets/dashboard-path-conversion-3d.png" />
      </div>
      <div className="dashboard-data-panels">
        <EventGrowthTrend data={data} />
        <EventFunnel data={data} />
      </div>
      <EventRankingTable data={data} />
    </div>
  );
}

function EventTracking({ openModal, initialTab }: { openModal: OpenModal; initialTab: "info" | "stats" }) {
  const [events, setEvents] = useState(trackingRows);
  const [moduleFilter, setModuleFilter] = useState("全部");
  const [eventIdFilter, setEventIdFilter] = useState("");

  const updateEvent = (eventId: string, patch: Partial<(typeof trackingRows)[number]>) => {
    setEvents((list) => list.map((event) => (event.事件ID === eventId ? { ...event, ...patch } : event)));
  };

  if (initialTab === "stats") return <section className="card page-card event-dashboard-page"><EventDashboard /></section>;

  const filteredEvents = events.filter((event) => (
    (moduleFilter === "全部" || event.所属功能模块 === moduleFilter)
    && event.事件ID.toLowerCase().includes(eventIdFilter.trim().toLowerCase())
  ));

  return (
    <section className="card page-card">
      <div className="filters event-info-filters">
        <FilterSelect label="模块" options={["全部", "报告管理", "审核管理", "用户管理", "权限配置"]} value={moduleFilter} onChange={setModuleFilter} />
        <FilterInput label="事件ID" placeholder="请输入" value={eventIdFilter} onChange={setEventIdFilter} />
      </div>
      <div className="table-toolbar event-info-toolbar">
        <div>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => openModal("tracking", {
              mode: "create",
              onSave: (values) => setEvents((list) => [...list, {
                事件ID: values.事件ID,
                所属功能模块: values.所属功能模块,
                埋点标签: values.埋点标签,
                埋点路径: values.埋点路径,
                触发机制: values.触发机制,
                创建时间: "2026-07-13 14:30",
              }]),
            })}
          >新增埋点事件</Button>
          <Button icon={Upload} onClick={() => openModal("tracking", { mode: "batch" })}>批量上传</Button>
        </div>
      </div>
      <DataTable
        columns={["事件ID", "所属功能模块", "埋点标签", "埋点路径", "触发机制", "创建时间"]}
        rows={filteredEvents}
        rowKey={(row) => String(row.事件ID)}
        fullTextColumns={["事件ID"]}
        actions={(row) => (
          <ActionLinks
            actions={["查看详情", "修改", "删除"]}
            onAction={(action) => {
              const eventId = String(row.事件ID);
              const event = events.find((item) => item.事件ID === eventId);
              if (!event) return;
              if (action === "修改") openModal("tracking", { mode: "edit", payload: event, onSave: (values) => updateEvent(eventId, values) });
              if (action === "查看详情") openModal("tracking", { mode: "detail", payload: event });
              if (action === "删除") openModal("delete", { payload: { message: `确认删除${eventId}？` }, onConfirm: () => setEvents((list) => list.filter((item) => item.事件ID !== eventId)) });
            }}
          />
        )}
      />
    </section>
  );
}

function filterOrganizationTree(nodes: OrganizationNode[], keyword: string): OrganizationNode[] {
  const normalizedKeyword = keyword.trim().toLocaleLowerCase();
  if (!normalizedKeyword) return nodes;
  return nodes.flatMap((node) => {
    const children = filterOrganizationTree(node.children ?? [], keyword);
    if (node.label.toLocaleLowerCase().includes(normalizedKeyword) || children.length) return [{ ...node, children }];
    return [];
  });
}

function findOrganizationNode(nodes: OrganizationNode[], nodeId: string): OrganizationNode | undefined {
  for (const node of nodes) {
    if (node.id === nodeId) return node;
    const child = findOrganizationNode(node.children ?? [], nodeId);
    if (child) return child;
  }
  return undefined;
}

function collectOrganizationLabels(node?: OrganizationNode): string[] {
  if (!node) return [];
  return [node.label, ...(node.children ?? []).flatMap((child) => collectOrganizationLabels(child))];
}

function updateOrganizationNodes(nodes: OrganizationNode[], nodeId: string, update: (node: OrganizationNode) => OrganizationNode): OrganizationNode[] {
  return nodes.map((node) => {
    if (node.id === nodeId) return update(node);
    if (!node.children?.length) return node;
    return { ...node, children: updateOrganizationNodes(node.children, nodeId, update) };
  });
}

function OrganizationTreeNodeRow({ node, level, selectedId, expandedIds, forceExpanded, activeMenuId, onSelect, onToggle, onOpenMenu, onAction }: {
  node: OrganizationNode;
  level: number;
  selectedId: string;
  expandedIds: Set<string>;
  forceExpanded: boolean;
  activeMenuId: string | null;
  onSelect: (node: OrganizationNode) => void;
  onToggle: (nodeId: string) => void;
  onOpenMenu: (nodeId: string | null) => void;
  onAction: (action: "add" | "rename" | "sync", node: OrganizationNode) => void;
}) {
  const hasChildren = Boolean(node.children?.length);
  const expanded = forceExpanded || expandedIds.has(node.id);
  return (
    <div className="organization-tree-node">
      <div className={`organization-tree-row ${selectedId === node.id ? "active" : ""}`} style={{ paddingLeft: 8 + level * 18 }} onClick={() => onSelect(node)}>
        <button type="button" className={`organization-tree-toggle ${hasChildren ? "" : "empty"}`} aria-label={expanded ? `收起${node.label}` : `展开${node.label}`} onClick={(event) => { event.stopPropagation(); if (hasChildren) onToggle(node.id); }}>
          {hasChildren && <ChevronRight size={20} strokeWidth={1.2} className={expanded ? "expanded" : ""} />}
        </button>
        <FolderOpen size={16} aria-hidden="true" />
        <span className="organization-tree-label">{node.label}</span>
        <div className="organization-tree-actions">
          <button type="button" className="organization-more-button" aria-label={`${node.label}组织操作`} aria-expanded={activeMenuId === node.id} onClick={(event) => { event.stopPropagation(); onOpenMenu(activeMenuId === node.id ? null : node.id); }}><MoreHorizontal size={16} /></button>
          {activeMenuId === node.id && (
            <div className="organization-node-menu" role="menu" onClick={(event) => event.stopPropagation()}>
              <button type="button" role="menuitem" onClick={() => onAction("add", node)}>新增子组织</button>
              <button type="button" role="menuitem" onClick={() => onAction("rename", node)}>重命名</button>
              <button type="button" role="menuitem" onClick={() => onAction("sync", node)}>组织数据对接</button>
            </div>
          )}
        </div>
      </div>
      {hasChildren && expanded && <div>{node.children?.map((child) => <OrganizationTreeNodeRow key={child.id} node={child} level={level + 1} selectedId={selectedId} expandedIds={expandedIds} forceExpanded={forceExpanded} activeMenuId={activeMenuId} onSelect={onSelect} onToggle={onToggle} onOpenMenu={onOpenMenu} onAction={onAction} />)}</div>}
    </div>
  );
}

function OrganizationEditorModal({ mode, organizationName, close, save }: { mode: "add" | "rename"; organizationName: string; close: () => void; save: (value: string) => void }) {
  const [value, setValue] = useState(mode === "rename" ? organizationName : "");
  return createPortal(
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && close()}>
      <div className="modal organization-editor-modal" role="dialog" aria-modal="true" aria-label={mode === "add" ? "新增子组织" : "重命名组织"}>
        <ModalHeader title={mode === "add" ? "新增子组织" : "重命名组织"} subtitle={mode === "add" ? `父组织：${organizationName}` : undefined} close={close} />
        <form className="modal-form" onSubmit={(event) => { event.preventDefault(); if (value.trim()) save(value.trim()); }}>
          <div className="modal-form-body"><FormField label="组织名称" required><input autoFocus value={value} placeholder="请输入组织名称" onChange={(event) => setValue(event.target.value)} /></FormField></div>
          <div className="modal-footer"><Button onClick={close}>取消</Button><Button type="submit" variant="primary" disabled={!value.trim()}>确定</Button></div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

type OrganizationSyncConfig = {
  endpoint: string;
  method: "GET" | "POST";
  authType: "Bearer Token" | "API Key" | "无需认证";
  credential: string;
  scope: "全部组织" | "当前组织及下级";
  responsePath: string;
  externalIdField: string;
  nameField: string;
  parentIdField: string;
};

type OrganizationSyncConnectionState = "未测试" | "测试中" | "已通过" | "测试失败";

const defaultOrganizationSyncConfig: OrganizationSyncConfig = {
  endpoint: "",
  method: "GET",
  authType: "Bearer Token",
  credential: "",
  scope: "全部组织",
  responsePath: "data.organizations",
  externalIdField: "id",
  nameField: "name",
  parentIdField: "parentId",
};

function OrganizationSyncModal({ organizationName, close, notify }: { organizationName?: string; close: () => void; notify: Notify }) {
  const [config, setConfig] = useState<OrganizationSyncConfig>(() => ({ ...defaultOrganizationSyncConfig, scope: organizationName ? "当前组织及下级" : "全部组织" }));
  const [connectionState, setConnectionState] = useState<OrganizationSyncConnectionState>("未测试");
  const [syncing, setSyncing] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const updateConfig = (patch: Partial<OrganizationSyncConfig>) => {
    setConfig((current) => ({ ...current, ...patch }));
    setConnectionState("未测试");
  };

  const endpointError = (() => {
    if (!config.endpoint.trim()) return "请输入外部组织接口地址";
    try {
      const parsed = new URL(config.endpoint.trim());
      return parsed.protocol === "https:" ? "" : "接口地址必须使用 https:// 安全协议";
    } catch {
      return "请输入有效的 https:// 接口地址";
    }
  })();
  const credentialError = config.authType !== "无需认证" && !config.credential.trim() ? "请输入认证凭证" : "";
  const mappingError = !config.responsePath.trim() || !config.externalIdField.trim() || !config.nameField.trim() || !config.parentIdField.trim();
  const canTest = !endpointError && !credentialError && !mappingError;
  const connectionMessage = connectionState === "已通过"
    ? "接口地址、认证信息与字段映射校验通过"
    : connectionState === "测试失败"
      ? "请检查接口地址、认证凭证和字段映射"
      : connectionState === "测试中"
        ? "正在校验接口连通性与返回结构…"
        : "连接测试通过后才可开始对接";

  const testConnection = () => {
    setSubmitted(true);
    if (!canTest) {
      setConnectionState("测试失败");
      notify("请先完善外部接口配置", "warning");
      return;
    }
    setConnectionState("测试中");
    window.setTimeout(() => {
      setConnectionState("已通过");
      notify("接口连接测试通过", "success");
    }, 650);
  };

  const startSync = () => {
    setSubmitted(true);
    if (!canTest || connectionState !== "已通过") {
      notify("请先完善配置并完成连接测试", "warning");
      return;
    }
    setSyncing(true);
    window.setTimeout(() => {
      setSyncing(false);
      notify("组织数据对接完成：新增 2 个、更新 3 个、未变更 12 个", "success");
      close();
    }, 900);
  };

  return createPortal(
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && close()}>
      <div className="modal organization-sync-modal" role="dialog" aria-modal="true" aria-label="组织数据对接">
        <ModalHeader title="组织数据对接" subtitle="配置外部组织接口，测试通过后同步最新组织架构" close={close} />
        <div className="modal-form">
          <div className="modal-form-body">
            <ModalAlert tone="info" title="同步说明">服务端按外部组织标识新增或更新，保留现有组织层级。</ModalAlert>
            <div className={`organization-sync-connection ${connectionState === "已通过" ? "success" : connectionState === "测试失败" ? "error" : connectionState === "测试中" ? "testing" : ""}`} role="status" aria-live="polite">
              <div className="organization-sync-connection-heading"><span>连接状态</span><StatusTag value={connectionState} /></div>
              <p>{connectionMessage}</p>
            </div>
            <div className="form-row organization-sync-endpoint-row">
              <FormField label="外部组织接口地址" required>
                <div className="validated-control">
                  <input className={submitted && endpointError ? "is-error" : ""} type="url" placeholder="https://org.example.com/api/v1/organizations" value={config.endpoint} onChange={(event) => updateConfig({ endpoint: event.target.value })} />
                  {submitted && endpointError && <span className="form-error-message">{endpointError}</span>}
                </div>
              </FormField>
              <FormField label="请求方式" required><FormSelect ariaLabel="请求方式" options={["GET", "POST"]} value={config.method} onChange={(value) => updateConfig({ method: value as OrganizationSyncConfig["method"] })} /></FormField>
            </div>
            <div className="form-row organization-sync-form-row">
              <FormField label="认证方式" required><FormSelect ariaLabel="认证方式" options={["Bearer Token", "API Key", "无需认证"]} value={config.authType} onChange={(value) => updateConfig({ authType: value as OrganizationSyncConfig["authType"], credential: value === "无需认证" ? "" : config.credential })} /></FormField>
              <FormField label="认证凭证" required={config.authType !== "无需认证"}>
                <div className="validated-control">
                  <input className={submitted && credentialError ? "is-error" : ""} type="password" autoComplete="new-password" disabled={config.authType === "无需认证"} placeholder={config.authType === "API Key" ? "请输入 API Key" : "请输入 Bearer Token"} value={config.credential} onChange={(event) => updateConfig({ credential: event.target.value })} />
                  {submitted && credentialError && <span className="form-error-message">{credentialError}</span>}
                </div>
              </FormField>
            </div>
            <div className="form-row organization-sync-form-row">
              <FormField label="同步范围" required><FormSelect ariaLabel="同步范围" options={["全部组织", "当前组织及下级"]} value={config.scope} onChange={(value) => updateConfig({ scope: value as OrganizationSyncConfig["scope"] })} /></FormField>
              <FormField label="返回组织数据路径" required><input className={submitted && !config.responsePath.trim() ? "is-error" : ""} placeholder="例如 data.organizations" value={config.responsePath} onChange={(event) => updateConfig({ responsePath: event.target.value })} /></FormField>
            </div>
            {config.scope === "当前组织及下级" && <p className="organization-sync-context">当前组织：{organizationName ?? "未指定"}（包含下级组织）</p>}
            <div className="organization-sync-mapping">
              <div className="organization-sync-section-title">组织字段映射</div>
              <p className="organization-sync-section-helper">服务端按映射读取外部返回数据，避免不同组织系统字段不一致导致同步失败。</p>
              <div className="organization-sync-mapping-grid">
                <FormField label="外部组织 ID 字段" required><input className={submitted && !config.externalIdField.trim() ? "is-error" : ""} placeholder="id" value={config.externalIdField} onChange={(event) => updateConfig({ externalIdField: event.target.value })} /></FormField>
                <FormField label="组织名称字段" required><input className={submitted && !config.nameField.trim() ? "is-error" : ""} placeholder="name" value={config.nameField} onChange={(event) => updateConfig({ nameField: event.target.value })} /></FormField>
                <FormField label="上级组织 ID 字段" required><input className={submitted && !config.parentIdField.trim() ? "is-error" : ""} placeholder="parentId" value={config.parentIdField} onChange={(event) => updateConfig({ parentIdField: event.target.value })} /></FormField>
              </div>
            </div>
            <p className="modal-helper-text">生产实现时，前端只提交接口配置到门户服务端，由服务端安全托管凭证、调用外部接口并创建可追踪的同步任务；当前原型用本地校验模拟连接测试结果。</p>
          </div>
          <div className="modal-footer"><Button onClick={close}>取消</Button><Button disabled={syncing || connectionState === "测试中"} onClick={testConnection}>{connectionState === "测试中" ? "测试中" : "连接测试"}</Button><Button variant="primary" icon={Network} disabled={syncing || connectionState !== "已通过"} onClick={startSync}>{syncing ? "对接中" : "开始对接"}</Button></div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function AccountStatusSwitch({ checked, label, onChange }: { checked: boolean; label: string; onChange: () => void }) {
  return <div className="account-status-control"><button type="button" role="switch" aria-checked={checked} aria-label={`${label}账号当前${checked ? "启用" : "禁用"}，点击切换`} className={`account-status-switch ${checked ? "checked" : ""}`} onClick={(event) => { event.stopPropagation(); onChange(); }}><span /></button><span className="account-status-text">{checked ? "启用" : "禁用"}</span></div>;
}

function UserManagement({ openModal, notify }: { openModal: OpenModal; notify: Notify }) {
  const [organizations, setOrganizations] = useState(initialOrganizationTree);
  const [organizationKeyword, setOrganizationKeyword] = useState("");
  const [selectedOrganizationId, setSelectedOrganizationId] = useState("gkx");
  const [expandedOrganizationIds, setExpandedOrganizationIds] = useState<Set<string>>(new Set(["gkx", "research-center", "operation-center"]));
  const [activeOrganizationMenu, setActiveOrganizationMenu] = useState<string | null>(null);
  const [organizationEditor, setOrganizationEditor] = useState<{ mode: "add" | "rename"; node: OrganizationNode } | null>(null);
  const [organizationSyncOpen, setOrganizationSyncOpen] = useState(false);
  const [organizationSyncTarget, setOrganizationSyncTarget] = useState<string | undefined>();
  const [users, setUsers] = useState(userRows);
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("全部");
  const [userRoleMap, setUserRoleMap] = useState<Record<string, string[]>>({ U20260001: ["普通用户"], U20260002: ["机构用户", "政府用户"] });
  const [transferUser, setTransferUser] = useState<(typeof userRows)[number] | null>(null);

  const visibleOrganizations = useMemo(() => filterOrganizationTree(organizations, organizationKeyword), [organizations, organizationKeyword]);
  const selectedOrganization = useMemo(() => findOrganizationNode(organizations, selectedOrganizationId), [organizations, selectedOrganizationId]);
  const selectedOrganizationLabels = useMemo(() => collectOrganizationLabels(selectedOrganization), [selectedOrganization]);
  const filteredUsers = useMemo(() => users.filter((user) => {
    const matchesOrganization = !selectedOrganizationLabels.length || selectedOrganizationLabels.includes(user.所属组织名称);
    const matchesName = !nameFilter || user.用户姓名.includes(nameFilter.trim());
    const matchesStatus = statusFilter === "全部" || user.账号状态 === statusFilter;
    return matchesOrganization && matchesName && matchesStatus;
  }), [users, selectedOrganizationLabels, nameFilter, statusFilter]);

  const updateUser = (userId: string, patch: Partial<(typeof userRows)[number]>) => setUsers((list) => list.map((user) => user.用户ID === userId ? { ...user, ...patch } : user));
  const toggleOrganization = (nodeId: string) => setExpandedOrganizationIds((current) => {
    const next = new Set(current);
    if (next.has(nodeId)) next.delete(nodeId); else next.add(nodeId);
    return next;
  });
  const handleOrganizationAction = (action: "add" | "rename" | "sync", node: OrganizationNode) => {
    setActiveOrganizationMenu(null);
    if (action === "sync") {
      setOrganizationSyncTarget(node.label);
      setOrganizationSyncOpen(true);
      return;
    }
    setOrganizationEditor({ mode: action, node });
  };
  const saveOrganization = (value: string) => {
    if (!organizationEditor) return;
    if (organizationEditor.mode === "rename") {
      setOrganizations((nodes) => updateOrganizationNodes(nodes, organizationEditor.node.id, (node) => ({ ...node, label: value })));
      notify("组织名称修改成功");
    } else {
      const newNode: OrganizationNode = { id: `org-${Date.now()}`, label: value };
      setOrganizations((nodes) => updateOrganizationNodes(nodes, organizationEditor.node.id, (node) => ({ ...node, children: [...(node.children ?? []), newNode] })));
      setExpandedOrganizationIds((current) => new Set([...current, organizationEditor.node.id]));
      notify("子组织新增成功");
    }
    setOrganizationEditor(null);
  };

  return (
    <section className="card page-card user-organization-page" onClick={() => setActiveOrganizationMenu(null)}>
      <div className="user-organization-layout">
        <aside className="organization-tree-panel">
          <div className="organization-tree-heading"><div><h2>组织管理</h2><span>组织数据管理 · 组织列表查看 · {collectOrganizationLabels(organizations[0]).length} 个组织</span></div></div>
          <label className="filter-search-control organization-tree-search"><input aria-label="组织检索" placeholder="组织检索" value={organizationKeyword} onChange={(event) => setOrganizationKeyword(event.target.value)} />{organizationKeyword ? <button type="button" aria-label="清空组织检索" onClick={() => setOrganizationKeyword("")}><X size={14} /></button> : <Search size={16} aria-hidden="true" />}</label>
          <div className="organization-tree-list" role="tree">
            {visibleOrganizations.length ? visibleOrganizations.map((node) => <OrganizationTreeNodeRow key={node.id} node={node} level={0} selectedId={selectedOrganizationId} expandedIds={expandedOrganizationIds} forceExpanded={Boolean(organizationKeyword.trim())} activeMenuId={activeOrganizationMenu} onSelect={(selectedNode) => { setSelectedOrganizationId(selectedNode.id); setActiveOrganizationMenu(null); }} onToggle={toggleOrganization} onOpenMenu={setActiveOrganizationMenu} onAction={handleOrganizationAction} />) : <div className="organization-tree-empty">未找到相关组织</div>}
          </div>
        </aside>
        <section className="user-list-panel">
          <div className="organization-sync-toolbar"><Button icon={Network} onClick={() => { setOrganizationSyncTarget(selectedOrganization?.label); setOrganizationSyncOpen(true); }}>组织数据对接</Button></div>
          <div className="user-list-context"><h2>用户管理</h2><span>用户列表展示</span></div>
          <div className="filters user-management-filters">
            <FilterInput label="用户检索" placeholder="请输入用户姓名" searchable value={nameFilter} onChange={setNameFilter} />
            <FilterSelect label="账号状态" options={["全部", "启用", "禁用"]} value={statusFilter} onChange={setStatusFilter} />
          </div>
          <div className="table-toolbar user-management-toolbar"><div>
            <Button variant="primary" icon={Plus} onClick={() => openModal("user", { mode: "create", onSave: (values) => {
              setUsers((list) => [...list, { 用户ID: `U2026${String(list.length + 1).padStart(4, "0")}`, 用户姓名: values.姓名, 所属组织名称: values.所属组织, 手机号: values.手机号, 邮箱: values.邮箱, 创建时间: "2026-07-14", 账号状态: "启用" }]);
              notify("用户注册成功");
            } })}>用户注册</Button>
            <Button icon={Network} onClick={() => notify("用户数据对接成功")}>用户数据对接</Button>
          </div></div>
          <DataTable
            columns={["用户ID", "姓名", "归属组织名称", "手机号", "邮箱", "创建时间", "账号状态"]}
            rows={filteredUsers.map((user) => ({ ...user, 姓名: user.用户姓名, 归属组织名称: user.所属组织名称, 原始账号状态: user.账号状态, 账号状态: <AccountStatusSwitch checked={user.账号状态 === "启用"} label={user.用户姓名} onChange={() => { updateUser(user.用户ID, { 账号状态: user.账号状态 === "启用" ? "禁用" : "启用" }); notify(`账号已${user.账号状态 === "启用" ? "禁用" : "启用"}`); }} /> }))}
            rowKey={(row) => String(row.用户ID)}
            fullTextColumns={["用户ID", "手机号", "邮箱"]}
            actionWidth={220}
            actions={(row) => <div className="inline-actions user-row-actions"><button type="button" onClick={() => { const user = users.find((item) => item.用户ID === row.用户ID); if (user) openModal("user", { mode: "detail", payload: user }); }}>查看详情</button><button type="button" className="primary-action" onClick={() => setTransferUser(users.find((item) => item.用户ID === row.用户ID) ?? null)}>分配角色</button><button type="button" className="danger-action" onClick={() => { const user = users.find((item) => item.用户ID === row.用户ID); if (!user) return; openModal("delete", { payload: { title: "确认注销", message: `确定要注销用户“${user.用户姓名}”吗？`, description: "此操作无法撤销，注销后该用户将无法登录系统。", confirmLabel: "确认注销", successMessage: "用户注销成功" }, onConfirm: () => setUsers((list) => list.filter((item) => item.用户ID !== user.用户ID)) }); }}>注销用户</button></div>}
          />
        </section>
      </div>
      {organizationEditor && <OrganizationEditorModal mode={organizationEditor.mode} organizationName={organizationEditor.node.label} close={() => setOrganizationEditor(null)} save={saveOrganization} />}
      {organizationSyncOpen && <OrganizationSyncModal organizationName={organizationSyncTarget} close={() => { setOrganizationSyncOpen(false); setOrganizationSyncTarget(undefined); }} notify={notify} />}
      {transferUser && <RoleTransferModal user={transferUser} roles={userRoleMap[transferUser.用户ID] ?? []} close={() => setTransferUser(null)} save={(roles) => { setUserRoleMap((current) => ({ ...current, [transferUser.用户ID]: roles })); setTransferUser(null); notify("角色分配成功"); }} />}
    </section>
  );
}

function RoleManagement({ openModal, onPermissionConfig }: { openModal: OpenModal; onPermissionConfig: () => void }) {
  const [roles, setRoles] = useState(roleRows);

  const updateRole = (roleId: string, patch: Partial<(typeof roleRows)[number]>) => {
    setRoles((list) => list.map((role) => (role.角色ID === roleId ? { ...role, ...patch } : role)));
  };

  return (
    <section className="card page-card">
      <div className="workflow-management-label">角色检索 · 角色列表展示</div>
      <div className="filters">
        <FilterInput label="角色ID" placeholder="角色ID" />
        <FilterInput label="角色名称" placeholder="角色名称" />
        <FilterSelect label="状态" options={["启用", "禁用", "废弃"]} />
      </div>
      <div className="table-toolbar">
        <div>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => openModal("role", {
              mode: "create",
              onSave: (values) => setRoles((list) => [
                ...list,
                {
                  角色ID: `R${String(list.length + 1).padStart(3, "0")}`,
                  角色名称: values.角色名称,
                  角色描述: values.角色描述,
                  状态: values.状态,
                  创建人: "系统管理员",
                  创建时间: "2026-07-13",
                  最近修改人: "系统管理员",
                  最近修改时间: "2026-07-13",
                },
              ]),
            })}
          >创建</Button>
        </div>
      </div>
      <DataTable
        columns={["角色ID", "角色名称", "角色描述", "状态", "创建人", "创建时间", "最近修改人", "最近修改时间"]}
        rows={roles.map((row) => ({ ...row, 原始状态: row.状态, 状态: <StatusTag value={row.状态} /> }))}
        actions={(row) => (
          <ActionLinks
            actions={["编辑", row.原始状态 === "废弃" && "删除", "权限配置"]}
            onAction={(action) => {
              const roleId = String(row.角色ID);
              const role = roles.find((item) => item.角色ID === roleId);
              if (!role) return;
              if (action === "编辑") openModal("role", { mode: "edit", payload: role, onSave: (values) => updateRole(roleId, values) });
              if (action === "删除") {
                openModal("delete", {
                  payload: { message: `确认删除${role.角色名称}？` },
                  onConfirm: () => setRoles((list) => list.filter((item) => item.角色ID !== roleId)),
                });
              }
              if (action === "权限配置") onPermissionConfig();
            }}
          />
        )}
      />
    </section>
  );
}

function findPageMenuNode(nodes: PageMenuNode[], nodeId: string): PageMenuNode | undefined {
  for (const node of nodes) {
    if (node.id === nodeId) return node;
    const child = findPageMenuNode(node.children ?? [], nodeId);
    if (child) return child;
  }
  return undefined;
}

function findPageMenuPath(nodes: PageMenuNode[], nodeId: string, path: PageMenuNode[] = []): PageMenuNode[] | null {
  for (const node of nodes) {
    const nextPath = [...path, node];
    if (node.id === nodeId) return nextPath;
    const childPath = findPageMenuPath(node.children ?? [], nodeId, nextPath);
    if (childPath) return childPath;
  }
  return null;
}

function findPageParentId(nodes: PageMenuNode[], nodeId: string, parentId = ""): string {
  for (const node of nodes) {
    if (node.id === nodeId) return parentId;
    const childParent = findPageParentId(node.children ?? [], nodeId, node.id);
    if (childParent) return childParent;
  }
  return "";
}

function updatePageMenuNodes(nodes: PageMenuNode[], nodeId: string, update: (node: PageMenuNode) => PageMenuNode): PageMenuNode[] {
  return nodes.map((node) => node.id === nodeId ? update(node) : { ...node, children: node.children ? updatePageMenuNodes(node.children, nodeId, update) : undefined });
}

function removePageMenuNode(nodes: PageMenuNode[], nodeId: string): PageMenuNode[] {
  return nodes.filter((node) => node.id !== nodeId).map((node) => ({ ...node, children: node.children ? removePageMenuNode(node.children, nodeId) : undefined }));
}

function addPageMenuNode(nodes: PageMenuNode[], parentId: string, node: PageMenuNode): PageMenuNode[] {
  if (!parentId) return [...nodes, node];
  return updatePageMenuNodes(nodes, parentId, (parent) => ({ ...parent, children: [...(parent.children ?? []), node] }));
}

type VisiblePageMenuRow = { node: PageMenuNode; depth: number; parentId: string; parentTitle: string };

function getVisiblePageMenuRows(nodes: PageMenuNode[], expandedIds: Set<string>, depth = 1, parentId = "", parentTitle = "-"): VisiblePageMenuRow[] {
  return nodes.flatMap((node) => [
    { node, depth, parentId, parentTitle },
    ...(node.children?.length && expandedIds.has(node.id) ? getVisiblePageMenuRows(node.children, expandedIds, depth + 1, node.id, node.title) : []),
  ]);
}

function PageParentCascader({ nodes, value, disabled, excludedId, onChange }: { nodes: PageMenuNode[]; value: string; disabled: boolean; excludedId?: string; onChange: (value: string) => void }) {
  const availableRoots = nodes.filter((node) => node.id !== excludedId);
  const initialPath = value ? findPageMenuPath(availableRoots, value) : null;
  const [levelOneId, setLevelOneId] = useState(initialPath?.[0]?.id ?? "");
  const [levelTwoId, setLevelTwoId] = useState(initialPath?.[1]?.id ?? "");
  const levelOne = availableRoots.find((node) => node.id === levelOneId);
  const levelTwoOptions = (levelOne?.children ?? []).filter((node) => node.id !== excludedId);
  return (
    <div className="page-parent-cascader" aria-label="父页面级联选择器">
      <select aria-label="一级页面" value={levelOneId} disabled={disabled} onChange={(event) => {
        const nextId = event.target.value;
        setLevelOneId(nextId);
        setLevelTwoId("");
        onChange(nextId);
      }}>
        <option value="">无（新建页面）</option>
        {availableRoots.map((node) => <option key={node.id} value={node.id}>{node.title}</option>)}
      </select>
      <select aria-label="二级页面" value={levelTwoId} disabled={disabled || !levelOneId} onChange={(event) => {
        const nextId = event.target.value;
        setLevelTwoId(nextId);
        onChange(nextId || levelOneId);
      }}>
        <option value="">{levelOneId ? "当前一级页面" : "请先选择一级页面"}</option>
        {levelTwoOptions.map((node) => <option key={node.id} value={node.id}>{node.title}</option>)}
      </select>
    </div>
  );
}

type PageEditorState = { mode: "create-root" | "create-child" | "edit"; nodeId?: string; parentId?: string };

function PageEditorModal({ state, nodes, close, save }: { state: PageEditorState; nodes: PageMenuNode[]; close: () => void; save: (values: { title: string; url: string; parentId: string; enabled: "启用" | "禁用" }) => void }) {
  const node = state.nodeId ? findPageMenuNode(nodes, state.nodeId) : undefined;
  const initialParentId = state.parentId ?? (node ? findPageParentId(nodes, node.id) : "");
  const [title, setTitle] = useState(node?.title ?? "");
  const [url, setUrl] = useState(node?.url ?? "");
  const [parentId, setParentId] = useState(initialParentId);
  const [enabled, setEnabled] = useState<"启用" | "禁用">(node?.enabled ?? "启用");
  const [submitted, setSubmitted] = useState(false);
  const parentLocked = state.mode === "create-root" || Boolean(node?.children?.length);
  const canSubmit = Boolean(title.trim() && url.trim());
  const modalTitle = state.mode === "edit" ? "修改页面" : "新建页面";
  return createPortal(
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && close()}>
      <div className="modal page-editor-modal" role="dialog" aria-modal="true" aria-label={modalTitle}>
        <ModalHeader title={modalTitle} close={close} />
        <form className="modal-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); if (canSubmit) save({ title: title.trim(), url: url.trim(), parentId, enabled }); }} noValidate>
          <div className="modal-form-body">
            <FormField label="标题" required><div className="validated-control"><input className={submitted && !title.trim() ? "is-error" : ""} value={title} placeholder="请输入页面标题" onChange={(event) => setTitle(event.target.value)} />{submitted && !title.trim() && <span className="form-error-message">请输入页面标题</span>}</div></FormField>
            <FormField label="地址(URL)" required><div className="validated-control"><input className={submitted && !url.trim() ? "is-error" : ""} value={url} placeholder="请输入路由地址" onChange={(event) => setUrl(event.target.value)} />{submitted && !url.trim() && <span className="form-error-message">请输入路由地址</span>}</div></FormField>
            <FormField label="父页面" required={state.mode === "create-child"}><PageParentCascader nodes={nodes} value={parentId} disabled={parentLocked} excludedId={node?.id} onChange={setParentId} /></FormField>
            <FormField label="启用属性" required><FormSelect ariaLabel="启用属性" options={["启用", "禁用"]} value={enabled} onChange={(value) => setEnabled(value as "启用" | "禁用")} /></FormField>
          </div>
          <div className="modal-footer"><Button onClick={close}>取消</Button><Button type="submit" variant="primary">保存</Button></div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

function PageManagement({ openModal, notify }: { openModal: OpenModal; notify: Notify }) {
  const [pages, setPages] = useState(initialPageMenuTree);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(["system-menu", "audit-menu", "permission-menu"]));
  const [editor, setEditor] = useState<PageEditorState | null>(null);
  const [scrollState, setScrollState] = useState({ hasOverflow: false, showLeftShadow: false, showRightShadow: false });
  const [tooltip, setTooltip] = useState<{ content: string; left: number; top: number } | null>(null);
  const tableWrapRef = useRef<HTMLDivElement>(null);
  const visibleRows = useMemo(() => getVisiblePageMenuRows(pages, expandedIds), [pages, expandedIds]);
  const pageActionColumnWidth = getActionColumnWidth([getOrderedActions(["新建页面", "修改页面", "删除页面"])]);

  const updateScrollState = useCallback(() => {
    const tableWrap = tableWrapRef.current;
    if (!tableWrap) return;
    const maxScrollLeft = Math.max(0, tableWrap.scrollWidth - tableWrap.clientWidth);
    const hasOverflow = maxScrollLeft > 1;
    setScrollState({
      hasOverflow,
      showLeftShadow: hasOverflow && tableWrap.scrollLeft > 1,
      showRightShadow: hasOverflow && tableWrap.scrollLeft < maxScrollLeft - 1,
    });
  }, []);

  useEffect(() => {
    const tableWrap = tableWrapRef.current;
    if (!tableWrap) return undefined;
    updateScrollState();
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(tableWrap);
    window.addEventListener("resize", updateScrollState);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState, visibleRows.length]);

  const showTooltip = (content: string, target: HTMLElement) => {
    const rect = target.getBoundingClientRect();
    const maxLeft = Math.max(8, window.innerWidth - 368);
    setTooltip({ content, left: Math.min(Math.max(8, rect.left), maxLeft), top: rect.bottom + 8 });
  };

  const toggleExpanded = (nodeId: string) => setExpandedIds((current) => {
    const next = new Set(current);
    if (next.has(nodeId)) next.delete(nodeId); else next.add(nodeId);
    return next;
  });
  const savePage = (values: { title: string; url: string; parentId: string; enabled: "启用" | "禁用" }) => {
    if (!editor) return;
    if (editor.mode === "edit" && editor.nodeId) {
      const current = findPageMenuNode(pages, editor.nodeId);
      if (!current) return;
      const editedNode: PageMenuNode = { ...current, title: values.title, url: values.url, enabled: values.enabled };
      const withoutCurrent = removePageMenuNode(pages, current.id);
      setPages(addPageMenuNode(withoutCurrent, values.parentId, editedNode));
      notify("页面修改成功");
    } else {
      const newNode: PageMenuNode = { id: `page-${Date.now()}`, title: values.title, url: values.url, enabled: values.enabled };
      setPages((current) => addPageMenuNode(current, values.parentId, newNode));
      if (values.parentId) setExpandedIds((current) => new Set([...current, values.parentId]));
      notify("页面新建成功");
    }
    setEditor(null);
  };

  return (
    <section className="card page-card page-menu-management-page">
      <div className="workflow-management-label">分级管理</div>
      <div className="table-toolbar page-menu-toolbar"><div><Button variant="primary" icon={Plus} onClick={() => setEditor({ mode: "create-root", parentId: "" })}>新建页面</Button></div></div>
      <div className={`table-wrap page-tree-grid-wrap ${scrollState.hasOverflow ? "is-scrollable" : ""} ${scrollState.showLeftShadow ? "has-left-shadow" : ""} ${scrollState.showRightShadow ? "has-right-shadow" : ""}`} ref={tableWrapRef} onScroll={updateScrollState}>
        <table className="page-tree-grid">
          <colgroup><col /><col /><col style={{ width: 160 }} /><col style={{ width: 112 }} /><col style={{ width: pageActionColumnWidth }} /></colgroup>
          <thead><tr><th>菜单/页面标题</th><th>路由地址(URL)</th><th>父级页面</th><th>启用状态</th><th className="table-action-cell table-sticky-right" style={{ width: pageActionColumnWidth, minWidth: pageActionColumnWidth, maxWidth: pageActionColumnWidth }}>操作</th></tr></thead>
          <tbody>{visibleRows.map(({ node, depth, parentId, parentTitle }) => {
            const hasChildren = Boolean(node.children?.length);
            const expanded = expandedIds.has(node.id);
            const canCreateChild = depth < 3;
            return <tr key={node.id}>
              <td><div className="page-tree-title" style={{ paddingLeft: (depth - 1) * 24 }}><button type="button" className={`page-tree-toggle ${hasChildren ? "" : "empty"}`} aria-label={expanded ? `收起${node.title}` : `展开${node.title}`} onClick={() => hasChildren && toggleExpanded(node.id)}>{hasChildren && <ChevronRight size={18} className={expanded ? "expanded" : ""} />}</button><span className="page-tree-label-text"><TableCellContent value={node.title} onShowTooltip={showTooltip} onHideTooltip={() => setTooltip(null)} /></span></div></td>
              <td><span className="page-route-text"><TableCellContent value={node.url} onShowTooltip={showTooltip} onHideTooltip={() => setTooltip(null)} /></span></td>
              <td><TableCellContent value={parentTitle} onShowTooltip={showTooltip} onHideTooltip={() => setTooltip(null)} /></td>
              <td><StatusTag value={node.enabled} /></td>
              <td className="table-action-cell table-sticky-right" style={{ width: pageActionColumnWidth, minWidth: pageActionColumnWidth, maxWidth: pageActionColumnWidth }}><ActionLinks actions={["新建页面", "修改页面", "删除页面"]} disabledActions={canCreateChild ? [] : ["新建页面"]} actionTipOverrides={canCreateChild ? {} : { 新建页面: "最多支持三级页面" }} onAction={(action) => {
                if (action === "新建页面") setEditor({ mode: "create-child", parentId: node.id });
                if (action === "修改页面") setEditor({ mode: "edit", nodeId: node.id, parentId });
                if (action === "删除页面") openModal("delete", { payload: { message: `确定要删除页面“${node.title}”吗？`, description: "此操作将隐藏对应前端访问入口，且无法撤销。", successMessage: "页面删除成功" }, onConfirm: () => setPages((current) => removePageMenuNode(current, node.id)) });
              }} /></td>
            </tr>;
          })}</tbody>
        </table>
      </div>
      {tooltip && createPortal(<div className="table-cell-tooltip" role="tooltip" style={{ left: tooltip.left, top: tooltip.top }}>{tooltip.content}</div>, document.body)}
      {editor && <PageEditorModal state={editor} nodes={pages} close={() => setEditor(null)} save={savePage} />}
    </section>
  );
}

function ResourceManagement({ openModal, notify }: { openModal: OpenModal; notify: Notify }) {
  const [tab, setTab] = useState<"api" | BusinessResourceType>("api");
  return (
    <section className="card page-card resource-management-page">
      <div className="resource-tabs resource-primary-tabs" aria-label="资源管理类型">
        <button className={tab === "api" ? "active" : ""} onClick={() => setTab("api")}>接口资源管理</button>
        {(Object.keys(businessResourceConfigs) as BusinessResourceType[]).map((type) => <button className={tab === type ? "active" : ""} onClick={() => setTab(type)} key={type}>{businessResourceConfigs[type].tab}</button>)}
      </div>
      {tab === "api" ? <ApiResources openModal={openModal} notify={notify} /> : <BusinessResourceWorkspace type={tab} openModal={openModal} notify={notify} key={tab} />}
    </section>
  );
}

function TokenValueCell({ value, onCopy }: { value: string; onCopy: () => void }) {
  return <span className="token-value-cell"><code className="masked-token">{`${value.slice(0, 2)}...****...${value.slice(-4)}`}</code><button type="button" aria-label="复制Token" title="复制Token" onClick={onCopy}><Copy size={15} /></button></span>;
}

function TokenEditorModal({ mode, initialName, initialExpiryDate, close, save }: { mode: "create" | "edit"; initialName?: string; initialExpiryDate?: string; close: () => void; save: (applicationName: string, expiryDate: string) => void }) {
  const [applicationName, setApplicationName] = useState(initialName ?? "");
  const [expiryDate, setExpiryDate] = useState(initialExpiryDate ?? "2027-07-13");
  const canSubmit = applicationName.trim().length > 0 && expiryDate.length > 0;
  return createPortal(
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && close()}>
      <div className="modal token-editor-modal" role="dialog" aria-modal="true" aria-label={mode === "create" ? "生成Token" : "编辑Token"}>
        <ModalHeader
          title={mode === "create" ? "生成Token" : "编辑Token"}
          close={close}
        />
        <form className="modal-form" onSubmit={(event) => { event.preventDefault(); if (canSubmit) save(applicationName.trim(), expiryDate); }}>
          <div className="modal-form-body token-editor-form">
            {mode === "create" && <ModalAlert tone="warning">Token 生成后仅在当前操作中完整复制，请妥善保存。</ModalAlert>}
            <FormField label="应用名称" required><input value={applicationName} placeholder="请输入应用名称" onChange={(event) => setApplicationName(event.target.value)} /></FormField>
            <FormField label="到期时间" required><DateField value={expiryDate} onChange={setExpiryDate} /></FormField>
          </div>
          <div className="modal-footer"><Button onClick={close}>取消</Button><Button type="submit" variant="primary" disabled={!canSubmit}>{mode === "create" ? "生成" : "保存"}</Button></div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

function ApiResources({ openModal, notify }: { openModal: OpenModal; notify: Notify }) {
  const [tab, setTab] = useState<"tokens" | "docs" | "logs">("tokens");
  const [tokens, setTokens] = useState(initialTokenRows);
  const [tokenEditor, setTokenEditor] = useState<{ mode: "create" | "edit"; tokenId?: string } | null>(null);
  const copyToken = async (token: string) => {
    try {
      await navigator.clipboard.writeText(token);
      notify("Token 已复制");
    } catch {
      notify("复制失败，请重试", "error");
    }
  };
  return (
    <div className="api-resource-workspace">
      <div className="resource-subtabs" aria-label="接口资源管理功能">
        <button className={tab === "tokens" ? "active" : ""} onClick={() => setTab("tokens")}>令牌管理</button>
        <button className={tab === "docs" ? "active" : ""} onClick={() => setTab("docs")}>接口调用文档展示</button>
        <button className={tab === "logs" ? "active" : ""} onClick={() => setTab("logs")}>接口调用日志</button>
      </div>
      {tab === "tokens" && (
        <div className="resource-tab-content">
          <div className="table-toolbar">
            <div><Button variant="primary" icon={Plus} onClick={() => setTokenEditor({ mode: "create" })}>生成Token</Button></div>
          </div>
          <DataTable
            columns={["应用名称", "Token字符串", "创建时间", "到期时间", "状态"]}
            rows={tokens.map((item) => ({ ...item, 原始Token: item.Token字符串, 原始状态: item.状态, Token字符串: <TokenValueCell value={item.Token字符串} onCopy={() => copyToken(item.Token字符串)} />, 状态: <StatusTag value={item.状态} /> }))}
            rowKey={(row) => String(row.id)}
            selectable={false}
            actions={(row) => (
              <ActionLinks
                actions={["编辑", "注销", "删除"]}
                disabledActions={row.原始状态 === "已注销" ? ["注销"] : []}
                onAction={(action) => {
                  if (action === "编辑") {
                    setTokenEditor({ mode: "edit", tokenId: String(row.id) });
                    return;
                  }
                  if (action === "注销") {
                    setTokens((list) => list.map((item) => item.id === row.id ? { ...item, 状态: "已注销" } : item));
                    notify("Token 注销成功");
                    return;
                  }
                  openModal("delete", {
                    payload: { message: `确认删除${String(row.应用名称)}的Token？` },
                    onConfirm: () => setTokens((list) => list.filter((item) => item.id !== row.id)),
                  });
                }}
              />
            )}
          />
          {tokenEditor && <TokenEditorModal
            mode={tokenEditor.mode}
            initialName={tokenEditor.mode === "edit" ? tokens.find((item) => item.id === tokenEditor.tokenId)?.应用名称 : undefined}
            initialExpiryDate={tokenEditor.mode === "edit" ? tokens.find((item) => item.id === tokenEditor.tokenId)?.到期时间.slice(0, 10) : undefined}
            close={() => setTokenEditor(null)}
            save={(applicationName, expiryDate) => {
              if (tokenEditor.mode === "create") {
                const token = `eyJhbGciOiJIUzI1NiJ9.${Date.now().toString(36)}.gkx`;
                setTokens((list) => [...list, { id: `token-${Date.now()}`, 应用名称: applicationName, Token字符串: token, 创建时间: "2026-07-13 16:20", 到期时间: `${expiryDate} 23:59`, 状态: "正常" }]);
                notify("Token 生成成功");
              } else {
                setTokens((list) => list.map((item) => item.id === tokenEditor.tokenId ? { ...item, 应用名称: applicationName, 到期时间: `${expiryDate} 23:59` } : item));
                notify("Token 编辑成功");
              }
              setTokenEditor(null);
            }}
          />}
        </div>
      )}
      {tab === "docs" && <ApiDocumentViewer notify={notify} />}
      {tab === "logs" && <ApiLogList />}
    </div>
  );
}

function ApiDocumentViewer({ notify }: { notify: Notify }) {
  const categories = Object.keys(apiDocumentCatalog);
  const [category, setCategory] = useState(categories[0]);
  const document = apiDocumentCatalog[category][0];
  return (
    <div className="api-document-layout">
      <aside className="api-document-nav">
        <h3>资源分类</h3>
        {categories.map((item) => (
          <button type="button" className={category === item ? "active" : ""} onClick={() => setCategory(item)} key={item}>
            <Database size={16} /><span>{item}</span><ChevronRight size={15} />
          </button>
        ))}
      </aside>
      <article className="api-document-content">
        <header>
          <div><h3>{document.name}</h3><p>{document.description}</p></div>
          <span className={`api-method ${document.method.toLowerCase()}`}>{document.method}</span>
        </header>
        <div className="api-path-row"><code>{document.path}</code><button type="button" aria-label="复制请求路径" title="复制请求路径" onClick={async () => { try { await navigator.clipboard.writeText(document.path); notify("请求路径已复制"); } catch { notify("复制失败，请重试", "error"); } }}><Copy size={15} /></button></div>
        <section>
          <h4>参数列表</h4>
          <div className="api-plain-table"><table><thead><tr><th>参数名</th><th>类型</th><th>必填</th><th>说明</th></tr></thead><tbody>{document.parameters.map((parameter) => <tr key={parameter.参数名}><td><code>{parameter.参数名}</code></td><td>{parameter.类型}</td><td>{parameter.必填}</td><td>{parameter.说明}</td></tr>)}</tbody></table></div>
        </section>
        <section>
          <h4>返回 JSON 示例</h4>
          <pre className="api-json-example"><code>{document.response}</code></pre>
        </section>
        <section>
          <h4>错误码说明</h4>
          <div className="api-plain-table"><table><thead><tr><th>错误码</th><th>说明</th></tr></thead><tbody>{document.errors.map((error) => <tr key={error.错误码}><td><code>{error.错误码}</code></td><td>{error.说明}</td></tr>)}</tbody></table></div>
        </section>
      </article>
    </div>
  );
}

function ApiLogList() {
  const [timeRange, setTimeRange] = useState("近1小时");
  const [result, setResult] = useState("全部");
  const [apiName, setApiName] = useState("");
  const [detail, setDetail] = useState<(typeof apiLogRows)[number] | null>(null);
  const rows = apiLogRows.filter((row) => (
    (timeRange === "近7天" || row.时间范围 === "近1小时")
    && (result === "全部" || row.响应结果 === result)
    && row.接口名称.includes(apiName.trim())
  ));
  return (
    <div className="resource-tab-content api-log-list">
      <div className="filters api-log-filters">
        <FilterSelect label="时间范围" options={["近1小时", "近7天"]} value={timeRange} onChange={setTimeRange} />
        <FilterSelect label="调用结果" options={["全部", "成功", "失败"]} value={result} onChange={setResult} />
        <FilterInput label="接口名称" placeholder="请输入" searchable value={apiName} onChange={setApiName} />
      </div>
      <DataTable
        columns={["调用时间", "调用方IP", "接口地址", "响应结果", "调用耗时"]}
        rows={rows.map((row) => ({ ...row, 响应结果: <StatusTag value={row.响应结果} /> }))}
        actions={(row) => <ActionLinks actions={["查看"]} onAction={() => setDetail(rows.find((item) => item.调用时间 === String(row.调用时间)) ?? null)} />}
      />
      {detail && createPortal(
        <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setDetail(null)}>
          <div className="modal resource-log-modal" role="dialog" aria-modal="true" aria-label="调用详情">
            <ModalHeader title="调用详情" subtitle={detail.接口名称} close={() => setDetail(null)} />
            <div className="modal-form">
              <div className="modal-form-body resource-log-detail">
                <dl><div><dt>调用时间</dt><dd>{detail.调用时间}</dd></div><div><dt>调用方 IP</dt><dd>{detail.调用方IP}</dd></div><div><dt>接口地址</dt><dd><code>{detail.接口地址}</code></dd></div><div><dt>响应结果</dt><dd><StatusTag value={detail.响应结果} /></dd></div><div><dt>调用耗时</dt><dd>{detail.调用耗时}</dd></div><div><dt>错误信息</dt><dd>{detail.错误信息}</dd></div></dl>
                <h3>请求参数</h3><pre><code>{detail.请求参数}</code></pre>
              </div>
              <div className="modal-footer"><Button onClick={() => setDetail(null)}>关闭</Button></div>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}

function BusinessResources({ openModal, notify }: { openModal: OpenModal; notify: Notify }) {
  const [tab, setTab] = useState<BusinessResourceType>("talent");
  return (
    <div className="business-resource-workspace">
      <div className="resource-subtabs" aria-label="业务资源类型">
        {(Object.keys(businessResourceConfigs) as BusinessResourceType[]).map((type) => <button className={tab === type ? "active" : ""} onClick={() => setTab(type)} key={type}>{businessResourceConfigs[type].tab}</button>)}
      </div>
      <BusinessResourceWorkspace type={tab} openModal={openModal} notify={notify} key={tab} />
    </div>
  );
}

function DirectoryEditorModal({ mode, initialValue, close, save }: { mode: "create" | "edit"; initialValue: string; close: () => void; save: (value: string) => void }) {
  const [value, setValue] = useState(initialValue);
  const canSubmit = value.trim().length > 0;
  return createPortal(
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && close()}>
      <div className="modal directory-editor-modal" role="dialog" aria-modal="true" aria-label={mode === "create" ? "新增目录" : "编辑目录"}>
        <ModalHeader title={mode === "create" ? "新增目录" : "编辑目录"} close={close} />
        <form className="modal-form" onSubmit={(event) => { event.preventDefault(); if (canSubmit) save(value.trim()); }}>
          <div className="modal-form-body"><FormField label="目录名称" required><input value={value} placeholder="请输入目录名称" onChange={(event) => setValue(event.target.value)} /></FormField></div>
          <div className="modal-footer"><Button onClick={close}>取消</Button><Button type="submit" variant="primary" disabled={!canSubmit}>保存</Button></div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

function BusinessItemModal({ mode, columns, requiredColumns, values, close, save }: { mode: "create" | "edit" | "detail"; columns: string[]; requiredColumns: string[]; values: Record<string, string>; close: () => void; save: (values: Record<string, string>) => void }) {
  const [formValues, setFormValues] = useState(values);
  const title = mode === "create" ? "新增资源" : mode === "edit" ? "编辑资源" : "资源详情";
  const canSubmit = requiredColumns.every((column) => String(formValues[column] ?? "").trim().length > 0);
  return createPortal(
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && close()}>
      <div className="modal business-item-modal" role="dialog" aria-modal="true" aria-label={title}>
        <ModalHeader title={title} close={close} />
        <form className="modal-form" onSubmit={(event) => { event.preventDefault(); if (mode !== "detail" && canSubmit) save(formValues); }}>
          <div className="modal-form-body business-item-form">{columns.map((column) => <FormField label={column} required={mode !== "detail" && requiredColumns.includes(column)} key={column}><input disabled={mode === "detail"} value={formValues[column] ?? ""} placeholder={`请输入${column}`} onChange={(event) => setFormValues((current) => ({ ...current, [column]: event.target.value }))} /></FormField>)}</div>
          <div className="modal-footer">{mode === "detail" ? <Button onClick={close}>关闭</Button> : <><Button onClick={close}>取消</Button><Button type="submit" variant="primary" disabled={!canSubmit}>保存</Button></>}</div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

function BusinessResourceWorkspace({ type, openModal, notify }: { type: BusinessResourceType; openModal: OpenModal; notify: Notify }) {
  const config = businessResourceConfigs[type];
  const resourceTotals = type === "talent" ? [128, 96, 74] : type === "report" ? [46, 32, 28, 20] : [18, 12, 9];
  const [directories, setDirectories] = useState(() => config.directories.map((name, index) => ({ name, count: resourceTotals[index] ?? 0 })));
  const [directory, setDirectory] = useState(config.directories[0]);
  const [directoryEditor, setDirectoryEditor] = useState<"create" | "edit" | null>(null);
  const [resourceRows, setResourceRows] = useState<Array<Record<string, string>>>(() => config.rows.map((row) => ({ ...row })));
  const [itemEditor, setItemEditor] = useState<{ mode: "create" | "edit" | "detail"; index: number; values: Record<string, string> } | null>(null);
  const selectedDirectory = directories.find((item) => item.name === directory) ?? directories[0];
  const selectedTotal = String(selectedDirectory?.count ?? 0);
  const selectedDescription = type === "talent" ? `聚合${directory}相关学者资源` : type === "report" ? `${directory}资源集合` : `${directory}数据资源集合`;
  const rowActions = type === "report" ? ["编辑", "删除"] : ["查看", "编辑", "删除"];
  const primaryColumn = config.columns[0];
  const emptyValues = Object.fromEntries(config.columns.map((column) => [column, column === "关联时间" ? "2026-07-13 16:10" : ""]));
  const saveDirectory = (name: string) => {
    if (directories.some((item) => item.name === name && item.name !== directory)) {
      notify("目录名称已存在", "warning");
      return;
    }
    if (directoryEditor === "create") {
      setDirectories((list) => [...list, { name, count: 0 }]);
      setDirectory(name);
      notify("目录新增成功");
    } else {
      setDirectories((list) => list.map((item) => item.name === directory ? { ...item, name } : item));
      setDirectory(name);
      notify("目录编辑成功");
    }
    setDirectoryEditor(null);
  };
  return (
    <div className="business-resource-layout">
      <aside className="business-directory">
        <div className="business-directory-heading"><h3>{config.directoryTitle}</h3><button type="button" aria-label="新增目录" title="新增目录" onClick={() => setDirectoryEditor("create")}><Plus size={16} /></button></div>
        <div className="tree-list business-tree-list">
          {directories.map((item) => (
            <button type="button" className={directory === item.name ? "active" : ""} onClick={() => setDirectory(item.name)} key={item.name}>
              <FolderOpen size={16} /><span>{item.name}</span><b>{item.count}</b>
            </button>
          ))}
        </div>
        <div className="business-directory-actions"><button type="button" onClick={() => setDirectoryEditor("edit")}>编辑</button><button type="button" className="danger-action" disabled={directories.length <= 1} onClick={() => openModal("delete", { payload: { message: `确认删除${directory}？` }, onConfirm: () => { const remaining = directories.filter((item) => item.name !== directory); setDirectories(remaining); setDirectory(remaining[0].name); } })}>删除</button></div>
      </aside>
      <section className="business-resource-content">
        <div className="business-resource-summary">
          <div><span>{type === "talent" ? "人才库名称" : type === "report" ? "报告资源名称" : "智库资源名称"}</span><strong>{directory}</strong></div>
          <div className="summary-description"><span>描述</span><p>{selectedDescription}</p></div>
          <div className="summary-count"><span>{config.info.总数标签}</span><strong>{selectedTotal}</strong></div>
          <div><span>创建人</span><strong>{config.info.创建人}</strong></div>
        </div>
        <div className="table-toolbar"><div><Button variant="primary" icon={Plus} onClick={() => setItemEditor({ mode: "create", index: -1, values: emptyValues })}>新增</Button></div></div>
        <DataTable columns={config.columns} rows={resourceRows} actions={(row) => <ActionLinks actions={rowActions} onAction={(action) => {
          const rowIndex = resourceRows.findIndex((item) => item[primaryColumn] === String(row[primaryColumn]));
          const values = resourceRows[rowIndex] ?? emptyValues;
          if (action === "查看") setItemEditor({ mode: "detail", index: rowIndex, values });
          if (action === "编辑") setItemEditor({ mode: "edit", index: rowIndex, values });
          if (action === "删除") openModal("delete", { payload: { message: `确认删除${values[primaryColumn]}？` }, onConfirm: () => setResourceRows((list) => list.filter((_, index) => index !== rowIndex)) });
        }} />} />
      </section>
      {directoryEditor && <DirectoryEditorModal mode={directoryEditor} initialValue={directoryEditor === "edit" ? directory : ""} close={() => setDirectoryEditor(null)} save={saveDirectory} />}
      {itemEditor && <BusinessItemModal mode={itemEditor.mode} columns={config.columns} requiredColumns={config.requiredColumns} values={itemEditor.values} close={() => setItemEditor(null)} save={(values) => {
        if (itemEditor.mode === "create") setResourceRows((list) => [...list, values]);
        else setResourceRows((list) => list.map((item, index) => index === itemEditor.index ? values : item));
        setItemEditor(null);
        notify(itemEditor.mode === "create" ? "新增成功" : "编辑成功");
      }} />}
    </div>
  );
}

const pagePermissionGroups = [
  { label: "系统管理", items: [{ key: "report", label: "报告管理", level: 0 }, { key: "workflow", label: "审核流程管理 / 流程中心", level: 0 }, { key: "form", label: "审核流程管理 / 表单中心", level: 1 }, { key: "audit", label: "审核内容管理 / 评论审核", level: 1 }, { key: "event-info", label: "埋点管理 / 埋点信息管理", level: 0 }, { key: "event-dashboard", label: "埋点管理 / 埋点数据统计", level: 1 }] },
  { label: "权限管理", items: [{ key: "user", label: "用户管理", level: 0 }, { key: "role", label: "角色管理", level: 0 }, { key: "page", label: "页面管理", level: 0 }, { key: "resource", label: "资源管理", level: 0 }, { key: "permission", label: "权限配置", level: 0 }] },
];

const resourcePermissionGroups = [
  { label: "人才库资源", items: ["人工智能人才库", "新材料人才库", "生命科学人才库"] },
  { label: "报告资源", items: ["TR报告", "战略咨询报告", "洞察分析报告", "未来产业报告"] },
  { label: "智库资源", items: ["科技政策智库", "未来产业智库", "区域创新智库"] },
];

function RoleTransferModal({ user, roles, close, save }: { user: (typeof userRows)[number]; roles: string[]; close: () => void; save: (roles: string[]) => void }) {
  const [selected, setSelected] = useState(roles);
  const [availableChecked, setAvailableChecked] = useState<string[]>([]);
  const [selectedChecked, setSelectedChecked] = useState<string[]>([]);
  const available = roleOptions.filter((role) => !selected.includes(role));
  const toggleChecked = (value: string, list: string[], setter: (next: string[]) => void) => setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  return createPortal(
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && close()}>
      <div className="modal role-transfer-modal" role="dialog" aria-modal="true" aria-label="分配角色">
        <ModalHeader title="分配角色" subtitle={`${user.用户姓名} · ${user.所属组织名称}`} close={close} />
        <div className="modal-form">
          <div className="modal-form-body role-transfer-body">
            <section className="transfer-pane"><header><h3>可选角色</h3><span>{available.length}</span></header><div>{available.length ? available.map((role) => <label key={role}><input className="gkx-checkbox" type="checkbox" checked={availableChecked.includes(role)} onChange={() => toggleChecked(role, availableChecked, setAvailableChecked)} /><span>{role}</span></label>) : <p>暂无可选角色</p>}</div></section>
            <div className="transfer-actions"><button type="button" disabled={!availableChecked.length} aria-label="添加所选角色" onClick={() => { setSelected((list) => [...list, ...availableChecked]); setAvailableChecked([]); }}><ChevronRight size={17} /></button><button type="button" disabled={!selectedChecked.length} aria-label="移除所选角色" onClick={() => { setSelected((list) => list.filter((role) => !selectedChecked.includes(role))); setSelectedChecked([]); }}><ChevronLeft size={17} /></button></div>
            <section className="transfer-pane"><header><h3>已选角色</h3><span>{selected.length}</span></header><div>{selected.length ? selected.map((role) => <label key={role}><input className="gkx-checkbox" type="checkbox" checked={selectedChecked.includes(role)} onChange={() => toggleChecked(role, selectedChecked, setSelectedChecked)} /><span>{role}</span></label>) : <p>暂未分配角色</p>}</div></section>
          </div>
          <div className="modal-footer"><Button onClick={close}>取消</Button><Button variant="primary" onClick={() => save(selected)}>保存</Button></div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function PagePermissionTree({ selected, onChange }: { selected: string[]; onChange: (next: string[]) => void }) {
  const toggleKeys = (keys: string[], checked: boolean) => onChange(checked ? Array.from(new Set([...selected, ...keys])) : selected.filter((key) => !keys.includes(key)));
  return <div className="permission-checkbox-tree">{pagePermissionGroups.map((group) => {
    const groupKeys = group.items.map((item) => item.key);
    const allChecked = groupKeys.every((key) => selected.includes(key));
    return <section key={group.label}><label className="permission-tree-parent"><input className="gkx-checkbox" type="checkbox" checked={allChecked} onChange={(event) => toggleKeys(groupKeys, event.target.checked)} /><span>{group.label}</span></label><div>{group.items.map((item) => <label className={`permission-tree-child level-${item.level}`} key={item.key}><input className="gkx-checkbox" type="checkbox" checked={selected.includes(item.key)} onChange={(event) => toggleKeys([item.key], event.target.checked)} /><span>{item.label}</span></label>)}</div></section>;
  })}</div>;
}

function ResourcePermissionTree({ selected, onChange }: { selected: string[]; onChange: (next: string[]) => void }) {
  const toggle = (key: string, checked: boolean) => onChange(checked ? Array.from(new Set([...selected, key])) : selected.filter((item) => item !== key));
  return <div className="resource-permission-tree"><div className="resource-permission-head"><span>资源范围</span><span>可见</span><span>可维护</span></div>{resourcePermissionGroups.map((group) => <section key={group.label}><h4>{group.label}</h4>{group.items.map((item) => <div className="resource-permission-row" key={item}><span><FolderOpen size={15} />{item}</span>{["view", "edit"].map((permission) => { const key = `${group.label}/${item}/${permission}`; return <label key={key}><input className="gkx-checkbox" type="checkbox" aria-label={`${item}${permission === "view" ? "可见" : "可维护"}`} checked={selected.includes(key)} onChange={(event) => toggle(key, event.target.checked)} /></label>; })}</div>)}</section>)}</div>;
}

function PermissionConfig({ notify }: { notify: Notify }) {
  const [tab, setTab] = useState<"users" | "roles">("users");
  const [userKeyword, setUserKeyword] = useState("");
  const [userRoleMap, setUserRoleMap] = useState<Record<string, string[]>>({ U20260001: ["普通用户"], U20260002: ["机构用户", "政府用户"] });
  const [transferUser, setTransferUser] = useState<(typeof userRows)[number] | null>(null);
  const roles = ["系统管理员", ...roleOptions];
  const [activeRole, setActiveRole] = useState("系统管理员");
  const [permissionTab, setPermissionTab] = useState<"pages" | "resources">("pages");
  const [pagePermissions, setPagePermissions] = useState<Record<string, string[]>>({ 系统管理员: pagePermissionGroups.flatMap((group) => group.items.map((item) => item.key)), 普通用户: ["report", "event-dashboard"], 机构用户: ["report", "workflow", "form", "event-info"], 政府用户: ["report", "event-dashboard"] });
  const [resourcePermissions, setResourcePermissions] = useState<Record<string, string[]>>({ 系统管理员: resourcePermissionGroups.flatMap((group) => group.items.flatMap((item) => [`${group.label}/${item}/view`, `${group.label}/${item}/edit`])), 普通用户: ["报告资源/TR报告/view"], 机构用户: ["人才库资源/人工智能人才库/view", "报告资源/TR报告/view"], 政府用户: ["智库资源/科技政策智库/view"] });
  const filteredUsers = userRows.filter((user) => user.用户姓名.includes(userKeyword.trim()));
  return (
    <section className="card permission-page permission-config-page">
      <div className="resource-tabs permission-primary-tabs" aria-label="权限配置类型"><button className={tab === "users" ? "active" : ""} onClick={() => setTab("users")}>用户</button><button className={tab === "roles" ? "active" : ""} onClick={() => setTab("roles")}>角色</button></div>
      {tab === "users" ? (
        <div className="permission-user-list">
          <div className="filters permission-user-filters"><FilterInput label="用户检索" placeholder="请输入" searchable value={userKeyword} onChange={setUserKeyword} /></div>
          <DataTable columns={["用户ID", "用户姓名", "所属组织名称", "手机号", "当前角色"]} rows={filteredUsers.map((user) => ({ ...user, 当前角色: (userRoleMap[user.用户ID] ?? []).join("、") || "未分配" }))} actions={(row) => <ActionLinks actions={["分配角色"]} onAction={() => setTransferUser(userRows.find((user) => user.用户ID === row.用户ID) ?? null)} />} />
        </div>
      ) : (
        <div className="role-permission-console">
          <aside className="role-selector"><h3>角色列表</h3>{roles.map((role) => <button type="button" className={activeRole === role ? "active" : ""} onClick={() => setActiveRole(role)} key={role}><ShieldCheck size={16} /><span><b>{role}</b><small>{role === "系统管理员" ? "全部系统权限" : "自定义权限"}</small></span><ChevronRight size={15} /></button>)}</aside>
          <section className="permission-workspace">
            <div className="permission-workspace-header"><div><h3>{activeRole}</h3><p>配置该角色可访问的页面与业务资源范围</p></div><Button variant="primary" icon={Save} onClick={() => notify("权限配置保存成功")}>保存配置</Button></div>
            <div className="resource-subtabs permission-workspace-tabs"><button className={permissionTab === "pages" ? "active" : ""} onClick={() => setPermissionTab("pages")}>页面</button><button className={permissionTab === "resources" ? "active" : ""} onClick={() => setPermissionTab("resources")}>资源</button></div>
            {permissionTab === "pages" ? <><div className="permission-note"><ShieldCheck size={16} /><span>若页面管理中页面已禁用，则优先覆盖此处配置。</span></div><PagePermissionTree selected={pagePermissions[activeRole] ?? []} onChange={(next) => setPagePermissions((current) => ({ ...current, [activeRole]: next }))} /></> : <ResourcePermissionTree selected={resourcePermissions[activeRole] ?? []} onChange={(next) => setResourcePermissions((current) => ({ ...current, [activeRole]: next }))} />}
          </section>
        </div>
      )}
      {transferUser && <RoleTransferModal user={transferUser} roles={userRoleMap[transferUser.用户ID] ?? []} close={() => setTransferUser(null)} save={(nextRoles) => { setUserRoleMap((current) => ({ ...current, [transferUser.用户ID]: nextRoles })); setTransferUser(null); notify("角色分配成功"); }} />}
    </section>
  );
}

const reportFormFields = ["报告标题", "报告类型", "报告来源", "所属领域", "上传时间", "内容摘要"] as const;
const trackingFormFields = ["事件ID", "所属功能模块", "埋点标签", "埋点路径", "触发机制"] as const;
const userFormFields = ["姓名", "手机号", "邮箱", "所属组织"] as const;
const roleFormFields = ["角色名称", "角色描述", "状态"] as const;
const pageFormFields = ["标题", "地址(URL)", "父页面", "启用属性"] as const;

function useModalValues(payload: ModalPayload, fields: readonly string[], aliases: Record<string, string> = {}) {
  const makeValues = () => Object.fromEntries(fields.map((field) => [field, payload[field] ?? payload[aliases[field] ?? ""] ?? ""]));
  const [values, setValues] = useState<ModalPayload>(makeValues);

  useEffect(() => {
    setValues(makeValues());
  }, [payload]);

  return {
    values,
    setValue: (field: string, value: string) => setValues((current) => ({ ...current, [field]: value })),
  };
}

function getModalSuccessMessage(type: ModalType, mode: ModalMode) {
  if (mode === "detail") return "";
  if (type === "report") return mode === "edit" ? "编辑成功" : "报告上传成功";
  if (type === "tracking") return mode === "batch" ? "批量上传成功" : mode === "edit" ? "编辑成功" : "新增成功";
  if (type === "user") return "用户注册成功";
  if (type === "role" || type === "page") return mode === "edit" ? "编辑成功" : "新建成功";
  return "保存成功";
}

function Modal({ type, mode = "create", payload = {}, onConfirm, onSave, close, notify }: { type: ModalType; mode?: ModalMode; payload?: ModalPayload; onConfirm?: () => void; onSave?: ModalSave; close: () => void; notify: Notify }) {
  if (!type) return null;
  const handleSave: ModalSave = (values) => {
    onSave?.(values);
    const message = getModalSuccessMessage(type, mode);
    if (message) notify(message);
  };
  if (type === "delete") return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="modal confirm-modal">
        <ModalHeader title={payload.title || "确认删除"} close={close} />
        <div className="modal-form">
          <div className="confirm-modal-body">
            <p className="confirm-modal-message">{payload.message}</p>
            <p className="confirm-modal-description">{payload.description || "此操作无法撤销，删除后数据将无法恢复。"}</p>
          </div>
          <div className="modal-footer"><Button onClick={close}>取消</Button><Button variant="danger" onClick={() => { onConfirm?.(); notify(payload.successMessage || "删除成功"); close(); }}>{payload.confirmLabel || "删除"}</Button></div>
        </div>
      </div>
    </div>
  );
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="modal form-modal">
        {type === "report" && <ReportModal close={close} mode={mode} payload={payload} onSave={handleSave} />}
        {type === "tracking" && mode === "batch" && <TrackingBatchModal close={close} onSuccess={() => notify(getModalSuccessMessage(type, mode))} />}
        {type === "tracking" && mode !== "batch" && <TrackingModal close={close} mode={mode} payload={payload} onSave={handleSave} />}
        {type === "user" && <UserModal close={close} mode={mode} payload={payload} onSave={handleSave} />}
        {type === "role" && <RoleModal close={close} payload={payload} onSave={handleSave} />}
        {type === "page" && <PageModal close={close} payload={payload} onSave={handleSave} />}
      </div>
    </div>
  );
}

function ReportModal({ close, mode, payload, onSave }: { close: () => void; mode: ModalMode; payload: ModalPayload; onSave?: ModalSave }) {
  const { values, setValue } = useModalValues(payload, reportFormFields);
  const [fileName, setFileName] = useState("");
  const isEdit = mode === "edit";
  const canSubmit = ["报告标题", "报告类型", "报告来源", "所属领域", "上传时间"].every((field) => values[field]?.trim()) && (isEdit || fileName.length > 0);
  return (
    <>
      <ModalHeader title="报告上传/信息修改" close={close} />
      <form className="modal-form" onSubmit={(e) => { e.preventDefault(); if (!canSubmit) return; onSave?.(values); close(); }}>
        <div className="modal-form-body">
          <FormField label="PDF格式文件" required={!isEdit}><FileUploadField onFileChange={setFileName} /></FormField>
          <div className="form-row">
            <FormField label="报告标题" required><input value={values.报告标题} onChange={(event) => setValue("报告标题", event.target.value)} /></FormField>
            <FormField label="报告类型" required><FormSelect options={reportTypeOptions} value={values.报告类型} onChange={(value) => setValue("报告类型", value)} /></FormField>
          </div>
          <div className="form-row">
            <FormField label="报告来源" required><input value={values.报告来源} onChange={(event) => setValue("报告来源", event.target.value)} /></FormField>
            <FormField label="所属领域" required><FormSelect options={["人工智能", "智能制造", "新材料", "低空经济"]} value={values.所属领域} onChange={(value) => setValue("所属领域", value)} /></FormField>
          </div>
          <FormField label="上传时间" required><DateField value={values.上传时间} onChange={(value) => setValue("上传时间", value)} /></FormField>
          <FormField label="内容摘要"><textarea value={values.内容摘要} onChange={(event) => setValue("内容摘要", event.target.value)} /></FormField>
        </div>
        <div className="modal-footer"><Button onClick={close}>取消</Button><Button type="submit" variant="primary" disabled={!canSubmit}>保存</Button></div>
      </form>
    </>
  );
}

function TrackingBatchModal({ close, onSuccess }: { close: () => void; onSuccess: () => void }) {
  const [fileName, setFileName] = useState("");
  return (
    <>
      <ModalHeader title="批量上传埋点" close={close} />
      <form className="modal-form" onSubmit={(event) => { event.preventDefault(); if (!fileName) return; onSuccess(); close(); }}>
        <div className="modal-form-body"><FormField label="上传文件" required><FileUploadField accept=".xlsx,.xls,.csv" hint="支持 .xlsx、.xls、.csv 格式" onFileChange={setFileName} /></FormField></div>
        <div className="modal-footer"><Button onClick={close}>取消</Button><Button type="submit" variant="primary" disabled={!fileName}>保存</Button></div>
      </form>
    </>
  );
}

function TrackingModal({ close, mode, payload, onSave }: { close: () => void; mode: Exclude<ModalMode, "batch">; payload: ModalPayload; onSave?: ModalSave }) {
  const { values, setValue } = useModalValues(payload, trackingFormFields);
  const isDetail = mode === "detail";
  const canSubmit = trackingFormFields.every((field) => values[field]?.trim());
  const moduleOptions = ["报告管理", "审核管理", "用户管理", "角色管理", "页面管理", "资源管理", "权限配置"];
  const triggerOptions = ["点击", "提交", "保存", "曝光", "页面加载"];
  return (
    <>
      <ModalHeader title={isDetail ? "查看详情" : mode === "edit" ? "修改埋点" : "新增埋点事件"} close={close} />
      <form className="modal-form" onSubmit={(e) => { e.preventDefault(); if (!isDetail && !canSubmit) return; onSave?.(values); close(); }}>
        <div className="modal-form-body">
          <FormField label="事件ID" required={!isDetail}><input readOnly={isDetail} value={values.事件ID} onChange={(event) => setValue("事件ID", event.target.value)} /></FormField>
          <FormField label="所属功能模块" required={!isDetail}><FormSelect ariaLabel="所属功能模块" options={moduleOptions} value={values.所属功能模块} disabled={isDetail} onChange={(value) => setValue("所属功能模块", value)} /></FormField>
          <FormField label="埋点标签" required={!isDetail}><input readOnly={isDetail} value={values.埋点标签} onChange={(event) => setValue("埋点标签", event.target.value)} /></FormField>
          <FormField label="埋点路径" required={!isDetail}><input readOnly={isDetail} value={values.埋点路径} onChange={(event) => setValue("埋点路径", event.target.value)} /></FormField>
          <FormField label="触发机制" required={!isDetail}><FormSelect ariaLabel="触发机制" options={triggerOptions} value={values.触发机制} disabled={isDetail} onChange={(value) => setValue("触发机制", value)} /></FormField>
        </div>
        <div className="modal-footer">{isDetail ? <Button variant="primary" onClick={close}>关闭</Button> : <><Button onClick={close}>取消</Button><Button type="submit" variant="primary" disabled={!canSubmit}>保存</Button></>}</div>
      </form>
    </>
  );
}

function findOrganizationPath(nodes: OrganizationNode[], label: string, path: OrganizationNode[] = []): OrganizationNode[] | null {
  for (const node of nodes) {
    const nextPath = [...path, node];
    if (node.label === label) return nextPath;
    const childPath = findOrganizationPath(node.children ?? [], label, nextPath);
    if (childPath) return childPath;
  }
  return null;
}

function OrganizationCascader({ value, disabled, onChange }: { value: string; disabled: boolean; onChange: (value: string) => void }) {
  const initialPath = findOrganizationPath(initialOrganizationTree, value) ?? [initialOrganizationTree[0]];
  const [levelOneId] = useState(initialPath[0]?.id ?? initialOrganizationTree[0].id);
  const [levelTwoId, setLevelTwoId] = useState(initialPath[1]?.id ?? "");
  const [levelThreeId, setLevelThreeId] = useState(initialPath[2]?.id ?? "");
  const levelOne = initialOrganizationTree.find((node) => node.id === levelOneId) ?? initialOrganizationTree[0];
  const levelTwoOptions = levelOne.children ?? [];
  const levelTwo = levelTwoOptions.find((node) => node.id === levelTwoId);
  const levelThreeOptions = levelTwo?.children ?? [];
  return (
    <div className="organization-cascader" aria-label="所属组织级联选择器">
      <select aria-label="一级组织" value={levelOneId} disabled={disabled}><option value={levelOne.id}>{levelOne.label}</option></select>
      <select aria-label="二级组织" value={levelTwoId} disabled={disabled} onChange={(event) => {
        const nextId = event.target.value;
        const nextNode = levelTwoOptions.find((node) => node.id === nextId);
        setLevelTwoId(nextId);
        setLevelThreeId("");
        onChange(nextNode?.label ?? levelOne.label);
      }}>
        <option value="">请选择</option>
        {levelTwoOptions.map((node) => <option key={node.id} value={node.id}>{node.label}</option>)}
      </select>
      <select aria-label="三级组织" value={levelThreeId} disabled={disabled || !levelTwoId} onChange={(event) => {
        const nextId = event.target.value;
        const nextNode = levelThreeOptions.find((node) => node.id === nextId);
        setLevelThreeId(nextId);
        onChange(nextNode?.label ?? levelTwo?.label ?? levelOne.label);
      }}>
        <option value="">{levelTwoId ? "可选" : "请先选择上级"}</option>
        {levelThreeOptions.map((node) => <option key={node.id} value={node.id}>{node.label}</option>)}
      </select>
    </div>
  );
}

function UserModal({ close, mode, payload, onSave }: { close: () => void; mode: ModalMode; payload: ModalPayload; onSave?: ModalSave }) {
  const { values, setValue } = useModalValues(payload, userFormFields, { 姓名: "用户姓名", 所属组织: "所属组织名称" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isDetail = mode === "detail";
  const submit = () => {
    const nextErrors: Record<string, string> = {};
    if (!values.姓名.trim()) nextErrors.姓名 = "请输入姓名";
    if (!/^1[3-9]\d{9}$/.test(values.手机号.trim())) nextErrors.手机号 = "请输入正确的 11 位手机号";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.邮箱.trim())) nextErrors.邮箱 = "请输入正确的邮箱地址";
    if (!values.所属组织.trim()) nextErrors.所属组织 = "请选择所属组织";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSave?.(values);
    close();
  };
  const changeValue = (field: string, value: string) => {
    setValue(field, value);
    if (errors[field]) setErrors((current) => ({ ...current, [field]: "" }));
  };
  return (
    <>
      <ModalHeader title={isDetail ? "用户详情" : "用户注册"} close={close} />
      <form className="modal-form user-account-form" onSubmit={(event) => { event.preventDefault(); if (!isDetail) submit(); }} noValidate>
        <div className="modal-form-body">
          <FormField label="姓名" required={!isDetail}><div className="validated-control"><input readOnly={isDetail} className={errors.姓名 ? "is-error" : ""} placeholder="请输入姓名" value={values.姓名} onChange={(event) => changeValue("姓名", event.target.value)} />{errors.姓名 && <span className="form-error-message">{errors.姓名}</span>}</div></FormField>
          <FormField label="手机号" required={!isDetail}><div className="validated-control"><input readOnly={isDetail} className={errors.手机号 ? "is-error" : ""} type="tel" inputMode="numeric" maxLength={11} placeholder="请输入11位手机号" value={values.手机号} onChange={(event) => changeValue("手机号", event.target.value.replace(/\D/g, ""))} />{errors.手机号 && <span className="form-error-message">{errors.手机号}</span>}</div></FormField>
          <FormField label="邮箱" required={!isDetail}><div className="validated-control"><input readOnly={isDetail} className={errors.邮箱 ? "is-error" : ""} type="email" placeholder="请输入邮箱地址" value={values.邮箱} onChange={(event) => changeValue("邮箱", event.target.value)} />{errors.邮箱 && <span className="form-error-message">{errors.邮箱}</span>}</div></FormField>
          <FormField label="所属组织" required={!isDetail}><div className={`validated-control ${errors.所属组织 ? "is-error" : ""}`}><OrganizationCascader value={values.所属组织} disabled={isDetail} onChange={(value) => changeValue("所属组织", value)} />{errors.所属组织 && <span className="form-error-message">{errors.所属组织}</span>}</div></FormField>
        </div>
        <div className="modal-footer">{isDetail ? <Button variant="primary" onClick={close}>关闭</Button> : <><Button onClick={close}>取消</Button><Button type="submit" variant="primary">注册</Button></>}</div>
      </form>
    </>
  );
}

function RoleModal({ close, payload, onSave }: { close: () => void; payload: ModalPayload; onSave?: ModalSave }) {
  const { values, setValue } = useModalValues(payload, roleFormFields);
  const canSubmit = values.角色名称.trim().length > 0 && values.状态.trim().length > 0;
  return (
    <>
      <ModalHeader title="创建/编辑" close={close} />
      <form className="modal-form" onSubmit={(e) => { e.preventDefault(); if (!canSubmit) return; onSave?.(values); close(); }}>
        <div className="modal-form-body">
          <FormField label="角色名称" required><input value={values.角色名称} onChange={(event) => setValue("角色名称", event.target.value)} /></FormField>
          <FormField label="角色描述"><textarea value={values.角色描述} onChange={(event) => setValue("角色描述", event.target.value)} /></FormField>
          <FormField label="状态" required><FormSelect options={statusOptions} value={values.状态} onChange={(value) => setValue("状态", value)} /></FormField>
        </div>
        <div className="modal-footer"><Button onClick={close}>取消</Button><Button type="submit" variant="primary" disabled={!canSubmit}>保存</Button></div>
      </form>
    </>
  );
}

function PageModal({ close, payload, onSave }: { close: () => void; payload: ModalPayload; onSave?: ModalSave }) {
  const { values, setValue } = useModalValues(payload, pageFormFields);
  const canSubmit = values.标题.trim().length > 0 && values["地址(URL)"].trim().length > 0 && values.启用属性.trim().length > 0;
  return (
    <>
      <ModalHeader title="新建页面/修改页面" close={close} />
      <form className="modal-form" onSubmit={(e) => { e.preventDefault(); if (!canSubmit) return; onSave?.(values); close(); }}>
        <div className="modal-form-body">
          <FormField label="标题" required><input value={values.标题} onChange={(event) => setValue("标题", event.target.value)} /></FormField>
          <FormField label="地址(URL)" required><input value={values["地址(URL)"]} onChange={(event) => setValue("地址(URL)", event.target.value)} /></FormField>
          <FormField label="父页面"><input value={values.父页面} onChange={(event) => setValue("父页面", event.target.value)} /></FormField>
          <FormField label="启用属性" required><FormSelect options={statusOptions} value={values.启用属性} onChange={(value) => setValue("启用属性", value)} /></FormField>
        </div>
        <div className="modal-footer"><Button onClick={close}>取消</Button><Button type="submit" variant="primary" disabled={!canSubmit}>保存</Button></div>
      </form>
    </>
  );
}

function FileUploadField({ id, accept = "application/pdf", hint = "仅支持 PDF 格式文件", onFileChange }: { id?: string; accept?: string; hint?: string; onFileChange?: (fileName: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const clearFile = () => {
    if (inputRef.current) inputRef.current.value = "";
    setFileName("");
    onFileChange?.("");
  };
  return (
    <div className="upload-field">
      <input
        ref={inputRef}
        id={id}
        className="upload-file-input"
        type="file"
        accept={accept}
        onChange={(event) => {
          const nextFileName = event.target.files?.[0]?.name ?? "";
          setFileName(nextFileName);
          onFileChange?.(nextFileName);
        }}
      />
      <button className="upload-trigger" type="button" onClick={() => inputRef.current?.click()}><Upload size={14} />点击上传</button>
      <small className="upload-hint">{hint}</small>
      {fileName && (
        <div className="upload-file-row">
          <FileText size={16} />
          <span>{fileName}</span>
          <button type="button" aria-label="移除文件" onClick={clearFile}><X size={16} /></button>
        </div>
      )}
    </div>
  );
}

type FormSelectProps = {
  id?: string;
  options: string[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  disabled?: boolean;
};

type SelectMenuPosition = { left: number; top: number; width: number };

function FormSelect({ id, options, defaultValue, value, onChange, placeholder = "请选择", ariaLabel, disabled = false }: FormSelectProps) {
  const [internalSelected, setInternalSelected] = useState(defaultValue ?? options[0] ?? "");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() => Math.max(0, options.indexOf(value ?? defaultValue ?? options[0] ?? "")));
  const [menuPosition, setMenuPosition] = useState<SelectMenuPosition | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const selected = value ?? internalSelected;

  const updateMenuPosition = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMenuPosition({ left: rect.left, top: rect.bottom + 4, width: rect.width });
  };

  useEffect(() => {
    if (!open) return undefined;
    updateMenuPosition();
    const closeOnExternalPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!triggerRef.current?.contains(target) && !menuRef.current?.contains(target)) setOpen(false);
    };
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);
    document.addEventListener("pointerdown", closeOnExternalPointerDown);
    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
      document.removeEventListener("pointerdown", closeOnExternalPointerDown);
    };
  }, [open]);

  const openMenu = () => {
    if (disabled || !options.length) return;
    updateMenuPosition();
    setActiveIndex(Math.max(0, options.indexOf(selected)));
    setOpen(true);
  };

  const moveActive = (offset: number) => {
    if (!options.length) return;
    setActiveIndex((current) => (current + offset + options.length) % options.length);
  };

  const selectOption = (option: string) => {
    if (value === undefined) setInternalSelected(option);
    onChange?.(option);
    setOpen(false);
  };

  return (
    <div
      className={`gkx-select ${open ? "is-open" : ""}`}
      onBlur={(event) => {
        const nextTarget = event.relatedTarget;
        if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) setOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        className="gkx-select-trigger"
        aria-label={ariaLabel}
        aria-controls={menuId}
        aria-activedescendant={open ? `${menuId}-option-${activeIndex}` : undefined}
        aria-expanded={open}
        aria-haspopup="listbox"
        disabled={disabled}
        onClick={() => {
          if (open) setOpen(false);
          else openMenu();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            if (!open) openMenu();
            else moveActive(event.key === "ArrowDown" ? 1 : -1);
          } else if (event.key === "Home" || event.key === "End") {
            event.preventDefault();
            if (!open) openMenu();
            setActiveIndex(event.key === "Home" ? 0 : Math.max(0, options.length - 1));
          } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (!open) openMenu();
            else if (options[activeIndex]) selectOption(options[activeIndex]);
          } else if (event.key === "Escape") {
            setOpen(false);
          }
        }}
      >
        <span className={selected ? "" : "is-placeholder"}>{selected || placeholder}</span>
        <ChevronDown aria-hidden="true" size={16} />
      </button>
      {open && menuPosition && createPortal(
        <div
          id={menuId}
          ref={menuRef}
          className="gkx-select-menu"
          role="listbox"
          aria-label={ariaLabel}
          style={menuPosition}
          onMouseDown={(event) => event.preventDefault()}
        >
          {options.map((option, index) => (
            <button
              id={`${menuId}-option-${index}`}
              type="button"
              role="option"
              aria-selected={selected === option}
              className={`${selected === option ? "active" : ""} ${activeIndex === index ? "is-active" : ""}`.trim()}
              key={option}
              onClick={() => {
                setActiveIndex(index);
                selectOption(option);
              }}
            >
              {option}
            </button>
          ))}
        </div>,
        document.body,
      )}
    </div>
  );
}

type FormMultiSelectProps = Omit<FormSelectProps, "defaultValue" | "value" | "onChange"> & {
  value?: string[];
  onChange?: (value: string[]) => void;
};

function FormMultiSelect({ id, options, value, onChange, placeholder = "请选择", ariaLabel }: FormMultiSelectProps) {
  const [internalSelected, setInternalSelected] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [menuPosition, setMenuPosition] = useState<SelectMenuPosition | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const selected = value ?? internalSelected;
  const selectedText = selected.join("、");

  const updateMenuPosition = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMenuPosition({ left: rect.left, top: rect.bottom + 4, width: rect.width });
  };

  useEffect(() => {
    if (!open) return undefined;
    updateMenuPosition();
    const closeOnExternalPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!triggerRef.current?.contains(target) && !menuRef.current?.contains(target)) setOpen(false);
    };
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);
    document.addEventListener("pointerdown", closeOnExternalPointerDown);
    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
      document.removeEventListener("pointerdown", closeOnExternalPointerDown);
    };
  }, [open]);

  const openMenu = () => {
    if (!options.length) return;
    updateMenuPosition();
    setActiveIndex(Math.max(0, options.findIndex((option) => selected.includes(option))));
    setOpen(true);
  };

  const moveActive = (offset: number) => {
    if (!options.length) return;
    setActiveIndex((current) => (current + offset + options.length) % options.length);
  };

  const toggleOption = (option: string) => {
    const next = selected.includes(option) ? selected.filter((item) => item !== option) : [...selected, option];
    if (value === undefined) setInternalSelected(next);
    onChange?.(next);
  };

  return (
    <div
      className={`gkx-select ${open ? "is-open" : ""}`}
      onBlur={(event) => {
        const nextTarget = event.relatedTarget;
        if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) setOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        className="gkx-select-trigger"
        aria-label={ariaLabel}
        aria-controls={menuId}
        aria-activedescendant={open ? `${menuId}-option-${activeIndex}` : undefined}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => {
          if (open) setOpen(false);
          else openMenu();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            if (!open) openMenu();
            else moveActive(event.key === "ArrowDown" ? 1 : -1);
          } else if (event.key === "Home" || event.key === "End") {
            event.preventDefault();
            if (!open) openMenu();
            setActiveIndex(event.key === "Home" ? 0 : Math.max(0, options.length - 1));
          } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (!open) openMenu();
            else if (options[activeIndex]) toggleOption(options[activeIndex]);
          } else if (event.key === "Escape") {
            setOpen(false);
          }
        }}
      >
        <span className={selectedText ? "" : "is-placeholder"}>{selectedText || placeholder}</span>
        <ChevronDown aria-hidden="true" size={16} />
      </button>
      {open && menuPosition && createPortal(
        <div
          id={menuId}
          ref={menuRef}
          className="gkx-select-menu gkx-multiselect-menu"
          role="listbox"
          aria-label={ariaLabel}
          aria-multiselectable="true"
          style={menuPosition}
          onMouseDown={(event) => event.preventDefault()}
        >
          {options.map((option, index) => {
            const isSelected = selected.includes(option);
            return (
              <button
                id={`${menuId}-option-${index}`}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`${isSelected ? "is-selected" : ""} ${activeIndex === index ? "is-active" : ""}`.trim()}
                key={option}
                onClick={() => {
                  setActiveIndex(index);
                  toggleOption(option);
                }}
              >
                <i aria-hidden="true" />
                {option}
              </button>
            );
          })}
        </div>,
        document.body,
      )}
    </div>
  );
}

function DateField({ id, value, onChange }: { id?: string; value?: string; onChange?: (value: string) => void }) {
  return (
    <span className="date-field-control">
      <input id={id} type="date" value={value} onChange={(event) => onChange?.(event.target.value)} />
      <CalendarDays aria-hidden="true" size={16} />
    </span>
  );
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  const fieldId = useId();
  const control = isValidElement<{ id?: string }>(children) ? cloneElement(children, { id: fieldId }) : children;
  return <div className="form-field"><label className="form-field-label" htmlFor={fieldId}>{required && <em>*</em>}{label}</label>{control}</div>;
}

function ModalHeader({ title, subtitle, close }: { title: string; subtitle?: string; close: () => void }) {
  return <header className="modal-header"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div><button type="button" aria-label="关闭对话框" onClick={close}><X size={20} /></button></header>;
}

function Sidebar({ active, setActive, collapsed, setCollapsed }: { active: PageKey; setActive: (p: PageKey) => void; collapsed: boolean; setCollapsed: (v: boolean) => void }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ 审核管理: true, 埋点管理: true });
  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="brand">
        <img src="./assets/gkx-logo.png" alt="国科信" />
        {!collapsed && <strong>门户后台管理系统</strong>}
      </div>
      <button className="sidebar-fold" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? "展开侧栏" : "收起侧栏"}>
        <img src={collapsed ? "./assets/sidebar-collapsed.svg" : "./assets/sidebar-expanded.svg"} alt="" />
      </button>
      <nav>
        {navSections.map((section) => (
          <div className="nav-section-block" key={section.label}>
            {!collapsed && <div className="nav-section-title">{section.label}</div>}
            {section.items.map((item) => {
              const ItemIcon = item.icon;
              const isLeafActive = item.key === active;
              const hasActiveChild = item.children?.some((child) => child.key === active) ?? false;
              const isOpen = expanded[item.label] ?? hasActiveChild;
              if (item.key) {
                return (
                  <button className={`group-button nav-leaf ${isLeafActive ? "active" : ""}`} title={collapsed ? item.label : undefined} onClick={() => setActive(item.key!)} key={item.label}>
                    <ItemIcon className="nav-item-icon" size={20} strokeWidth={1.2} />
                    {!collapsed && <span>{item.label}</span>}
                  </button>
                );
              }
              return (
                <div className={`nav-group ${hasActiveChild ? "has-active" : ""}`} key={item.label}>
                  <button className="group-button nav-parent" aria-haspopup={collapsed ? "menu" : undefined} onClick={() => !collapsed && setExpanded({ ...expanded, [item.label]: !isOpen })}>
                    <ItemIcon className="nav-item-icon" size={20} strokeWidth={1.2} />
                    {!collapsed && <><span>{item.label}</span><ChevronDown className={`nav-chevron ${isOpen ? "rotate" : ""}`} size={16} strokeWidth={1.2} /></>}
                  </button>
                  {!collapsed && isOpen && <div className="group-children">{item.children?.map((child) => <button className={`${active === child.key ? "active" : ""} ${child.label.length > 8 ? "is-long-label" : ""}`.trim()} onClick={() => setActive(child.key)} key={child.key}>{child.label}</button>)}</div>}
                  {collapsed && <div className={`collapsed-submenu ${item.children?.some((child) => child.label.length > 8) ? "is-wide" : ""}`.trim()} role="menu" aria-label={`${item.label}二级菜单`}><strong>{item.label}</strong>{item.children?.map((child) => <button type="button" role="menuitem" className={`${active === child.key ? "active" : ""} ${child.label.length > 8 ? "is-long-label" : ""}`.trim()} onClick={() => setActive(child.key)} key={child.key}>{child.label}</button>)}</div>}
                </div>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}

function TopBar({ collapsed, onMenu, onSearch }: { collapsed: boolean; onMenu: () => void; onSearch: () => void }) {
  const [notifications, setNotifications] = useState(false);
  const [profile, setProfile] = useState(false);
  return (
    <header className={`topbar ${collapsed ? "wide" : ""}`}>
      <button className="mobile-menu" onClick={onMenu}><Menu size={20} /></button>
      <button className="global-search" onClick={onSearch}><Search size={17} /><span>搜索菜单</span><kbd>⌘ K</kbd></button>
      <div className="top-actions">
        <button className="top-link"><MessageSquareMore size={16} /><span>帮助</span></button>
        <button className="top-link"><LayoutGrid size={16} /><span>应用</span></button>
        <div className="popover-wrap">
          <button className="top-icon" onClick={() => { setNotifications(!notifications); setProfile(false); }}><Bell size={19} /><i /></button>
          {notifications && <div className="popover notification-pop"><header><b>消息通知</b><button>全部已读</button></header>{[["报告管理", "报告审核", "2分钟前"], ["审核管理", "流程中心", "1小时前"], ["埋点管理", "埋点数据统计", "昨天"]].map(([t, d, time], i) => <div className="notice-item" key={t}><span className={`notice-icon n${i + 1}`}>{i === 0 ? <FileBarChart size={16} /> : i === 1 ? <ClipboardCheck size={16} /> : <Activity size={16} />}</span><div><b>{t}</b><p>{d}</p><small>{time}</small></div></div>)}<footer>查看全部通知 <ChevronRight size={14} /></footer></div>}
        </div>
        <div className="popover-wrap">
          <button className="profile-button" onClick={() => { setProfile(!profile); setNotifications(false); }}><img src="./assets/user-avatar.png" alt="系统管理员" /><b>系统管理员</b><ChevronDown size={12} /></button>
          {profile && <div className="popover profile-pop"><button><CircleUserRound size={16} />个人中心</button><button><LockKeyhole size={16} />修改密码</button><i /><button className="logout"><LogOut size={16} />退出登录</button></div>}
        </div>
      </div>
    </header>
  );
}

export default function App() {
  const [active, setActive] = useState<PageKey>("report-management");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [formWorkspaceOpen, setFormWorkspaceOpen] = useState(false);
  const [formCenterVersion, setFormCenterVersion] = useState(0);
  const [modal, setModal] = useState<{ type: ModalType; mode: ModalMode; payload: ModalPayload; onConfirm?: () => void; onSave?: ModalSave }>({ type: null, mode: "create", payload: {} });
  const [command, setCommand] = useState(false);
  const [feedbackNotices, setFeedbackNotices] = useState<FeedbackNotice[]>([]);
  const feedbackId = useRef(0);
  const dismissFeedback = useCallback((id: number) => setFeedbackNotices((notices) => notices.filter((notice) => notice.id !== id)), []);
  const notify = useCallback<Notify>((message, tone = "success") => {
    const id = ++feedbackId.current;
    setFeedbackNotices((notices) => [...notices.slice(-2), { id, message, tone }]);
    window.setTimeout(() => dismissFeedback(id), tone === "warning" || tone === "error" ? 4500 : 3000);
  }, [dismissFeedback]);
  useEffect(() => {
    if (active !== "form-center") setFormWorkspaceOpen(false);
  }, [active]);
  const currentTitle = pageLabels[active];
  const breadcrumbSection = breadcrumbSections[active];
  const breadcrumbParent = breadcrumbParents[active];
  const breadcrumbParentTarget = breadcrumbParentTargets[active];
  const openModal: OpenModal = (type, options = {}) => setModal({
    type,
    mode: options.mode ?? "create",
    payload: options.payload ?? {},
    onConfirm: options.onConfirm,
    onSave: options.onSave,
  });
  const go = (key: PageKey) => { setActive(key); setMobileOpen(false); };
  const returnToFormCenter = () => {
    setFormWorkspaceOpen(false);
    setFormCenterVersion((version) => version + 1);
    go("form-center");
  };
  const page = useMemo(() => {
    if (active === "report-management") return <ReportManagement openModal={openModal} notify={notify} />;
    if (active === "announcement-management") return <AnnouncementManagement openModal={openModal} notify={notify} />;
    if (active === "workflow-center") return <WorkflowCenter openModal={openModal} notify={notify} />;
    if (active === "form-center") return <FormCenter key={formCenterVersion} openModal={openModal} notify={notify} onWorkspaceChange={setFormWorkspaceOpen} />;
    if (active === "audit-content") return <AuditContent />;
    if (active === "event-info") return <EventTracking key="event-info" initialTab="info" openModal={openModal} />;
    if (active === "event-dashboard") return <EventTracking key="event-dashboard" initialTab="stats" openModal={openModal} />;
    if (active === "org-management" || active === "user-management") return <UserManagement openModal={openModal} notify={notify} />;
    if (active === "role-management") return <RoleManagement openModal={openModal} onPermissionConfig={() => go("permission-config")} />;
    if (active === "page-management") return <PageManagement openModal={openModal} notify={notify} />;
    if (active === "resource-management") return <ResourceManagement openModal={openModal} notify={notify} />;
    return <PermissionConfig notify={notify} />;
  }, [active, formCenterVersion]);
  return (
    <div className={`app-shell ${collapsed ? "is-sidebar-collapsed" : ""}`}>
      <div className={mobileOpen ? "mobile-sidebar open" : "mobile-sidebar"}><Sidebar active={active} setActive={go} collapsed={collapsed} setCollapsed={setCollapsed} /></div>
      {mobileOpen && <button className="mobile-overlay" onClick={() => setMobileOpen(false)} aria-label="关闭导航" />}
      <TopBar collapsed={collapsed} onMenu={() => setMobileOpen(!mobileOpen)} onSearch={() => setCommand(true)} />
      <main className={collapsed ? "main collapsed" : "main"}>
        <div className="page-heading">
          <nav className="breadcrumb" aria-label="面包屑">
            <span className="breadcrumb-section">{breadcrumbSection}</span>
            <span className="breadcrumb-separator" aria-hidden="true">/</span>
            {breadcrumbParent && breadcrumbParentTarget && (
              <>
                <button type="button" className="breadcrumb-link" onClick={() => go(breadcrumbParentTarget)}>{breadcrumbParent}</button>
                <span className="breadcrumb-separator" aria-hidden="true">/</span>
              </>
            )}
            {active === "form-center" && formWorkspaceOpen ? (
              <>
                <button type="button" className="breadcrumb-link" onClick={returnToFormCenter}>{currentTitle}</button>
                <span className="breadcrumb-separator" aria-hidden="true">/</span>
                <span className="breadcrumb-current" aria-current="page">表单设计器</span>
              </>
            ) : (
              <span className="breadcrumb-current" aria-current="page">{currentTitle}</span>
            )}
          </nav>
        </div>
        <div className="page-content">
          <div className="page-body">{page}</div>
        </div>
      </main>
      <Modal type={modal.type} mode={modal.mode} payload={modal.payload} onConfirm={modal.onConfirm} onSave={modal.onSave} notify={notify} close={() => setModal({ type: null, mode: "create", payload: {} })} />
      <FeedbackToasts notices={feedbackNotices} onDismiss={dismissFeedback} />
      {command && <div className="modal-backdrop command-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setCommand(false)}><div className="command-box"><label><Search size={20} /><input autoFocus placeholder="搜索菜单…" /><kbd>ESC</kbd></label><p>快速导航</p><div>{allMenuItems.map(item => <button key={item.key} onClick={() => { go(item.key); setCommand(false); }}><span><LayoutGrid size={16} />{item.label}</span><small>菜单 <ChevronRight size={14} /></small></button>)}</div></div></div>}
    </div>
  );
}
