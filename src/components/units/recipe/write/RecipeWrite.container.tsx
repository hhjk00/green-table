import RecipeWriteUI from "./RecipeWrite.presenter";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRef, useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_RECIPE } from "./RecipeWrite.queries";
import { useModal } from "../../../commons/hooks/useModal";

const nonSchema = yup.object({});

export default function RecipeWrite() {
  const router = useRouter();
  const [createRecipe] = useMutation(CREATE_RECIPE);
  const { Success, ModalError } = useModal();
  // 탭 Ref
  const ingredientTabRef = useRef<HTMLDivElement>(null);
  const cookOrderTabRef = useRef<HTMLDivElement>(null);
  const [tabActive, setTabActive] = useState(["isActive", ""]);
  // 태그
  const [hashArr, setHashArr] = useState([]);
  // 재료Array
  const [ingredientArr, setIngredientArr] = useState([]);
  // desc Array
  const [descArr, setDescArr] = useState([]);
  // 재료
  const [ingredient, setIngredient] = useState({
    name: "",
    amount: "",
    unit: "",
  });
  // description
  const [desc, setDesc] = useState({
    step: 0,
    image: "",
    desc: "",
  });
  const [selectType, setSelectType] = useState({ types: "Vegan" });
  // 대표 이미지업로드
  const [imageUrls, setImageUrls] = useState(["", "", "", ""]);
  // 요리순서 이미지 업로드
  const [descImage, setDescImage] = useState("");
  // useForm
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(nonSchema),
    mode: "onChange",
  });

  // 재료 input 입력
  const onChangeIngredient = (event) => {
    setIngredient((prev) => ({
      ...ingredient,
      [event.target.name]: event.target.value,
    }));
  };

  // step 입력(description)
  const onChangeTextArea = (event) => {
    setDesc((prev) => ({
      ...desc,
      image: descImage,
      desc: event.target.value,
    }));
  };

  // step 추가
  const onClickAddDesc = () => {
    const newDesc = desc.desc.replaceAll(/\n/gi, "<br />");
    if (!desc.desc) return;
    setDescArr((prev) => [
      ...descArr,
      {
        step: descArr.length + 1,
        image: desc.image,
        desc: newDesc,
      },
    ]);
    setDescImage("");
  };

  // step 삭제
  const onClickDeleteDesc = (arg) => () => {
    setDescArr(descArr.filter((el) => el.step !== arg));
  };

  // 재료추가
  const onClickAddIngredient = () => {
    if (!ingredient.name || !ingredient.amount || !ingredient.unit) return;
    setIngredientArr((prev) => [...ingredientArr, ingredient]);
  };

  // 재료 삭제
  const onClickDeleteIngredient = (arg) => () => {
    setIngredientArr(ingredientArr.filter((el) => el !== arg));
  };

  // 해쉬태그
  const onKeyUpHash = (event) => {
    if (event.keyCode === 32 && event.target.value !== " ") {
      setHashArr([...hashArr, "#" + event.target.value.trim()]);
      event.target.value = "";
    }
  };

  // 해쉬태그 삭제
  const onClickDeleteTag = (tag) => () => {
    setHashArr(hashArr.filter((el) => el !== `${tag}`));
  };

  // 탭 Ref
  const onClickIngredientTab = () => {
    ingredientTabRef.current?.scrollIntoView({ behavior: "smooth" });
    setTabActive(["isActive", ""]);
  };
  const onClickCookOrderTab = () => {
    cookOrderTabRef.current?.scrollIntoView({ behavior: "smooth" });
    setTabActive(["", "isActive"]);
  };

  // 채식유형선택
  const handleChange = (event) => {
    const { name, value } = event.target;
    setSelectType({
      [name]: value,
    });
  };

  // 레시피 등록하기
  const onClickSubmit = async (data) => {
    try {
      const result = await createRecipe({
        variables: {
          createRecipesInput: {
            title: data.title,
            summary: data.summary,
            types: String(selectType.types),
            mainImage: imageUrls,
            url: descArr.map((el) => el.image),
            description: descArr.map((el) => `${el.desc}`),
            cookTime: Number(data.cookTime),
            level: data.level,
            serve: Number(data.serve),
            ingredients: ingredientArr.map(
              (el) => `${el.name} ${el.amount}${el.unit}`
            ),
            recipesTags: hashArr,
          },
        },
      });
      Success("등록 성공", "레시피 등록에 성공하였습니다.");
      console.log(result);
      router.push(`/recipe/${result.data.createRecipe.id}`);
    } catch (error) {
      if (error instanceof Error) ModalError("등록 실패", error.message);
    }
  };

  // 대표 이미지 업로드
  const onChangeFileUrls = (fileUrl: string, index: number) => {
    const newFileUrls = [...imageUrls];
    newFileUrls[index] = fileUrl;
    setImageUrls(newFileUrls);
  };

  // 요리순서 이미지 업로드
  const onChangeDescImage = (fileUrl: string) => {
    setDescImage(fileUrl);
  };

  return (
    <RecipeWriteUI
      formState={formState}
      hashArr={hashArr}
      ingredientArr={ingredientArr}
      descArr={descArr}
      ingredientTabRef={ingredientTabRef}
      cookOrderTabRef={cookOrderTabRef}
      tabActive={tabActive}
      selectType={selectType}
      router={router}
      imageUrls={imageUrls}
      descImage={descImage}
      register={register}
      handleSubmit={handleSubmit}
      onClickSubmit={onClickSubmit}
      onClickDeleteTag={onClickDeleteTag}
      onClickAddIngredient={onClickAddIngredient}
      onChangeIngredient={onChangeIngredient}
      onKeyUpHash={onKeyUpHash}
      onClickDeleteIngredient={onClickDeleteIngredient}
      onChangeTextArea={onChangeTextArea}
      onClickAddDesc={onClickAddDesc}
      onClickIngredientTab={onClickIngredientTab}
      onClickCookOrderTab={onClickCookOrderTab}
      onClickDeleteDesc={onClickDeleteDesc}
      handleChange={handleChange}
      onChangeFileUrls={onChangeFileUrls}
      onChangeDescImage={onChangeDescImage}
    />
  );
}
