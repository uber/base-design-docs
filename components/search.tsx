import { useRef, useMemo } from "react";
import { useRouter } from "next/router";
import { ThemeProvider, LightThemeMove } from "baseui";
import { StatefulMenu } from "baseui/menu";
import { Select, TYPE, SIZE } from "baseui/select";
import { SearchIcon } from "./icons";
import * as gtag from "../lib/gtag";

interface Props {
  pages: any[];
  nodeId: string;
}

function Search({ pages = [], nodeId }: Props) {
  const router = useRouter();
  const controlRef = useRef<HTMLInputElement>();

  // Create list of options
  const [options, activeIndex] = useMemo(() => {
    const options = { __ungrouped: [] };
    let count = 0;
    let activeIndex = 0;

    for (const page of pages) {
      options[page.name] = [];
      for (const frame of page.children) {
        if (frame.id === nodeId) activeIndex = count;
        count += 1;
        options[page.name].push({
          id: frame.id,
          name: frame.name,
          self: `${page.name} ${frame.name}`,
          href: `/${frame.id}`,
        });
      }
    }

    return [options, activeIndex];
  }, [nodeId]);

  return (
    <Select
      searchable
      openOnClick
      valueKey="id"
      labelKey="self"
      clearable={false}
      options={options}
      type={TYPE.search}
      size={SIZE.compact}
      controlRef={controlRef}
      placeholder="Components"
      maxDropdownHeight="300px"
      getOptionLabel={({ option }) => option.name}
      onChange={({ value }) => {
        if (value[0]) {
          gtag.event({
            action: "click_link_search",
            category: "navigation",
            label: value[0].id as string,
          });
          router.push("/[nodeId]", value[0].href);
          controlRef.current && controlRef.current.blur();
        }
      }}
      overrides={{
        Input: {
          props: { "aria-label": "Search through components and pages." },
        },
        Placeholder: {
          style: ({ $theme }) => ({
            // Default fails Lighthouse contrast ratio
            color: $theme.colors.backgroundInverseSecondary,
          }),
        },
        SearchIcon: {
          component: function SearchIconOverride() {
            return <SearchIcon />;
          },
        },
        StatefulMenu: {
          component: function StatefulMenuOverride(props) {
            return (
              <ThemeProvider theme={LightThemeMove}>
                <StatefulMenu
                  {...props}
                  initialState={{
                    highlightedIndex: activeIndex,
                    isFocused: true,
                    activedescendantId: nodeId,
                  }}
                />
              </ThemeProvider>
            );
          },
        },
      }}
    />
  );
}

export default Search;
