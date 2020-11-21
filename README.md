## Development

First, clone and install dependencies:

```bash
$ git clone https://github.com/uber/base-design-docs.git
$ cd base-design-docs
$ yarn
```

Then, create a `.env.local` file like so:

```bash
# The base figma file for the org
FIGMA_FILE_KEY=XYZ

# The figma project to build pages from
FIGMA_PROJECT_ID=XYZ

# A figma API auth token with access to the above file
FIGMA_AUTH_TOKEN=XYZ
```

You can find the first two variables by looking at the URL for a project:

```
https://www.figma.com/files/FIGMA_FILE_KEY/project/FIGMA_PROJECT_ID/Some-Cool-Project
```

You can create an auth token on your Figma user settings page. Note, this auth token needs viewing access to the project and each file in it.

Once you have your environment set up, run the development server:

```bash
$ yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Pages auto-update as you edit files.

## How this works

This project is built with Next.js and Vercel.

We use `getStaticPaths` and `getStaticProps` to render a webpage for each top-level Frame in each file in our Figma Project. So, what is a top-level Frame?

First, recall that every Figma File has the following structure:

```
Project > File[] > Page[] > Frame[]
```

Every Project can have multuple Files, which can have multiple Pages, which in turn can have multiple Frames. **Top-level Frames are the direct child Frames of a Page**. We render a webpage for every one of these top-level Frames.

Take the following Figma file structure:

```
- Docs
  - Setup
    - Getting started
    - Living styleguides
  - Color
    - Light tokens
    - Dark tokens
  - Typography
    - Uber Move
    - Uber Move Mono
  - Grid
    - Columns
    - Rows
```

This results in the following webpages being rendered:

```
- Getting started
- Living styleguides
- Light tokens
- Dark tokens
- Uber Move
- Uber Move Mono
- Columns
- Rows
```

In our navigation, these pages will be grouped by their parent Pages. Something like this:

```
Setup
  - Getting started
  - Living styleguides
...
```

We apply this to each file in the Figma project. Note, the file structure itself only impacts the rendered website by influencing the order of pages. We have a step that essentially "joins" each page into one list before processing top-level frames.

There are a couple more conventions to keep in mind:

- We only use Pages that start with a capital letter.
- We only use Frames that start with a captial letter and are visible.

So, given any arbitrary Project, provided at build-time as `FIGMA_PROJECT_ID`, so long as the files in the project follow the above conventions, we can build a website.

### Building the site

At build time, we ask Figma for all of the files in our project (`FIGMA_PROJECT_KEY`). This is saved in `data/project.json`. With that information, we can query each file in the project. We ask for the first two levels of each file's node tree. This will give us the Pages/Top-level Frames for the file. With the pages/frames for each file we can build a site map, which gets saved in `data/siteMap.json`.

This first part of the build is initiated by `getStaticPaths`, which Next.js calls to build a static collection of pages. The second part of the build is calling `getStaticProps` for each of the pages we've returned in `getStaticPaths`.

During the `getStaticProps` call we ask the Figma API for a PNG of the relevant Frame. We receive a link to the generated image from the API, download it to the `public` directory and then embed the image on the page with `next/image`.

### Prior art

We've done [some prototyping](https://v9-80-0.baseweb.design/guidelines) where we render the Frame as HTML & CSS (through React). The main benefit is that the pages are indexable— which is useful for SEO and cross-page search. It would also be interesting if the webpages could be made responsive.

There have been a lot of issues with the HTML & CSS approach though. To start, it isn't clear if you can do responsive pages without an excessive amount of convention in your Figma File. We want our designers to focus on presenting useful documentation, not fussing over the rules for adding it. Furthermore, for a large File, the API can take quite a long time to query all of the JSON necessary to render the Frame accurately.

At a certain point a CMS is probably better suited for delivering structured data that can be rendered nicely across multiple mediums.

So, with all of this considered, for now we use images (pngs).
