import { useContext, Fragment } from "react";
import Link from "next/link";
import { useStyletron } from "baseui";
import { Button, KIND, SHAPE, SIZE } from "baseui/button";
import { Logo, Console, Figma, Help } from "./icons";
import Search from "./search";
import { PageContext } from "./layout";
import * as gtag from "../lib/gtag";

function Home() {
  const [css, theme] = useStyletron();
  return (
    <div className={css({ display: "flex" })}>
      <Link href="/" as="/">
        <a
          className={css({
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            ":focus": {
              outline: `solid 3px ${theme.colors.borderAccent}`,
              outlineOffset: "2px",
            },
          })}
          onClick={() => {
            gtag.event({
              action: "click_link_header",
              category: "navigation",
              label: "home",
            });
          }}
        >
          <Logo dark size="22px" />
          <div
            className={css({
              ...theme.typography.DisplayXSmall,
              fontSize: theme.typography.HeadingSmall.fontSize,
              color: theme.colors.white,
              marginLeft: theme.sizing.scale400,
            })}
          >
            Base
          </div>
        </a>
      </Link>
    </div>
  );
}

function Links() {
  const [css, theme] = useStyletron();
  const {
    activePage = { key: null },
    figmaLink = "#",
    openHelpModal,
  } = useContext(PageContext);
  return (
    <Fragment>
      <div
        className={css({
          marginLeft: theme.sizing.scale400,
          marginRight: theme.sizing.scale400,
        })}
      >
        <Button
          // @ts-ignore - Missing type in baseui
          $as="a"
          href="https://baseweb.design"
          target="_blank"
          rel="noopener"
          kind={KIND.tertiary}
          shape={SHAPE.pill}
          size={SIZE.compact}
          title="Open Base Web documentation"
          onClick={() => {
            gtag.event({
              action: "click_link_header_external",
              category: "navigation",
              label: "base_web",
            });
          }}
        >
          <Console size="16px" />
          <span
            className={css({
              display: "none",
              [theme.mediaQuery.small]: {
                display: "inline-block",
                marginLeft: theme.sizing.scale400,
                whiteSpace: "nowrap",
              },
            })}
          >
            Base Web
          </span>
        </Button>
      </div>
      <div
        className={css({
          marginRight: theme.sizing.scale400,
        })}
      >
        <Button
          // @ts-ignore - Missing type in baseui
          $as="a"
          href={figmaLink}
          target="_blank"
          rel="noopener"
          kind={KIND.tertiary}
          shape={SHAPE.pill}
          size={SIZE.compact}
          title="Open in Figma"
          onClick={() => {
            gtag.event({
              action: "click_link_header_external",
              category: "navigation",
              label: activePage.key ? `figma_${activePage.key}` : "figma_root",
            });
          }}
        >
          <Figma size="16px" />
          <span
            className={css({
              display: "none",
              [theme.mediaQuery.small]: {
                display: "inline-block",
                marginLeft: theme.sizing.scale400,
              },
            })}
          >
            Figma
          </span>
        </Button>
      </div>
      <Button
        shape={SHAPE.pill}
        kind={KIND.tertiary}
        size={SIZE.compact}
        onClick={() => {
          openHelpModal();
        }}
      >
        <Help size="16px" />
        <span
          className={css({
            display: "none",
            [theme.mediaQuery.small]: {
              display: "inline-block",
              marginLeft: theme.sizing.scale400,
            },
          })}
        >
          Help
        </span>
      </Button>
    </Fragment>
  );
}

function Header() {
  const [css, theme] = useStyletron();
  return (
    <header
      className={css({
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        background: theme.colors.backgroundPrimary,
        height: "124px",
        paddingLeft: theme.sizing.scale800,
        paddingRight: theme.sizing.scale800,
        [theme.mediaQuery.medium]: {
          position: "fixed",
          top: "0",
          zIndex: "1",
          height: "60px",
          flexWrap: "nowrap",
        },
      })}
    >
      <div
        className={css({
          order: 1,
          marginRight: "auto",
          [theme.mediaQuery.medium]: {
            flex: "1",
            marginRight: "0",
          },
        })}
      >
        <Home />
      </div>
      <div
        className={css({
          order: 3,
          width: "100%",
          alignSelf: "baseline",
          [theme.mediaQuery.medium]: {
            order: 2,
            flex: "1",
            alignSelf: "initial",
          },
        })}
      >
        <Search />
      </div>
      <div
        className={css({
          order: 2,
          display: "flex",
          justifyContent: "flex-end",
          [theme.mediaQuery.medium]: {
            order: 3,
            flex: "1",
          },
        })}
      >
        <Links />
      </div>
    </header>
  );
}

export default Header;
