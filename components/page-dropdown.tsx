import { useMemo, ReactChildren } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useStyletron, ThemeProvider, LightThemeMove } from "baseui";
import { colors } from "baseui/tokens";
import { Button, KIND, SHAPE, SIZE } from "baseui/button";
import { StatefulPopover, PLACEMENT } from "baseui/popover";
import { StatefulMenu } from "baseui/menu";
import { Book } from "./icons";
import * as gtag from "../lib/gtag";
import { MQ } from "../lib/constants";

interface Props {
  nodeId: string;
  pages?: any[];
}

function PageDropdown({ nodeId, pages = [] }: Props) {
  const [css, theme] = useStyletron();
  const router = useRouter();
  const [ITEMS, activeIndex] = useMemo(() => {
    const ITEMS = {};
    let count = 0;
    let activeIndex = 0;

    for (const page of pages) {
      ITEMS[page.name] = [];
      for (const frame of page.children) {
        if (frame.id === nodeId) activeIndex = count;
        count += 1;
        ITEMS[page.name].push({
          id: frame.id,
          name: frame.name,
          href: `/${frame.id}`,
        });
      }
    }

    return [ITEMS, activeIndex];
  }, [nodeId]);

  return (
    <StatefulPopover
      focusLock
      placement={PLACEMENT.bottom}
      content={({ close }) => (
        <ThemeProvider theme={LightThemeMove}>
          {/* @ts-ignore - Might be bad TS covergae for StatefulMenu. Errors when initialState is provided  */}
          <StatefulMenu
            items={ITEMS}
            initialState={{
              highlightedIndex: activeIndex,
              isFocused: true,
              activedescendantId: nodeId,
            }}
            onItemSelect={(params) => {
              // Keyboard events do not trigger the link so we do it manually.
              if (params.event.type === "keydown") {
                gtag.event({
                  action: "click_link_dropdown",
                  category: "navigation",
                  label: nodeId,
                });
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
                $item: { isHighlighted: boolean; id: string };
              }) {
                const isActive = $item.id === nodeId;
                return (
                  <Link href="/[nodeId]" as={href}>
                    <a
                      className={css({
                        display: "block",
                        color:
                          isActive || $item.isHighlighted
                            ? theme.colors.black
                            : theme.colors.contentTertiary,
                        textDecoration: "none",
                      })}
                      onClick={() => {
                        gtag.event({
                          action: "click_link_dropdown",
                          category: "navigation",
                          label: nodeId,
                        });
                      }}
                    >
                      {children}
                    </a>
                  </Link>
                );
              },
              Option: {
                props: {
                  getItemLabel: (item: { name: any }) => item.name,
                },
                style: ({ children }) => {
                  const isActive = children.props.$item.id === nodeId;
                  return {
                    backgroundColor: isActive ? colors.gray50 : "none",
                  };
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
            [MQ.medium]: {
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

export default PageDropdown;
