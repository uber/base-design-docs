export interface Frame {
  id: string;
  name: string;
  // The following are not Figma properties:
  key: string; // Used for urls and unique identification
  fileName: string;
  fileKey: string;
}

export interface Page {
  id: string;
  name: string;
  children: Frame[];
}

export interface Node {
  id: string;
  name: string;
  visible: boolean;
}

export interface Document {
  children: Node[];
}

export interface File {
  key: string;
  document: Document;
}

export interface Project {
  id: string;
  name: string;
}
