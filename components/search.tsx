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
  const { siteMap = [], activePage = { key: null } } = useContext(PageContext);

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

    for (const section of siteMap) {
      options[section.name] = [];
      for (const page of section.children) {
        if (page.key === activePage.key) activeIndex = count;
        count += 1;
        options[section.name].push({
          id: page.key, // IDs may not be unique, so use `key` for this.
          name: page.name,
          self: `${section.name} → ${page.name}`,
          href: `/${page.key}`,
        });
      }
    }

    return [options, activeIndex];
  }, [activePage.key]);

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
      placeholder={activePage.key ? placeholder : "Search components..."}
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
          router.push("/[pageKey]", value[0].href);
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
                    activedescendantId: activePage.key,
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
