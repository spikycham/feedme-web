import { useEffect, useState } from "react";
import "./index.css";

interface Props {
    srcs: string[];
}

export default function Carousel(props: Props) {
    const [selected, setSelected] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setSelected((prev) => {
                if (prev === props.srcs.length - 1) {
                    return 0;
                }
                return prev + 1;
            });
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="carousel">
            <div className="img-container">
                <img src={props.srcs[selected]} />
            </div>
            <div className="sl-container">
                {Array.from({ length: props.srcs.length }, (_, i) => i).map((i) => (
                    <button
                        className={"selector" + (i === selected ? " active" : "")}
                        key={i}
                        onClick={() => setSelected(i)}
                    ></button>
                ))}
            </div>
        </div>
    );
}
