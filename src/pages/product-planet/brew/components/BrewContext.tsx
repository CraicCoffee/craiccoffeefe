// BrewContext.js
import React, { createContext, useState, useContext } from 'react';

const BrewContext = createContext({
  currentBrew: null,
  setCurrentBrew: () => {}, // 提供一个空函数作为默认值
});

export const useBrew = () => useContext(BrewContext);

export const BrewProvider = ({ children }) => {
  const [currentBrew, setCurrentBrew] = useState(null);

  return (
    <BrewContext.Provider value={{ currentBrew, setCurrentBrew }}>
      {children}
    </BrewContext.Provider>
  );
};
