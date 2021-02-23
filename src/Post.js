import { Avatar, Button, IconButton } from "@material-ui/core";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import "./Post.css";
import firebase from "firebase";

function tConvert(time) {
  // Check correct time format and split into components
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [
    time,
  ];

  if (time.length > 1) {
    // If time format correct
    time = time.slice(1); // Remove full string match value
    time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join(""); // return adjusted time or original string
}

const convertTime = (anytime) => {
  if (anytime !== null) {
    let s = anytime.toDate();
    s = String(s);
    let t = "";
    t += s.substring(4, 15);
    let k = s.substring(16, 21);
    k = tConvert(k);
    t += ", " + k;
    return t;
  }
};

function Post(props) {
  const { dp, postID, user, time, username, caption, imgURL } = props;
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [likes, setLikes] = useState(0);
  const [likeState, setLikeState] = useState(false);

  useEffect(() => {
    let unSubscribe;
    if (postID) {
      unSubscribe = db
        .collection("posts")
        .doc(postID)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snap) => {
          setComments(snap.docs.map((doc) => doc.data()));
        });
    }

    return () => unSubscribe();
  }, [postID]);

  const postComment = (e) => {
    e.preventDefault();
    db.collection("posts")
      .doc(postID)
      .collection("comments")
      .add({
        text: comment,
        username: user.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .catch((err) => console.log(err));

    setComment("");
  };

  useEffect(() => {
    let unSubs;
    if (postID) {
      unSubs = db
        .collection("posts")
        .doc(postID)
        .onSnapshot((snap) => {
          setLikes(snap.data().likes);
          let filled = snap.data().likedUsers;
          let st = false;
          if (filled) {
            for (let i = 0; i < filled.length; i++) {
              if (filled[i] === user.uid) {
                st = true;
              }
            }
            st ? setLikeState(true) : setLikeState(false);
          }
        });
    }
    return () => unSubs();
  }, [postID]);

  const updateLikes = (e) => {
    e.preventDefault();
    db.collection("users")
      .doc(user.uid)
      .get()
      .then((snap) => {
        let allposts = snap.data().likedPosts;
        console.log(allposts);
        for (let i = 0; i < allposts.length; i++) {
          if (allposts[i] !== postID) {
            db.collection("posts")
              .doc(postID)
              .get()
              .then((snap2) => {
                db.collection("posts")
                  .doc(postID)
                  .update({
                    likes: likes + 1,
                    likedUsers: [...snap2.data().likedUsers, ...[user.uid]],
                  });
              });

            db.collection("users")
              .doc(user.uid)
              .update({
                likedPosts: [...snap.data().likedPosts, ...[postID]],
              });
          } else {
            db.collection("posts")
              .doc(postID)
              .get()
              .then((snap2) => {
                db.collection("posts")
                  .doc(postID)
                  .update({
                    likes: likes - 1,
                    likedUsers: [
                      ...snap2.data().likedUsers.filter((i) => i !== user.uid),
                    ],
                  });
              });

            db.collection("users")
              .doc(user.uid)
              .update({
                likedPosts: [
                  ...snap.data().likedPosts.filter((i) => i !== postID),
                ],
              });
          }
        }
      });
    setLikes(0);
  };

  return (
    <div className="post">
      <div className="post__header">
        <Avatar className="post__avatar" alt={username} src={dp} />
        <p className="post__Utext">{username}</p>
      </div>
      {/* header -> avatar + username */}

      <img className="post__image" src={imgURL} />
      {/* image */}

      <div className="post__likes">
        <IconButton onClick={updateLikes} disabled={!user} aria-label="like">
          {likeState ? (
            <FavoriteIcon style={{ color: "#ED4956" }} />
          ) : (
            <FavoriteBorderIcon />
          )}
        </IconButton>
        <div className="post__likecount">
          <p>
            {" "}
            {likes === 1 ? `${likes} Like` : likes ? `${likes} Likes` : null}
          </p>
        </div>
      </div>

      {/* like button with likes count */}

      <p className="post__text">
        <span className="post__Utext">{username}</span> {caption}
      </p>
      {/* username + caption */}

      <div className="post__allcomments">
        {comments.map((cmnt) => (
          <p>
            <span className="post__Utext">{cmnt.username}</span> {cmnt.text}
          </p>
        ))}
      </div>

      <div className="post__time">{convertTime(time)}</div>

      {user && (
        <form className="post__commentbox">
          <input
            className="post__input"
            type="text"
            placeholder="Add a comment..."
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />

          <button
            disabled={!comment}
            style={!comment ? { color: "#5ec3ff" } : null}
            className="post__button"
            type="submit"
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
