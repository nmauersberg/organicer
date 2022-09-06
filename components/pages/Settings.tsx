import dynamic from 'next/dynamic';
const ImportExport = dynamic(() => import('../dbManagement/ImportExport'), {
  ssr: false,
});

export const Settings = () => {
  return <ImportExport />;
};
