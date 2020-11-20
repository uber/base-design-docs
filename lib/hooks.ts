import { useMemo } from "react";

function mod(n, m) {
  return ((n % m) + m) % m;
}

export function useSiblingPages(siteMap = [], key) {
  const siblingPages = useMemo(() => {
    const pages = [];
    let activePageIndex = 0;
    for (const section of siteMap) {
      for (const page of section.children) {
        if (key === page.key) {
          activePageIndex = pages.length;
        }
        pages.push(page);
      }
    }
    const previousPageIndex = key
      ? mod(activePageIndex - 1, pages.length)
      : pages.length - 1;
    const nextPageIndex = key ? mod(activePageIndex + 1, pages.length) : 0;
    return [pages[previousPageIndex], pages[nextPageIndex]];
  }, [siteMap, key]);

  return siblingPages;
}
