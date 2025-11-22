import React, { useState } from "react";
import { app } from "../../firebase";
import "./SignupUser.css";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, set, ref } from "firebase/database";

const db = getDatabase(app);

const auth = getAuth(app);

const SignupUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const createUserInDb = (user, firstName, lastName) => {
    const userRef = ref(db, "users/" + user.email.replace(".", "_"));
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

  const makeUser = () => {
    if (email && password && firstName) {
      setIsCreating(true);
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed up
          const user = userCredential.user;
          console.log("user created successfully: ", user);
          createUserInDb(user, firstName, lastName);
          setIsCreating(false);
          setShowSuccessMessage(true);
          setTimeout(() => {
            setShowSuccessMessage(false);
          }, 2000);
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
          ClearInputs();
        });
    } else {
      alert("please enter email and password to sign up");
    }
  };

  const ClearInputs = () => {
    setEmail("");
    setPassword("");
  };

  return (
    <div className="signup-page">
      <h2>Sign Up</h2>

      <label htmlFor="firstname">
        <strong>First Name: </strong>
      </label>
      <input
        type="firstname"
        id="firstname"
        name="firstname"
        placeholder="enter you First Name here"
        onChange={(e) => setFirstName(e.target.value)}
        value={firstName}
        disabled={isCreating || showSuccessMessage}
      />
      <br />
      <label htmlFor="lastname">
        <strong>Last Name: </strong>
      </label>
      <input
        type="lastname"
        id="lastname"
        name="lastname"
        placeholder="enter you Last Name here"
        onChange={(e) => setLastName(e.target.value)}
        value={lastName}
        disabled={isCreating || showSuccessMessage}
      />
      <br />
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
        disabled={isCreating || showSuccessMessage}
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
        disabled={isCreating || showSuccessMessage}
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
          onClick={makeUser}
          disabled={isCreating || showSuccessMessage}
        >
          {isCreating ? "Creating user..." : "Sign Up"}
        </button>
      </section>
      <span style={{ textAlign: "center", margin: "0 auto" }}>
        <a href="">already a user? sign in</a>
      </span>

      {showSuccessMessage && (
        <p className="success-message">User created successfully!</p>
      )}
    </div>
  );
};

export default SignupUser;
