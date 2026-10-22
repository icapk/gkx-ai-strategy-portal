export const SHENZHEN_DISTRICTS = [
  "宝安区",
  "光明区",
  "龙华区",
  "南山区",
  "福田区",
  "罗湖区",
  "龙岗区",
  "坪山区",
  "盐田区",
] as const;

export type ShenzhenDistrictName = (typeof SHENZHEN_DISTRICTS)[number];

export type ShenzhenMapMarker = {
  id: string;
  name: string;
  type: "重点企业" | "科研机构";
  district: ShenzhenDistrictName;
  coordinate?: [number, number];
};
