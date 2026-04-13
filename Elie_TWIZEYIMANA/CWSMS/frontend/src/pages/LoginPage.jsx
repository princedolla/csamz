import { useState } from "react";

function LoginPage({ onLogin, isSubmitting, errorMessage }) {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onLogin({ Email: Email.trim(), Password });
  };

  return (
    <div className="mx-auto mt-20 max-w-md rounded-xl bg-white p-6 shadow">
      <h1 className="mb-1 text-2xl font-semibold text-slate-800">SmartPark CWSMS</h1>
      <p className="mb-6 text-sm text-slate-600">Sign in to continue.</p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
            value={Email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
            value={Password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}

        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
