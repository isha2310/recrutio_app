import "./message.css";
import { format } from "timeago.js";
import Pic from "../Assets/profile.png";
import { useEffect, useState } from "react";

export default function Message({ message, own, secondDp }) {
  const [dp, setDp] = useState(Pic);

  useEffect(() => {
    if (own) {
      if (localStorage.getItem("rec-snap")) {
        setDp(localStorage.getItem("rec-snap"));
      } else {
        setDp(Pic);
      }
    } else {
      if (secondDp !== "") {
        setDp(secondDp);
      } else {
        setDp(Pic);
      }
    }
  }, [own, secondDp]);

  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img className="messageImg" src={dp} alt="" />
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
}
