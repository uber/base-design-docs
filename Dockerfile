FROM uber/web-base-image:12.13.0

WORKDIR /base-design-docs

# Copy manifests and install dependencies.
# Doing this before a build step can more effectively leverage Docker caching.
COPY package.json yarn.lock /base-design-docs/
RUN yarn --ignore-scripts

# Copy the current files to the docker image.
COPY . .
