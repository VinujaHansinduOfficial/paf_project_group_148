import RegisterForm from "../components/RegisterForm";
import LoginForm from "../components/LoginForm";

function AuthPage() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        padding: "2rem",
      }}
    >
      <RegisterForm />
      <LoginForm />
    </div>
  );
}

export default AuthPage;
