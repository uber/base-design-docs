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
    <div className={css({ display: "flex", alignItems: "flex-end" })}>
      <div
        className={css({
          flexBasis: "50%",
          paddingBottom: "10vh",
          paddingLeft: "8vh",
          paddingRight: "8vh",
        })}
      >
        <Display>Base</Display>
        <DisplayXSmall color="contentTertiary">Documentation</DisplayXSmall>
        <ParagraphMedium color="contentTertiary">
          Reference this site for both high-level patterns as well as component
          specific guidelines when using the Base design system.
        </ParagraphMedium>
      </div>
      <div className={css({ flexBasis: "50%" })}>
        <img
          alt="Cars driving down a winding road."
          className={css({
            display: "block",
            height: "100vh",
            width: "100%",
            objectFit: "cover",
          })}
          src="/curvy.jpg"
        />
      </div>
    </div>
  );

  return (
    <Grid>
      <Cell span={[4, 3, 5]}>
        <div
          className={css({
            height: "100vh",
            maxHeight: "1000px",
            display: "flex",
            alignItems: "flex-end",
            paddingBottom: "10vh",
          })}
        >
          <div>
            <Display>Base</Display>
            <DisplayXSmall color="contentTertiary">Documentation</DisplayXSmall>
            <ParagraphMedium color="contentTertiary">
              Reference this site for both high-level patterns as well as
              component specific guidelines when using the Base design system.
            </ParagraphMedium>
          </div>
        </div>
      </Cell>
      <Cell
        span={[0, 4, 6]}
        skip={[0, 1, 1]}
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
  );
}

export { Home as default, getStaticProps };
