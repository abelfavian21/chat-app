import React, { useState } from "react";
import { ref, get, set } from "firebase/database";
import { db } from "../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";

const AddContact = ({ onContactAdded }) => {
  const [email, setEmail] = useState("");
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!email) return;

    setLoading(true);

    const emailKey = email
      .replaceAll(".", "_dot_")
      .replaceAll("@", "_at_");
    const currentUserKey = user.email
      .replaceAll(".", "_dot_")
      .replaceAll("@", "_at_");

    const contactRef = ref(db, `users/${emailKey}`);
    const snapshot = await get(contactRef);

    if (snapshot.exists()) {
      await set(ref(db, `users/${currentUserKey}/contacts/${emailKey}`), true);
      onContactAdded();
      alert("Kontak berhasil ditambahkan");
    } else {
      alert("Email tidak ditemukan");
    }

    setEmail("");
    setLoading(false);
  };

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">Tambah Kontak</h5>
        <div className="input-group">
          <input
            type="email"
            className="form-control"
            placeholder="Masukkan email teman"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <button
            className="btn btn-primary"
            onClick={handleAdd}
            disabled={loading}
          >
            {loading ? "Menambahkan..." : "Tambah"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddContact;
