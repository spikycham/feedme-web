import { useEffect, useRef, useState } from "react";
import "./index.css";

interface Props {
    srcs: string[];
}

export default function Carousel(props: Props) {
    const [selected, setSelected] = useState(0);

    const timerRef = useRef<number>(null);
    const setNext = () => {
        if (timerRef.current) clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {
            setSelected((prev) => {
                if (prev === props.srcs.length - 1) {
                    return 0;
                }
                return prev + 1;
            });
        }, 3000);
    };

    useEffect(() => {
        setNext();
        return () => {
            if (!timerRef.current) return;
            clearInterval(timerRef.current);
        };
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
                        onClick={() => {
                            setNext();
                            setSelected(i);
                        }}
                    ></button>
                ))}
            </div>
        </div>
    );
}
