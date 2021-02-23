import "./App.css";
import React, { useState, useEffect } from "react";
import Post from "./Post";
import Profile from "./profile";
import { auth, db } from "./firebase";
import {
  Button,
  Input,
  Modal,
  IconButton,
  Avatar,
  Link,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ImageUpload from "./ImageUpload";
import PublishIcon from "@material-ui/icons/Publish";
import Tooltip from "@material-ui/core/Tooltip";
import { HeartIcon, HomeIcon } from "@primer/octicons-react";
import { ImCompass2 } from "react-icons/im";
import StickyBox from "react-sticky-box/dist/esnext";

// function getModalStyle() {
//   const top = 50;
//   const left = 50;

//   return {
//     top: `${top}%`,
//     left: `${left}%`,
//     transform: `translate(-${top}%, -${left}%)`,
//   };
// }

// const useStyles = makeStyles((theme) => ({
//   paper: {
//     position: "absolute",
//     width: 400,
//     backgroundColor: theme.palette.background.paper,
//     border: "2px solid #000",
//     boxShadow: theme.shadows[5],
//     padding: theme.spacing(2, 4, 3),
//   },
// }));

function App() {
  const [posts, setPosts] = useState([]);
  const [upload, setUpload] = useState(false);
  const [user, setUser] = useState(null);
  const [usrName, setName] = useState("");
  const [dp, setDP] = useState("");
  const [prfl, setPrfl] = useState(false);
  // const [postName, setPostName]
  // const [postName, setPostName]

  const closemodal = (change) => {
    
  }

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snap) => {
        setPosts(
          snap.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authuser) => {
      if (authuser) {
        // console.log(authuser);
        setUser(authuser);
        console.log(authuser.uid);
        db.collection("users")
          .doc(authuser.uid)
          .onSnapshot(
            (snap) => {
              if (snap) {
                setDP(snap.data().ProfilePic);
                setName(snap.data().Username);
                console.log(dp);
              }
              // console.log(snap.data());
            },
            (err) => {
              console.log(err);
            }
          );
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <div>
      {prfl ? (
        <Profile />
      ) : (
        <div className="App">
          <div className="app__header">
            <a href="#">
              <img
                className="app__headerImage"
                src="src\Instagram-Logo.png"
                alt=""
              />
            </a>

            <input type="text" class="app__headersearch" placeholder="Search" />

            {user ? (
              <div className="app__headername">
                <div className="app__headerbtns">
                  <Tooltip title="Home" arrow>
                    <IconButton className="app__uploadbtn">
                      <HomeIcon size={24} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Explore" arrow>
                    <IconButton className="app__uploadbtn">
                      <ImCompass2 />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Notification" arrow>
                    <IconButton className="app__uploadbtn">
                      <HeartIcon size={24} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Upload" arrow>
                    <IconButton
                      className="app__uploadbtn"
                      onClick={() => setUpload(true)}
                    >
                      <PublishIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            ) : null}
          </div>

          {/* <h1>Welcome to IG-Clone 🚀</h1> */}
          {/* <Post caption="sdsd" username="dfjsdnfjd" imgURL="https://picsum.photos/500" /> */}
          <div className="app__posts">
            <div className="app__posts-left">
              {posts.map(({ post, id }) => (
                <Post
                  key={id}
                  dp={dp}
                  postID={id}
                  time={post.timestamp}
                  user={user}
                  caption={post.caption}
                  username={post.username}
                  imgURL={post.imgURL}
                />
              ))}
            </div>
            {user && (
              <span>
                <StickyBox offsetTop={150} offsetBottom={10}>
                  <div className="app__userInfo">
                    <div className="app__avatarOut">
                      <Avatar src={dp} alt="h" className="app__avatar" />
                    </div>
                    <span>
                      <h3 className="app__user">
                        <a onClick={() => setPrfl(true)}>
                          {user ? usrName : "dummy"}
                        </a>
                      </h3>{" "}
                      <p className="app__username">{user.displayName}</p>
                    </span>
                    <span>
                      <button
                        className="app__logout"
                        onClick={() => auth.signOut()}
                      >
                        Log Out
                      </button>
                    </span>
                  </div>
                  <footer className="app__footer">
                    © 2020 INSTAGRAM CLONE BY{" "}
                    <Link
                      style={{ color: "#7e7e7e80" }}
                      href="https://github.com/24cipher"
                      target="blank"
                    >
                      <strong>CIPHER</strong>
                    </Link>{" "}
                  </footer>
                </StickyBox>
              </span>
            )}
          </div>

          {user?.displayName ? (
            <Modal open={upload} onClose={() => setUpload(false)}>
              <ImageUpload closeme={(e) => setUpload(e)} usern={usrName} />
            </Modal>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default App;
