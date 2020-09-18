import { useStyletron } from "baseui";
import { Grid, Cell } from "baseui/layout-grid";
import { Display, ParagraphMedium, DisplayXSmall } from "baseui/typography";

export async function getStaticProps() {
  const { getPages } = require("../lib/api");
  const pages = await getPages();
  return {
    props: {
      pages,
      activeFrame: {},
      figmaLink: `https://www.figma.com/files/${process.env.FIGMA_FILE_KEY}/project/${process.env.FIGMA_PROJECT_ID}/%E2%9D%96-Base-Documentation`,
    },
  };
}

export default function Home() {
  const [css, theme] = useStyletron();
  return (
    <div
      className={css({
        display: "flex",
        alignItems: "flex-end",
        height: "calc(100vh - 124px)",
        [theme.mediaQuery.medium]: {
          height: "calc(100vh - 60px)",
        },
      })}
    >
      <div
        className={css({
          paddingBottom: theme.sizing.scale800,
          flexBasis: "75%",
          [theme.mediaQuery.medium]: {
            flexBasis: "50%",
          },
        })}
      >
        <Grid>
          <Cell span={[12]}>
            <Display>Base</Display>
            <DisplayXSmall color="contentTertiary">Documentation</DisplayXSmall>
            <ParagraphMedium color="contentTertiary">
              Reference this site for both high-level patterns as well as
              component specific guidelines when using the Base design system.
            </ParagraphMedium>
          </Cell>
        </Grid>
      </div>
      <div
        className={css({
          display: "none",
          [theme.mediaQuery.medium]: {
            display: "block",
            flexBasis: "50%",
            height: "100%",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundImage: `url('collage-405.png')`,
          },
          [theme.mediaQuery.medium + "and (min-height: 405px)"]: {
            backgroundImage: `url('collage-810.png')`,
          },
          [theme.mediaQuery.medium + "and (min-height: 810px)"]: {
            backgroundImage: `url('collage-1620.png')`,
          },
          [theme.mediaQuery.medium + "and (min-height: 1620px)"]: {
            backgroundImage: `url('collage-3240.png')`,
          },
        })}
      ></div>
    </div>
  );
}
