import fs from "fs";
import path from "path";
import retry from "async-retry";
import { Page, Frame } from "./types";

const RETRY_LIMIT = 10;
const RETRY_TIMEOUT = 1000 * 30; // 30s
const PROJECT_DATA_PATH = path.join(process.cwd(), "./data/project.json");
const PAGES_DATA_PATH = path.join(process.cwd(), "./data/pages.json");
const getImageDataPath = (nodeId) =>
  path.join(process.cwd(), `./data/image-[${nodeId}].json`);
function getPageUrl(page, frame) {
  return (
    `${page.name}-${frame.name}`
      .toLowerCase()
      // Convert common expressions
      .replace(/\s\/\s/g, "-")
      .replace(/\s\\\s/g, "-")
      .replace(/\s-\s/g, "-")
      .replace(/\s\+\s/g, "-")
      .replace(/\s&\s/g, "-")
      .replace(/:\s/g, "-")
      .replace(/\s/g, "-")
      // Remove problematic characters
      .replace(/\//g, "")
      .replace(/:/g, "")
      .replace(/\./g, "")
      .replace(/\(/g, "")
      .replace(/\)/g, "")
  );
}

/**
 * Returns a list of Figma Pages. The pages include their immediate children,
 * which are top-level Figma Frames. By convention, Frames and Pages are
 * filtered to include only nodes that are visible and start with a capital letter.
 */
async function getPages(): Promise<Page[]> {
  let figmaProject;
  try {
    const project = fs.readFileSync(PROJECT_DATA_PATH);
    figmaProject = JSON.parse(project.toString());
  } catch (er) {
    try {
      const response = await fetch(
        `https://api.figma.com/v1/projects/${process.env.FIGMA_PROJECT_ID}/files`,
        {
          headers: {
            "X-FIGMA-TOKEN": process.env.FIGMA_AUTH_TOKEN,
          },
        }
      );
      const contentType = response.headers.get("Content-Type");
      if (contentType === "application/json; charset=utf-8") {
        figmaProject = await response.json();
        try {
          fs.writeFileSync(PROJECT_DATA_PATH, JSON.stringify(figmaProject));
        } catch (er) {
          console.log(
            "There was a problem saving the figma project data to disk."
          );
          console.log(er);
        }
      } else {
        throw new Error(await response.text());
      }
    } catch (er) {
      console.log("There was a problem fetching the figma project.");
      console.log(er);
    }
  }

  let figmaPages;
  try {
    const file = fs.readFileSync(PAGES_DATA_PATH);
    figmaPages = JSON.parse(file.toString());
  } catch (er) {
    figmaPages = [];
    for (const figmaProjectFile of figmaProject.files) {
      let figmaFile;
      try {
        const response = await fetch(
          `https://api.figma.com/v1/files/${figmaProjectFile.key}?depth=2`,
          {
            headers: {
              "X-FIGMA-TOKEN": process.env.FIGMA_AUTH_TOKEN,
            },
          }
        );
        const contentType = response.headers.get("Content-Type");
        if (contentType === "application/json; charset=utf-8") {
          figmaFile = await response.json();
        } else {
          throw new Error(await response.text());
        }
      } catch (er) {
        console.log(
          `There was a problem fetching the figma file ${figmaProjectFile.key}.`
        );
        console.log(er);
      }

      // Bail early if figma file is mal-formed.
      if (!figmaFile || !figmaFile.document) {
        console.log("The figma file we got is mal-formed.");
        console.log(figmaFile);
        return [];
      }

      // Now we want to process the Figma file into a list of pages.
      let figmaFilePages = [];
      try {
        // By convention, only use Figma Pages starting with a capital letter.
        figmaFilePages = figmaFile.document.children.filter((page) =>
          page.name.match(/^[A-Z]/)
        );

        // By convention, we only use *visible* Figma Frames starting with a capital
        // letter.
        for (const page of figmaFilePages) {
          page.children = page.children.filter(
            (frame) => frame.name.match(/^[A-Z]/) && frame.visible !== false
          );

          // Add some additional metadata to make things easier later on.
          for (const frame of page.children) {
            frame.id = frame.id;
            frame.fileKey = figmaProjectFile.key;
            frame.fileName = figmaProjectFile.name;
            frame.url = getPageUrl(page, frame);
          }
        }

        figmaPages = [...figmaPages, ...figmaFilePages];
      } catch (er) {
        console.log("There was a problem processing the figma file.");
        console.log(er);
        console.log(figmaFile);
      }
    }

    try {
      fs.writeFileSync(PAGES_DATA_PATH, JSON.stringify(figmaPages));
    } catch (er) {
      console.log(
        `There was a problem saving the figma project files to disk.`
      );
      console.log(er);
    }
  }

  return figmaPages;
}

async function getImage(frame: Frame): Promise<string> {
  // For network requests
  let image = null;
  try {
    if (process.env.CACHE_IMAGES) {
      const project = fs.readFileSync(getImageDataPath(frame.id));
      const images = JSON.parse(project.toString());
      image = images[frame.id];
    } else {
      throw new Error("Do not cache images");
    }
  } catch (er) {
    try {
      console.log(`Fetching PDF for [${frame.id}]...`);
      await retry(
        async () => {
          const response = await fetch(
            `https://api.figma.com/v1/images/${frame.fileKey}?ids=${frame.id}&format=pdf`,
            {
              headers: {
                "X-FIGMA-TOKEN": process.env.FIGMA_AUTH_TOKEN,
              },
            }
          );
          const contentType = response.headers.get("Content-Type");
          if (contentType === "application/json; charset=utf-8") {
            const json = await response.json();
            if (json.images && json.images[frame.id]) {
              image = json.images[frame.id];
              console.log(`Fetch PDF for [${frame.id}] success!`);
              try {
                fs.writeFileSync(
                  getImageDataPath(frame.id),
                  JSON.stringify(json.images)
                );
              } catch (er) {
                console.log(`There was a problem saving the PDF to disk.`);
                console.log(er);
              }
            } else {
              throw new Error(JSON.stringify(json));
            }
          } else {
            throw new Error(await response.text());
          }
        },
        {
          retries: RETRY_LIMIT,
          minTimeout: RETRY_TIMEOUT,
          onRetry: (er) => {
            console.log(
              `There was a problem fetching the PDF for [${frame.id}]. Retrying...`
            );
            console.log(er);
          },
        }
      );
    } catch (er) {
      console.log(
        `There was a problem fetching the PDF for [${frame.id}]. Giving up.`
      );
      console.log(er);
      console.log(image);
    }
  }

  return image;
}

export { getPages, getImage };
