import Link from "next/link";

import { useStyletron } from "baseui";
import { Grid, Cell } from "baseui/layout-grid";
import { Display, ParagraphMedium, DisplayXSmall } from "baseui/typography";

async function getStaticProps() {
  const { getPages } = require("../lib/api");
  const [pages, fileName] = await getPages();
  return {
    props: {
      pages,
      fileId: process.env.FIGMA_FILE_ID,
      fileName,
    },
  };
}

function Home({ pages }: { pages: any[] }) {
  const [css, theme] = useStyletron();
  return (
    <div className={css({ borderLeft: `solid 1px ${theme.colors.border}` })}>
      <Grid>
        <Cell span={[4, 3, 4]}>
          <div
            className={css({
              height: "100vh",
              maxHeight: "1000px",
              display: "flex",
              alignItems: "flex-end",
              paddingBottom: theme.sizing.scale1000,
            })}
          >
            <div>
              <Display>Base</Display>
              <DisplayXSmall color="contentSecondary">
                Documentation
              </DisplayXSmall>
              <ParagraphMedium color="contentTertiary">
                Reference this site for both high-level patterns as well as
                component specific guidelines when using the Base design system.
              </ParagraphMedium>
            </div>
          </div>
        </Cell>
        <Cell
          span={[0, 4, 6]}
          skip={[0, 1, 2]}
          overrides={{ Cell: { style: { display: "none" } } }}
        >
          <img
            alt="Cars driving down a winding road."
            className={css({
              display: "block",
              height: "100vh",
              maxHeight: "1000px",
              width: "100%",
              objectFit: "cover",
            })}
            src="/curvy.jpg"
          />
        </Cell>
      </Grid>
    </div>
  );
}

export { Home as default, getStaticProps };
