import Link from "next/link";
import { useStyletron } from "baseui";

export default function SideNavigation({
  fileId,
  fileName,
  pages = [],
  nodeId = null,
}: {
  fileId: string;
  fileName: string;
  pages?: any[];
  nodeId?: string;
}) {
  const [css, theme] = useStyletron();
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
      {pages.map((page, index) => {
        return (
          <div
            key={page.id}
            className={css({
              marginBottom:
                index < pages.length - 1 ? theme.sizing.scale800 : null,
            })}
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
              return (
                <div
                  key={frame.id}
                  className={css({
                    padding: `${theme.sizing.scale200} 0`,
                    paddingLeft: theme.sizing.scale800,
                  })}
                >
                  <Link href={`/[nodeId]`} as={`/${frame.id}`} passHref>
                    <a
                      className={css({
                        ...theme.typography.ParagraphMedium,
                        textDecoration: "none",
                        color: theme.colors.contentTertiary,
                        ":focus": {
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
