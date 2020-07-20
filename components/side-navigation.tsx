import * as React from "react";
import Link from "next/link";
import { useStyletron } from "baseui";

interface Props {
  fileId: string;
  fileName: string;
  pages?: any[];
  nodeId?: string;
}

export default function SideNavigation({ pages = [], nodeId = null }: Props) {
  const [css, theme] = useStyletron();
  const activeLink = React.useRef<HTMLDivElement>();
  React.useEffect(() => {
    if (activeLink.current && activeLink.current.scrollIntoView) {
      activeLink.current.scrollIntoView();
    }
  }, [nodeId]);
  return (
    <nav
      className={css({
        display: "none",
        [theme.mediaQuery.large]: {
          position: "fixed",
          top: "60px",
          width: "300px",
          height: "calc(100vh - 60px)",
          display: "flex",
          flexDirection: "column",
          borderRight: `solid 1px ${theme.colors.border}`,
          paddingTop: theme.sizing.scale800,
          overflowY: "scroll",
        },
      })}
    >
      {pages.map((page) => {
        return (
          <div
            key={page.id}
            className={css({ marginBottom: theme.sizing.scale800 })}
          >
            <div
              className={css({
                ...theme.typography.ParagraphMedium,
                fontFamily: theme.typography.DisplayXSmall.fontFamily,
                paddingLeft: theme.sizing.scale800,
                marginBottom: theme.sizing.scale400,
              })}
            >
              {page.name}
            </div>
            {page.children.map((frame) => {
              const isActive = frame.id === nodeId;
              return (
                <div
                  ref={isActive ? activeLink : null}
                  key={frame.id}
                  className={css({
                    padding: `${theme.sizing.scale200} 0`,
                    paddingLeft: theme.sizing.scale800,
                    background: isActive
                      ? theme.colors.backgroundLightAccent
                      : "none",
                  })}
                >
                  <Link href={`/[nodeId]`} as={`/${frame.id}`} passHref>
                    <a
                      className={css({
                        ...theme.typography.ParagraphMedium,
                        textDecoration: "none",
                        color: isActive
                          ? theme.colors.contentPrimary
                          : theme.colors.contentTertiary,
                        ":focus-visible": {
                          outline: `solid 2px ${theme.colors.accent}`,
                          outlineOffset: "2px",
                        },
                        ":hover": {
                          color: theme.colors.black,
                        },
                      })}
                    >
                      {frame.name}
                    </a>
                  </Link>
                </div>
              );
            })}
          </div>
        );
      })}
    </nav>
  );
}
