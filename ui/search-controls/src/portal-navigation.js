// Portal navigation entries mirror the owning NAVIGATION in index.html.
export default [
        {
          label: "科学研究",
          items: [
            { label: "深圳人才宇宙", url: "https://ai4s.itic-sci.com/talent" },
            { label: "数据库导航", url: "https://itic-sci.com/databaseNavigation" },
            { label: "期刊导航", url: "https://itic-sci.com/journal" },
            { label: "精选论文库", url: "https://itic-sci.com/paper" },
            { label: "PaperLink", url: "https://itic-sci.com/paper-link/" },
            { label: "浪淘沙预印本", url: "https://itic-sci.com/langtaosha" },
            { label: "文献资源申请", url: "https://itic-sci.com/org/" },
            { label: "深圳科学导航", url: "https://itic-sci.com/sso/user/login?back_url=https%3A%2F%2Fitic-sci.bohrium.com%3Ftype%3D10001%26method%3Doauth-code" },
            { label: "探微", url: "https://itic-sci.com/ai-agent/" },
            { label: "专题知识库", url: "https://kg-cg.itic-sci.com/ChatSearch" },
            { label: "科学数据中心", url: "https://kg-cg.itic-sci.com/ChatSearch" },
            { label: "科学信息交流" }
          ]
        },
        {
          label: "未来教育",
          items: [
            { label: "学伴智能体平台", url: "https://edu.itic-sci.com/" },
            { label: "信息素养教育", url: "https://xxsy.itic-sci.com/" }
          ]
        },
        {
          label: "科技评价",
          items: [
            { label: "智慧人才", url: "https://vip.itic-sci.com/talent/index/" },
            { label: "科技资源服务" },
            { label: "科技决策支持" }
          ]
        },
        {
          label: "战略咨询",
          items: [
            { label: "战略咨询总体" },
            { label: "新型高端智库", badge: "new", url: "https://effortless-licorice-cdaa9f.netlify.app" },
            { label: "科技专题服务系统", badge: "hot", url: "https://skxdemo.unicomcn.tech:30999/development/search", action: "embed", hideEmbeddedHeader: true },
            { label: "科技信息展示系统", badge: "hot", url: "https://skxrules.unicomcn.tech:30999/", action: "embed", hideEmbeddedHeader: true },
            { label: "未来产业概述", badge: "new", url: "https://future_industry.itic-sci.com/index/" },
            { label: "未来产业图谱", badge: "hot", url: "https://itic-sci.com/sso/user/login?back_url=https://itic-sci.com/brain-graph/" }
          ]
        },
        {
          label: "应用管理",
          items: [
            { label: "科技专题服务系统", url: "https://skxdemo.unicomcn.tech:30999/development/search", action: "embed", hideEmbeddedHeader: true },
            { label: "科技信息展示系统", url: "https://skxrules.unicomcn.tech:30999/", action: "embed", hideEmbeddedHeader: true },
            { label: "AI 分析与智能分发工作台", url: "apps/ai-distribution/index.html", action: "embed", embedTitle: "AI 分析与智能分发工作台" },
            { label: "语音增强与适配工作台", url: "apps/voice-enhancement/index.html", action: "embed", embedTitle: "语音增强与适配工作台" },
            { label: "管理后台", url: "apps/portal-admin/dist/index.html?v=20260826-user-data-api", action: "embed", embedTitle: "后台管理一", hideEmbeddedToolbar: true, hideEmbeddedHeader: true, headerCropPx: 64 },
            { label: "文档中心", url: "document-center.html?v=20260909-doc-cleanup", action: "embed", embedTitle: "文档中心", hideEmbeddedToolbar: true },
            { label: "示例系统" },
            { label: "示例系统" }
          ]
        },
        {
          label: "集群服务",
          items: [
            { label: "科技信息交流", url: "apps/cluster-service/dist/index.html?page=information-exchange&embed=portal&build=20261013-mobile-adapt-1#ie-top", action: "embed", embedTitle: "科技信息交流", hideEmbeddedToolbar: true },
            { label: "科技资源服务", url: "apps/cluster-service/dist/index.html?page=technology-resource-service&embed=portal&build=20261012-highend-route-3#trs-top", action: "embed", embedTitle: "科技资源服务", hideEmbeddedToolbar: true },
            { label: "科技决策支持", url: "apps/cluster-service/dist/index.html?page=technology-decision-support&embed=portal&build=20261020-layout-fix-1#tds-top", action: "embed", embedTitle: "科技决策支持", hideEmbeddedToolbar: true },
            { label: "科学数据中心", url: "apps/cluster-service/dist/index.html?page=scientific-data-center&embed=portal&build=20261023-sdc-navigation-15#sdc-top", action: "embed", embedTitle: "科学数据中心", hideEmbeddedToolbar: true },
            { label: "新型高端智库", url: "apps/cluster-service/dist/index.html?page=think-tank&embed=portal&build=20261019-talent-tooltip-1#top", action: "embed", embedTitle: "新型高端智库", hideEmbeddedToolbar: true },
            { label: "科技专题服务", url: "apps/cluster-service/dist/index.html?page=technology-topic-service&embed=portal&build=20261026-one-map-mobile-2#tp-top", action: "embed", embedTitle: "科技专题服务", hideEmbeddedToolbar: true }
          ]
        },
        {
          label: "工作台",
          items: [
            { label: "智能科研", url: "apps/research-reading/dist/index.html?view=research&v=20260919-local-candidate", action: "embed", embedTitle: "智能科研", hideEmbeddedToolbar: true },
            { label: "智能阅读", url: "apps/research-reading/dist/index.html?view=reading&v=20260919-local-candidate", action: "embed", embedTitle: "智能阅读", hideEmbeddedToolbar: true }
          ]
        }
      ];
