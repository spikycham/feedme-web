import Button from "../button/Button";
import "./index.css";

interface Props {
    show: boolean;
    onShow: (show: boolean) => void;
    title: string;
    description: string;
    loading: boolean;
    onConfirm?: () => void;
    onCancel?: () => void;
    children?: React.ReactNode;
}

export default function Modal(props: Props) {
    const onHide = () => props.onShow(false);

    return (
        <div className={"modal" + (props.show ? " show" : "")}>
            <div className="content">
                <h1>{props.title}</h1>
                <p>
                    <span>{props.description}</span>
                </p>
                <p>{props.children}</p>
                <div className="operation">
                    <Button type="cancel" title="Cancel" onClick={onHide} />
                    <Button title="Confirm" loading={props.loading} onClick={props.onConfirm} />
                </div>
            </div>
            <div className="background" onClick={onHide}></div>
        </div>
    );
}
