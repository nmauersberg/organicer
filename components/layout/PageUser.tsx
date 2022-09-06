import Icon from '@mdi/react';
import { mdiAccountHeart } from '@mdi/js';
import { DropDown } from './DropDown';
import { css, styled } from 'twin.macro';

type PageUserProps = {
  showSettings: () => void;
};

export const PageUser = ({ showSettings }: PageUserProps) => {
  return (
    <DropDown label={<Icon size={1.25} path={mdiAccountHeart} />}>
      <Link onClick={() => showSettings()}>Einstellungen</Link>
    </DropDown>
  );
};

const Link = styled.span(() => [
  css`
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  `,
]);
