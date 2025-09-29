import { useState, useCallback } from "react";

export function usePopupNotify() {
    const [show, setShow] = useState(false);
    const [hide, setHide] = useState(false);
    const [msg, setMsg] = useState("");
    const [type, setType] = useState("success"); // "success" | "remove" | etc.

    const showPopup = useCallback((message, popupType = "success") => {
        setMsg(message);
        setType(popupType);
        setShow(true);
        setHide(false);
        setTimeout(() => setHide(true), 1200);
        setTimeout(() => setShow(false), 1600);
    }, []);

    return { show, hide, msg, type, showPopup };
}