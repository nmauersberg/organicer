import { ReactElement } from 'react';
import { css, styled } from 'twin.macro';
import Icon from '@mdi/react';
import { mdiChevronRight } from '@mdi/js';

type SlideButtonRoundProps = {
  children: ReactElement | ReactElement[] | string;
  onClick: () => void;
  disabled?: boolean;
};

export const SlideButtonRound = (props: SlideButtonRoundProps) => {
  return (
    <SlideButtonRound_ {...props}>
      <div>{props.children}</div>
      <i>
        <Icon
          className={'icon'}
          path={mdiChevronRight}
          size={1}
          color="black"
        />
      </i>
    </SlideButtonRound_>
  );
};

const SlideButtonRound_ = styled.button(() => [
  css`
    font-size: 25px;
    font-weight: 200;
    letter-spacing: 1px;
    padding: 0.25rem;
    outline: 0;
    border: 1px dashed black;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    background-color: rgb(83, 162, 190, 0.75);
    margin: 0.5rem 0 1rem;
    width: 3rem;
    height: 3rem;

    i {
      opacity: 0;
      font-size: 13px;
      transition: 0.2s;
      position: absolute;
      right: 0px;
      top: 11px;
      transition: transform 1;
    }

    &:hover {
      border: 1px solid black;
    }

    div {
      transition: transform 0.8s;
    }

    &:hover div {
      transform: translateX(-6px);
    }

    &:hover i {
      opacity: 1;
      transform: translateX(-6px);
    }
  `,
]);
