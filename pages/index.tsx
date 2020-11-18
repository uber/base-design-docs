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
    <div>
      <h1
        className={css({
          ...theme.typography.DisplayLarge,
          fontSize: "40px",
          lineHeight: 1.25,
          margin: 0,
        })}
      >
        Base Documentation
      </h1>
      <p
        className={css({
          ...theme.typography.ParagraphLarge,
          color: theme.colors.contentTertiary,
          margin: 0,
          marginBottom: theme.sizing.scale800,
        })}
      >
        Component specific guidelines for the Base design system.
      </p>
      <div
        className={css({
          overflow: "hidden",
          ...theme.borders.border300,
          borderWidth: "2px",
          background: theme.colors.white,
          maxWidth: "1500px",
        })}
      >
        <Image
          src="/collage.png"
          height="3240"
          width="5760"
          layout="responsive"
        />
      </div>
    </div>
  );
}
