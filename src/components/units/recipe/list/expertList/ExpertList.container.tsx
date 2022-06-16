import { gql, useQuery } from "@apollo/client";
import Slider from "react-slick";
import { IPropsExpertBestList } from "../RecipeList.types";
import * as Expert from "./ExpertList.styles";

const FETCH_RECIPE_EXPERT = gql`
  query fetchRecipeIsPro {
    fetchRecipeIsPro {
      id
      title
      summary
      types
      level
      scrapCount
      replyCount
      recipesMainImage {
        mainUrl
      }
      recipesContentsImage {
        contentsUrl
      }
      recipesScraps {
        scraped
      }
    }
  }
`;

export default function ExpertRecipeList(props: IPropsExpertBestList) {
  const settings = {
    dots: false,
    arrows: true,
    // toShow 갯수보다 적을 때 복사가 되는 거 인피니트 false로 하면 해결~
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          dots: false,
          arrows: false,
          infinite: true,
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 575,
        settings: {
          dots: false,
          arrows: false,
          infinite: true,
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const { data: expertData } = useQuery(FETCH_RECIPE_EXPERT);

  const tempExpertPopular = expertData?.fetchRecipeIsPro;
  const ccc: any = [];
  tempExpertPopular?.map((el: any) => ccc.push(el));
  const tempExpertPopularData = [...ccc];
  const expertPopularData = tempExpertPopularData?.sort(
    (a, b) => b.scrapCount - a.scrapCount
  );

  return (
    <Expert.Container>
      <Expert.Wrapper>
        <Expert.TitleWrapper>
          <Expert.TitleBar />
          <Expert.Title>전문가 레시피</Expert.Title>
          <Expert.SubTitle>
            다양한 전문가들의 특별한 레시피를 확인해보세요
          </Expert.SubTitle>
        </Expert.TitleWrapper>
        <Expert.SliderWrapper>
          <Slider {...settings}>
            {expertPopularData?.map((el: any, i: number) => (
              <Expert.ListWrapper key={i}>
                <Expert.RecipeBox
                  id={el.id}
                  onClick={props?.onClickMoveToDetail(el)}
                >
                  <Expert.RecipeImg
                    src={
                      el.recipesMainImage
                        ? el.recipesMainImage.filter(
                            (e: any) => e.mainUrl !== " "
                          ).length === 0
                          ? "/img/bestRecipe/img-recipe-01.png"
                          : `https://storage.googleapis.com/${el.recipesMainImage[0].mainUrl}`
                        : "/img/bestRecipe/img-recipe-01.png"
                    }
                  />
                  <Expert.IconBookmark>
                    {props.myScraps.includes(el.id) ? (
                      <img src="/img/bestRecipe/icon-bookmark-on.svg" />
                    ) : (
                      <img src="/img/bestRecipe/icon-bookmark-off.svg" />
                    )}
                    <span>{el.scrapCount}</span>
                  </Expert.IconBookmark>
                  <Expert.StickerWrapper>
                    {el.scrapCount >= 1 && (
                      <Expert.RecipeRecommendSticker src="/img/icon/recommend.svg" />
                    )}
                    {el.scrapCount === 0 && (
                      <Expert.RecipeRecommendStickerHidden src="/img/icon/recommend.svg" />
                    )}
                    {el.level === "SIMPLE" && (
                      <Expert.RecipeLevelSticker src="/img/icon/level1.svg" />
                    )}
                    {el.level === "NORMAL" && (
                      <Expert.RecipeLevelSticker src="/img/icon/level2.svg" />
                    )}
                    {el.level === "DIFFICULT" && (
                      <Expert.RecipeLevelSticker src="/img/icon/level3.svg" />
                    )}
                  </Expert.StickerWrapper>
                  <Expert.RecipeTitle>{el.title}</Expert.RecipeTitle>
                  <Expert.RecipeSubtitle>{el.summary}</Expert.RecipeSubtitle>
                  <Expert.RecipeCommentBox>
                    <Expert.RecipeCommentIcon src="/img/icon/comment.svg" />
                    <Expert.RecipeCommentsCount>
                      {el.replyCount}
                    </Expert.RecipeCommentsCount>
                  </Expert.RecipeCommentBox>
                </Expert.RecipeBox>
              </Expert.ListWrapper>
            ))}
          </Slider>
        </Expert.SliderWrapper>
      </Expert.Wrapper>
    </Expert.Container>
  );
}
