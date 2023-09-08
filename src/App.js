import Checkout from "./components/Checkout";
import { useState } from 'react';


const App = () => {
    const [model, setModel] = useState({});
    return (
        <div>
            <Checkout model={model} setModel={setModel}/>
        </div>
    );
};

export default App;