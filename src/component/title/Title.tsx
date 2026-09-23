import { useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";
import "./index.css";

interface Props {
    title: string;
    hasBack?: boolean;
}
export default function Title(props: Props) {
    const navigate = useNavigate();

    return (
        <div
            className="title"
            onClick={() => {
                if (!props.hasBack) return;
                navigate(-1);
            }}
        >
            {props.hasBack && <ChevronLeft size={24} />}
            <h3>{props.title}</h3>
        </div>
    );
}
