import React, { createContext, useState } from 'react';

const AppContext = createContext({});

const AppContextProvider = ({ children }) => {
    const [data, setData] = useState({});

    return (
        <AppContext.Provider value={{ data, setData }}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContext, AppContextProvider };