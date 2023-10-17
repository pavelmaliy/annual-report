import * as React from 'react';
import {AppContextProvider} from "./context/AppContext";
import Bootstrap from "./components/Bootstrap";
// import CurrencyUpload from "./components/uploader/CurrencyUploader";

export default function App() {
    return (
        <AppContextProvider>
            <Bootstrap/>
        </AppContextProvider>
    );
}

/*export default function App() {
    return (
        <CurrencyUpload/>
    );
}*/

