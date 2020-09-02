import { useState, useRef, useMemo, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import tinykeys from "tinykeys";
import { ThemeProvider, LightThemeMove } from "baseui";
import { StatefulMenu } from "baseui/menu";
import { Select, TYPE, SIZE } from "baseui/select";
import { SearchIcon } from "./icons";
import { PageContext } from "./layout";
import * as gtag from "../lib/gtag";

function Search() {
  const router = useRouter();
  const controlRef = useRef<HTMLInputElement>();
  const { pages = [], activeFrame = { key: null } } = useContext(PageContext);

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      "/": (event) => {
        if (event.target !== controlRef.current) {
          event.preventDefault();
          controlRef.current.focus();
        }
      },
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Create list of options
  const [options, activeIndex] = useMemo(() => {
    const options = { __ungrouped: [] };
    let count = 0;
    let activeIndex = 0;

    for (const page of pages) {
      options[page.name] = [];
      for (const frame of page.children) {
        if (frame.key === activeFrame.key) activeIndex = count;
        count += 1;
        options[page.name].push({
          id: frame.key, // IDs may not be unique, so use `key` for this.
          name: frame.name,
          self: `${page.name} ${frame.name}`,
          href: `/${frame.key}`,
        });
      }
    }

    return [options, activeIndex];
  }, [activeFrame.key]);

  const [placeholder, setPlaceholder] = useState("Search components...");

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
      placeholder={activeFrame.key ? placeholder : "Search components..."}
      maxDropdownHeight="300px"
      getOptionLabel={({ option }) => option.name}
      onFocus={(event) => {
        // Opens the dropdown
        event.target.click();
      }}
      onChange={({ value }) => {
        if (value[0]) {
          gtag.event({
            action: "click_link_search",
            category: "navigation",
            label: value[0].href as string,
          });
          router.push("/[frameKey]", value[0].href);
          controlRef.current && controlRef.current.blur();
          setPlaceholder(value[0].self);
        }
      }}
      overrides={{
        Input: {
          props: {
            id: "search",
            "aria-label": "Search through components and pages.",
          },
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
                    activedescendantId: activeFrame.key,
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
