import React from "react";

const Button = ({ type = "button", onClick, disabled, children }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-md bg-blue-600 py-2 px-4 text-white font-medium text-center hover:bg-blue-700 disabled:opacity-60 transition"
    >
      {children}
    </button>
  );
};

export default Button;
