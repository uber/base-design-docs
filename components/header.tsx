import Link from "next/link";
import { useStyletron } from "baseui";
import { Button, KIND, SHAPE, SIZE } from "baseui/button";
import { Logo, Console, Figma } from "./icons";
import PageDropdown from "./page-dropdown";

interface Props {
  pages: any[];
  fileId: string;
  fileName: string;
  nodeId?: string;
}

function Header({ pages, fileId, fileName, nodeId = null }: Props) {
  const [css, theme] = useStyletron();
  return (
    <header
      className={css({
        height: "60px",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "fixed",
        top: "0",
        background: theme.colors.backgroundPrimary,
        paddingLeft: theme.sizing.scale800,
        paddingRight: theme.sizing.scale800,
        zIndex: "1",
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
      <div
        className={css({
          display: "flex",
          marginLeft: "auto",
        })}
      >
        <PageDropdown pages={pages} nodeId={nodeId} />
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
          >
            <Console size="16px" />
            <span
              className={css({
                display: "none",
                [theme.mediaQuery.medium]: {
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
          href={`https://www.figma.com/file/${fileId}/${fileName}${
            nodeId ? `?node-id=${nodeId.replace("-", ":")}` : ""
          }`}
          target="_blank"
          rel="noopener"
          kind={KIND.tertiary}
          shape={SHAPE.pill}
          size={SIZE.compact}
          title="Open in Figma"
        >
          <Figma size="16px" />
          <span
            className={css({
              display: "none",
              [theme.mediaQuery.medium]: {
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
