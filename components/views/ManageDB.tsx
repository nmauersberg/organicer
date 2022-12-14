import { FadeIn } from 'anima-react';
import dynamic from 'next/dynamic';
const ImportExport = dynamic(() => import('../dbManagement/ImportExport'), {
  ssr: false,
});

export const ManageDB = ({ back }: { back: () => void }) => {
  return (
    <FadeIn orientation="up" duration={0.5} delay={0.15} distance={30}>
      <ImportExport back={back} />
    </FadeIn>
  );
};
