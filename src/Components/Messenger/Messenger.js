import { useHistory, useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import "./messenger.css";
import Conversation from "../../Components/Conversations/Conversation";
import Message from "../../Components/Message/Message";
// import ChatOnline from "../../components/chatOnline/ChatOnline";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { API } from "../../apiCalls/api";
import { useSelector } from "react-redux";
import Pic from "../ProfileCard/profile.png";
import { getCandidateById } from "../../apiCalls/Candidate";
import { getRecruiterById } from "../../apiCalls/Recruiter";

export default function Messenger(props) {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [frndDp, setFrndDp] = useState(Pic);
  const [frndName, setFrndName] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const socket = useRef();
  const scrollRef = useRef();
  const location = useLocation();
  const canDetails = useSelector((state) => state.candidate.candidate);

  let history = useHistory();

  const firstUserId = canDetails._id;
  const secondUserId = location?.state?.receiverId || null;

  useEffect(() => {
    socket.current = io("https://recrutio.herokuapp.com");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  // useEffect(() => {
  //     socket.current.emit("addUser", firstUserId);
  //     socket.current.on("getUsers", (users) => {
  //         console.log(users)
  //         setOnlineUsers(
  //             user.followings.filter((f) => users.some((u) => u.firstUserId === f))
  //         );
  //     });
  // }, [user]);

  useEffect(() => {
    console.log(currentChat);

    const setImg = async () => {
      let id = currentChat.members.filter(
        (mem) => mem !== localStorage.getItem("rec-id")
      );
      const res = await axios(`${API}/getCandidateById/` + id);
      setFrndName(res.data.candidate.name);
      if (res.data.candidate.snap && res.data.candidate.snap !== []) {
        let im = `data:${res.data.candidate.snap};base64,${Buffer.from(
          res.data.candidate.snap
        ).toString("base64")}`;
        setFrndDp(im);
      }
    };
    if (currentChat !== null) {
      setImg();
    }
  }, [currentChat]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        if (secondUserId !== null) {
          const res1 = await axios.get(
            `${API}/conversation/find/` + firstUserId + "/" + secondUserId
          );
          if (res1.data == null) {
            const body = { senderId: firstUserId, receiverId: secondUserId };
            const res = await axios.post(`${API}/conversation/`, body);
            // setConversations(res.data);
          }
        }
        const res = await axios.get(`${API}/conversation/` + firstUserId);
        socket.current.emit("addUser", firstUserId);
        socket.current.on("getUsers", (users) => {
          console.log(users);
          // setOnlineUsers(
          //     user.followings.filter((f) => users.some((u) => u.firstUserId === f))
          // );
        });
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [firstUserId]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(`${API}/message/` + currentChat?._id);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: firstUserId,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== firstUserId
    );

    socket.current.emit("sendMessage", {
      senderId: firstUserId,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await axios.post(`${API}/message`, message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  const openProfile = () => {
    let id = currentChat.members.filter(
      (mem) => mem !== localStorage.getItem("rec-id")
    );
    getCandidateById(id)
      .then((res) => {
        if (!res.error) {
          console.log(res);
          history.push({
            pathname: "/viewProfile",
            state: { user: "Candidate", data: res.candidate },
          });
        }
        if (res.status === 404) {
          getRecruiterById(id)
            .then((res) => {
              if (!res.error) {
                console.log(res);
                history.push({
                  pathname: "/viewProfile",
                  state: { user: "Candidate", data: res.candidate },
                });
              }
            })
            .catch((e) => console.log(e));
        }
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <Navbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input placeholder="Search for friends" className="chatMenuInput" />
            {conversations !== null &&
              conversations.map((c, index) => (
                <div key={index} onClick={() => setCurrentChat(c)}>
                  <Conversation conversation={c} currentUser={canDetails} />
                </div>
              ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  <div className="chatName" onClick={openProfile}>
                    <img src={frndDp} alt="..." className="chatNameImg" />
                    {frndName}
                  </div>
                  {messages.map((m, index) => (
                    <div ref={scrollRef}>
                      <Message
                        message={m}
                        own={m.sender === firstUserId}
                        secondDp={frndDp}
                        key={index}
                      />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
