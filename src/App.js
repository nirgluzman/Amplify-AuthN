import { useState } from "react";
import { Auth } from "aws-amplify";

const initialFormState = {
  username: "",
  email: "",
  password: "",
  authCode: "",
  formType: "signUp",
};

function App() {
  const [formState, setFormState] = useState(initialFormState);

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
        </div>
      )}
      {formType === "signedIn" && <h1>Welcome user!</h1>}
    </div>
  );
}

export default App;
