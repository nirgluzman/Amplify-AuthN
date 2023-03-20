import { useEffect, useState } from "react";
import { Auth, Hub } from "aws-amplify";

const initialFormState = {
  username: "",
  email: "",
  password: "",
  authCode: "",
  formType: "signUp",
};

function App() {
  const [formState, setFormState] = useState(initialFormState);
  const [user, setUser] = useState(null);

  function onChange(e) {
    e.preventDefault();
    setFormState(() => ({ ...formState, [e.target.name]: e.target.value }));
  }

  const { formType } = formState;

  async function signUp() {
    const { username, email, password } = formState;
    try {
      await Auth.signUp({ username, password, attributes: { email } });
      setFormState(() => ({ ...formState, formType: "confirmSignUp" }));
    } catch (err) {
      console.log("error signing up:", err);
    }
  }

  async function confirmSignUp() {
    const { username, authCode } = formState;
    console.log(authCode);
    try {
      await Auth.confirmSignUp(username, authCode);
      setFormState(() => ({ ...formState, formType: "signIn" }));
    } catch (err) {
      console.log("error confirming sign up:", err);
    }
  }

  async function signIn() {
    const { username, password } = formState;
    try {
      await Auth.signIn({ username, password });
      setFormState(() => ({ ...formState, formType: "signedIn" }));
    } catch (err) {
      console.log("error signing in:", err);
    }
  }

  async function signOut() {
    try {
      await Auth.signOut();
      setFormState(() => ({ ...formState, formType: "signIn" }));
    } catch (err) {
      console.log("error signing out: ", err);
    }
  }

  async function checkUser() {
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      console.log("currentUser:", currentUser);
      setUser(currentUser);
      setFormState(() => ({ ...formState, formType: "signedIn" }));
    } catch (err) {
      console.log(err);
    }
  }

  function setAuthListener() {
    Hub.listen("auth", (data) => {
      switch (data.payload.event) {
        case "signIn":
          console.log("user signed in");
          break;
        case "signUp":
          console.log("user signed up");
          break;
        case "signOut":
          console.log("user signed out");
          break;
        case "signIn_failure":
          console.log("user sign in failed");
          break;
        default:
          break;
      }
    });
  }

  useEffect(() => {
    checkUser();
    setAuthListener();
  }, []);

  return (
    <div>
      {formType === "signUp" && (
        <div>
          <input
            name="username"
            type="text"
            onChange={onChange}
            placeholder="username"
          />
          <input
            name="email"
            type="email"
            onChange={onChange}
            placeholder="email"
          />
          <input
            name="password"
            type="password"
            onChange={onChange}
            placeholder="password"
          />
          <button onClick={signUp}>Sign Up</button>
          <button
            onClick={() =>
              setFormState(() => ({ ...formState, formType: "signIn" }))
            }
          >
            Sign In
          </button>
        </div>
      )}
      {formType === "confirmSignUp" && (
        <div>
          <input
            name="authCode"
            type="text"
            onChange={onChange}
            placeholder="confirmation code"
          />
          <button onClick={confirmSignUp}>Confirm Sign Up</button>
        </div>
      )}
      {formType === "signIn" && (
        <div>
          <input
            name="username"
            type="text"
            onChange={onChange}
            placeholder="username"
          />
          <input
            name="password"
            type="password"
            onChange={onChange}
            placeholder="password"
          />
          <button onClick={signIn}>Sign In</button>
          <button
            onClick={() =>
              setFormState(() => ({ ...formState, formType: "signUp" }))
            }
          >
            Sign Up
          </button>
        </div>
      )}
      {formType === "signedIn" && (
        <div>
          <h1>Welcome</h1>
          <button onClick={signOut}>Sign Out</button>
        </div>
      )}
    </div>
  );
}

export default App;
