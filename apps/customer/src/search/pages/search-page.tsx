import { Input, Separator, Typography, useTheme } from "@repo/ui";
import Menu from "@src/menu/components/menu";
import useMenu from "@src/menu/hooks/use-menu";
import { Loader2, Search } from "lucide-react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounceValue, useLocalStorage } from "usehooks-ts";

const SearchPage = () => {
  const { theme } = useTheme();
  const [sp, ssp] = useSearchParams();
  const sq = sp.get("q") ?? undefined;
  const [q, setQ] = useDebounceValue("", 1000);
  const [recentSearches, setRecentSearches] = useLocalStorage("recentSearches", []);
  const { menuItems: { result = [] } = {}, isLoadingMenuItems } = useMenu({ variables: { filters: { q } } });

  useEffect(() => {
    if (sq) setQ(sq);
  }, [sq]);

  useEffect(() => {
    if (result?.length && q) setRecentSearches((prev) => [...new Set([q, ...prev])].slice(0, 5) as any);
  }, [result, q]);

  return (
    <div className="pt-8 px-4 space-y-4">
      <Input
        value={sq}
        type="search"
        onChange={(e) => {
          setQ(e.target.value);
          ssp({ q: e.target.value });
        }}
        placeholder="Search"
        startIcon={Search}
        className="bg-gray-200 dark:bg-[#1f222a]  placeholder:text-gray-500 rounded-full"
      />
      {isLoadingMenuItems ? (
        <Loader2 className="animate-spin w-8 h-8 mx-auto text-emerald-500" />
      ) : q?.length && !result.length ? (
        <div className="flex flex-col gap-4">
          <img className="w-60 mx-auto h-auto" src={theme === "dark" ? "/not-found-food-dark.svg" : "/not-found-food.svg"} />
          <div className="space-y-2">
            <Typography className="text-center" variant="h4">
              Not Found
            </Typography>
            <Typography className="text-center" variant="muted">
              Sorry, no result found for "{q}"
            </Typography>
          </div>
        </div>
      ) : result.length && q?.length ? (
        <Menu sectionTitle={`Results for "${q}"`} isLoading={isLoadingMenuItems} menuItems={result} />
      ) : (
        <>
          {recentSearches?.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <Typography>Recent Searches</Typography>
                <span onClick={() => setRecentSearches([])} className="text-sm underline text-emerald-500">
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
                    className="px-2 py-1 rounded-full min-w-16 bg-transparent border border-emerald-500 text-sm text-emerald-500"
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
                  className="px-2 py-1 rounded-full min-w-16 bg-transparent border border-emerald-500 text-sm text-emerald-500"
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
