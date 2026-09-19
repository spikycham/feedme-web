import { useState } from "react";
import { useNavigate } from "react-router";
import { useUserStore } from "@/store/user.store";

import "./index.css";

export interface TabType {
    key: number;
    icon: React.ReactNode;
    title: string;
    path: string;
    isShow: (role: UserRole) => boolean;
}

interface Props {
    tabs: TabType[];
    active: number;
    onChange: (k: number) => void;
}

export default function Tab(props: Props) {
    const navigate = useNavigate();

    const onNavigate = (tab: TabType) => {
        localStorage.setItem("previous_path", tab.path);
        localStorage.setItem("previous_tab_key", String(tab.key));
        navigate(tab.path);
    };

    const user = useUserStore((state) => state.user);

    return (
        <div className="tab">
            {props.tabs.map((tab) => {
                if (!tab.isShow(user.role)) return null;
                return (
                    <button
                        key={tab.key}
                        className={props.active === tab.key ? "active" : ""}
                        onClick={() => {
                            props.onChange(tab.key);
                            onNavigate(tab);
                        }}>
                        <span>{tab.icon}</span>
                        {/* <span>{tab.title}</span> */}
                        <div className="highlight"></div>
                    </button>
                );
            })}
        </div>
    );
}
