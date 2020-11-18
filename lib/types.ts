/**
 * A Figma Node. A fairly primitive type extended by most other Figma types.
 */
export interface Node {
  id: string;
  name: string;
  visible?: boolean;
}

/**
 * A Figma Frame Node. Equivalent to a Page of the site.
 */
export type Frame = Node;

/**
 * A Figma Canvas Node. Equivalent to a Section of the site.
 *
 * Sometimes called a Page, we refer to it as a Canvas,
 * both for accuracy but also to disambiguate our other Page type, which
 * represents pages of the site.
 */
export interface Canvas extends Node {
  children: Frame[];
}

/**
 * A Figma Document Node.
 */
export interface Document extends Node {
  children: Canvas[];
}

/**
 * A Figma File.
 */
export interface File {
  key: string;
  name: string;
  document: Document;
}

/**
 * A Figma Project. Note, this includes project files which is not strictly
 * part of the true Figma type signature for Projects.
 */
export interface Project {
  id: string;
  name: string;
  // non Figma properties...
  files: File[];
}

// Site

/**
 * A single page of the site. Equivalent to a single Frame in Figma.
 */
export interface Page extends Frame {
  key: string;
  fileName: string;
  fileKey: string;
}

/**
 * A list of pages. Equivalent to a single Canvas in Figma.
 */
export interface Section extends Canvas {
  children: Page[];
}

/**
 * A list of sections, each of which is parent to a list of pages.
 * The Figma equivalent is a collection of all Canvases in a Project (across Files).
 * We use this for assembling navigation as well as constructing the list
 * of paths to render during a build (via getStaticPaths).
 */
export type SiteMap = Section[];

/** All of the information needed to render a next/image. */
export type ImageData = { src: string; height: number; width: number };
