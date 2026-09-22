import React, { useContext, useState } from "react";
import { createContext } from "react";
import { Loading } from "../components/ui/loading";

const loaderContext = createContext();

export function Loader({ children }) {
  const [load, setLoad] = useState(false);

  const showLoader = () => setLoad(true);
  const hideLoader = () => setLoad(false);

  return (
    <loaderContext.Provider value={{ load, showLoader, hideLoader }}>
      {children}
      {load && <Loading />}
    </loaderContext.Provider>
  );
}

export function UseLoader() {
  return useContext(loaderContext);
}
