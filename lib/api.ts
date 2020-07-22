import fs from "fs";
import path from "path";
import retry from "async-retry";

const RETRY_LIMIT = 2;
const RETRY_TIMEOUT = 1000 * 60; // 1min
const FILE_DATA_PATH = path.join(process.cwd(), "file-data.json");

/**
 * Returns a list of Figma Pages and the Figma file name. The pages include
 * their immediate children, which are top-level Figma Frames. By convention,
 * Frames and Pages are filtered to only include ones that are visible and
 * start with a capital letter.
 */
async function getPages() {
  console.log("getPages start");
  let figmaFile;
  try {
    const file = fs.readFileSync(FILE_DATA_PATH);
    figmaFile = JSON.parse(file.toString());
    console.log("File data found on disk.");
  } catch (er) {
    // file does not exist yet...
    console.log("File data not found on disk.");
  }
  if (!figmaFile) {
    try {
      console.log("Fetching file data.");
      const response = await fetch(
        `https://api.figma.com/v1/files/${process.env.FIGMA_FILE_ID}?depth=2`,
        {
          headers: {
            "X-FIGMA-TOKEN": process.env.FIGMA_AUTH_TOKEN,
          },
        }
      );
      const contentType = response.headers.get("Content-Type");
      if (contentType === "application/json; charset=utf-8") {
        figmaFile = await response.json();
        console.log("Saving file data to disk.");
        fs.writeFileSync(FILE_DATA_PATH, JSON.stringify(figmaFile));
      } else {
        throw new Error(await response.text());
      }
    } catch (er) {
      console.log("There was a problem fetching the figma file.");
      console.log(er);
    }
  }

  // Bail early if figma file is mal-formed.
  if (!figmaFile || !figmaFile.document) {
    console.log("The figma file we got is mal-formed.");
    console.log(figmaFile);
    console.log("getPages done");
    return [[], "Figma File"];
  }

  // Now we want to process the Figma file into a list of pages.
  let figmaPages = [];
  try {
    // By convention, only use Figma Pages starting with a capital letter.
    figmaPages = figmaFile.document.children.filter((page) =>
      page.name.match(/^[A-Z]/)
    );

    // By convention, we only use *visible* Figma Frames starting with a capital
    // letter.
    for (const page of figmaPages) {
      page.children = page.children.filter(
        (frame) => frame.name.match(/^[A-Z]/) && frame.visible !== false
      );
      for (const frame of page.children) {
        frame.id = frame.id.replace(":", "-");
      }
    }
  } catch (er) {
    console.log("There was a problem processing the figma file.");
    console.log(er);
    console.log(figmaFile);
  }

  console.log("getPages done");
  return [figmaPages, figmaFile.name];
}

/**
 * Get a PDF of a Figma node id.
 * @param {string} nodeId The id of the Figma node to grab a PDF of.
 * @returns {Promise<string>} URL of the generated PDF
 */
async function getImage(nodeId) {
  console.log("getImage start");
  const _id = nodeId.replace("-", ":");
  let image = null;
  try {
    console.log(`Fetching PDF for frame [${nodeId}].`);
    await retry(
      async () => {
        const response = await fetch(
          `https://api.figma.com/v1/images/${process.env.FIGMA_FILE_ID}?ids=${_id}&format=pdf`,
          {
            headers: {
              "X-FIGMA-TOKEN": process.env.FIGMA_AUTH_TOKEN,
            },
          }
        );
        const contentType = response.headers.get("Content-Type");
        if (contentType === "application/json; charset=utf-8") {
          const json = await response.json();
          image = json.images[_id] || null;
          console.log("PDF success!");
        } else {
          throw new Error(await response.text());
        }
      },
      {
        retries: RETRY_LIMIT,
        minTimeout: RETRY_TIMEOUT,
        onRetry: (er) => {
          console.log(
            `There was a problem fetching the PDF for frame [${nodeId}]. Retrying...`
          );
          console.log(er);
        },
      }
    );
  } catch (er) {
    console.log(`There was a problem fetching the PDF for frame [${nodeId}].`);
    console.log(er);
  }

  return image;
}

console.log("getImage done");
export { getPages, getImage };
