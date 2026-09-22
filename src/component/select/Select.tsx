import "./index.css";

export interface Option<T extends string | number> {
    key: number;
    label: string;
    value: T;
}
interface Props<T extends string | number> {
    value: T;
    options: Option<T>[];
    onChange: (v: T) => void;
}

export default function Select<T extends string | number>(props: Props<T>) {
    return (
        <select value={props.value} onChange={(e) => props.onChange(e.target.value as T)}>
            {props.options.map((opt) => (
                <option key={opt.key} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
}
