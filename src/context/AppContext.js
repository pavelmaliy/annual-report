import React, { createContext, useState } from 'react';

const AppContext = createContext({});

const AppContextProvider = ({ children }) => {
    const [model, setModel] = useState({"transactions": []});

    return (
        <AppContext.Provider value={{ model: model, setModel: setModel }}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContext, AppContextProvider };