import { MapChart } from "echarts/charts";
import { AriaComponent, MarkPointComponent, TooltipComponent, VisualMapComponent } from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { useEffect, useMemo, useRef, type KeyboardEvent } from "react";
import shenzhenGeoJSON from "../data/shenzhen-districts.json";
import { SHENZHEN_DISTRICTS, type ShenzhenDistrictName, type ShenzhenMapMarker } from "./shenzhenMapData";

type ShenzhenGeoMapProps = {
  ariaLabel: string;
  values: Record<ShenzhenDistrictName, number>;
  selectedDistrict: ShenzhenDistrictName;
  onDistrictChange: (district: ShenzhenDistrictName) => void;
  metricLabel: string;
  unit?: string;
  showValues?: boolean;
  markers?: ShenzhenMapMarker[];
  selectedMarkerId?: string | null;
  onMarkerSelect?: (marker: ShenzhenMapMarker) => void;
};

type GeoFeature = {
  properties?: { name?: string };
  geometry?: { coordinates?: unknown };
};

const MAP_NAME = "gkx-shenzhen-districts";
const geoJSON = shenzhenGeoJSON as { features?: GeoFeature[] };

echarts.use([MapChart, TooltipComponent, VisualMapComponent, MarkPointComponent, AriaComponent, CanvasRenderer]);
echarts.registerMap(MAP_NAME, shenzhenGeoJSON as never);

function collectCoordinates(value: unknown, output: Array<[number, number]>) {
  if (!Array.isArray(value)) return;
  if (value.length >= 2 && typeof value[0] === "number" && typeof value[1] === "number") {
    output.push([value[0], value[1]]);
    return;
  }
  value.forEach((item) => collectCoordinates(item, output));
}

const districtCenters = new Map<ShenzhenDistrictName, [number, number]>();
for (const feature of geoJSON.features ?? []) {
  const name = feature.properties?.name as ShenzhenDistrictName | undefined;
  if (!name || !SHENZHEN_DISTRICTS.includes(name)) continue;
  const points: Array<[number, number]> = [];
  collectCoordinates(feature.geometry?.coordinates, points);
  if (!points.length) continue;
  const bounds = points.reduce((result, point) => ({
    minX: Math.min(result.minX, point[0]),
    maxX: Math.max(result.maxX, point[0]),
    minY: Math.min(result.minY, point[1]),
    maxY: Math.max(result.maxY, point[1]),
  }), { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });
  districtCenters.set(name, [(bounds.minX + bounds.maxX) / 2, (bounds.minY + bounds.maxY) / 2]);
}

export default function ShenzhenGeoMap({
  ariaLabel,
  values,
  selectedDistrict,
  onDistrictChange,
  metricLabel,
  unit = "",
  showValues = true,
  markers = [],
  selectedMarkerId = null,
  onMarkerSelect,
}: ShenzhenGeoMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);
  const onDistrictChangeRef = useRef(onDistrictChange);
  const onMarkerSelectRef = useRef(onMarkerSelect);
  onDistrictChangeRef.current = onDistrictChange;
  onMarkerSelectRef.current = onMarkerSelect;

  const seriesData = useMemo(() => SHENZHEN_DISTRICTS.map((name) => ({
    name,
    value: values[name],
    selected: name === selectedDistrict,
  })), [selectedDistrict, values]);

  useEffect(() => {
    if (!containerRef.current) return;
    const chart = echarts.init(containerRef.current, undefined, { renderer: "canvas" });
    chartRef.current = chart;
    const handleClick = (event: unknown) => {
      const params = event as { componentType?: string; data?: unknown; name?: string; seriesType?: string };
      const markerData = params.data as ShenzhenMapMarker | undefined;
      if (params.componentType === "markPoint" && markerData?.id) {
        onMarkerSelectRef.current?.(markerData);
        return;
      }
      if (params.seriesType !== "map") return;
      const district = params.name as ShenzhenDistrictName | undefined;
      if (district && SHENZHEN_DISTRICTS.includes(district)) onDistrictChangeRef.current(district);
    };
    chart.on("click", handleClick);
    const resizeObserver = new ResizeObserver(() => chart.resize());
    resizeObserver.observe(containerRef.current);
    return () => {
      resizeObserver.disconnect();
      chart.off("click", handleClick);
      chart.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    const valuesList = SHENZHEN_DISTRICTS.map((name) => values[name]);
    const min = Math.min(...valuesList);
    const max = Math.max(...valuesList);
    const markerData = markers.flatMap((marker) => {
      const center = marker.coordinate ?? districtCenters.get(marker.district);
      if (!center) return [];
      return [{
        ...marker,
        coord: center,
        itemStyle: {
          color: marker.type === "科研机构" ? "#0f9f8f" : "#f59e0b",
          borderColor: marker.id === selectedMarkerId ? "#1d2129" : "#fff",
          borderWidth: marker.id === selectedMarkerId ? 3 : 2,
        },
      }];
    });
    chart.setOption({
      animationDurationUpdate: 220,
      animationEasingUpdate: "cubicOut",
      aria: { enabled: true },
      tooltip: {
        trigger: "item",
        confine: true,
        backgroundColor: "rgba(29,33,41,.92)",
        borderWidth: 0,
        padding: [8, 10],
        textStyle: { color: "#fff", fontSize: 12 },
        formatter: (params: { componentType?: string; data?: unknown; name?: string; value?: number }) => {
          if (params.componentType === "markPoint") {
            const marker = params.data as ShenzhenMapMarker | undefined;
            return marker ? `${marker.name}<br/>${marker.type} · ${marker.district}<br/>位置坐标为示意数据` : "";
          }
          return `${params.name ?? ""}<br/>${metricLabel}：${Number(params.value ?? 0).toLocaleString()}${unit}`;
        },
      },
      visualMap: {
        show: false,
        min,
        max: Math.max(max, min + 1),
        inRange: { color: ["#dbeafe", "#8db7ff", "#165dff"] },
      },
      series: [{
        type: "map",
        map: MAP_NAME,
        roam: false,
        selectedMode: "single",
        selectedMap: { [selectedDistrict]: true },
        layoutCenter: ["50%", "51%"],
        layoutSize: "145%",
        data: seriesData,
        label: {
          show: true,
          color: "#fff",
          fontSize: 12,
          fontWeight: 500,
          lineHeight: 18,
          textBorderColor: "rgba(22,65,125,.52)",
          textBorderWidth: 2,
          formatter: (params: { name?: string; value?: number }) => showValues
            ? `${params.name ?? ""}\n${Number(params.value ?? 0).toLocaleString()}${unit}`
            : params.name ?? "",
        },
        itemStyle: {
          areaColor: "#8db7ff",
          borderColor: "rgba(255,255,255,.96)",
          borderWidth: 1.5,
        },
        emphasis: {
          label: { color: "#fff", fontWeight: 600 },
          itemStyle: { areaColor: "#4f8cff", borderColor: "#fff", borderWidth: 2 },
        },
        select: {
          label: { color: "#fff", fontWeight: 600 },
          itemStyle: { areaColor: "#0e5dcc", borderColor: "#fff", borderWidth: 3, shadowBlur: 14, shadowColor: "rgba(22,93,255,.46)" },
        },
        markPoint: markerData.length ? {
          symbol: "pin",
          symbolSize: 38,
          label: { show: false },
          data: markerData,
        } : undefined,
      }],
    }, true);
    chart.dispatchAction({ type: "select", seriesIndex: 0, name: selectedDistrict });
  }, [markers, metricLabel, selectedDistrict, selectedMarkerId, seriesData, showValues, unit, values]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = SHENZHEN_DISTRICTS.indexOf(selectedDistrict);
    let nextIndex = currentIndex;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (currentIndex + 1) % SHENZHEN_DISTRICTS.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (currentIndex - 1 + SHENZHEN_DISTRICTS.length) % SHENZHEN_DISTRICTS.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = SHENZHEN_DISTRICTS.length - 1;
    else return;
    event.preventDefault();
    onDistrictChange(SHENZHEN_DISTRICTS[nextIndex]);
  };

  return <figure className="om-map-figure om-echarts-map">
    <div ref={containerRef} className="om-echarts-map-canvas" role="group" tabIndex={0} aria-label={`${ariaLabel}。使用方向键切换行政区。`} onKeyDown={handleKeyDown} />
    {markers.length > 0 && <div className="om-echarts-marker-legend" aria-label="地图点位图例"><span><i className="enterprise" />重点企业</span><span><i className="research" />科研机构</span></div>}
    <figcaption><span>深圳市真实行政区边界</span><small>9 个正式行政区 · 支持悬浮、点击与键盘切换</small></figcaption>
  </figure>;
}
