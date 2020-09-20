import Link from "next/link";
import { useStyletron } from "baseui";
import { useContext } from "react";
import { PageContext } from "./layout";
import { Grid, Cell } from "baseui/layout-grid";

function BottomNavigation() {
  const [css, theme] = useStyletron();
  const { siteMap = [], activePage = { key: null } } = useContext(PageContext);

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
        {siteMap.map((section) => (
          <Cell key={section.name} span={[2, 2, 3]}>
            <div>
              <div
                className={css({
                  ...theme.typography.DisplayXSmall,
                  fontSize: theme.typography.LabelLarge.fontSize,
                  padding: theme.sizing.scale400,
                })}
              >
                {section.name}
              </div>
              <div>
                {section.children.map((page) => (
                  <div
                    key={page.key}
                    className={css({
                      padding: `${theme.sizing.scale200} ${theme.sizing.scale400}`,
                      borderRadius: "3px",
                      background:
                        activePage.key === page.key
                          ? theme.colors.backgroundTertiary
                          : null,
                    })}
                  >
                    <Link href={`/[pageKey]`} as={`/${page.key}`} passHref>
                      <a
                        className={css({
                          ...theme.typography.ParagraphMedium,
                          textDecoration: "none",
                          color:
                            activePage.key === page.key
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
                        {page.name}
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
