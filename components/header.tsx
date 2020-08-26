import Link from "next/link";
import { useStyletron } from "baseui";
import { Button, KIND, SHAPE, SIZE } from "baseui/button";
import { Logo, Console, Figma } from "./icons";
import Search from "./search";
import { MQ } from "../lib/constants";
import * as gtag from "../lib/gtag";

interface Props {
  pages: any[];
  fileId?: string;
  fileName?: string;
  nodeId?: string;
}

function Header({
  pages,
  fileId = null,
  fileName = null,
  nodeId = null,
}: Props) {
  const [css, theme] = useStyletron();
  return (
    <header
      className={css({
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        background: theme.colors.backgroundPrimary,
        height: "124px",
        paddingLeft: theme.sizing.scale800,
        paddingRight: theme.sizing.scale800,
        [MQ.medium]: {
          position: "fixed",
          top: "0",
          zIndex: "1",
          height: "60px",
        },
      })}
    >
      <div
        className={css({
          marginRight: "auto",
          order: 1,
        })}
      >
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
      <div
        className={css({
          width: "100%",
          order: 3,
          alignSelf: "baseline",
          [MQ.medium]: {
            width: "300px",
            order: 2,
            alignSelf: "initial",
          },
          [MQ.large]: {
            width: "400px",
          },
        })}
      >
        <Search pages={pages} nodeId={nodeId} />
      </div>
      <div
        className={css({
          display: "flex",
          order: 2,
          [MQ.medium]: {
            order: 3,
          },
        })}
      >
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
                [MQ.small]: {
                  display: "inline-block",
                  marginLeft: theme.sizing.scale400,
                },
              })}
            >
              Base Web
            </span>
          </Button>
        </div>
        <Button
          // @ts-ignore - Missing type in baseui
          $as="a"
          href={
            fileId && fileName
              ? `https://www.figma.com/file/${fileId}/${fileName}${
                  nodeId ? `?node-id=${nodeId.replace("-", ":")}` : ""
                }`
              : `https://www.figma.com/files/${process.env.FIGMA_FILE_ID}/project/${process.env.FIGMA_PROJECT_ID}/%E2%9D%96-Base-Documentation`
          }
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
              label: nodeId ? `figma_${nodeId}` : "figma_root",
            });
          }}
        >
          <Figma size="16px" />
          <span
            className={css({
              display: "none",
              [MQ.small]: {
                display: "inline-block",
                marginLeft: theme.sizing.scale400,
              },
            })}
          >
            Figma
          </span>
        </Button>
      </div>
    </header>
  );
}

export default Header;
