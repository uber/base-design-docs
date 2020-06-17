import Link from "next/link";

import { useStyletron } from "baseui";
import { Grid, Cell } from "baseui/layout-grid";
import { Display, ParagraphMedium, DisplayXSmall } from "baseui/typography";

import Layout from "../components/layout";

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

interface HomeProps {
  pages: any[];
  fileId: string;
  fileName: string;
}

function Home({ pages, fileId, fileName }: HomeProps) {
  const [css, theme] = useStyletron();
  return (
    <Layout pages={pages} fileId={fileId} fileName={fileName}>
      <Grid>
        <Cell span={[4, 3, 4]}>
          <div
            className={css({
              height: "calc(100vh - 70px)",
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
              height: "calc(100vh - 70px)",
              maxHeight: "1000px",
              width: "100%",
              filter: "grayscale(100%)",
              objectFit: "cover",
            })}
            src="/freeway.jpg"
          />
        </Cell>
      </Grid>
      <div
        className={css({
          paddingTop: theme.sizing.scale1600,
          paddingBottom: theme.sizing.scale1600,
        })}
      >
        <Grid>
          {pages.map((page) => {
            return (
              <Cell span={[4, 4, 3]} key={page.id}>
                <ParagraphMedium marginBottom="scale600" marginTop="scale1000">
                  {page.name}
                </ParagraphMedium>
                <div>
                  {page.children.map((frame) => {
                    return (
                      <div
                        key={frame.id}
                        className={css({
                          marginBottom: theme.sizing.scale200,
                        })}
                      >
                        <Link href={`/[nodeId]`} as={`/${frame.id}`} passHref>
                          <a
                            className={css({
                              ...theme.typography.ParagraphMedium,
                              textDecoration: "none",
                              color: theme.colors.contentTertiary,
                              transition: `${theme.animation.timing200} color ${theme.animation.easeInQuinticCurve}`,
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
              </Cell>
            );
          })}
        </Grid>
      </div>
    </Layout>
  );
}

export { Home as default, getStaticProps };
