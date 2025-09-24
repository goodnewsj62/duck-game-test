import { createContext, useState, type PropsWithChildren } from "react";

type AppStoreProviderProps = PropsWithChildren;

const initialState = {
  username: "",
  timezone: "",
  role: "SURVIVOR",
};

export type storeType = typeof initialState & {
  setState: React.Dispatch<React.SetStateAction<storeType | undefined>>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const StoreProvider = createContext<storeType>({
  ...initialState,
  setState: () => {},
});

const AppStoreProvider: React.FC<AppStoreProviderProps> = ({ children }) => {
  const [store, setStore] = useState<Omit<storeType, "setState">>(initialState);
  return (
    <StoreProvider value={{ ...store, setState: setStore as any }}>
      {children}
    </StoreProvider>
  );
};

export default AppStoreProvider;
