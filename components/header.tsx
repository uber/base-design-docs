import { ReactChildren } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useStyletron, ThemeProvider, LightThemeMove } from "baseui";
import { Button, KIND, SHAPE, SIZE } from "baseui/button";
import { StatefulPopover, PLACEMENT } from "baseui/popover";
import { StatefulMenu } from "baseui/menu";
import { Logo, Console, Figma, Book } from "./icons";

function PageDropdown({ pages }: { pages: any[] }) {
  const [css, theme] = useStyletron();
  const router = useRouter();

  // Sometimes pages is undefined.
  // This might be related to Layout being in _app.tsx...
  const ITEMS = pages
    ? pages.reduce((acc, cur) => {
        acc[cur.name] = cur.children.map((frame) => ({
          id: frame.id,
          name: frame.name,
          href: `/${frame.id}`,
        }));
        return acc;
      }, {})
    : [];

  return (
    <StatefulPopover
      focusLock
      placement={PLACEMENT.bottom}
      content={({ close }) => (
        <ThemeProvider theme={LightThemeMove}>
          <StatefulMenu
            items={ITEMS}
            onItemSelect={(params) => {
              // Keyboard events do not trigger the link so we do it manually.
              if (params.event.type === "keydown") {
                router.push("/[nodeId]", params.item.href);
              }
              close();
            }}
            overrides={{
              List: {
                style: {
                  height: "400px",
                  width: "300px",
                },
              },
              // @ts-ignore - Missing type in baseui
              ListItemAnchor: function ListItemAnchor({
                children,
                href,
                $item,
              }: {
                children: ReactChildren;
                href: string;
                $item: { isHighlighted: boolean };
              }) {
                return (
                  <Link href="/[nodeId]" as={href}>
                    <a
                      className={css({
                        display: "block",
                        color: $item.isHighlighted
                          ? theme.colors.black
                          : theme.colors.contentTertiary,
                        textDecoration: "none",
                      })}
                    >
                      {children}
                    </a>
                  </Link>
                );
              },
              Option: {
                props: {
                  getItemLabel: (item) => item.name,
                },
              },
            }}
          />
        </ThemeProvider>
      )}
    >
      <Button
        kind={KIND.tertiary}
        shape={SHAPE.pill}
        size={SIZE.compact}
        overrides={{
          BaseButton: {
            props: {
              title: "Open a specific page",
            },
          },
        }}
      >
        <Book size="16px" />
        <span
          className={css({
            display: "none",
            [theme.mediaQuery.medium]: {
              display: "inline-block",
              marginLeft: theme.sizing.scale400,
            },
          })}
        >
          Components
        </span>
      </Button>
    </StatefulPopover>
  );
}

interface HeaderProps {
  pages: any[];
  fileId: string;
  fileName: string;
  nodeId?: string;
}

export default function Header({
  pages,
  fileId,
  fileName,
  nodeId = null,
}: HeaderProps) {
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
        <PageDropdown pages={pages} />
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
