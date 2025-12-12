import { createContext, useContext, useEffect, useState } from "react";

const HeaderContext = createContext();

export const HeaderProvider = ({ children }) => {
  const [cartCount, setCount] = useState(() => {
    return Number(localStorage.getItem("cart") || 0);
  });
  const [unreadCount, setUnreadCount] = useState(() => {
    return Number(localStorage.getItem("unreadCount") || 0);
  });

  const [ wishlistCount ,setList] = useState(0)

  // Whenever cartCount changes → save it
  useEffect(() => {
    localStorage.setItem("cart", cartCount);
  }, [cartCount]);

  return (
    <HeaderContext.Provider value={{ cartCount,unreadCount,setCount,setUnreadCount,setList ,wishlistCount}}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => useContext(HeaderContext);
