import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const AcceptInvite = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate()
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      axios.get(`http://127.0.0.1:8080/accept-invite?token=${token}`)
        .then(response => {
          alert(response.data.message);
          navigate("/login")
        })
        .catch(error => {
          console.error("Error accepting invitation:", error);
          alert("Invitation link is invalid or expired.");
        });
    }
  }, [token]);

  return (
    <div>
      <h2>Accepting Invitation...</h2>
      <p>Please wait while we process your invitation.</p>
    </div>
  );
};

export default AcceptInvite;
