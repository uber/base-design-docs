import Link from "next/link";

import { useStyletron } from "baseui";
import { Grid, Cell } from "baseui/layout-grid";
import { StyledLink } from "baseui/link";

import Layout from "../components/layout.js";
import { DisplaySmall } from "baseui/typography";

async function getStaticProps() {
  const { getPages } = require("../figma/api.js");
  const [pages, fileName] = await getPages();
  return {
    props: {
      pages,
      fileId: process.env.FIGMA_FILE_ID,
      fileName,
    },
  };
}

function Home({ pages }) {
  const [css, theme] = useStyletron();
  return (
    <Layout pages={pages}>
      <Grid gridGaps={24}>
        {pages.map((page) => {
          return (
            <Cell span={[4, 4, 3]} key={page.id}>
              <div className={css({ marginBottom: theme.sizing.scale400 })}>
                <DisplaySmall>{page.name}</DisplaySmall>
              </div>
              <div>
                {page.children.map((frame) => {
                  return (
                    <div
                      key={frame.id}
                      className={css({ marginBottom: theme.sizing.scale200 })}
                    >
                      <Link href={`/[nodeId]`} as={`/${frame.id}`} passHref>
                        <StyledLink $style={{ textDecoration: "none" }}>
                          {frame.name}
                        </StyledLink>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </Cell>
          );
        })}
      </Grid>
    </Layout>
  );
}

export { Home as default, getStaticProps };
