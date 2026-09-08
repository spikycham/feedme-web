import "./index.css";

interface Props {
    src: string;
}

export default function PreviewImage(props: Props) {
    if (props.src === "") return null;

    return (
        <div className="preview-image">
            <div>
                <img src="src" />
            </div>
            <div className="background"></div>
        </div>
    );
}
