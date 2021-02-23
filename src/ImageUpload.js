import "./ImageUpload.css";
import React, { useState } from "react";
import { auth, db, storage } from "./firebase";
import firebase from "firebase";
import { Button } from "@material-ui/core";

function ImageUpload(props) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [URL, setURL] = useState('');

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };


  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    uploadTask.on(
      "state_changed",
      (snap) => {
        const prog = Math.round(
          (snap.bytesTransferred / snap.totalBytes) * 100
        );
        setProgress(prog);
      },
      (err) => {
        console.log(err);
      },
      () => {
        storage.ref('images').child(image.name).getDownloadURL().then(url => {
          setURL(url);
        });
      }
    );
  };

  const handlePost = (prop) => {
    storage
      .ref("images")
      .child(image.name)
      .getDownloadURL()
      .then((url) => {
        db.collection("posts").add({
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          caption: caption,
          imgURL: url,
          likes: 0,
          username: props.usern,
          likedUsers: ['.']
        });

        setProgress(0);
        setCaption("");
        setImage(null);
        props.closeme(false);
        // setURL('');
      });
  };

  return (
    <div className="imgupload">
      <progress className="imgupload__progress" value={progress} max="100" />
      <input
        onChange={(e) => setCaption(e.target.value)}
        type="text"
        placeholder="Caption here...."
        value={caption}
      />
      <input type="file" onChange={handleChange} />
      {progress===100 ? (
        <div>
          <img className="imgupload__progress" src={URL} />
          <Button onClick={handlePost}>Post!</Button>
        </div>
      ) : (
        <Button onClick={() => handleUpload(props)}>Upload</Button>
      )}
    </div>
  );
}

export default ImageUpload;
