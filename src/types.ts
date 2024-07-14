export const STORAGE_KEY = "label-website";

type LabelModel = {
  url: string;
  label: string;
  labelColor: string;
  textColor: string;
};

export const defaultLabelModel: LabelModel = {
  url: "",
  label: "",
  labelColor: "#FF0000",
  textColor: "#FFFFFF",
};

export type { LabelModel };
