import { useRouter } from "next/router";
import { useState } from "react";
import * as Search from "./styles";

export default function SearchBar01() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");

  const onChangeSearch = (e) => {
    setSearchInput(e.target.value);
  };
  const onKeyupMoveList = (event) => {
    if (event.keyCode === 13 && searchInput !== " ") {
      router.push(`/recipe/?input=${searchInput}`, `/recipe`, {
        shallow: true,
      });
    }
  };

  return (
    <Search.Container>
      <img
        src="/img/searchBar/icon-search.svg"
        alt="검색"
        onClick={onKeyupMoveList}
      />
      <input
        type="text"
        placeholder="원하는 레시피가 있나요?"
        onChange={onChangeSearch}
        onKeyUp={onKeyupMoveList}
      />
    </Search.Container>
  );
}
