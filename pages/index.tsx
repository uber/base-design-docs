import { useStyletron } from "baseui";
import { Grid, Cell } from "baseui/layout-grid";

export async function getStaticProps() {
  const { getSiteMap } = require("../lib/api");
  const siteMap = await getSiteMap();
  return {
    props: {
      siteMap,
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
        background: theme.colors.white,
        display: "flex",
        alignItems: "flex-end",
        height: "calc(100vh - 164px)",
        marginLeft: theme.sizing.scale800,
        marginRight: theme.sizing.scale800,
        boxShadow: theme.lighting.shadow700,
        [theme.mediaQuery.medium]: {
          height: "calc(100vh - 100px)",
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
            <h1
              className={css({
                ...theme.typography.DisplayLarge,
                margin: 0,
              })}
            >
              Base
            </h1>
            <h2
              className={css({
                ...theme.typography.DisplayXSmall,
                margin: 0,
                color: theme.colors.contentTertiary,
              })}
            >
              Documentation
            </h2>
            <p
              className={css({
                ...theme.typography.ParagraphSmall,
                color: theme.colors.contentTertiary,
              })}
            >
              Reference this site for both high-level patterns as well as
              component specific guidelines when using the Base design system.
            </p>
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
