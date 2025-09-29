import React from "react";

export default function PopupNotify({ show, hide, msg, type = "success" }) {
    if (!show) return null;
    return (
        <div className={`popup-notify popup-${type}${hide ? " popup-hide" : ""}`}>
            {msg}
        </div>
    );
}