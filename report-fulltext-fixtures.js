(function (root) {
  "use strict";

  // Authored only for this interaction prototype. These example documents
  // are not extracts from the reports named in the existing resource catalogue.
  const notice = "原型示例正文；由本原型编写，用于演示检索与定位，并非同名报告的真实全文。";
  const definitions = [
    {
      resourceId: "kw-report-ai-2026", resourceIdAliases: ["search-6"], documentId: "prototype-report-ai-2026", documentVersion: "local-demo-20261030-v1",
      title: "2026 全球人工智能科技创新态势报告",
      chapters: [
        ["研究范围与信息来源", [
          "人工智能技术创新可以按照基础模型、智能体、具身智能和科学研究应用四条线索持续观察。",
          "这里的 AI 观察框架把公开技术说明、研究论文和应用案例分开记录，以便读者查看不同信息的来源。",
          "研究范围与资料来源应分别记录，便于比较不同技术方向的信息覆盖情况。"
        ]],
        ["基础模型与计算资源", [
          "基础模型的能力评估需要同时检查任务表现、训练数据范围与计算成本，单一分数难以说明全部使用条件。",
          "AI 模型的推理成本与响应时间会影响应用部署方式，选择方案前应明确业务允许的等待时间。",
          "光互连连接计算节点与数据传输环节，评估这一方案时，需要同时观察传输带宽、系统能耗与运维条件。"
        ]],
        ["智能体与工作流程", [
          "智能体把复杂任务拆成若干步骤，并在每一步记录使用的工具、输入资料和输出结果。",
          "AI 智能体可以辅助整理科研资料，但涉及关键判断时，仍需要使用者核对证据与任务目标。",
          "当多个工具返回的信息互相冲突时，流程应保留原始记录，方便后续检查冲突发生的原因。"
        ]],
        ["具身智能与科学研究", [
          "具身智能需要把感知、规划和执行连接起来，实验环境的变化可能影响同一方法的表现。",
          "AI for Science 可用于生成候选研究方向；候选方向仍需通过独立数据和实验验证。",
          "材料研究中的主动学习可以安排下一轮实验，从实验反馈中逐步缩小候选范围。"
        ]],
        ["应用观察与后续追踪", [
          "对人工智能创新的持续观察，应分别记录技术可行性、业务采用情况与使用效果，避免将演示表现直接等同于落地成效。",
          "AI 应用的后续追踪可从明确的任务开始，保留人工处理与辅助处理的完整耗时。",
          "后续观察需要保留信息版本与更新日期，在证据发生变化时及时调整原有判断。"
        ]]
      ]
    },
    {
      resourceId: "kw-report-future-industries", resourceIdAliases: ["search-12"], documentId: "prototype-report-future-industries", documentVersion: "local-demo-20261030-v1",
      title: "未来产业技术链与机会窗口研判",
      chapters: [
        ["观察框架", [
          "未来产业技术链的观察可从研究活动、关键材料、核心器件和应用环节展开，逐项记录可核实的信息。",
          "判断机会窗口需要比较技术进展、供给条件和实际需求，单独出现的热点不足以形成完整判断。",
          "将信息分成论文、专利、政策和企业信号四类，可以帮助研究人员开展来源之间的交叉核对。"
        ]],
        ["技术链中的关键节点", [
          "关键技术节点可以按输入材料、工艺环节和输出产品梳理，明确节点之间的依赖关系。",
          "钙钛矿器件的封装稳定性涉及材料配方、工艺条件和长期测试，需要分别记录各环节的验证进展。",
          "人工智能工具可以辅助整理技术链资料，但节点之间的真实关系仍需通过来源材料核对。"
        ]],
        ["产业信号的交叉核对", [
          "研究论文反映研究活动，专利反映公开的技术方案，二者与产业化程度之间不能直接画等号。",
          "企业信号可以记录产品进展、合作信息与公开项目，核对时应保留信息日期。",
          "AI 辅助整理产业信号时，应把原始内容和归纳结果分开，便于复核每项判断的依据。"
        ]],
        ["机会窗口与行动条件", [
          "未来产业机会窗口的判断需要综合论文、专利、政策与企业信号，并持续校验信号之间的冲突。",
          "布局某个技术方向之前，需要确认人才、设备、资金与应用场景是否具备，缺少条件时应记录待解决问题。",
          "对暂时缺乏资料的方向保留待确认状态，后续获得新证据后再调整判断。"
        ]],
        ["追踪清单", [
          "技术链追踪清单可包含节点名称、主要来源、最新信息日期与待核对问题，便于持续更新。",
          "人工智能与新材料等方向可以采用同一信息记录方式，但各自的产业判断标准仍需具体说明。",
          "追踪过程中应保留历次判断与修订依据，使后续研究能够了解结论发生变化的原因。"
        ]]
      ]
    },
    {
      resourceId: "keyword-report-ai-insight-demo", resourceIdAliases: [], documentId: "prototype-report-ai-insight", documentVersion: "local-demo-20261030-v1",
      title: "人工智能科研应用洞察报告（原型示例）",
      chapters: [
        ["科研应用的观察范围", [
          "AI 科研应用可从资料整理、信息检索、证据核对与过程记录几个环节开展观察。",
          "不同研究任务需要的资料范围和核对方式各不相同，记录应用背景有助于理解使用反馈。"
        ]],
        ["证据核对与可追溯性", [
          "AI 辅助整理的信息应保留原始来源，关键结论的可追溯性需要结合来源内容逐项核对。",
          "遇到来源之间的冲突，应分别记录各方内容和发布日期，再判断是否需要进一步补充资料。"
        ]],
        ["使用反馈与后续观察", [
          "AI 科研应用的使用反馈应结合具体任务、人工投入与结果质量共同记录。",
          "后续观察按资料来源、使用问题和待核对结论形成清单，获得新证据后持续更新。"
        ]]
      ]
    }
  ];

  function freeze(value) {
    Object.values(value).forEach(child => { if (child && typeof child === "object") freeze(child); });
    return Object.freeze(value);
  }
  const documents = freeze(definitions.map(({ chapters, ...document }) => ({
    ...document, sourceKind: "LOCAL_PROTOTYPE", access: "PUBLIC_DEMO", notice, pageCount: chapters.length,
    pages: chapters.map(([heading, paragraphs], pageIndex) => ({
      pageNumber: pageIndex + 1, heading,
      paragraphs: paragraphs.map((text, paragraphIndex) => ({ paragraphId: `${document.documentId}-p${pageIndex + 1}-${paragraphIndex + 1}`, text }))
    }))
  })));
  // Explicit aliases are from PORTAL_REMEDIATION_FIXTURES.searchResources.
  // Matching a title is deliberately insufficient to bind demonstration text.
  const byResource = new Map(documents.flatMap(document => [document.resourceId, ...document.resourceIdAliases].map(id => [id, document])));
  function attach(records) {
    return records.map(record => {
      const document = record.type === "报告" ? byResource.get(record.id) : null;
      return document ? { ...record, document } : record;
    });
  }
  root.PortalReportFulltextFixtures = Object.freeze({ documents, attach });
})(typeof window !== "undefined" ? window : globalThis);
