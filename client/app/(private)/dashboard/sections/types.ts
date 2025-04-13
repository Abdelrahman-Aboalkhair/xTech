// components/sections/types.ts
export interface Section {
  id: number;
  title: string;
  type: string;
  content: any;
  order: number;
  isVisible: boolean;
  pageId: number;
}

export interface SectionFormData {
  id: number;
  title: string;
  type: string;
  content: any;
  order: number;
  isVisible: boolean;
  pageId: number;
}
