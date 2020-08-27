import { useRef, useEffect } from "react";
import Link from "next/link";
import { useStyletron } from "baseui";
import * as gtag from "../lib/gtag";
import { MQ } from "../lib/constants";

interface Props {
  pages?: any[];
  nodeId?: string;
}

function SideNavigation({ pages = [], nodeId = null }: Props) {
  const [css, theme] = useStyletron();
  const activeLink = useRef<HTMLDivElement>();
  useEffect(() => {
    if (activeLink.current && activeLink.current.scrollIntoView) {
      activeLink.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [nodeId]);
  return (
    <nav
      className={css({
        display: "none",
        [MQ.large]: {
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
                      ? theme.colors.backgroundSecondary
                      : "none",
                  })}
                >
                  <Link href={`/[nodeId]`} as={`/${frame.url}`} passHref>
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
                      onClick={() => {
                        gtag.event({
                          action: "click_link_sidenav",
                          category: "navigation",
                          label: nodeId,
                        });
                      }}
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

export default SideNavigation;
