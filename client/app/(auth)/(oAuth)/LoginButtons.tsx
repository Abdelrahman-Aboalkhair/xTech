"use client";

export default function LoginButtons() {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/v1/auth/google";
  };

  const handleFacebookLogin = () => {
    window.location.href = "http://localhost:5000/api/v1/auth/facebook";
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
      <button
        onClick={handleGoogleLogin}
        className="flex items-center gap-2 w-full px-4 py-2 text-white bg-gray-900 hover:bg-gray-800 rounded-lg shadow-md transition"
      >
        <span className="flex-1 text-center">Login with Google</span>
      </button>

      <button
        onClick={handleFacebookLogin}
        className="flex items-center gap-2 w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md transition"
      >
        <span className="flex-1 text-center">Login with Facebook</span>
      </button>
    </div>
  );
}
