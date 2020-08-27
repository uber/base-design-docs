export interface Page {
  id: string;
  name: string;
  children: Frame[];
}

export interface Frame {
  id: string;
  url: string;
  name: string;
  fileName: string;
  fileKey: string;
}
