import { useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";
import "./index.css";

export default function Back() {
    const navigate = useNavigate();
    return (
        <button className="back" onClick={() => navigate(-1)}>
            <ChevronLeft />
        </button>
    );
}
