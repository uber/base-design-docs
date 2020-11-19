import Image from "next/image";
import { useStyletron } from "baseui";

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
        ...theme.borders.border300,
        borderWidth: "2px",
        background: theme.colors.white,
        display: "flex",
        height: `calc(100vh - 172px)`,
        [theme.mediaQuery.medium]: {
          height: `calc(100vh - 108px)`,
        },
      })}
    >
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: theme.sizing.scale1200,
        })}
      >
        <h1
          className={css({
            ...theme.typography.DisplayLarge,
            lineHeight: 1,
            margin: 0,
          })}
        >
          Base
        </h1>
        <h1
          className={css({
            ...theme.typography.DisplayXSmall,
            color: theme.colors.contentTertiary,
            lineHeight: 1,
            margin: 0,
            marginBottom: theme.sizing.scale800,
          })}
        >
          Documentation
        </h1>
        <p
          className={css({
            ...theme.typography.ParagraphLarge,
            color: theme.colors.contentTertiary,
            lineHeight: 1.4,
            margin: 0,
          })}
        >
          Component specific guidelines for the Base design system.
        </p>
      </div>
      <div
        className={css({
          position: "relative",
          flexBasis: "66.66%",
          flexGrow: "1",
          display: "none",
          [theme.mediaQuery.medium]: {
            display: "block",
          },
        })}
      >
        <Image
          src="/collage.png"
          layout="fill"
          objectFit="cover"
          objectPosition="left"
        />
      </div>
    </div>
  );
}
