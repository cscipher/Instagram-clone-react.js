import { Button } from "@material-ui/core";
import React from "react";
import "./profile.css";

function Profile() {
  return (
    <div>
      {/* navbar */}
      {/* user info & bio */}
      <div className="profile__prfl">
        <h2 className="profile__usrnm">__ciph3r__</h2>
        <Button className="profile__editprfl">Edit Profile</Button>
      </div>

      {/* posts wall */}
    </div>
  );
}

export default Profile;
