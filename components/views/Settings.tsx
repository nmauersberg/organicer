import { FadeIn } from 'anima-react';
import { ListDailyDuty } from '../duty/daily/ListDailyDuty';
import { SlideButton } from '../button/SlideButton';
import { useState } from 'react';
import { ManageDB } from './ManageDB';
import { AddDailyDuty } from '../duty/daily/AddDailyDuty';
import { Title } from '../text';
import { css, styled } from 'twin.macro';

export const Settings = () => {
  const [dbImportExportPage, setDbImportExportPage] = useState(false);

  if (dbImportExportPage) {
    return <ManageDB back={() => setDbImportExportPage(false)} />;
  }

  return (
    <SettingsContainer>
      <SettingsElement>
        <FadeIn orientation="up" duration={0.5} delay={0.15} distance={30}>
          <Title>Datenbankverwaltung:</Title>
          <SlideButton onClick={() => setDbImportExportPage(true)}>
            Datenbank Import/Export
          </SlideButton>
        </FadeIn>
      </SettingsElement>
      <SettingsElement>
        <FadeIn orientation="up" duration={0.5} delay={0.15} distance={30}>
          <Title>Täglche Aufgaben:</Title>
          <ListDailyDuty />
          <AddDailyDuty />
        </FadeIn>
      </SettingsElement>
    </SettingsContainer>
  );
};

const SettingsElement = styled.div(() => [
  css`
    margin-bottom: 3rem;
  `,
]);

const SettingsContainer = styled.div(() => [
  css`
    height: 100%;
    width: 100%;
    max-width: 50rem;
  `,
]);
