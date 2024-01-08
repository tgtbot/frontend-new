import { createContext, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

export const TgtContext = createContext<{
  goPage: (page: any) => void;
  isMobile: boolean;
}>({
  goPage: () => {},
  isMobile: false,
});

export const TgtProvider = ({ children }: { children: any }) => {
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const goPage = (page: any) => {
    router.push(page);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024); // 假設手機版寬度小於768px
    };

    // 初始化
    handleResize();

    // 監聽視窗大小變化
    window.addEventListener("resize", handleResize);

    // 清理副作用
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <TgtContext.Provider
      value={{
        goPage,
        isMobile,
      }}
    >
      {children}
    </TgtContext.Provider>
  );
};
