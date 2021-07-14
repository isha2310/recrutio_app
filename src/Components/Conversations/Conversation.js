import axios from "axios";
import { useEffect, useState } from "react";
import "./conversation.css";
import {API} from "../../apiCalls/api";
import ProfilePic from "../Assets/profile.png";



export default function Conversation({ conversation, currentUser }) {
    const [user, setUser] = useState(null);
    const [dp, setDp] = useState(ProfilePic)
    useEffect(() => {
        const friendId = conversation.members.find((m) => m !== currentUser._id);

        console.log(currentUser._id,"  ------   ",friendId)

        const getUser = async () => {
            try {
                const res = await axios(`${API}/getCandidateById/` + friendId);
                console.log("Freind",res.data)
                if(res.data.candidate.snap && res.data.candidate.snap !== [] ){
                    let im = `data:${res.data.candidate.snap};base64,${Buffer.from(
                        res.data.candidate.snap
                      ).toString("base64")}`;
                      setDp(im)
                } 
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
                src= {dp}

                alt=""
            />
            <span className="conversationName">{user?.candidate.name}</span>
        </div>
    );
}

