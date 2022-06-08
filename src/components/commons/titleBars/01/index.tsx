import styled from "@emotion/styled";

interface IMyPageTitleBarProps {
  title: string;
}

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  border-bottom: 1px solid #c4c4c4;
`;

const Title = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  padding-bottom: 1.5rem;
`;

export default function MyPageTitleBar(props: IMyPageTitleBarProps) {
  return (
    <TitleWrapper>
      <Title>{props.title}</Title>
    </TitleWrapper>
  );
}
