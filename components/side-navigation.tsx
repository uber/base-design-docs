import { useRef, useEffect, useContext } from "react";
import Link from "next/link";
import { useStyletron } from "baseui";
import { Accordion, Panel } from "baseui/accordion";
import { PageContext } from "./layout";
import * as gtag from "../lib/gtag";

function SideNavigation() {
  const [css, theme] = useStyletron();
  const activeLink = useRef<HTMLDivElement>();
  const { siteMap = [], activePage = { key: null } } = useContext(PageContext);

  useEffect(() => {
    if (activeLink.current && activeLink.current.scrollIntoView) {
      activeLink.current.scrollIntoView({
        block: "center",
        inline: "center",
      });
    }
  }, [activePage.key]);

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
          paddingTop: theme.sizing.scale800,
          overflowY: "scroll",
          /* Hide scrollbar for Chrome, Safari and Opera */
          "::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
        },
      })}
    >
      <Accordion>
        {siteMap.map((section) => {
          return (
            <Panel title={section.name} key={section.name}>
              {section.children.map((page) => {
                const isActive = page.key === activePage.key;
                return (
                  <div
                    ref={isActive ? activeLink : null}
                    key={page.key}
                    className={css({
                      padding: `${theme.sizing.scale200} ${theme.sizing.scale400}`,
                      marginLeft: theme.sizing.scale600,
                      marginRight: theme.sizing.scale600,
                      borderRadius: "3px",
                      background: isActive
                        ? theme.colors.backgroundTertiary
                        : "none",
                    })}
                  >
                    <Link href={`/[pageKey]`} as={`/${page.key}`} passHref>
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
                            label: page.key,
                          });
                        }}
                      >
                        {page.name}
                      </a>
                    </Link>
                  </div>
                );
              })}
            </Panel>
          );
        })}
      </Accordion>
    </nav>
  );
}

export default SideNavigation;
