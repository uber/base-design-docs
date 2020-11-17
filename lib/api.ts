import fs from "fs";
import https from "https";
import path from "path";
import retry from "async-retry";
import { SiteMap, Page, Section, Canvas, Frame, File, Project } from "./types";

const RETRY_LIMIT = 10;
const RETRY_TIMEOUT = 1000 * 30; // 30s

const PROJECT_DATA_PATH = path.join(process.cwd(), "./data/project.json");
const SITE_MAP_DATA_PATH = path.join(process.cwd(), "./data/siteMap.json");
const getImageDataPath = (id) =>
  path.join(process.cwd(), `./data/image-[${id}].json`);
const getImageFilePath = (key) =>
  path.join(process.cwd(), `./public/${key}.png`);

function getPageKey(canvas: Canvas, frame: Frame) {
  return (
    `${canvas.name}-${frame.name}`
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

/** Returns a list of sections, each of which is parent to a list of pages. */
async function getSiteMap(): Promise<SiteMap> {
  let project: Project;
  try {
    const projectFromDisk = fs.readFileSync(PROJECT_DATA_PATH);
    project = JSON.parse(projectFromDisk.toString());
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
        project = await response.json();
        try {
          fs.writeFileSync(PROJECT_DATA_PATH, JSON.stringify(project));
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

  let siteMap: SiteMap = [];
  try {
    const siteMapFromDisk = fs.readFileSync(SITE_MAP_DATA_PATH);
    siteMap = JSON.parse(siteMapFromDisk.toString());
  } catch (er) {
    for (const { key: fileKey, name: fileName } of project.files) {
      let file: File;
      try {
        const response = await fetch(
          `https://api.figma.com/v1/files/${fileKey}?depth=2`,
          {
            headers: {
              "X-FIGMA-TOKEN": process.env.FIGMA_AUTH_TOKEN,
            },
          }
        );
        const contentType = response.headers.get("Content-Type");
        if (contentType === "application/json; charset=utf-8") {
          file = await response.json();
        } else {
          throw new Error(await response.text());
        }
      } catch (er) {
        console.log(`There was a problem fetching the figma file ${fileKey}.`);
        console.log(er);
      }

      // Bail early if figma file is mal-formed.
      if (!file || !file.document) {
        console.log("The figma file we got is mal-formed.");
        console.log(file);
        return [];
      }

      // Only use figma canvases and visible frames that start with a capital letter.
      // Note, we intentionally leave out most of the data sent over from Figma
      // because static prop data is inlined on the page.
      for (const canvas of file.document.children) {
        if (canvas.name.match(/^[A-Z]/)) {
          const section: Section = {
            id: canvas.id,
            name: canvas.name,
            children: [],
          };
          for (const frame of canvas.children) {
            if (
              frame.name.match(/^[A-Z]/) &&
              frame.visible !== false // `visible` is only present when it is false
            ) {
              const page: Page = {
                id: frame.id,
                name: frame.name,
                // Add some additional metadata to make things easier later on.
                key: getPageKey(canvas, frame),
                fileKey,
                fileName,
              };
              section.children.push(page);
            }
          }
          if (section.children.length > 0) {
            siteMap.push(section);
          }
        }
      }
    }

    try {
      fs.writeFileSync(SITE_MAP_DATA_PATH, JSON.stringify(siteMap));
    } catch (er) {
      console.log(
        `There was a problem saving the figma project files to disk.`
      );
      console.log(er);
    }
  }

  return siteMap;
}

async function getImage(page: Page): Promise<string> {
  const image = `/${page.key}.png`;

  try {
    if (fs.existsSync(getImageFilePath(page.key))) {
      console.log(`Image [${page.key}] found locally...`);
    } else {
      throw new Error("No image file exists yet.");
    }
  } catch (er) {
    console.log(`No image [${page.key}] found locally...`);

    try {
      console.log(`Fetching image for [${page.key}]...`);
      await retry(
        async () => {
          const response = await fetch(
            `https://api.figma.com/v1/images/${page.fileKey}?ids=${page.id}&format=png&scale=2`,
            {
              headers: {
                "X-FIGMA-TOKEN": process.env.FIGMA_AUTH_TOKEN,
              },
            }
          );
          const contentType = response.headers.get("Content-Type");
          if (contentType === "application/json; charset=utf-8") {
            const json = await response.json();
            if (json.images && json.images[page.id]) {
              const imageUrl = json.images[page.id];
              console.log(`Image generation for [${page.key}] was successful!`);
              try {
                console.log(`Saving [${page.key}] image to disk...`);
                await saveImageToDisk(imageUrl, getImageFilePath(page.key));
                console.log("Image fetched successfully.");
              } catch (er) {
                console.log(`There was a problem saving the image to disk.`);
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
              `There was a problem fetching the image for [${page.key}]. Retrying...`
            );
            console.log(er);
          },
        }
      );
    } catch (er) {
      console.log(
        `There was a problem fetching the image for [${page.key}]. Giving up.`
      );
      console.log(er);
      console.log(image);
    }
  }

  return image;
}

function saveImageToDisk(url, localPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(localPath);
    https
      .get(url, (response) => {
        response.pipe(file);
        response.on("end", () => {
          console.log("Image saved to disk!");
          resolve();
        });
      })
      .on("error", (er) => console.log(er));
  });
}

export { getSiteMap, getImage };
