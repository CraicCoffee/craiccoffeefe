// PageTabsProvider.js
import React, { createContext, useState, useCallback, PropsWithChildren } from 'react';

export const PageTabsContext = createContext({
  tabs: [],
  setTabs: () => {},
});

export const PageTabsProvider = ({ children }: PropsWithChildren<{}>) => {
  const [tabs, setTabs] = useState([]);

  const handleSetTabs = useCallback((newTabs) => {
    console.log('newTabs', newTabs);
    setTabs(newTabs);
  }, []);

  return (
    <PageTabsContext.Provider value={{ tabs, setTabs: handleSetTabs }}>
      {children}
    </PageTabsContext.Provider>
  );
};
