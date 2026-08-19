import type {
  CommentItem,
  FolderItem,
  MemberItem,
  ResearchDocument,
  TodoItem,
} from './types'

export const initialDocuments: ResearchDocument[] = [
  {
    id: 1,
    title: '深度学习报告',
    location: '我的空间/研究',
    owner: '张三',
    createdAt: '2026-04-15 10:30',
    visitedAt: '2026-04-15 10:30',
    size: '1.3 MB',
    kind: '在线文档',
    favorite: false,
    owned: true,
    shared: false,
  },
  {
    id: 2,
    title: '科研项目进度表',
    location: 'AI研究团队/管理',
    owner: '李四',
    createdAt: '2026-04-15 10:30',
    visitedAt: '2026-04-15 10:30',
    size: '2.3 MB',
    kind: '在线文档',
    favorite: true,
    owned: true,
    shared: true,
  },
  {
    id: 3,
    title: '项目需求文档',
    location: '产品研发部/产品',
    owner: '王五',
    createdAt: '2026-04-15 10:30',
    visitedAt: '2026-04-15 10:30',
    size: '16 MB',
    kind: 'PDF文档',
    favorite: false,
    owned: true,
    shared: false,
  },
  {
    id: 4,
    title: '实验数据分析',
    location: '产品研发部/产品',
    owner: '王五',
    createdAt: '2026-04-15 10:30',
    visitedAt: '2026-04-15 10:30',
    size: '856 KB',
    kind: 'Word文档',
    favorite: false,
    owned: false,
    shared: true,
  },
  {
    id: 5,
    title: '技术架构设计',
    location: '产品研发部/产品',
    owner: '王五',
    createdAt: '2026-04-15 10:30',
    visitedAt: '2026-04-15 10:30',
    size: '4.6 MB',
    kind: 'Excel文档',
    favorite: false,
    owned: false,
    shared: true,
  },
  {
    id: 6,
    title: '文献综述整理',
    location: '产品研发部/产品',
    owner: '王五',
    createdAt: '2026-04-15 10:30',
    visitedAt: '2026-04-15 10:30',
    size: '5.0 MB',
    kind: 'Excel文档',
    favorite: false,
    owned: false,
    shared: true,
  },
]

export const initialFolders: FolderItem[] = [
  { id: 1, name: '研究项目', count: 15, updatedAt: '2026-04-30 14:20' },
  { id: 2, name: '实验数据', count: 8, updatedAt: '2026-04-30 14:20' },
  { id: 3, name: '研究项目', count: 15, updatedAt: '2026-04-30 14:20' },
]

export const initialTodos: TodoItem[] = [
  { id: 1, title: '完成储能材料综述第三章初稿', due: '2024-06-28', level: 'danger', done: false },
  { id: 2, title: '审阅李助理的实验数据整理报告', due: '2024-06-27', level: 'warning', done: false },
  { id: 3, title: '更新锂硫电池专利数据库', due: '2024-06-25', level: 'warning', done: false },
  { id: 4, title: '准备7月研讨会演讲PPT', due: '2024-07-05', level: 'muted', done: false },
]

export const initialComments: CommentItem[] = [
  { id: 1, author: '李助理', content: '第3章的实验参数表格需要补充原料来源信息', time: '2小时前', attachment: '储能材料专利分析报告_v3.pdf' },
  { id: 2, author: '陈博士', content: '图5的坐标轴标注有误，建议修正', time: '昨天', attachment: '锂硫电池实验数据集.xlsx' },
  { id: 3, author: '王分析师', content: '政策汇编已更新至2024年6月最新版本', time: '2天前', attachment: '深圳未来产业政策汇编.pdf' },
]

export const initialMembers: MemberItem[] = [
  { id: 1, name: '张研究员', role: '管理员', initials: '张', color: '#5b8ff9', status: '在线', joinedAt: '2025-12-05' },
  { id: 2, name: '李助理', role: '编辑者', initials: '李', color: '#7c3aed', status: '在线', joinedAt: '2025-12-05' },
  { id: 3, name: '陈博士', role: '编辑者', initials: '陈', color: '#0891b2', status: '离线', joinedAt: '2025-12-02' },
  { id: 4, name: '王分析师', role: '查看员', initials: '王', color: '#f97316', status: '在线', joinedAt: '2025-12-01' },
  { id: 5, name: '刘研究员', role: '查看员', initials: '刘', color: '#14b8a6', status: '离线', joinedAt: '2025-12-01' },
]

export const teamNames = ['AI研究团队', '产品研发部', '数据分析组', '技术架构组', '实验室管理']
