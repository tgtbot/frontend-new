import { createContext, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

export const TgtContext = createContext<{
  goPage: (page: any) => void;
}>({
  goPage: () => {},
});

export const TgtProvider = ({ children }: { children: any }) => {
  const router = useRouter();
  const goPage = (page: any) => {
    router.push(page);
  };
  return (
    <TgtContext.Provider
      value={{
        goPage,
      }}
    >
      {children}
    </TgtContext.Provider>
  );
};
