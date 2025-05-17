import LoginForm from "../components/LoginForm";

function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3"
          alt="Learning Platform"
          className="w-full h-screen object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 mix-blend-overlay" />
        <div className="absolute bottom-8 left-8 text-white">
          <h2 className="text-2xl font-bold mb-2">Learn Together</h2>
          <p className="text-sm opacity-90">Join our learning community today</p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to EduConnect
            </h1>
            <p className="text-gray-600">Sign in and start learning</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
