import React, { ReactElement, SetStateAction, useState } from 'react';
import { EncryptStorage } from 'encrypt-storage';

type SetEncryptStorage = React.Dispatch<SetStateAction<EncryptStorage | null>>;

export const EncryptStorageContext: React.Context<
  [EncryptStorage | null, SetEncryptStorage]
> = React.createContext([null as any, (_) => {}]);

type EncryptStorageProviderProps = {
  children: ReactElement;
};

export const EncryptStorageProvider = ({
  children,
}: EncryptStorageProviderProps) => {
  const [encryptStorage, setEncryptStorage] = useState<EncryptStorage | null>(
    null
  );

  return (
    <EncryptStorageContext.Provider value={[encryptStorage, setEncryptStorage]}>
      {children}
    </EncryptStorageContext.Provider>
  );
};
