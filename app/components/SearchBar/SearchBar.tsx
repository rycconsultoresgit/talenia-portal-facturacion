import { Input } from "@heroui/react";
import { BiSearch } from "react-icons/bi";
import { MdOutlineCancel } from "react-icons/md";
import { memo, useRef, useEffect } from "react";
import { useSearch } from "@/app/hooks/useSearch";

interface SearchBarProps {
  onSearch: (term: string) => void | Promise<void>;
  onClearSearch: () => void;
  isDisabled?: boolean;
}

const SearchBar = memo(function SearchBar({
  onSearch,
  onClearSearch,
  isDisabled = false,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    searchInput: value,
    setSearchInput: setValue,
    debouncedSearchTerm,
    clearSearch,
  } = useSearch("", 300);

  // Track the last search term to avoid unnecessary calls
  const lastSearchTermRef = useRef("");

  // Store the current search term in a ref to avoid including it in the dependency array
  const searchCallbacksRef = useRef({
    onSearch,
    onClearSearch,
  });

  // Update the ref when callbacks change
  useEffect(() => {
    searchCallbacksRef.current = { onSearch, onClearSearch };
  }, [onSearch, onClearSearch]);

  useEffect(() => {
    const currentTerm = debouncedSearchTerm.trim();
    const { onSearch, onClearSearch } = searchCallbacksRef.current;

    if (currentTerm === "") {
      lastSearchTermRef.current = "";
      onClearSearch();
    } else if (currentTerm !== lastSearchTermRef.current) {
      lastSearchTermRef.current = currentTerm;
      onSearch(currentTerm);
    }
  }, [debouncedSearchTerm]);

  const handleClear = () => {
    if (isDisabled) return;
    clearSearch();
    onClearSearch();
    inputRef.current?.focus();
  };

  return (
    <div className="w-full">
      <Input
        ref={inputRef}
        startContent={
          <BiSearch className="size-4 flex-shrink-0 text-[#CACCFD]" />
        }
        endContent={
          value ? (
            <div
              className="hover:cursor-pointer"
              onMouseDown={(e) => {
                e.preventDefault();
                handleClear();
              }}
            >
              <MdOutlineCancel className="text-[#CACCFD]" />
            </div>
          ) : null
        }
        isDisabled={isDisabled}
        variant="bordered"
        autoComplete="off"
        placeholder={"Buscar"}
        value={value}
        onValueChange={setValue}
        classNames={{
          inputWrapper: `border-0 p-0`,
          input: "text-drawerLightGray placeholder:text-drawerLightGray",
          innerWrapper: "items-center bg-white px-4 py-3 rounded-md px-2",
        }}
      />
    </div>
  );
});

export default SearchBar;
