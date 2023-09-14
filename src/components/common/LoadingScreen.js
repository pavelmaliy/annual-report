import ReactLoading from "react-loading";
import '../../styles.css'

export default function LoadingScreen() {
    return (
        <div className="loading-container">
            <ReactLoading type="spin" color="#0000FF"/>
        </div>
    );
}