import { Loader2, Search } from "lucide-react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounceValue, useLocalStorage } from "usehooks-ts";

import Empty from "@src/common/components/empty";
import PageMeta from "@src/common/components/page-meta";
import useInfinte from "@src/common/hooks/use-infinite";
import { PAGES } from "@src/common/utils/pages";
import Menu from "@src/menu/components/menu";
import { menuService } from "@src/menu/services/menu";
import { K_RECENT_SEARCHES } from "@src/search/utils/constants";
import { Input, Separator, Typography } from "@ui/components";

const SearchPage = () => {
  const [sp, ssp] = useSearchParams();
  const sq = sp.get("q") ?? "";
  const [q, setQ] = useDebounceValue("", 1000);
  const [recentSearches, setRecentSearches] = useLocalStorage(K_RECENT_SEARCHES, []);
  const {
    status,
    ref: refMenu,
    hasNextPage: hasNextMenuPage,
    data: menuItems,
    isLoading: isLoadingMenuItemsFirstTime,
    isFetchingNextPage: isFetchingNextMenuPage,
  } = useInfinte({ fetcher: menuService.getMenuItems, queryKey: ["menuItems"], filters: { q } });

  useEffect(() => {
    if (sq) setQ(sq);
  }, [sq]);

  useEffect(() => {
    if (status === "success" && q?.length) setRecentSearches((prev) => [...new Set([q, ...prev])].slice(0, 5) as any);
  }, [status, q]);

  return (
    <div className="pt-8 px-4 space-y-4">
      <PageMeta title={q ? `Search for ${q}` : PAGES.SearchPage().title} description={PAGES.SearchPage().description} />
      <Input
        value={sq}
        type="search"
        onChange={(e) => {
          setQ(e.target.value);
          ssp({ q: e.target.value });
        }}
        placeholder="Search"
        startIcon={Search}
        className="bg-input rounded-full"
      />
      {isLoadingMenuItemsFirstTime ? (
        <Loader2 className="animate-spin w-8 h-8 mx-auto text-primary" />
      ) : q?.length && !menuItems.length ? (
        <Empty notFoundDescription={`Sorry, no result found for "${q}"`} />
      ) : menuItems.length && q?.length ? (
        <Menu
          endRef={refMenu}
          menuItems={menuItems}
          isFetchingNextPage={isFetchingNextMenuPage}
          hasNextMenuPage={hasNextMenuPage}
          sectionTitle={`Results for "${q}"`}
          isLoading={isLoadingMenuItemsFirstTime}
        />
      ) : (
        <>
          {recentSearches?.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <Typography>Recent Searches</Typography>
                <span onClick={() => setRecentSearches([])} className="text-sm underline text-primary">
                  Clear
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {recentSearches.map((search, idx) => (
                  <button
                    onClick={() => {
                      setQ(search);
                      ssp({ q: search });
                    }}
                    key={idx}
                    className="px-2 py-1 rounded-full min-w-16 bg-transparent border border-primary text-sm text-primary"
                  >
                    {search}
                  </button>
                ))}
              </div>
              <Separator className="mt-6" />
            </>
          )}
          <div>
            <Typography>Popular Searches</Typography>
            <div className="flex flex-wrap gap-2 mt-2">
              {["Pizza", "Burger", "Pasta", "Salad", "Sandwich", "Soup", "Pita Pocket"].map((search, idx) => (
                <button
                  onClick={() => {
                    setQ(search);
                    ssp({ q: search });
                  }}
                  key={idx}
                  className="px-2 py-1 rounded-full min-w-16 bg-transparent border border-primary text-sm text-primary"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchPage;
