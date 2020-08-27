import { useStyletron } from "baseui";
import { Display, ParagraphMedium, DisplayXSmall } from "baseui/typography";
import { MQ } from "../lib/constants";

export async function getStaticProps() {
  const { getPages } = require("../lib/api");
  const pages = await getPages();
  return {
    props: {
      pages,
      activeFrame: {},
      figmaLink: `https://www.figma.com/files/${process.env.FIGMA_FILE_ID}/project/${process.env.FIGMA_PROJECT_ID}/%E2%9D%96-Base-Documentation`,
    },
  };
}

export default function Home() {
  const [css] = useStyletron();
  return (
    <div
      className={css({
        display: "flex",
        alignItems: "flex-end",
        height: "calc(100vh - 124px)",
        [MQ.medium]: {
          height: "calc(100vh - 60px)",
        },
      })}
    >
      <div
        className={css({
          paddingBottom: "10vh",
          paddingLeft: "8vh",
          paddingRight: "8vh",
          flexBasis: "100%",
          [MQ.small]: {
            flexBasis: "75%",
          },
          [MQ.medium]: {
            flexBasis: "50%",
          },
        })}
      >
        <Display>Base</Display>
        <DisplayXSmall color="contentTertiary">Documentation</DisplayXSmall>
        <ParagraphMedium color="contentTertiary">
          Reference this site for both high-level patterns as well as component
          specific guidelines when using the Base design system.
        </ParagraphMedium>
      </div>
      <div
        className={css({
          display: "none",
          [MQ.medium]: {
            display: "block",
            flexBasis: "50%",
            height: "100%",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundImage: `url('collage-405.png')`,
          },
          [MQ.medium + "and (min-height: 405px)"]: {
            backgroundImage: `url('collage-810.png')`,
          },
          [MQ.medium + "and (min-height: 810px)"]: {
            backgroundImage: `url('collage-1620.png')`,
          },
          [MQ.medium + "and (min-height: 1620px)"]: {
            backgroundImage: `url('collage-3240.png')`,
          },
        })}
      ></div>
    </div>
  );
}
