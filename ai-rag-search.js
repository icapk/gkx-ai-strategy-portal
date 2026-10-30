(function (root) {
  "use strict";

  // Presentation prototype using the existing authored paper/patent fixtures.
  // The curated retrieval, reranking and synthesis below are local examples,
  // not a connection to Aminer or a production semantic retrieval algorithm.
  const TOPICS = [
    {
      id: "evidence", pattern: /智能体|智能代理|agent|证据|检索|核对|文献/iu,
      title: "科研证据检索与核对", paper: "ai-demo-paper-1", patent: "ai-demo-patent-1",
      conclusion: "将检索、来源记录和结论核对串成可追溯流程，是这组资料共同关注的方向。",
      paperPoint: "论文侧重文献检索、来源记录与结论核对的工作流程。",
      patentPoint: "专利方案侧重把检索词、来源片段与核对记录关联为证据链。",
      relation: "二者可对照阅读：前者说明研究流程，后者展示资料关联的技术方案。"
    },
    {
      id: "material", pattern: /多模态|材料|图像|material|multimodal/iu,
      title: "多模态材料分析", paper: "ai-demo-paper-2", patent: "ai-demo-patent-2",
      conclusion: "材料分析中的共同线索，是联合组织图像、文本和结构化实验资料。",
      paperPoint: "论文比较图像、文本和结构化资料的组织与核对方式。",
      patentPoint: "专利方案展示材料图像特征、文本说明和实验记录的关联处理。",
      relation: "两类资料都涉及多模态信息组织，可进一步核对其数据条件与处理流程。"
    },
    {
      id: "drug", pattern: /药物|靶点|生物医学|生物医药|drug|target|biomedical/iu,
      title: "药物发现与候选排序", paper: "ai-demo-paper-3", patent: "ai-demo-patent-3",
      conclusion: "药物发现资料主要围绕知识整合、候选排序和后续核对展开。",
      paperPoint: "论文介绍知识图谱、证据检索和人工复核的衔接。",
      patentPoint: "专利方案展示多来源生物医学资料的召回、解释及核对流程。",
      relation: "论文和专利分别提供研究方法与方案线索；摘要没有提供真实候选的验证结果。"
    }
  ];
  const esc = value => String(value == null ? "" : value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const sourceText = record => record.abstract || record.summary || "";
  const sourceDate = record => record.publishedAt || record.publicationDate || "";
  const names = values => (values || []).map(value => typeof value === "string" ? value : value.name || "").filter(Boolean).join("、");
  const PROCESS_STEPS = [
    { group: "semantic", title: "深度解析", description: "运用自然语言处理（NLP）与机器学习技术，深度解析用户查询语义", progress: "语义检索 · 深度解析中…" },
    { group: "semantic", title: "精准匹配", description: "正在匹配最具价值的学术文献", progress: "语义检索 · 精准匹配中…" },
    { group: "interpretation", title: "自动提取论文核心要点", description: "", progress: "AI解读 · 正在自动提取论文核心要点…" }
  ];

  function processMarkup() {
    return [["semantic", "语义检索"], ["interpretation", "AI解读"]].map(([key, title], groupIndex) => `<li class="rag-process-group" data-process-group="${key}" data-state="waiting"><div class="rag-process-group-heading"><span class="rag-process-group-marker" aria-hidden="true">${groupIndex + 1}</span><strong>${title}</strong><span class="rag-process-state" data-group-state>等待中</span></div><ol class="rag-process-children">${PROCESS_STEPS.map((step, index) => step.group === key ? `<li class="rag-process-step" data-process-step="${index}" data-state="waiting"><span class="rag-process-marker" aria-hidden="true"></span><div><strong>${esc(step.title)}</strong>${step.description ? `<p data-step-description>${esc(step.description)}</p>` : ""}</div><span class="rag-process-state" data-step-state>等待中</span></li>` : "").join("")}</ol></li>`).join("");
  }

  function create(bridge) {
    const doc = root.document;
    const records = (bridge.records || []).filter(record => ["论文", "专利"].includes(record.type) && /^ai-demo-(paper|patent)-/u.test(record.id));
    const panel = doc.createElement("div");
    panel.className = "ai-rag-workspace";
    panel.innerHTML = `<div class="rag-body"><div class="rag-main"><section class="rag-answer" aria-labelledby="ragAnswerTitle"><header class="rag-answer-header"><span class="rag-ai-mark" aria-hidden="true">AI</span><strong id="ragAnswerTitle">AI搜索</strong><span class="rag-material-scope">精选论文与专利</span><button class="rag-home-button" type="button" data-rag-return-home>← 返回首页</button></header><div class="rag-user-message" id="ragUserMessage" role="group" aria-label="用户消息" hidden><p class="rag-user-bubble" id="ragQuestionTitle" tabindex="-1"></p></div>
      <details class="rag-status" id="ragStatus" hidden><summary id="ragStatusSummary" role="status" aria-live="polite">正在查找相关资料</summary><ol class="rag-process-tree" id="ragStatusSteps" aria-label="检索与解读过程">${processMarkup()}</ol></details>
      <div class="rag-answer-content" id="ragAnswerContent" aria-live="polite"></div><div class="rag-answer-actions" id="ragAnswerActions" hidden><button type="button" data-rag-copy>复制回答</button><span id="ragCopyStatus" role="status" aria-live="polite"></span></div>
      <div class="rag-composer-area"><form class="rag-composer" id="ragComposer"><label class="sr-only" for="ragQueryInput">输入研究问题</label><textarea id="ragQueryInput" rows="2" placeholder="请输入想要检索的问题…" aria-describedby="ragComposerError"></textarea><p class="rag-error" id="ragComposerError" role="alert" hidden></p><div class="rag-composer-bottom"><span>Enter 发送 · Shift+Enter 换行</span><button class="rag-send" id="ragSend" type="submit" aria-label="发送研究问题"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6"></path></svg></button></div></form><p class="rag-ai-disclaimer">本内容由AI生成，请仔细甄别。</p></div></section>
      </div><aside class="rag-sources" aria-label="引用结果"><header class="rag-source-header"><h2>引用结果</h2><span id="ragSourceCount">0 条</span></header><div class="rag-source-tabs" role="group" aria-label="引用类型"><button type="button" data-rag-type="全部" aria-pressed="true">全部 <span>0</span></button><button type="button" data-rag-type="论文" aria-pressed="false">论文 <span>0</span></button><button type="button" data-rag-type="专利" aria-pressed="false">专利 <span>0</span></button></div><div class="rag-source-list" id="ragSourceList"></div></aside></div>
      `;
    bridge.host.append(panel);
    const get = id => panel.querySelector("#" + id);
    let query = "", status = "idle", revision = 0, sourceType = "全部", sources = [], groups = [];
    let highlighted = "", expandedSources = new Set(), copyText = "";
    const timers = new Set();

    function delay(fn, ms) {
      const id = root.setTimeout(() => { timers.delete(id); fn(); }, ms);
      timers.add(id);
    }
    function setProcess(currentIndex, mode = "running") {
      const labels = { waiting: "等待中", running: "进行中", complete: "已完成", skipped: "未执行" };
      panel.querySelectorAll("[data-process-step]").forEach(node => {
        const index = Number(node.dataset.processStep), step = PROCESS_STEPS[index];
        const state = mode === "empty" ? index < 2 ? "complete" : "skipped" : mode === "complete" ? "complete" : index < currentIndex ? "complete" : index === currentIndex ? "running" : "waiting";
        node.dataset.state = state;
        node.querySelector("[data-step-state]").textContent = labels[state];
        node.querySelector(".rag-process-marker").textContent = state === "complete" ? "✓" : state === "skipped" ? "−" : "";
        const description = node.querySelector("[data-step-description]");
        if (description) description.textContent = index === 1 && state === "complete" ? mode === "empty" ? "本次精选资料中未匹配到相关学术文献" : "已完成学术文献匹配" : step.description;
      });
      panel.querySelectorAll("[data-process-group]").forEach(group => {
        const states = [...group.querySelectorAll("[data-process-step]")].map(node => node.dataset.state);
        const state = states.every(value => value === "complete") ? "complete" : states.every(value => value === "skipped") ? "skipped" : states.some(value => value === "running") ? "running" : "waiting";
        group.dataset.state = state;
        group.querySelector("[data-group-state]").textContent = state === "skipped" ? "未执行 · 暂无可解读资料" : labels[state];
      });
      get("ragStatusSummary").textContent = mode === "empty" ? "已完成检索，暂无相关资料" : mode === "complete" ? "已完成语义检索与AI解读" : PROCESS_STEPS[currentIndex].progress;
    }
    function cancel() {
      revision++;
      timers.forEach(id => root.clearTimeout(id)); timers.clear();
      get("ragSend").disabled = false;
      if (status === "loading") { status = "idle"; query = ""; }
    }
    function citations(ids) {
      return ids.map(id => sources.findIndex(source => source.id === id)).filter(index => index >= 0).map(index => `<button class="rag-citation" type="button" data-rag-cite="${esc(sources[index].id)}" aria-label="查看引用${index + 1}：${esc(sources[index].title)}">${index + 1}</button>`).join("");
    }
    function retrieve(value) {
      const specific = TOPICS.filter(topic => topic.pattern.test(value));
      const general = /人工智能|\bai\b|科研应用|科学研究|研究方向/iu.test(value);
      const selected = specific.length ? specific : general ? TOPICS : [];
      // This order is only an authored presentation of curated, reranked results.
      const ids = selected.flatMap(topic => [topic.paper, topic.patent]);
      const date = value.match(/(20\d{2})年/u)?.[1];
      const onlyType = /只[看要].*专利|仅.*专利/u.test(value) ? "专利" : /只[看要].*论文|仅.*论文/u.test(value) ? "论文" : "";
      const result = ids.map(id => records.find(record => record.id === id)).filter(Boolean)
        .filter(record => (!date || sourceDate(record).startsWith(date)) && (!onlyType || record.type === onlyType));
      return { sources: result, groups: selected.filter(topic => result.some(record => [topic.paper, topic.patent].includes(record.id))) };
    }
    function renderSources() {
      get("ragSourceCount").textContent = `${sources.length} 条`;
      panel.querySelectorAll("[data-rag-type]").forEach(button => {
        const type = button.dataset.ragType;
        button.setAttribute("aria-pressed", String(type === sourceType));
        button.querySelector("span").textContent = String(type === "全部" ? sources.length : sources.filter(source => source.type === type).length);
      });
      const visible = sources.filter(source => sourceType === "全部" || source.type === sourceType);
      get("ragSourceList").innerHTML = visible.length ? visible.map(source => {
        const number = sources.findIndex(value => value.id === source.id) + 1;
        const author = source.type === "论文" ? names(source.authors) : names(source.applicant);
        const open = expandedSources.has(source.id);
        return `<article class="rag-source-card${highlighted === source.id ? " is-highlighted" : ""}" id="rag-source-${esc(source.id)}" tabindex="-1"><div class="rag-source-kicker"><span>${number}</span><span>${source.type}</span><time>${esc(sourceDate(source).slice(0, 4))}</time></div><button class="rag-source-title" type="button" data-rag-source="${esc(source.id)}" aria-expanded="${open}" aria-controls="rag-source-detail-${esc(source.id)}">${esc(source.title)}</button><p class="rag-source-meta">${esc(author)}${author ? " · " : ""}${esc(source.source || "")}</p><p class="rag-source-summary">${esc(sourceText(source))}</p><div class="rag-source-detail" id="rag-source-detail-${esc(source.id)}" ${open ? "" : "hidden"}><strong>摘要依据</strong><p>${esc(sourceText(source))}</p><span>${source.type === "专利" ? "公布日期" : "发表日期"}：${esc(sourceDate(source))}</span></div></article>`;
      }).join("") : `<div class="rag-empty"><p>${status === "loading" ? "检索完成后显示引用来源" : sources.length ? "暂无该类型的引用" : "暂无引用资料"}</p></div>`;
    }
    function renderIdle() {
      get("ragAnswerContent").innerHTML = '<div class="rag-empty"><h2>你想了解哪个研究问题？</h2><p>从精选论文与专利中查找资料，聚合分析后形成带引用的解读。</p><div class="rag-followups"><button type="button" data-rag-question="人工智能在科研中的应用有哪些？">人工智能在科研中的应用</button><button type="button" data-rag-question="AI在药物靶点发现中有哪些研究与专利线索？">药物靶点发现的研究线索</button></div></div>';
      get("ragStatus").hidden = true; renderSources();
    }
    function renderAnswer() {
      const answer = get("ragAnswerContent");
      if (!sources.length) {
        answer.innerHTML = `<div class="rag-empty"><h2>暂未找到可用于解读的相关资料</h2><p>本次精选资料中没有与“${esc(query)}”匹配的内容，暂不生成结论。可以调整研究问题后重新检索。</p><div class="rag-followups"><button type="button" data-rag-question="人工智能在科研中的应用有哪些？">看看人工智能科研应用</button><button type="button" data-rag-question="AI在多模态材料分析中有哪些应用？">看看多模态材料分析</button></div></div>`;
        get("ragAnswerActions").hidden = true; copyText = ""; return;
      }
      const paperCount = sources.filter(source => source.type === "论文").length;
      const patentCount = sources.filter(source => source.type === "专利").length;
      const overview = groups.length > 1
        ? `围绕你的问题，当前资料可归纳为${groups.map(topic => "“" + topic.title + "”").join("、")}等线索。下面结合论文研究与专利方案，整理它们关注的问题和相互关系。`
        : `围绕你的问题，当前资料主要聚焦“${groups[0].title}”。下面综合已检索资料，整理可供进一步阅读的结论与线索。`;
      const overviewItems = groups.map(topic => {
        const hasBoth = [topic.paper, topic.patent].every(id => sources.some(source => source.id === id));
        const single = sources.find(source => [topic.paper, topic.patent].includes(source.id));
        const text = hasBoth ? topic.conclusion : sourceText(single);
        return `<li><strong>${esc(topic.title)}：</strong>${esc(text)}${citations([topic.paper, topic.patent])}</li>`;
      }).join("");
      const rows = groups.map(topic => {
        const paper = sources.some(source => source.id === topic.paper);
        const patent = sources.some(source => source.id === topic.patent);
        return `<tr><th scope="row">${esc(topic.title)}</th><td>${paper ? esc(topic.paperPoint) + citations([topic.paper]) : "本次未检索到相关论文资料"}</td><td>${patent ? esc(topic.patentPoint) + citations([topic.patent]) : "本次未检索到相关专利资料"}</td></tr>`;
      }).join("");
      const relations = groups.map(topic => {
        const hasBoth = [topic.paper, topic.patent].every(id => sources.some(source => source.id === id));
        return hasBoth ? `<p><strong>${esc(topic.title)}。</strong>${esc(topic.relation)}${citations([topic.paper, topic.patent])}</p>` : "";
      }).join("");
      answer.innerHTML = `<p class="rag-intro">${esc(overview)}</p><h2>一、结论概览</h2><ol class="rag-conclusions">${overviewItems}</ol><h2>二、论文与专利的主要线索</h2><table class="rag-comparison"><thead><tr><th>研究方向</th><th>论文研究</th><th>专利方案</th></tr></thead><tbody>${rows}</tbody></table>${relations ? `<h2>三、如何结合这些资料继续研究</h2>${relations}` : ""}<p class="rag-reading-note">本次引用 ${paperCount} 篇论文、${patentCount} 项专利，解读依据为摘要。专利方案用于了解技术思路，不能据此认定方案效果已经验证。</p><div class="rag-followups"><button type="button" data-rag-question="AI在药物靶点发现中有哪些研究与专利线索？">聚焦药物靶点发现</button><button type="button" data-rag-question="AI在多模态材料分析中有哪些应用？">聚焦多模态材料分析</button><button type="button" data-rag-question="科研智能体如何组织文献证据？">聚焦科研证据检索</button></div>`;
      get("ragAnswerActions").hidden = false;
      copyText = answer.innerText;
    }
    function submit(rawQuery) {
      const value = String(rawQuery || "").trim();
      if (!value) { renderIdle(); return Promise.resolve(false); }
      if (query === value && ["ready", "loading", "empty"].includes(status)) return Promise.resolve(true);
      cancel(); query = value; status = "loading"; sourceType = "全部"; sources = []; groups = []; highlighted = ""; expandedSources.clear();
      const ticket = revision;
      get("ragQuestionTitle").textContent = query;
      get("ragUserMessage").hidden = false;
      get("ragQueryInput").value = "";
      get("ragComposerError").hidden = true;
      get("ragStatus").hidden = false; get("ragStatus").open = true;
      setProcess(0);
      get("ragAnswerContent").setAttribute("aria-busy", "true");
      get("ragAnswerContent").innerHTML = '<div class="rag-loading" role="status"><p>正在整理与你的问题相关的资料</p><div class="rag-skeleton"></div><div class="rag-skeleton"></div><div class="rag-skeleton"></div></div>';
      get("ragAnswerActions").hidden = true; get("ragCopyStatus").textContent = "";
      renderSources();
      delay(() => {
        if (ticket !== revision) return;
        setProcess(1);
      }, 900);
      delay(() => {
        if (ticket !== revision) return;
        ({ sources, groups } = retrieve(query));
        if (!sources.length) {
          status = "empty"; setProcess(-1, "empty");
          get("ragAnswerContent").setAttribute("aria-busy", "false");
          renderAnswer(); renderSources(); return;
        }
        setProcess(2);
        renderSources();
      }, 1800);
      delay(() => {
        if (ticket !== revision || status !== "loading") return;
        status = "ready"; setProcess(-1, "complete");
        get("ragAnswerContent").setAttribute("aria-busy", "false");
        renderAnswer(); renderSources();
      }, 2700);
      return Promise.resolve(true);
    }
    function validateAndSubmit() {
      const input = get("ragQueryInput"), value = input.value.trim();
      const message = !value ? "请输入研究问题。" : [...value].length > 200 ? "研究问题最多200个字符，请缩短后重试。" : !/[A-Za-z0-9\u3400-\u9fff]/u.test(value) ? "研究问题需包含文字或数字。" : "";
      get("ragComposerError").textContent = message; get("ragComposerError").hidden = !message;
      if (message) { input.focus(); return; }
      bridge.onSubmit(value);
    }
    get("ragComposer").addEventListener("submit", event => { event.preventDefault(); validateAndSubmit(); });
    get("ragQueryInput").addEventListener("keydown", event => { if (event.key === "Enter" && !event.shiftKey && !event.isComposing) { event.preventDefault(); validateAndSubmit(); } });
    panel.addEventListener("click", async event => {
      const cite = event.target.closest("[data-rag-cite]");
      if (cite) {
        const source = sources.find(item => item.id === cite.dataset.ragCite); if (!source) return;
        sourceType = source.type; highlighted = source.id; expandedSources.add(source.id); renderSources();
        const card = get("rag-source-" + source.id); card?.scrollIntoView({ behavior: "auto", block: "nearest" }); card?.focus({ preventScroll: true }); return;
      }
      const tab = event.target.closest("[data-rag-type]");
      if (tab) { sourceType = tab.dataset.ragType; renderSources(); return; }
      const sourceButton = event.target.closest("[data-rag-source]");
      if (sourceButton) {
        const id = sourceButton.dataset.ragSource;
        if (expandedSources.has(id)) expandedSources.delete(id); else expandedSources.add(id);
        const open = expandedSources.has(id); sourceButton.setAttribute("aria-expanded", String(open)); get("rag-source-detail-" + id).hidden = !open; return;
      }
      const followup = event.target.closest("[data-rag-question]");
      if (followup) { bridge.onSubmit(followup.dataset.ragQuestion); return; }
      if (event.target.closest("[data-rag-return-home]")) { bridge.onHome?.(); return; }
      if (event.target.closest("[data-rag-copy]")) {
        try { await root.navigator.clipboard.writeText(copyText); get("ragCopyStatus").textContent = "已复制回答"; }
        catch (_) { get("ragCopyStatus").textContent = "浏览器未允许复制，可选中回答内容复制。"; }
      }
    });
    renderIdle();
    return Object.freeze({ submit, cancel, input: get("ragQueryInput"), title: get("ragQuestionTitle"), snapshot: () => ({ query, status, sourceType, sources: sources.map(source => ({ id: source.id, type: source.type })) }) });
  }
  root.PortalAiRagSearch = Object.freeze({ create });
})(typeof window !== "undefined" ? window : globalThis);
