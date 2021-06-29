import axios from "axios";
import { useEffect, useState } from "react";
import "./conversation.css";
import {API} from "../../apiCalls/api";
import ProfilePic from "../ProfileCard/profile.png";



export default function Conversation({ conversation, currentUser }) {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const friendId = conversation.members.find((m) => m !== currentUser._id);

        console.log(currentUser._id,"  ------   ",friendId)

        const getUser = async () => {
            try {
                const res = await axios(`${API}/getCandidateById/` + friendId);
                console.log("Freind",res.data)
                setUser(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getUser();
    }, [currentUser, conversation]);

    return (

        <div className="conversation">
            <img
                className="conversationImg"
                src= {ProfilePic}

                alt=""
            />
            <span className="conversationName">{user?.candidate.name}</span>
        </div>
    );
}

