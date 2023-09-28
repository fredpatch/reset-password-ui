import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import queryString from "query-string";
import axios from "axios";

const baseUrl = "http://localhost:9000/user";

const Form = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [invalidUser, setInvalidUser] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(true);
  const [newPassword, setNewPassword] = useState({
    password: "",
    confirmPassword: "",
  });
  const { token, id } = queryString.parse(location.search);

  const verifyToken = async () => {
    try {
      const { data } = await axios(
        `${baseUrl}/verify-token?token=${token}&id=${id}`
      );
      setBusy(false);
    } catch (error) {
      if (error?.response?.data) {
        const { data } = error.response;
        if (!data.success) return setInvalidUser(data.error);
        return console.log(error.response.data);
      }
      console.log(error);
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  const handleOnChange = ({ target }) => {
    const { name, value } = target;

    setNewPassword({ ...newPassword, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = newPassword;
    if (password.trim().length < 8 || password.trim().length > 20) {
      return setError("Password must be 8 to 20 characters long!");
    }
    if (password !== confirmPassword) {
      return setError("Password does not match!");
    }
    try {
      setBusy(true);
      const { data } = await axios.post(
        `${baseUrl}/reset-password?token=${token}&id=${id}`,
        { password }
      );

      setBusy(false);

      if (data.success) {
        navigate("/reset-password", { replace: true });
        setSuccess(true);
      }
    } catch (error) {
      setBusy(false);
      if (error?.response?.data) {
        const { data } = error.response;
        if (!data.success) return setError(data.error);
        return console.log(error.response.data);
      }
      console.log(error);
    }
  };

  if (success)
    return (
      <div className="m-auto max-w-screen-sm pt-40">
        <h1 className="mb-3 text-center text-3xl text-gray-500">
          Password reset successfully . . .
        </h1>
      </div>
    );

  if (invalidUser)
    return (
      <div className="m-auto max-w-screen-sm pt-40">
        <h1 className="mb-3 text-center text-3xl text-gray-500">
          {invalidUser}
        </h1>
      </div>
    );

  if (busy)
    return (
      <div className="m-auto max-w-screen-sm pt-40">
        <h1 className="mb-3 text-center text-3xl text-gray-500">
          Verifying reset token . . .
        </h1>
      </div>
    );

  return (
    <div className="m-auto max-w-screen-sm pt-40">
      <h1 className="mb-3 text-center text-3xl text-gray-500">
        Reset Password
      </h1>
      <form onSubmit={handleSubmit} className="w-full rounded-lg p-10 shadow">
        {error && (
          <p className="mb-3 bg-red-500 p-2 text-center text-white">{error}</p>
        )}
        <div className="space-y-8">
          <input
            type="password"
            placeholder="* * * * * * * * * * "
            name="password"
            className="h-10 w-full rounded border-2 border-gray-500 px-3 text-lg"
            onChange={handleOnChange}
          />
          <input
            type="password"
            placeholder="* * * * * * * * * * "
            name="confirmPassword"
            className="h-10 w-full rounded border-2 border-gray-500 px-3 text-lg"
            onChange={handleOnChange}
          />
          <input
            type="submit"
            value="Reset Password"
            className="w-full rounded bg-gray-500 py-3 text-white"
          />
        </div>
      </form>
    </div>
  );
};

export default Form;
