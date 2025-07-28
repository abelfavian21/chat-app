import React, { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { db } from "../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";
// import helper
import { encodeEmail } from "../utils/encodeEmail"; // pastikan path sesuai

const ContactList = ({ onSelectContact }) => {
  const [contacts, setContacts] = useState([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchContacts = async () => {
      const currentUserKey = encodeEmail(user.email);
      const snapshot = await get(ref(db, `users/${currentUserKey}/contacts`));

      if (snapshot.exists()) {
        const contactKeys = Object.keys(snapshot.val());
        const contactsData = await Promise.all(
          contactKeys.map(async (key) => {
            const contactSnap = await get(ref(db, `users/${key}`));
            return contactSnap.exists() ? contactSnap.val() : null;
          })
        );
        setContacts(contactsData.filter(Boolean));
      }
    };

    if (user) {
      fetchContacts();
    }
  }, [user]);

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title">Daftar Kontak</h5>
        <ul className="list-group">
          {contacts.length === 0 && (
            <li className="list-group-item text-muted">Belum ada kontak</li>
          )}
          {contacts.map((contact, index) => (
            <li
              key={index}
              className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
              onClick={() => onSelectContact(contact)}
              style={{ cursor: "pointer" }}
            >
              <div>
                <strong>{contact.name || contact.email.split("@")[0]}</strong>
                <div className="text-muted small">{contact.email}</div>
              </div>
              <span className="badge bg-primary rounded-pill">Chat</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ContactList;
