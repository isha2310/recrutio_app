import { useHistory, useLocation } from "react-router-dom";
import MyNavbar from "../Navbar/Navbar";
import "./messenger.css";
import Conversation from "../../Components/Conversations/Conversation";
import Message from "../../Components/Message/Message";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { API } from "../../apiCalls/api";
import { useSelector } from "react-redux";
import Pic from "../Assets/profile.png";
import { getCandidateById } from "../../apiCalls/Candidate";
import { getRecruiterById } from "../../apiCalls/Recruiter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export default function Messenger(props) {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [frndDp, setFrndDp] = useState(Pic);
  const [frndName, setFrndName] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [update, setUpdate] = useState(true);
  const [details, setDetails] = useState({});
  const [show, setShow] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const socket = useRef();
  const scrollRef = useRef();
  const location = useLocation();
  const canDetails = useSelector((state) => state.candidate.candidate);
  const recDetails = useSelector((state) => state.recruiter.recruiter);

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
    if (localStorage.getItem("rec") === "Candidate") {
      setDetails(canDetails);
    } else {
      setDetails(recDetails);
    }
  }, [canDetails, recDetails]);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

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
    if (currentChat && currentChat !== null) {
      setImg();
    }
  }, [currentChat]);

  useEffect(() => {
    if (update === true) {
      const getConversations = async () => {
        try {
          if (secondUserId !== null) {
            const res1 = await axios.get(
              `${API}/conversation/find/` + firstUserId + "/" + secondUserId
            );
            if (res1.data == null) {
              const body = { senderId: firstUserId, receiverId: secondUserId };
              const res = await axios.post(`${API}/conversation/`, body);
              setCurrentChat(res.data);
              // setConversations(res.data);
            }
            setCurrentChat(res1.data);
          }
          if (firstUserId) {
            const res = await axios.get(`${API}/conversation/` + firstUserId);
            socket.current.emit("addUser", firstUserId);
            socket.current.on("getUsers", (users) => {
              console.log(users);
            });
            let convo = res.data.sort(
              (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
            );
            setConversations(convo);
            setCurrentChat(convo[0]);
          }
          // setOnlineUsers(
          //     user.followings.filter((f) => users.some((u) => u.firstUserId === f))
          // );
        } catch (err) {
          console.log(err);
        }
      };
      getConversations();
    }
  }, [firstUserId, update]);

  useEffect(() => {
    if (update === true) {
      let convo = conversations.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      setConversations(convo);
      setUpdate(false);
    }
  }, [update]);

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
      const res1 = await axios.patch(
        `${API}/conversationUpdate/${message.conversationId}`
      );
      setUpdate(true);
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

  useEffect(() => {
    if (show) setOpacity(0.5);
    else setOpacity(1);
  }, [show]);

  return (
    <>
      <MyNavbar />
      <div
        className="messenger"
        onClick={(e) => {
          if (show) setShow(false);
        }}
        style={{ opacity: opacity }}
      >
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            {conversations !== null && (
              <div
                className="d-none d-md-block d-lg-block "
                style={{ borderRight: "1px solid gray", minHeight: "88vh" }}
              >
                <h4 style={{ textAlign: "center" }}>Chats</h4>
                {conversations.map((c, index) => (
                  <div key={index} onClick={() => setCurrentChat(c)}>
                    <Conversation conversation={c} currentUser={details} />
                  </div>
                ))}
              </div>
            )}
            {conversations !== null && (
              <button
                className="d-block d-sm-block d-md-none"
                style={{
                  backgroundColor: "white",
                  color: "gray",
                  outline: "none",
                  border: "none",
                }}
                onClick={(e) => setShow(!show)}
              >
                <FontAwesomeIcon icon={faBars} />
              </button>
            )}
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
      {show && (
        <div
          style={{
            position: "absolute",
            zIndex: "10",
            backgroundColor: "#bebebe",
            width: "70vw",
            minHeight: "83vh",
            padding: "20px",
            transition: "width 2s",
            left: "0",
            marginTop: "10px",
            opacity: "1",
            top: "99px",
          }}
        >
          <h4 style={{ textAlign: "center" }}>Chats</h4>
          {conversations.map((c, index) => (
            <div
              key={index}
              onClick={() => {
                setShow(!show);
                setCurrentChat(c);
              }}
            >
              <Conversation conversation={c} currentUser={details} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
