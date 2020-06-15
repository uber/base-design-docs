import Head from "next/head";
import Link from "next/link";

import {
  useStyletron,
  ThemeProvider,
  LightThemeMove,
  DarkThemeMove,
} from "baseui";
import { Grid, Cell } from "baseui/layout-grid";
import { Button, KIND, SHAPE, SIZE } from "baseui/button";
import { StatefulPopover, PLACEMENT } from "baseui/popover";
import { StatefulMenu } from "baseui/menu";
import { DisplayXSmall } from "baseui/typography";

function Book({ size = "24px" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Book open (filled)</title>
      <g
        transform="matrix(
          1 0
          0 1
          1 2
        )"
      >
        <path
          fillRule="nonzero"
          clipRule="nonzero"
          d="M9.5 1.59998C7.5 0.499976 5.3 0 3 0L0 0L0 18L3 18C5.3 18 7.5 18.6 9.5 19.6L9.5 1.59998Z"
          fill="currentColor"
          opacity="1"
        />
        <path
          fillRule="nonzero"
          clipRule="nonzero"
          d="M19 0C16.7 0 14.5 0.599976 12.5 1.59998L12.5 19.6C14.5 18.5 16.7 18 19 18L22 18L22 0L19 0Z"
          fill="currentColor"
          opacity="1"
        />
      </g>
    </svg>
  );
}

function Logo({ size = "24px" }) {
  const [css, theme] = useStyletron();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 201"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      alt="Base Logo"
    >
      <path
        d="M89.9745 30.5439C95.445 25.0735 104.314 25.0735 109.785 30.5439L169.215 89.9745C174.686 95.445 174.686 104.314 169.215 109.785L109.785 169.215C104.314 174.686 95.445 174.686 89.9745 169.215L30.544 109.785C25.0735 104.314 25.0735 95.445 30.544 89.9745L89.9745 30.5439Z"
        fill={theme.colors.black}
      />
      <path
        d="M100.374 54.6022C100.374 50.9629 100.374 49.1433 101.092 48.3007C101.715 47.5696 102.65 47.1816 103.606 47.257C104.708 47.344 105.991 48.6307 108.558 51.204L153.416 96.1703C154.603 97.3598 155.196 97.9546 155.418 98.6404C155.614 99.2436 155.614 99.8935 155.418 100.497C155.196 101.183 154.603 101.777 153.416 102.967L108.558 147.933C105.991 150.506 104.708 151.793 103.606 151.88C102.65 151.955 101.715 151.567 101.092 150.836C100.374 149.994 100.374 148.174 100.374 144.535V54.6022Z"
        fill={theme.colors.white}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M118.47 8.46987C108.269 -1.73078 91.7308 -1.73078 81.5301 8.46987L7.65048 82.3495C-2.55016 92.5501 -2.55016 109.089 7.65049 119.289L81.5301 193.169C91.7308 203.37 108.269 203.37 118.47 193.169L192.35 119.289C202.55 109.089 202.55 92.5501 192.35 82.3495L118.47 8.46987ZM109.431 35.2349C104.331 30.1346 96.0613 30.1346 90.961 35.2349L35.5513 90.6446C30.451 95.7449 30.451 104.014 35.5513 109.114L90.961 164.524C96.0613 169.625 104.331 169.625 109.431 164.524L164.841 109.114C169.941 104.014 169.941 95.7449 164.841 90.6446L109.431 35.2349Z"
        fill={theme.colors.white}
      />
    </svg>
  );
}

function Figma({ size = "24px" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <title>Figma (filled)</title>
      <path
        d="M5 4c0 1.66 1.34 3 3 3h3V1H8C6.34 1 5 2.34 5 4z"
        fill="currentColor"
      ></path>
      ,
      <path
        d="M5 12c0 1.66 1.34 3 3 3h3V9H8c-1.66 0-3 1.34-3 3z"
        fill="currentColor"
      ></path>
      ,
      <path
        d="M5 20c0 1.66 1.34 3 3 3s3-1.34 3-3v-3H8c-1.66 0-3 1.34-3 3z"
        fill="currentColor"
      ></path>
      ,
      <path
        d="M19 4c0-1.66-1.34-3-3-3h-3v6h3c1.66 0 3-1.34 3-3z"
        fill="currentColor"
      ></path>
      ,<path d="M16 15a3 3 0 100-6 3 3 0 000 6z" fill="currentColor"></path>
    </svg>
  );
}

function PageDropdown({ pages }) {
  const [css] = useStyletron();
  const ITEMS = pages.reduce((acc, cur) => {
    acc[cur.name] = cur.children.map((frame) => ({
      id: frame.id,
      name: frame.name,
      href: `/${frame.id}`,
    }));
    return acc;
  }, {});
  return (
    <StatefulPopover
      focusLock
      placement={PLACEMENT.bottom}
      content={({ close }) => (
        <ThemeProvider theme={LightThemeMove}>
          <StatefulMenu
            items={ITEMS}
            onItemSelect={() => close()}
            overrides={{
              ListItemAnchor: {
                style: {
                  textDecoration: "none",
                },
              },
              Option: {
                props: {
                  getItemLabel: (item) => item.name,
                },
              },
            }}
          />
        </ThemeProvider>
      )}
    >
      <Button
        kind={KIND.tertiary}
        shape={SHAPE.pill}
        size={SIZE.compact}
        startEnhancer={() => <Book size="16px" />}
        overrides={{
          StartEnhancer: {
            style: {
              marginRight: "0px",
              [`@media (min-width: 500px)`]: {
                marginRight: "12px",
              },
            },
          },
        }}
      >
        <span
          className={css({
            display: "none",
            [`@media (min-width: 500px)`]: { display: "inline" },
          })}
        >
          Guidelines
        </span>
      </Button>
    </StatefulPopover>
  );
}

function Header({ pages, fileId, fileName, nodeId }) {
  const [css, theme] = useStyletron();
  return (
    <header
      className={css({
        zIndex: "1",
        position: "fixed",
        top: "0px",
        width: "100%",
        background: theme.colors.backgroundPrimary,
        borderBottom: `solid 1px ${theme.borders.border400.borderColor}`,
        alignItems: "center",
      })}
    >
      <Grid>
        <Cell span={[1, 3, 6]}>
          <div
            className={css({
              display: "flex",
              alignItems: "center",
              height: "70px",
            })}
          >
            <Link href="/" as="/">
              <a
                className={css({
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  ":focus": {
                    outline: `solid 3px ${theme.colors.borderAccent}`,
                    outlineOffset: "2px",
                  },
                })}
              >
                <Logo size="24px" />
                <DisplayXSmall
                  $style={{
                    marginLeft: theme.sizing.scale400,
                    fontSize: theme.typography.HeadingSmall.fontSize,
                    color: theme.colors.white,
                  }}
                >
                  Design
                </DisplayXSmall>
              </a>
            </Link>
          </div>
        </Cell>
        <Cell span={[3, 5, 6]}>
          <div
            className={css({
              display: "flex",
              alignItems: "center",
              height: "70px",
            })}
          >
            <div
              className={css({
                marginLeft: "auto",
                marginRight: theme.sizing.scale400,
              })}
            >
              <PageDropdown pages={pages} />
            </div>
            <Button
              $as="a"
              href={`https://www.figma.com/file/${fileId}/${fileName}${
                nodeId ? `?node-id=${nodeId.replace("-", ":")}` : ""
              }`}
              target="_blank"
              kind={KIND.tertiary}
              shape={SHAPE.pill}
              startEnhancer={() => <Figma size="16px" />}
              size={SIZE.compact}
              overrides={{
                StartEnhancer: {
                  style: {
                    marginRight: "0px",
                    [`@media (min-width: 500px)`]: {
                      marginRight: "12px",
                    },
                  },
                },
              }}
            >
              <span
                className={css({
                  display: "none",
                  [`@media (min-width: 500px)`]: { display: "inline" },
                })}
              >
                Open in Figma
              </span>
            </Button>
          </div>
        </Cell>
      </Grid>
    </header>
  );
}

function Layout({ children, pages, fileName, fileId, nodeId }) {
  const [css] = useStyletron();
  return (
    <div>
      <Head>
        <title>Base Documentation</title>
        <link rel="icon" href="/base.svg" />
      </Head>
      <ThemeProvider theme={DarkThemeMove}>
        <Header
          pages={pages}
          fileName={fileName}
          fileId={fileId}
          nodeId={nodeId}
        />
      </ThemeProvider>
      <main className={css({ marginTop: "70px" })}>{children}</main>
    </div>
  );
}

export default Layout;
