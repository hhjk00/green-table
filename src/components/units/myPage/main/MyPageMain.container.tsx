import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { MouseEvent, useEffect, useState } from "react";
import { FETCH_MY_RECIPE } from "../myRecipe/MyRecipe.queries";
import { FETCH_MY_SCRAP_HISTORY } from "../wish/MyWish.queries";
import MyPageMainUI from "./MyPageMain.presenter";
import { FETCH_USER } from "./MyPageMain.queries";

export default function MyPageMain() {
  const router = useRouter();
  const [recentItems, setRecentItems] = useState([]);

  const { data: userData } = useQuery(FETCH_USER);
  const { data: userRecipe } = useQuery(FETCH_MY_RECIPE, {
    variables: { user_id: String(userData?.fetchUser.user_id) },
  });
  const { data: userScrap } = useQuery(FETCH_MY_SCRAP_HISTORY, {
    variables: { user_id: String(userData?.fetchUser.user_id) },
  });

  useEffect(() => {
    const recent = JSON.parse(sessionStorage.getItem("recent") || "[]");
    setRecentItems(recent);
  }, []);

  const onClickMoveToDetail = (event: MouseEvent<HTMLLIElement>) => {
    router.push(`/recipe/${event.currentTarget.id}`);
  };

  return (
    <MyPageMainUI
      userData={userData}
      userRecipe={userRecipe}
      recentItems={recentItems}
      userScrap={userScrap}
      onClickMoveToDetail={onClickMoveToDetail}
    />
  );
}
