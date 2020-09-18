import Link from "next/link";
import { useStyletron } from "baseui";
import { useContext } from "react";
import { PageContext } from "./layout";
import { Grid, Cell } from "baseui/layout-grid";

function BottomNavigation() {
  const [css, theme] = useStyletron();
  const { pages = [], activeFrame = { key: null } } = useContext(PageContext);

  return (
    <nav
      className={css({
        ...theme.typography.ParagraphMedium,
        background: theme.colors.backgroundSecondary,
        paddingTop: theme.sizing.scale800,
        paddingBottom: theme.sizing.scale1200,
        [theme.mediaQuery.large]: {
          display: "none",
        },
      })}
    >
      <Grid gridGaps={[24]}>
        {pages.map((page) => (
          <Cell key={page.name} span={[2, 2, 3]}>
            <div>
              <div
                className={css({
                  ...theme.typography.DisplayXSmall,
                  fontSize: theme.typography.LabelLarge.fontSize,
                  padding: theme.sizing.scale400,
                })}
              >
                {page.name}
              </div>
              <div>
                {page.children.map((frame) => (
                  <div
                    key={frame.key}
                    className={css({
                      padding: `${theme.sizing.scale200} ${theme.sizing.scale400}`,
                      borderRadius: "3px",
                      background:
                        activeFrame.key === frame.key
                          ? theme.colors.backgroundTertiary
                          : null,
                    })}
                  >
                    <Link href={`/[frameKey]`} as={`/${frame.key}`} passHref>
                      <a
                        className={css({
                          ...theme.typography.ParagraphMedium,
                          textDecoration: "none",
                          color:
                            activeFrame.key === frame.key
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
                ))}
              </div>
            </div>
          </Cell>
        ))}
      </Grid>
    </nav>
  );
}

export default BottomNavigation;
