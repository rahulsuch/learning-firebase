import React, { useState } from "react";
import { app } from "../../firebase";
import "./SignupUser.css";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getDatabase, set, ref } from "firebase/database";

const db = getDatabase(app);

const auth = getAuth(app);

const SignupUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [existingUser, setExistingUser] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState({
    currState: false,
    type: "signin",
  });

  const handleExistingUser = () => {
    ClearInputs()
    setExistingUser((prev) => {
      const newState = !prev;
      setShowSuccessMessage({
        currState: false,
        type: newState ? "signin" : "signup",
      });
      return newState;
    });
  };

  const createUserInDb = (user, firstName, lastName) => {
    const userRef = ref(db, "users/" + user.uid);
    set(userRef, {
      email: user.email,
      uid: user.uid,
      firstName: firstName,
      lastName: lastName,
      createdAt: new Date().toISOString(),
    })
      .then(() => {
        console.log("User data saved successfully!");
      })
      .catch((error) => {
        console.error("Error saving user data: ", error);
      });
  };

  const handleCredentials = () => {
    if (!email || !password) {
      alert("Please enter email and password to sign in");
      return;
    } else if (existingUser) {
      // sign in logic here
      setIsCreating(true);
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          setShowSuccessMessage({
            currState: true,
            type: "signin",
          });
          setTimeout(() => {
            setShowSuccessMessage({
              currState: false,
              type: "signin",
            });
          }, 2000);
          console.log("user signed in successfully: ", user);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error(
            "error occurred during sign in: ",
            errorCode,
            errorMessage
          );
        })
        .finally(() => {
          setIsCreating(false);
        });
    } else {
      makeUser();
    }
  };
  const makeUser = () => {
    if (!email || !password || !firstName) {
      alert("Please fill all required fields.");
      return;
    }
    setIsCreating(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        createUserInDb(user, firstName, lastName);
        setShowSuccessMessage({
          currState: true,
          type: "signup",
        });
        setTimeout(() => {
          setShowSuccessMessage({
            currState: false,
            type: "signup",
          });
        }, 2000);

        ClearInputs();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(
          "error occurred during sign up: ",
          errorCode,
          errorMessage
        );
      })
      .finally(() => {
        setIsCreating(false);
      });
  };

  const ClearInputs = () => {
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
  };

  return (
    <div className="signup-page">
      <h2>{existingUser ? "Sign In" : "Sign Up"}</h2>

      {!existingUser && (
        <>
          <label htmlFor="firstname">
            <strong>First Name: </strong>
          </label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            placeholder="enter you First Name here"
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName}
            disabled={isCreating || showSuccessMessage.currState}
          />
          <br />
          <label htmlFor="lastname">
            <strong>Last Name: </strong>
          </label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            placeholder="enter you Last Name here"
            onChange={(e) => setLastName(e.target.value)}
            value={lastName}
            disabled={isCreating || showSuccessMessage.currState}
          />
          <br />
        </>
      )}
      <label htmlFor="email">
        <strong>Email: </strong>
      </label>
      <input
        type="email"
        id="email"
        name="email"
        placeholder="enter you email here"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        disabled={isCreating || showSuccessMessage.currState}
      />
      <br />
      <label htmlFor="password">
        <strong>Password: </strong>
      </label>
      <input
        type="password"
        id="password"
        name="password"
        placeholder="enter you password here"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        disabled={isCreating || showSuccessMessage.currState}
      />
      <br />
      <section
        style={{
          display: "flex",
          gap: "10px",
          textAlign: "center",
          margin: "0 auto",
        }}
      >
        <button type="button" onClick={ClearInputs}>
          Clear
        </button>
        <button
          type="submit"
          onClick={handleCredentials}
          disabled={isCreating || showSuccessMessage.currState}
        >
          {existingUser
            ? "Sign In"
            : isCreating
            ? "Creating user..."
            : "Sign Up"}
        </button>
      </section>
      <button
        onClick={handleExistingUser}
        disabled={isCreating || showSuccessMessage.currState}
        className="toggle-auth-btn"
      >
        {existingUser
          ? "New user? Create an account"
          : "Already have an account? Sign In here"}
      </button>

      {showSuccessMessage.currState && (
        <p className="success-message">
          {showSuccessMessage.type === "signup"
            ? "created successfully!"
            : "sign-in successful"}
        </p>
      )}
    </div>
  );
};

export default SignupUser;
