import { useStyletron } from "baseui";
import { Display, ParagraphMedium, DisplayXSmall } from "baseui/typography";
import { MQ } from "../lib/constants";

export async function getStaticProps() {
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

export default function Home() {
  const [css, theme] = useStyletron();
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
          flexBasis: "75%",
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
          },
        })}
      >
        <img
          alt="A collage of Base UI components."
          className={css({
            display: "block",
            height: "calc(100vh - 124px)",
            width: "100%",
            objectFit: "cover",
            objectPosition: "left",
            [MQ.medium]: {
              height: "calc(100vh - 60px)",
            },
          })}
          src="/base-collage.png"
        />
      </div>
    </div>
  );
}
