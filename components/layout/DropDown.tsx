import { ReactElement, useState } from 'react';
import { css, styled } from 'twin.macro';

type DropDownProps = {
  children: ReactElement | ReactElement[] | string | null;
  label: ReactElement | ReactElement[] | string | null;
};

export const DropDown = ({ children, label }: DropDownProps) => {
  const [visible, setVisible] = useState(false);
  const [overrideVisible, setOverrideVisible] = useState(false);

  return (
    <DropDownContainer
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() =>
        setTimeout(() => {
          setVisible(false);
        }, 500)
      }
    >
      {label}
      <DropDownContent
        onMouseEnter={() => setOverrideVisible(true)}
        onMouseLeave={() =>
          setTimeout(() => {
            setOverrideVisible(false);
          }, 500)
        }
        onClick={() => {
          setOverrideVisible(false);
          setVisible(false);
        }}
        visible={visible || overrideVisible}
      >
        {children}
      </DropDownContent>
    </DropDownContainer>
  );
};

const DropDownContainer = styled.div(() => [
  css`
    position: relative;
    display: inline-block;
  `,
]);

type DropDownContentProps = {
  visible: boolean;
};

const DropDownContent = styled.div<DropDownContentProps>(({ visible }) => {
  return [
    css`
      display: ${visible ? 'block' : 'none'};
      position: absolute;
      background-color: #db5461;
      color: white;
      min-width: 160px;
      padding: 12px 16px;
      padding-top: 0.5rem;
      z-index: 1;
      text-align: right;
      right: 3px;
      white-space: nowrap;
      border-radius: 30px 10px;
    `,
  ];
});
