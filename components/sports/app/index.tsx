import { useLiveQuery } from 'dexie-react-hooks';
import { BounceLoader } from 'react-spinners';
import { css, styled } from 'twin.macro';
import { useDexieDb } from '../../../dexie/db';
import { SmallTitle } from '../../text';
import { theme } from '../../../styles/theme';
import { Center, Session } from './Session';

export const AppSports = () => {
  const [db] = useDexieDb();
  const entries = useLiveQuery(() =>
    db.sports.toArray().then(entries => entries.reverse()),
  );
  const settings = useLiveQuery(() => db.userSettings.get(1));

  if (!settings || !entries) {
    return (
      <Center>
        <BounceLoader color={theme.colors.blue} />
      </Center>
    );
  }

  return (
    <Frame>
      <SmallTitle>Deine Sessions</SmallTitle>
      <br />
      {entries.map(session => (
        <Session key={session.id} session={session} settings={settings} />
      ))}
    </Frame>
  );
};

const Frame = styled.div(() => [
  css`
    margin: 0.5rem 0.25rem 0.5rem 0;
    white-space: pre-wrap;
  `,
]);
