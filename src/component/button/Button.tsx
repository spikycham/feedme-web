import { Loader } from "lucide-react";
import "./index.css";

interface Props {
    type?: "primary" | "cancel";
    htmlType?: "submit" | "reset" | "button";
    title: string;
    loading?: boolean;
    onClick?: () => void;
}

export default function Button(props: Props) {
    const type = props.type ?? "primary";

    return (
        <button
            className={"button" + (props.loading ? " loading" : "") + (" " + type)}
            type={props.htmlType}
            disabled={props.loading}
            onClick={props.onClick}
        >
            {props.loading && <Loader className="loader" />}
            <span>{props.title}</span>
        </button>
    );
}
