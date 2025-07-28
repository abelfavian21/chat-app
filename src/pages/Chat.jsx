import React, { useEffect, useState } from "react";
import { ref, onValue, push, set } from "firebase/database";
import { db } from "../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";
import ContactList from "./ContactList";
import AddContact from "./AddContact";
import "./Chat.css";

const Chat = () => {
  const [user] = useAuthState(auth);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const encodeEmail = (email) =>
    email.replaceAll(".", "_").replaceAll("@", "_at_");

  useEffect(() => {
    if (!selectedContact || !user) return;

    const currentUserKey = encodeEmail(user.email);
    const contactKey = encodeEmail(selectedContact.email);
    const chatId =
      currentUserKey < contactKey
        ? `${currentUserKey}_${contactKey}`
        : `${contactKey}_${currentUserKey}`;

    const messagesRef = ref(db, `chats/${chatId}/messages`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const msgs = snapshot.val();
      const list = msgs ? Object.values(msgs) : [];
      setMessages(list.sort((a, b) => a.timestamp - b.timestamp));
    });

    return () => unsubscribe();
  }, [selectedContact, user]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const currentUserKey = encodeEmail(user.email);
    const contactKey = encodeEmail(selectedContact.email);
    const chatId =
      currentUserKey < contactKey
        ? `${currentUserKey}_${contactKey}`
        : `${contactKey}_${currentUserKey}`;

    const msgRef = push(ref(db, `chats/${chatId}/messages`));
    await set(msgRef, {
      sender: user.email,
      text: input.trim(),
      timestamp: Date.now(),
    });
    setInput("");
  };

  return (
    <div className="chat-wrapper">
      <aside className="chat-sidebar">
        <AddContact onContactAdded={() => {}} />
        <ContactList onSelectContact={setSelectedContact} />
      </aside>

      <main className="chat-main">
        {selectedContact ? (
          <>
            <div className="chat-header">
              <h4>{selectedContact.name || selectedContact.email}</h4>
            </div>

            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`chat-bubble ${
                    msg.sender === user.email ? "sent" : "received"
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="chat-time">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>

            <div className="chat-input-container">
              <input
                className="chat-input"
                placeholder="Tulis pesan..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button className="chat-send-button" onClick={handleSend}>
                🚀
              </button>
            </div>
          </>
        ) : (
          <div className="chat-placeholder">
            <p>Pilih kontak untuk mulai chatting ✨</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Chat;
