import { r as reactExports, j as jsxRuntimeExports, M as Modal, b as exportResearchDataTableCsv, p as parseDelimitedData } from "./index-EC9-nM9l.js";
const columnTypeLabels = {
  text: "文本",
  number: "数字",
  select: "单选",
  date: "日期",
  percent: "进度",
  file: "文件名"
};
const formatTimestamp = () => {
  const now = /* @__PURE__ */ new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
};
const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};
const createId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const normalizedValue = (value) => value.normalize("NFC").trim().toLocaleLowerCase();
const isValidIsoDate = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};
const downloadText = (content, fileName, type = "text/csv;charset=utf-8") => {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};
const blankValues = (columns) => Object.fromEntries(columns.map((column) => [column.id, ""]));
const statusClass = (value) => {
  if (/完成|已归档|低/.test(value)) return "is-success";
  if (/进行|中/.test(value)) return "is-active";
  if (/延期|阻塞|高/.test(value)) return "is-danger";
  return "is-neutral";
};
function DataTableWorkspace({
  documentItem,
  table: initialTable,
  currentUser,
  teamName,
  collaboratorOptions,
  initialSearchQuery = "",
  initialAction,
  onClose,
  onSave,
  onToast,
  onNavigationGuardChange
}) {
  const [table, setTable] = reactExports.useState(initialTable);
  const [title, setTitle] = reactExports.useState(documentItem.title);
  const [viewMode, setViewMode] = reactExports.useState("table");
  const [saveState, setSaveState] = reactExports.useState("saved");
  const [saveError, setSaveError] = reactExports.useState("");
  const [lastSavedAt, setLastSavedAt] = reactExports.useState(initialTable.updatedAt.slice(-5));
  const [query, setQuery] = reactExports.useState(initialSearchQuery);
  const [statusFilter, setStatusFilter] = reactExports.useState("全部状态");
  const [sort, setSort] = reactExports.useState(null);
  const [page, setPage] = reactExports.useState(1);
  const [pageSize, setPageSize] = reactExports.useState(20);
  const [selectedRows, setSelectedRows] = reactExports.useState([]);
  const [activeRowId, setActiveRowId] = reactExports.useState(initialTable.rows[0]?.id ?? null);
  const [formValues, setFormValues] = reactExports.useState(
    initialTable.rows[0]?.values ?? blankValues(initialTable.columns)
  );
  const [formIsNew, setFormIsNew] = reactExports.useState(initialTable.rows.length === 0);
  const [recordEditorOpen, setRecordEditorOpen] = reactExports.useState(false);
  const [formDirty, setFormDirty] = reactExports.useState(false);
  const [formErrors, setFormErrors] = reactExports.useState({});
  const [undo, setUndo] = reactExports.useState(null);
  const [importOpen, setImportOpen] = reactExports.useState(initialAction === "import");
  const [importDrafts, setImportDrafts] = reactExports.useState([]);
  const [importMode, setImportMode] = reactExports.useState("append");
  const [importError, setImportError] = reactExports.useState("");
  const [shareOpen, setShareOpen] = reactExports.useState(initialAction === "share");
  const [shareAccess, setShareAccess] = reactExports.useState(initialTable.share.access);
  const [shareCollaborators, setShareCollaborators] = reactExports.useState(initialTable.share.collaborators);
  const [fieldDraft, setFieldDraft] = reactExports.useState(null);
  const [filesOpen, setFilesOpen] = reactExports.useState(initialAction === "files");
  const [previewAttachmentId, setPreviewAttachmentId] = reactExports.useState(null);
  const tableRef = reactExports.useRef(table);
  const titleRef = reactExports.useRef(title);
  const onSaveRef = reactExports.useRef(onSave);
  const saveTimerRef = reactExports.useRef(null);
  const saveStateRef = reactExports.useRef(saveState);
  const formDirtyRef = reactExports.useRef(formDirty);
  const navigationGuardRef = reactExports.useRef(() => true);
  const firstFormErrorRef = reactExports.useRef(null);
  const backButtonRef = reactExports.useRef(null);
  tableRef.current = table;
  titleRef.current = title;
  onSaveRef.current = onSave;
  saveStateRef.current = saveState;
  formDirtyRef.current = formDirty;
  const updateSaveState = (nextState) => {
    saveStateRef.current = nextState;
    setSaveState(nextState);
  };
  const updateFormDirty = (nextDirty) => {
    formDirtyRef.current = nextDirty;
    setFormDirty(nextDirty);
  };
  const statusColumn = table.columns.find((column) => column.type === "select" && /阶段|状态/.test(column.name));
  const progressColumn = table.columns.find((column) => column.type === "percent");
  const previewAttachment = previewAttachmentId ? table.attachments.find((attachment) => attachment.id === previewAttachmentId) : void 0;
  const nestedModalOpen = recordEditorOpen || importOpen || shareOpen || Boolean(fieldDraft) || filesOpen || Boolean(previewAttachment);
  reactExports.useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const frame = window.requestAnimationFrame(() => backButtonRef.current?.focus());
    return () => {
      window.cancelAnimationFrame(frame);
      window.requestAnimationFrame(() => previouslyFocused?.focus());
    };
  }, []);
  const markChanged = (updater) => {
    const timestamp = formatTimestamp();
    setTable((current) => {
      const next = updater(current);
      return { ...next, updatedAt: timestamp, updatedBy: currentUser };
    });
    updateSaveState("dirty");
    setSaveError("");
  };
  const validateTable = (candidate) => {
    for (const row of candidate.rows) {
      for (const column of candidate.columns) {
        const value = row.values[column.id]?.trim() ?? "";
        if (column.required && !value) return `“${column.name}”为必填字段，请补齐后保存。`;
        if (column.type === "number" && value && !Number.isFinite(Number(value))) return `“${column.name}”中存在无效数字。`;
        if (column.type === "select" && value && !column.options?.includes(value)) return `“${column.name}”中存在不属于选项的值。`;
        if (column.type === "date" && value && !isValidIsoDate(value)) return `“${column.name}”中存在无效日期。`;
        if (column.type === "percent" && value && (Number(value) < 0 || Number(value) > 100 || !Number.isFinite(Number(value)))) {
          return `“${column.name}”应为 0 至 100 之间的数字。`;
        }
      }
    }
    return "";
  };
  const saveNow = (candidate = tableRef.current, candidateTitle = titleRef.current) => {
    if (!candidateTitle.normalize("NFC").trim()) {
      updateSaveState("error");
      setSaveError("表格名称不能为空。");
      return false;
    }
    const validationError = validateTable(candidate);
    if (validationError) {
      updateSaveState("error");
      setSaveError(validationError);
      return false;
    }
    updateSaveState("saving");
    const error = onSaveRef.current({ title: candidateTitle.normalize("NFC").trim(), table: candidate });
    if (error) {
      updateSaveState("error");
      setSaveError(error);
      return false;
    }
    updateSaveState("saved");
    setSaveError("");
    setLastSavedAt(formatTimestamp().slice(-5));
    return true;
  };
  reactExports.useEffect(() => {
    if (saveState !== "dirty") return;
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    saveTimerRef.current = window.setTimeout(() => saveNow(), 850);
    return () => {
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    };
  }, [saveState, table, title]);
  reactExports.useEffect(() => {
    const onBeforeUnload = (event) => {
      if (saveState === "saved" && !formDirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    const onKeyDown = (event) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLocaleLowerCase() !== "s") return;
      if (recordEditorOpen) return;
      event.preventDefault();
      saveNow();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [formDirty, recordEditorOpen, saveState]);
  const attemptWorkspaceLeave = () => {
    let discardFormDraft = false;
    if (formDirtyRef.current) {
      if (!window.confirm("当前表单记录有未提交修改，离开后将丢失。仍要返回吗？")) return false;
      discardFormDraft = true;
    }
    if (saveStateRef.current !== "saved" && !saveNow()) return false;
    if (discardFormDraft) updateFormDirty(false);
    return true;
  };
  navigationGuardRef.current = attemptWorkspaceLeave;
  reactExports.useEffect(() => {
    const guard = () => navigationGuardRef.current();
    onNavigationGuardChange(guard);
    return () => onNavigationGuardChange(null);
  }, [onNavigationGuardChange]);
  const handleClose = () => {
    if (!attemptWorkspaceLeave()) return;
    onNavigationGuardChange(null);
    onClose();
  };
  reactExports.useEffect(() => {
    const closeWorkspaceFromKeyboard = (event) => {
      if (event.key !== "Escape" || event.defaultPrevented || nestedModalOpen) return;
      event.preventDefault();
      handleClose();
    };
    window.addEventListener("keydown", closeWorkspaceFromKeyboard);
    return () => window.removeEventListener("keydown", closeWorkspaceFromKeyboard);
  }, [formDirty, nestedModalOpen, saveState]);
  const updateCell = (rowId, columnId, value) => {
    markChanged((current) => ({
      ...current,
      rows: current.rows.map((row) => row.id === rowId ? { ...row, values: { ...row.values, [columnId]: value }, updatedAt: formatTimestamp(), updatedBy: currentUser } : row)
    }));
  };
  const handleCellKeyDown = (event, rowId, columnId) => {
    if (event.key === "Enter") {
      event.currentTarget.blur();
      return;
    }
    if (event.key !== "Escape") return;
    event.preventDefault();
    updateCell(rowId, columnId, event.currentTarget.dataset.originalValue ?? "");
    event.currentTarget.blur();
  };
  const statusOptions = statusColumn?.options ?? [];
  const filteredRows = reactExports.useMemo(() => {
    const normalizedQuery = normalizedValue(query);
    const rows = table.rows.filter((row) => {
      const matchesQuery = !normalizedQuery || normalizedValue(`${Object.values(row.values).join(" ")} ${row.updatedBy}`).includes(normalizedQuery);
      const matchesStatus = statusFilter === "全部状态" || row.values[statusColumn?.id ?? ""] === statusFilter;
      return matchesQuery && matchesStatus;
    });
    if (!sort) return rows;
    return [...rows].sort((first, second) => {
      const firstValue = first.values[sort.columnId] ?? "";
      const secondValue = second.values[sort.columnId] ?? "";
      const comparison = firstValue.localeCompare(secondValue, "zh-CN", { numeric: true });
      return sort.direction === "asc" ? comparison : -comparison;
    });
  }, [query, sort, statusColumn?.id, statusFilter, table.rows]);
  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pagedRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  reactExports.useEffect(() => setPage(1), [query, statusFilter, pageSize]);
  reactExports.useEffect(() => {
    if (filteredRows.length === 0) {
      if (activeRowId !== null) setActiveRowId(null);
      return;
    }
    if (!activeRowId || !filteredRows.some((row) => row.id === activeRowId)) {
      setActiveRowId(filteredRows[0].id);
    }
  }, [activeRowId, filteredRows]);
  const cycleSort = (columnId) => {
    setSort((current) => {
      if (!current || current.columnId !== columnId) return { columnId, direction: "asc" };
      if (current.direction === "asc") return { columnId, direction: "desc" };
      return null;
    });
  };
  const openNewRecord = () => {
    if (formDirty && !window.confirm("当前表单有未提交修改，是否放弃并新建记录？")) return;
    setFormValues(blankValues(table.columns));
    setFormIsNew(true);
    updateFormDirty(false);
    setFormErrors({});
    setRecordEditorOpen(true);
  };
  const openRecord = (row) => {
    if (formDirty && !window.confirm("当前表单有未提交修改，是否放弃并切换记录？")) return;
    setActiveRowId(row.id);
    setFormValues({ ...blankValues(table.columns), ...row.values });
    setFormIsNew(false);
    updateFormDirty(false);
    setFormErrors({});
    setRecordEditorOpen(true);
  };
  const closeRecordEditor = () => {
    if (formDirty && !window.confirm("当前记录有未保存修改，确定放弃吗？")) return;
    setRecordEditorOpen(false);
    updateFormDirty(false);
    setFormErrors({});
  };
  const validateForm = () => {
    const errors = {};
    table.columns.forEach((column) => {
      const value = formValues[column.id]?.trim() ?? "";
      if (column.required && !value) errors[column.id] = `请输入${column.name}`;
      if (column.type === "number" && value && !Number.isFinite(Number(value))) errors[column.id] = "请输入有效数字";
      if (column.type === "percent" && value && (Number(value) < 0 || Number(value) > 100 || !Number.isFinite(Number(value)))) {
        errors[column.id] = "请输入 0 至 100 之间的数字";
      }
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const commitRecord = () => {
    if (formIsNew && table.rows.length >= 500) {
      setFormErrors({ _form: "单个表格最多支持 500 条记录，请先导出或精简数据。" });
      return false;
    }
    if (!validateForm()) {
      window.requestAnimationFrame(() => firstFormErrorRef.current?.focus());
      return false;
    }
    const timestamp = formatTimestamp();
    const nextRowId = formIsNew ? createId("row") : activeRowId;
    if (!nextRowId) return false;
    markChanged((current) => ({
      ...current,
      rows: formIsNew ? [...current.rows, { id: nextRowId, values: { ...formValues }, updatedAt: timestamp, updatedBy: currentUser }] : current.rows.map((row) => row.id === nextRowId ? { ...row, values: { ...formValues }, updatedAt: timestamp, updatedBy: currentUser } : row)
    }));
    setActiveRowId(nextRowId);
    setFormIsNew(false);
    updateFormDirty(false);
    setRecordEditorOpen(false);
    onToast(formIsNew ? "记录已添加" : "记录已更新");
    return true;
  };
  const submitRecord = (event) => {
    event.preventDefault();
    commitRecord();
  };
  reactExports.useEffect(() => {
    if (!recordEditorOpen) return;
    const saveRecordFromKeyboard = (event) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLocaleLowerCase() !== "s") return;
      event.preventDefault();
      commitRecord();
    };
    window.addEventListener("keydown", saveRecordFromKeyboard);
    return () => window.removeEventListener("keydown", saveRecordFromKeyboard);
  }, [activeRowId, formIsNew, formValues, recordEditorOpen, table.columns, table.rows.length]);
  const deleteRows = (rowIds) => {
    if (!rowIds.length || !window.confirm(`删除选中的 ${rowIds.length} 条记录？删除后可立即撤销。`)) return;
    const activeIndex = activeRowId ? filteredRows.findIndex((row) => row.id === activeRowId) : -1;
    const remainingFilteredRows = filteredRows.filter((row) => !rowIds.includes(row.id));
    const nextActiveRow = activeIndex >= 0 ? remainingFilteredRows[Math.min(activeIndex, remainingFilteredRows.length - 1)] : void 0;
    setUndo({ table, message: `已删除 ${rowIds.length} 条记录` });
    markChanged((current) => ({ ...current, rows: current.rows.filter((row) => !rowIds.includes(row.id)) }));
    setSelectedRows([]);
    if (activeRowId && rowIds.includes(activeRowId)) {
      setActiveRowId(nextActiveRow?.id ?? null);
      setFormIsNew(!nextActiveRow);
      setFormValues(nextActiveRow?.values ?? blankValues(table.columns));
    }
  };
  const undoLastChange = () => {
    if (!undo) return;
    setTable({ ...undo.table, updatedAt: formatTimestamp(), updatedBy: currentUser });
    updateSaveState("dirty");
    setUndo(null);
    onToast("已撤销上一项操作");
  };
  const renderCellEditor = (row, column) => {
    const value = row.values[column.id] ?? "";
    if (column.type === "select") {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { "aria-label": `${row.values[table.columns[0]?.id] || "未命名记录"}的${column.name}`, value, onFocus: (event) => {
        event.currentTarget.dataset.originalValue = value;
      }, onKeyDown: (event) => handleCellKeyDown(event, row.id, column.id), onChange: (event) => updateCell(row.id, column.id, event.target.value), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "请选择" }),
        (column.options ?? []).map((option) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: option, children: option }, option))
      ] });
    }
    if (column.type === "percent") {
      const percent = Math.max(0, Math.min(100, Number(value) || 0));
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "data-sheet-progress-cell", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { style: { width: `${percent}%` } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { "aria-label": `${column.name}百分比`, type: "number", min: "0", max: "100", value, onFocus: (event) => {
          event.currentTarget.dataset.originalValue = value;
        }, onKeyDown: (event) => handleCellKeyDown(event, row.id, column.id), onChange: (event) => updateCell(row.id, column.id, event.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "%" })
      ] });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        "aria-label": `${row.values[table.columns[0]?.id] || "未命名记录"}的${column.name}`,
        type: column.type === "number" ? "number" : column.type === "date" ? "date" : "text",
        value,
        onFocus: (event) => {
          event.currentTarget.dataset.originalValue = value;
        },
        onKeyDown: (event) => handleCellKeyDown(event, row.id, column.id),
        onChange: (event) => updateCell(row.id, column.id, event.target.value)
      }
    );
  };
  const openAddField = () => {
    if (table.columns.length >= 30) {
      onToast("单个表格最多支持 30 个字段");
      return;
    }
    setFieldDraft({ mode: "add", name: "", type: "text", required: false, options: "", error: "" });
  };
  const openEditField = (column) => setFieldDraft({
    mode: "edit",
    columnId: column.id,
    name: column.name,
    type: column.type,
    required: column.required,
    options: column.options?.join("、") ?? "",
    error: ""
  });
  const submitField = (event) => {
    event.preventDefault();
    if (!fieldDraft) return;
    const name = fieldDraft.name.normalize("NFC").trim();
    if (!name) {
      setFieldDraft({ ...fieldDraft, error: "请输入字段名称。" });
      return;
    }
    if (table.columns.some((column) => column.id !== fieldDraft.columnId && normalizedValue(column.name) === normalizedValue(name))) {
      setFieldDraft({ ...fieldDraft, error: "字段名称不能重复。" });
      return;
    }
    const options = fieldDraft.type === "select" ? fieldDraft.options.split(/[、,，\n]/).map((item) => item.trim()).filter(Boolean) : void 0;
    if (fieldDraft.type === "select" && !options?.length) {
      setFieldDraft({ ...fieldDraft, error: "单选字段至少需要一个选项。" });
      return;
    }
    const previous = fieldDraft.columnId ? table.columns.find((column) => column.id === fieldDraft.columnId) : void 0;
    if (previous && previous.type !== fieldDraft.type && table.rows.some((row) => row.values[previous.id]?.trim())) {
      if (!window.confirm("修改字段类型可能使现有值不符合格式，仍要继续吗？")) return;
    }
    setUndo({ table, message: previous ? "已修改字段" : "已添加字段" });
    const columnId = fieldDraft.columnId ?? createId("column");
    const nextColumn = { id: columnId, name, type: fieldDraft.type, required: fieldDraft.required, options };
    markChanged((current) => ({
      ...current,
      columns: previous ? current.columns.map((column) => column.id === columnId ? nextColumn : column) : [...current.columns, nextColumn],
      rows: previous ? current.rows : current.rows.map((row) => ({ ...row, values: { ...row.values, [columnId]: "" } }))
    }));
    if (!previous) setFormValues((current) => ({ ...current, [columnId]: "" }));
    setFieldDraft(null);
    onToast(previous ? "字段设置已更新" : "字段已添加");
  };
  const deleteField = () => {
    if (!fieldDraft?.columnId || table.columns.length <= 1) return;
    const column = table.columns.find((item) => item.id === fieldDraft.columnId);
    if (!column || !window.confirm(`删除字段“${column.name}”？该字段中的数据也会删除。`)) return;
    setUndo({ table, message: `已删除字段“${column.name}”` });
    markChanged((current) => ({
      ...current,
      columns: current.columns.filter((item) => item.id !== column.id),
      rows: current.rows.map((row) => {
        const values = { ...row.values };
        delete values[column.id];
        return { ...row, values };
      })
    }));
    setFormValues((current) => {
      const next = { ...current };
      delete next[column.id];
      return next;
    });
    setFieldDraft(null);
    onToast("字段已删除，可撤销");
  };
  const readImportFiles = async (files) => {
    const allFiles = Array.from(files);
    const selected = allFiles.slice(0, 10);
    setImportError("");
    if (allFiles.length > 10) setImportError("一次最多选择 10 个文件，已保留前 10 个。");
    const pending = selected.map((file) => ({
      id: createId("import"),
      name: file.name,
      size: file.size,
      mimeType: file.type || "text/plain",
      status: "reading",
      headers: [],
      rows: [],
      previewText: ""
    }));
    setImportDrafts((current) => [...current, ...pending]);
    await Promise.all(selected.map(async (file, index) => {
      const base = pending[index];
      let result;
      if (!/\.(csv|tsv)$/i.test(file.name)) {
        result = { ...base, status: "error", error: "仅支持 CSV、TSV 文件。" };
      } else if (file.size > 2 * 1024 * 1024) {
        result = { ...base, status: "error", error: "文件超过 2 MiB 限制。" };
      } else {
        try {
          const text = await file.text();
          const parsed = parseDelimitedData(text, /\.tsv$/i.test(file.name) ? "	" : void 0);
          result = parsed.ok ? { ...base, status: "ready", headers: parsed.headers, rows: parsed.rows, previewText: text.slice(0, 6e3) } : { ...base, status: "error", error: parsed.error };
        } catch {
          result = { ...base, status: "error", error: "文件读取失败，请重新选择。" };
        }
      }
      setImportDrafts((current) => current.map((item) => item.id === base.id ? result : item));
    }));
  };
  const handleImportInput = (event) => {
    if (event.target.files?.length) void readImportFiles(event.target.files);
    event.target.value = "";
  };
  const handleImportDrop = (event) => {
    event.preventDefault();
    if (event.dataTransfer.files.length) void readImportFiles(event.dataTransfer.files);
  };
  const submitImportData = (event) => {
    event.preventDefault();
    const ready = importDrafts.filter((item) => item.status === "ready");
    if (!ready.length) {
      setImportError("请先选择并成功解析至少一个文件。");
      return;
    }
    if (importDrafts.some((item) => item.status === "reading")) {
      setImportError("文件仍在解析，请稍候。");
      return;
    }
    if (importMode === "replace" && table.rows.length && !window.confirm("替换会移除当前全部记录，是否继续？")) return;
    if (table.attachments.length + ready.length > 30) {
      setImportError("单个表格最多保留 30 条文件记录，请先移除部分导入记录。");
      return;
    }
    const nextColumns = [...table.columns];
    const columnByName = new Map(nextColumns.map((column) => [normalizedValue(column.name), column]));
    for (const file of ready) {
      for (const header of file.headers) {
        const key = normalizedValue(header);
        if (!columnByName.has(key)) {
          if (nextColumns.length >= 30) {
            setImportError("合并后的字段超过 30 个，请精简文件表头后重试。");
            return;
          }
          const column = { id: createId("column"), name: header, type: "text", required: false };
          nextColumns.push(column);
          columnByName.set(key, column);
        }
      }
    }
    const timestamp = formatTimestamp();
    const importedRows = ready.flatMap((file) => file.rows.map((values) => {
      const rowValues = blankValues(nextColumns);
      file.headers.forEach((header, index) => {
        const column = columnByName.get(normalizedValue(header));
        if (column) rowValues[column.id] = values[index] ?? "";
      });
      return { id: createId("row"), values: rowValues, updatedAt: timestamp, updatedBy: currentUser };
    }));
    if (importedRows.length + (importMode === "append" ? table.rows.length : 0) > 500) {
      setImportError("导入后记录将超过 500 条，请拆分数据后重试。");
      return;
    }
    const nextRows = importMode === "replace" ? importedRows : [...table.rows, ...importedRows];
    const validationError = validateTable({ ...table, columns: nextColumns, rows: nextRows });
    if (validationError) {
      setImportError(`导入数据未通过字段校验：${validationError} 请修正源文件后重试。`);
      return;
    }
    const attachments = ready.map((file) => ({
      id: createId("attachment"),
      name: file.name,
      size: file.size,
      mimeType: file.mimeType,
      uploadedAt: timestamp,
      uploadedBy: currentUser,
      rowCount: file.rows.length,
      source: "import",
      previewText: file.previewText
    }));
    setUndo({ table, message: importMode === "replace" ? "已替换全部记录" : "已追加导入记录" });
    markChanged((current) => ({
      ...current,
      columns: nextColumns,
      rows: nextRows,
      attachments: [...current.attachments, ...attachments]
    }));
    setImportOpen(false);
    setImportDrafts([]);
    setImportError("");
    setPage(1);
    if (importMode === "replace") {
      const firstRow = importedRows[0];
      setActiveRowId(firstRow?.id ?? null);
      setFormValues(firstRow?.values ?? blankValues(nextColumns));
      setFormIsNew(!firstRow);
      updateFormDirty(false);
      setFormErrors({});
    }
    onToast(`已从 ${ready.length} 个文件导入 ${importedRows.length} 条记录`);
  };
  const openImportDialog = () => {
    if (formDirty) {
      onToast("请先保存当前表单记录，再导入数据");
      return;
    }
    setImportDrafts([]);
    setImportError("");
    setImportOpen(true);
  };
  const openShareDialog = () => {
    if (formDirty) {
      onToast("请先保存当前表单记录，再设置分享权限");
      return;
    }
    setShareAccess(table.share.access);
    setShareCollaborators(table.share.collaborators);
    setShareOpen(true);
  };
  const exportCsv = () => {
    downloadText(exportResearchDataTableCsv(table), `${title.replace(/[\\/:*?"<>|]/g, "-") || "科研数据表格"}.csv`);
    onToast("CSV 已导出，可用于分享或备份");
  };
  const submitShare = (event) => {
    event.preventDefault();
    if (shareAccess !== "private" && shareCollaborators.length === 0) return;
    const timestamp = formatTimestamp();
    const next = {
      ...table,
      share: {
        access: shareAccess,
        collaborators: shareAccess === "private" ? [] : shareCollaborators,
        updatedAt: timestamp,
        updatedBy: currentUser
      },
      updatedAt: timestamp,
      updatedBy: currentUser
    };
    setTable(next);
    tableRef.current = next;
    updateSaveState("dirty");
    setShareOpen(false);
    window.setTimeout(() => saveNow(next), 0);
    onToast(shareAccess === "private" ? "已取消团队共享" : "本地分享权限已保存");
  };
  const copyLocalLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}#table=${documentItem.id}`;
    try {
      await navigator.clipboard.writeText(url);
      onToast("本地预览链接已复制");
    } catch {
      window.prompt("复制下面的本地预览链接：", url);
    }
  };
  const completedCount = statusColumn ? table.rows.filter((row) => /完成|已归档/.test(row.values[statusColumn.id] ?? "")).length : 0;
  const averageProgress = progressColumn && table.rows.length ? Math.round(table.rows.reduce((sum, row) => sum + (Number(row.values[progressColumn.id]) || 0), 0) / table.rows.length) : 0;
  const requiredColumns = table.columns.filter((column) => column.required);
  const completeDataRows = table.rows.filter((row) => requiredColumns.every((column) => row.values[column.id]?.trim())).length;
  const populatedCellCount = table.rows.reduce((sum, row) => sum + table.columns.filter((column) => row.values[column.id]?.trim()).length, 0);
  const dataCompleteness = table.rows.length && table.columns.length ? Math.round(populatedCellCount / (table.rows.length * table.columns.length) * 100) : 0;
  const isProjectProgress = table.template === "project-progress";
  const primaryColumn = table.columns[0];
  const ownerColumn = table.columns.find((column) => /负责人|责任人|采集人|上传人|所有者/.test(column.name)) ?? table.columns.find((column) => column.id !== primaryColumn?.id && column.type === "text");
  const activeRow = (activeRowId ? filteredRows.find((row) => row.id === activeRowId) : void 0) ?? filteredRows[0];
  const activeRowIndex = activeRow ? filteredRows.findIndex((row) => row.id === activeRow.id) : -1;
  const saveStateLabel = formDirty ? "表单草稿未提交" : saveState === "saved" ? `已保存 · ${lastSavedAt}` : saveState === "saving" ? "正在保存" : saveState === "error" ? "保存失败" : "有未保存修改";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: "data-sheet-workspace",
      role: nestedModalOpen ? void 0 : "dialog",
      "aria-modal": nestedModalOpen ? void 0 : true,
      "aria-label": nestedModalOpen ? void 0 : `${title}数据表格编辑器`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "data-sheet-header", "aria-hidden": nestedModalOpen ? true : void 0, inert: nestedModalOpen ? true : void 0, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { ref: backButtonRef, className: "data-sheet-back", type: "button", onClick: handleClose, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true" }),
            "返回"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "data-sheet-title-area", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "data-sheet-breadcrumb", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: documentItem.location }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("i", { children: "/" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "数据表格" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { "aria-label": "数据表格名称", maxLength: 50, value: title, onChange: (event) => {
              setTitle(event.target.value);
              updateSaveState("dirty");
              setSaveError("");
            } })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "data-sheet-save-area", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `data-sheet-save-state is-${formDirty ? "dirty" : saveState}`, role: "status", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("i", {}),
              saveStateLabel
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "button button--secondary data-sheet-share-button", type: "button", onClick: openShareDialog, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: "iconpark-control-icon", src: "./assets/iconpark/share.svg", alt: "" }),
              "分享"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "button button--primary", type: "button", disabled: saveState === "saving", onClick: () => saveNow(), children: "保存" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "data-sheet-toolbar", "aria-hidden": nestedModalOpen ? true : void 0, inert: nestedModalOpen ? true : void 0, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "data-sheet-view-switch", role: "tablist", "aria-label": "数据展示视图", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { id: "data-sheet-tab-table", type: "button", role: "tab", "aria-controls": "data-sheet-panel-table", "aria-selected": viewMode === "table", tabIndex: viewMode === "table" ? 0 : -1, className: viewMode === "table" ? "is-active" : "", onKeyDown: (event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                event.preventDefault();
                setViewMode("form");
                event.currentTarget.nextElementSibling instanceof HTMLElement && event.currentTarget.nextElementSibling.focus();
              }
            }, onClick: () => setViewMode("table"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: "data-sheet-tab-icon", src: "./assets/iconpark/grid-nine.svg", alt: "" }),
              "表格视图"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { id: "data-sheet-tab-form", type: "button", role: "tab", "aria-controls": "data-sheet-panel-form", "aria-selected": viewMode === "form", tabIndex: viewMode === "form" ? 0 : -1, className: viewMode === "form" ? "is-active" : "", onKeyDown: (event) => {
              if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                event.preventDefault();
                setViewMode("table");
                event.currentTarget.previousElementSibling instanceof HTMLElement && event.currentTarget.previousElementSibling.focus();
              }
            }, onClick: () => setViewMode("form"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: "data-sheet-tab-icon", src: "./assets/iconpark/form-one.svg", alt: "" }),
              "表单视图"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "data-sheet-toolbar-actions", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "button button--secondary", type: "button", onClick: openImportDialog, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: "iconpark-control-icon", src: "./assets/iconpark/upload-logs.svg", alt: "" }),
              "导入数据"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "button button--secondary", type: "button", onClick: exportCsv, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: "iconpark-control-icon", src: "./assets/iconpark/download.svg", alt: "" }),
              "导出 CSV"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "button button--secondary data-sheet-toolbar-share", type: "button", onClick: openShareDialog, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: "iconpark-control-icon", src: "./assets/iconpark/share.svg", alt: "" }),
              "分享"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "button button--primary", type: "button", onClick: openNewRecord, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "icon-plus", "aria-hidden": "true" }),
              "新增记录"
            ] })
          ] })
        ] }),
        saveError && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "data-sheet-error", role: "alert", "aria-hidden": nestedModalOpen ? true : void 0, inert: nestedModalOpen ? true : void 0, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "表格保存失败" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: saveError }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => saveNow(), children: "重试保存" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: exportCsv, children: "导出备份" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "data-sheet-body", "aria-hidden": nestedModalOpen ? true : void 0, inert: nestedModalOpen ? true : void 0, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "data-sheet-local-notice", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "i" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "本地可编辑预览" }),
              " 数据保存在当前浏览器；团队权限为交互演示，不会向真实成员发送通知。"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "data-sheet-summary", "aria-label": "表格概览", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "全部记录" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: table.rows.length }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "支持随时编辑与检索" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isProjectProgress ? "已完成" : "完整记录" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: isProjectProgress ? completedCount : completeDataRows }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: isProjectProgress ? "当前项目完成项" : "必填信息均已补齐" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isProjectProgress ? "平均进度" : "数据完整度" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                isProjectProgress ? averageProgress : dataCompleteness,
                "%"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("b", { style: { width: `${isProjectProgress ? averageProgress : dataCompleteness}%` } }) }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setFilesOpen(true), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "数据文件" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: table.attachments.length }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("small", { children: [
                "查看导入记录 ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { "aria-hidden": "true", children: "›" })
              ] })
            ] })
          ] }),
          viewMode === "table" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "data-sheet-panel-table", className: "data-sheet-panel", role: "tabpanel", "aria-labelledby": "data-sheet-tab-table", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "data-sheet-filters", children: selectedRows.length ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "data-sheet-selection", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                "已选 ",
                selectedRows.length,
                " 条"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => deleteRows(selectedRows), children: "删除所选" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setSelectedRows([]), children: "取消选择" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "data-sheet-search", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/reading/search.svg", alt: "" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { "aria-label": "搜索表格记录", value: query, onChange: (event) => setQuery(event.target.value), placeholder: "搜索记录、负责人或阶段" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  filteredRows.length,
                  " 条结果"
                ] })
              ] }),
              statusOptions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { "aria-label": "筛选状态", value: statusFilter, onChange: (event) => setStatusFilter(event.target.value), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "全部状态" }),
                statusOptions.map((option) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: option }, option))
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "data-sheet-field-add", type: "button", onClick: openAddField, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "icon-plus", "aria-hidden": "true" }),
                "添加字段"
              ] })
            ] }) }),
            table.rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "data-sheet-empty", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/document-sheet.svg", alt: "" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "从第一条科研数据开始" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "可以手动新增记录，也可以批量导入 CSV / TSV 文件。" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "button button--primary", type: "button", onClick: openNewRecord, children: "新增记录" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "button button--secondary", type: "button", onClick: openImportDialog, children: "导入数据" })
              ] })
            ] }) : filteredRows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "data-sheet-empty", role: "status", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/document-sheet.svg", alt: "" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "没有符合条件的记录" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "调整搜索条件，或清除当前筛选后再试。" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "button button--secondary", type: "button", onClick: () => {
                setQuery("");
                setStatusFilter("全部状态");
              }, children: "清除筛选" }) })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "data-sheet-grid-scroll", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "data-sheet-grid", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "data-sheet-check-column", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", "aria-label": "选择当前页全部记录", checked: pagedRows.length > 0 && pagedRows.every((row) => selectedRows.includes(row.id)), onChange: (event) => setSelectedRows((current) => event.target.checked ? Array.from(/* @__PURE__ */ new Set([...current, ...pagedRows.map((row) => row.id)])) : current.filter((id) => !pagedRows.some((row) => row.id === id))) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("th", { className: "data-sheet-row-number", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: "data-sheet-row-number-icon", src: "./assets/iconpark/list-numbers.svg", alt: "", "aria-hidden": "true" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "序号" })
                ] }),
                table.columns.map((column) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "data-sheet-sort", "aria-label": `按${column.name}排序`, onClick: () => cycleSort(column.id), children: [
                    column.name,
                    column.required && /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "*" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: sort?.columnId === column.id ? `is-${sort.direction}` : "", "aria-hidden": "true" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "data-sheet-column-menu", "aria-label": `设置字段${column.name}`, onClick: () => openEditField(column), children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/iconpark/more.svg", alt: "" }) })
                ] }) }, column.id)),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "data-sheet-row-actions", children: "记录操作" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: pagedRows.map((row, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: selectedRows.includes(row.id) ? "is-selected" : "", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "data-sheet-check-column", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", "aria-label": `选择${row.values[table.columns[0]?.id] || "未命名记录"}`, checked: selectedRows.includes(row.id), onChange: (event) => setSelectedRows((current) => event.target.checked ? [...current, row.id] : current.filter((id) => id !== row.id)) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "data-sheet-row-number", children: (currentPage - 1) * pageSize + index + 1 }),
                table.columns.map((column) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: column.type === "select" ? `data-sheet-select-cell ${statusClass(row.values[column.id] ?? "")}` : "", children: renderCellEditor(row, column) }, column.id)),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "data-sheet-row-actions", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => openRecord(row), children: "编辑记录" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "is-danger", onClick: () => deleteRows([row.id]), children: "删除" })
                ] })
              ] }, row.id)) })
            ] }) }),
            filteredRows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "data-sheet-pagination", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "共 ",
                filteredRows.length,
                " 条"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                "每页 ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: pageSize, onChange: (event) => setPageSize(Number(event.target.value)), children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "20", children: "20" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "50", children: "50" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "100", children: "100" })
                ] }),
                " 条"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", disabled: currentPage <= 1, onClick: () => setPage(currentPage - 1), "aria-label": "上一页", children: "‹" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                  currentPage,
                  " / ",
                  pageCount
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", disabled: currentPage >= pageCount, onClick: () => setPage(currentPage + 1), "aria-label": "下一页", children: "›" })
              ] })
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "data-sheet-panel-form", className: "data-sheet-form-view", role: "tabpanel", "aria-labelledby": "data-sheet-tab-form", children: table.rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "data-sheet-empty data-sheet-form-empty", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/document-sheet.svg", alt: "" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "从第一条科研数据开始" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "新增或导入记录后，可在表单视图中逐条查看全部字段。" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "button button--primary", type: "button", onClick: openNewRecord, children: "新增记录" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "button button--secondary", type: "button", onClick: openImportDialog, children: "导入数据" })
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { "aria-label": "表单视图记录导航", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "记录列表" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "当前显示 ",
                    filteredRows.length,
                    " 条"
                  ] })
                ] }),
                (query || statusFilter !== "全部状态") && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
                  setQuery("");
                  setStatusFilter("全部状态");
                }, children: "清除筛选" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/reading/search.svg", alt: "" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { "aria-label": "搜索表单视图记录", value: query, onChange: (event) => setQuery(event.target.value), placeholder: "搜索记录、负责人或阶段" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { role: "listbox", "aria-label": "记录列表", children: filteredRows.map((row, index) => {
                const owner = ownerColumn ? row.values[ownerColumn.id] : "";
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    role: "option",
                    "aria-selected": row.id === activeRow?.id,
                    "aria-controls": "data-sheet-active-record",
                    className: row.id === activeRow?.id ? "is-active" : "",
                    onClick: () => setActiveRowId(row.id),
                    onKeyDown: (event) => {
                      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
                      event.preventDefault();
                      const buttons = Array.from(event.currentTarget.parentElement?.querySelectorAll('button[role="option"]') ?? []);
                      const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? filteredRows.length - 1 : event.key === "ArrowDown" ? Math.min(index + 1, filteredRows.length - 1) : Math.max(index - 1, 0);
                      setActiveRowId(filteredRows[nextIndex].id);
                      window.requestAnimationFrame(() => buttons[nextIndex]?.focus());
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("i", { children: String(index + 1).padStart(2, "0") }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: row.values[primaryColumn?.id] || "未命名记录" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("small", { children: [
                          owner || row.updatedBy,
                          " · ",
                          row.updatedAt
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("b", { "aria-hidden": "true", children: "›" })
                    ]
                  },
                  row.id
                );
              }) })
            ] }),
            activeRow ? /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { id: "data-sheet-active-record", className: "data-sheet-record-form", "aria-label": `${activeRow.values[primaryColumn?.id] || "未命名记录"}详情`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "第 ",
                    activeRowIndex + 1,
                    " / ",
                    filteredRows.length,
                    " 条 · 记录详情"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: activeRow.values[primaryColumn?.id] || "未命名记录" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  activeRow.updatedBy,
                  " 更新于 ",
                  activeRow.updatedAt
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dl", { className: "data-sheet-record-details", children: table.columns.map((column) => {
                const value = activeRow.values[column.id] ?? "";
                const displayValue = value ? column.type === "percent" ? `${value}%` : value : "—";
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("dt", { children: [
                    column.required && /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "*" }),
                    column.name,
                    /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: columnTypeLabels[column.type] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { title: displayValue, children: displayValue })
                ] }, column.id);
              }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "button button--danger", type: "button", onClick: () => deleteRows([activeRow.id]), children: "删除记录" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "button button--primary", type: "button", onClick: () => openRecord(activeRow), children: "编辑记录" })
              ] })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "data-sheet-empty", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/document-sheet.svg", alt: "" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "没有符合条件的记录" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "调整搜索条件，或清除当前筛选后再试。" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "button button--secondary", type: "button", onClick: () => {
                setQuery("");
                setStatusFilter("全部状态");
              }, children: "清除筛选" }) })
            ] })
          ] }) })
        ] }),
        undo && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "data-sheet-undo", role: "status", "aria-hidden": nestedModalOpen ? true : void 0, inert: nestedModalOpen ? true : void 0, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: undo.message }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: undoLastChange, children: "撤销" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": "关闭撤销提示", onClick: () => setUndo(null), children: "×" })
        ] }),
        recordEditorOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Modal,
          {
            title: formIsNew ? "新增记录" : "编辑记录",
            onClose: closeRecordEditor,
            onSubmit: submitRecord,
            confirmText: formIsNew ? "新增并保存" : "保存记录",
            cancelText: "取消",
            extraWide: true,
            bodyClassName: "data-sheet-record-modal",
            children: [
              Object.keys(formErrors).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "data-sheet-form-errors", role: "alert", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                  "请检查 ",
                  Object.keys(formErrors).filter((key) => key !== "_form").length || 1,
                  " 个字段"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formErrors._form || "已保留当前输入，请从标红字段开始修正。" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "data-sheet-form-fields", children: table.columns.map((column, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  column.required && /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "*" }),
                  column.name,
                  /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: columnTypeLabels[column.type] })
                ] }),
                column.type === "select" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { ref: (element) => {
                  if (formErrors[column.id] && index === table.columns.findIndex((item) => formErrors[item.id])) firstFormErrorRef.current = element;
                }, "aria-invalid": Boolean(formErrors[column.id]), value: formValues[column.id] ?? "", onChange: (event) => {
                  setFormValues((current) => ({ ...current, [column.id]: event.target.value }));
                  updateFormDirty(true);
                  setFormErrors((current) => ({ ...current, [column.id]: "" }));
                }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "请选择" }),
                  (column.options ?? []).map((option) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: option }, option))
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("input", { autoFocus: index === 0, ref: (element) => {
                  if (formErrors[column.id] && index === table.columns.findIndex((item) => formErrors[item.id])) firstFormErrorRef.current = element;
                }, "aria-invalid": Boolean(formErrors[column.id]), type: column.type === "number" || column.type === "percent" ? "number" : column.type === "date" ? "date" : "text", min: column.type === "percent" ? 0 : void 0, max: column.type === "percent" ? 100 : void 0, value: formValues[column.id] ?? "", onChange: (event) => {
                  setFormValues((current) => ({ ...current, [column.id]: event.target.value }));
                  updateFormDirty(true);
                  setFormErrors((current) => ({ ...current, [column.id]: "" }));
                } }),
                formErrors[column.id] && /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: formErrors[column.id] })
              ] }, column.id)) })
            ]
          }
        ),
        importOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(Modal, { title: "导入数据文件", onClose: () => setImportOpen(false), onSubmit: submitImportData, confirmText: "确认导入", confirmDisabled: !importDrafts.some((item) => item.status === "ready"), extraWide: true, tall: true, bodyClassName: "data-sheet-import-modal", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "data-sheet-modal-intro", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "本地批量导入 CSV / TSV" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "支持一次选择多个文件；每个文件不超过 2 MiB，最多 500 行、30 个字段。" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "data-sheet-import-hint", children: [
            "必填表头：",
            table.columns.filter((column) => column.required).map((column) => column.name).join("、"),
            "。其他表头会自动添加为文本字段。"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "data-sheet-drop-zone", onDragOver: (event) => event.preventDefault(), onDrop: handleImportDrop, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "data-sheet-drop-icon", "aria-hidden": "true" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "点击或拖拽数据文件到这里" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "本地解析，不上传服务器；原文件仅保留导入记录与文本预览" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: ".csv,.tsv,text/csv,text/tab-separated-values", multiple: true, onChange: handleImportInput })
          ] }),
          importDrafts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "data-sheet-import-list", children: importDrafts.map((file) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: `is-${file.status}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/document-sheet.svg", alt: "" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: file.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                formatFileSize(file.size),
                file.status === "ready" ? ` · ${file.rows.length} 条 · ${file.headers.length} 个字段` : file.status === "reading" ? " · 正在解析" : ""
              ] }),
              file.error && /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: file.error })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": `移除${file.name}`, onClick: () => setImportDrafts((current) => current.filter((item) => item.id !== file.id)), children: "×" })
          ] }, file.id)) }),
          importDrafts.find((item) => item.status === "ready") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "data-sheet-import-preview", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "数据预览" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "前 5 行" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: importDrafts.find((item) => item.status === "ready")?.headers.map((header) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: header }, header)) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: importDrafts.find((item) => item.status === "ready")?.rows.slice(0, 5).map((row, rowIndex) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: row.map((cell, cellIndex) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: cell }, cellIndex)) }, rowIndex)) })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { className: "data-sheet-import-mode", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("legend", { children: "写入方式" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "radio", name: "import-mode", checked: importMode === "append", onChange: () => setImportMode("append") }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "追加到现有表格" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "保留当前记录，在末尾添加导入数据" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "radio", name: "import-mode", checked: importMode === "replace", onChange: () => setImportMode("replace") }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "替换全部记录" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "保留字段设置，清空当前记录后写入" })
              ] })
            ] })
          ] }),
          importError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "data-sheet-modal-error", role: "alert", children: importError })
        ] }),
        shareOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(Modal, { title: "分享与权限", onClose: () => setShareOpen(false), onSubmit: submitShare, confirmText: "保存权限", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "data-sheet-modal-intro", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: teamName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "当前为本地交互预览，不会向真实成员发送通知。" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "field-label", htmlFor: "data-sheet-share-access", children: "访问权限" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { id: "data-sheet-share-access", className: "text-field", value: shareAccess, onChange: (event) => setShareAccess(event.target.value), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "private", children: "仅自己可见" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "team-view", children: "团队成员可查看" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "team-edit", children: "团队成员可编辑" })
          ] }),
          shareAccess !== "private" && /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { className: "data-sheet-collaborators", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("legend", { children: "共享成员" }),
            collaboratorOptions.map((name) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: shareCollaborators.includes(name), onChange: (event) => setShareCollaborators((current) => event.target.checked ? [...current, name] : current.filter((item) => item !== name)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: name.slice(0, 1) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: name })
            ] }, name))
          ] }),
          shareAccess !== "private" && shareCollaborators.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "field-error", children: "请至少选择一位共享成员。" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "data-sheet-copy-link", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "本地预览链接" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "仅在本机开发服务运行时有效" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "button button--secondary", type: "button", onClick: () => void copyLocalLink(), children: "复制链接" })
          ] })
        ] }),
        fieldDraft && /* @__PURE__ */ jsxRuntimeExports.jsxs(Modal, { title: fieldDraft.mode === "add" ? "添加字段" : "字段设置", onClose: () => setFieldDraft(null), onSubmit: submitField, confirmText: "保存字段", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "field-label", htmlFor: "data-sheet-field-name", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "required-mark", children: "*" }),
            " 字段名称"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "data-sheet-field-name", className: "text-field", autoFocus: true, maxLength: 30, value: fieldDraft.name, onChange: (event) => setFieldDraft({ ...fieldDraft, name: event.target.value, error: "" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "field-label", htmlFor: "data-sheet-field-type", children: "字段类型" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("select", { id: "data-sheet-field-type", className: "text-field", value: fieldDraft.type, onChange: (event) => setFieldDraft({ ...fieldDraft, type: event.target.value, error: "" }), children: Object.entries(columnTypeLabels).map(([value, label]) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value, children: label }, value)) }),
          fieldDraft.type === "select" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "field-label", htmlFor: "data-sheet-field-options", children: "选项（用逗号分隔）" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "data-sheet-field-options", className: "text-field", value: fieldDraft.options, onChange: (event) => setFieldDraft({ ...fieldDraft, options: event.target.value, error: "" }), placeholder: "例如：待开始、进行中、已完成" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "data-sheet-required-field", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: fieldDraft.required, onChange: (event) => setFieldDraft({ ...fieldDraft, required: event.target.checked }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "设为必填字段" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "空值会阻止表格保存" })
            ] })
          ] }),
          fieldDraft.error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "field-error", role: "alert", children: fieldDraft.error }),
          fieldDraft.mode === "edit" && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "data-sheet-delete-field", type: "button", disabled: table.columns.length <= 1, onClick: deleteField, children: "删除此字段" })
        ] }),
        filesOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(Modal, { title: "数据文件与导入记录", onClose: () => setFilesOpen(false), hideFooter: true, wide: true, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "data-sheet-file-history", children: table.attachments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "data-sheet-file-empty", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/document-sheet.svg", alt: "" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "暂无导入文件" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "通过“导入数据”可批量解析 CSV / TSV 文件。" })
          ] }) : table.attachments.map((file) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/document-sheet.svg", alt: "" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: file.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                formatFileSize(file.size),
                " · ",
                file.rowCount,
                " 条 · ",
                file.uploadedBy,
                " 于 ",
                file.uploadedAt,
                " 导入"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              file.previewText && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
                setFilesOpen(false);
                setPreviewAttachmentId(file.id);
              }, children: "查看预览" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "is-danger", onClick: () => {
                if (!window.confirm(`移除“${file.name}”的导入记录？已导入的表格行不会删除。`)) return;
                markChanged((current) => ({ ...current, attachments: current.attachments.filter((item) => item.id !== file.id) }));
                onToast("导入记录已移除");
              }, children: "移除记录" })
            ] })
          ] }, file.id)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "data-sheet-file-actions", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "button button--secondary", type: "button", onClick: () => {
              setFilesOpen(false);
              window.setTimeout(openImportDialog, 0);
            }, children: "继续导入" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "button button--primary", type: "button", onClick: () => setFilesOpen(false), children: "完成" })
          ] })
        ] }),
        previewAttachment && /* @__PURE__ */ jsxRuntimeExports.jsxs(Modal, { title: "数据文件预览", onClose: () => {
          setPreviewAttachmentId(null);
          setFilesOpen(true);
        }, hideFooter: true, wide: true, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "data-sheet-preview-meta", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/document-sheet.svg", alt: "" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: previewAttachment.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                formatFileSize(previewAttachment.size),
                " · ",
                previewAttachment.rowCount,
                " 条 · ",
                previewAttachment.uploadedBy,
                " 导入"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "data-sheet-file-preview", children: previewAttachment.previewText || "该文件没有可用的文本预览。" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "data-sheet-file-actions", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "button button--primary", type: "button", onClick: () => {
            setPreviewAttachmentId(null);
            setFilesOpen(true);
          }, children: "返回文件列表" }) })
        ] })
      ]
    }
  );
}
export {
  DataTableWorkspace
};
