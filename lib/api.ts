/**
 * Returns a list of Figma Pages and the Figma file name. The pages include
 * their immediate children, which are top-level Figma Frames. By convention,
 * Frames and Pages are filtered to only include ones that are visible and
 * start with a capital letter.
 */
async function getPages() {
  let figmaFile = null;
  let request;
  try {
    // Figma file structure: File > Pages > Frames.

    // By convention we turn the top level Figma Frames for each Figma Page
    // into web pages. The Figma Pages become headers for grouping the pages
    // in our navigation.

    // Fetch Figma file 2 levels deep. We only need Figma Pages & the
    // top level Figma Frames within them.
    request = await fetch(
      `https://api.figma.com/v1/files/${process.env.FIGMA_FILE_ID}?depth=2`,
      {
        headers: {
          "X-FIGMA-TOKEN": process.env.FIGMA_AUTH_TOKEN,
        },
      }
    );
    figmaFile = await request.json();
    console.log("REQUEST FILE");
    console.log(figmaFile);
  } catch (er) {
    console.log("There was an error fetching the Figma file.");
    console.log(er);
    console.log(await request.text());
  }

  // Exit if we don't have a Figma file.
  if (figmaFile === null) return [];

  // ERROR - somewhere below children is undefined

  let figmaPages;
  try {
    // Now we want to process the Figma file into a list of pages.
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
    console.log("Something went wrong while processing the figma file!");
    console.log(er);
    console.log(figmaFile);
  }

  return [figmaPages, figmaFile.name];
}

/**
 * Get a PDF of a Figma node id.
 * @param {string} nodeId The id of the Figma node to grab a PDF of.
 * @returns {Promise<string>} URL of the generated PDF
 */
async function getImage(nodeId) {
  const _id = nodeId.replace("-", ":");

  let image = null;
  try {
    const res = await fetch(
      `https://api.figma.com/v1/images/${process.env.FIGMA_FILE_ID}?ids=${_id}&format=pdf`,
      {
        headers: {
          "X-FIGMA-TOKEN": process.env.FIGMA_AUTH_TOKEN,
        },
      }
    );
    const json = await res.json();
    console.log("REQUEST IMAGE");
    console.log(json);
    image = json.images[_id] || null; // ERROR - images is undefined
  } catch (er) {
    console.log(`there was a problem fetching the image for [${nodeId}]`);
    console.log(er);
  }

  return image;
}

export { getPages, getImage };
