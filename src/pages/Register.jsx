// import { useState } from "react";
// import { Navigate, useNavigate, Link } from "react-router-dom";
// import { toast } from "react-toastify";

// import useAuth from "../hooks/useAuth";
// import { ROLES } from "../auth/roles";

// import Input from "../components/common/Input";
// import Button from "../components/common/Button";

// import api from "../api/axios";

// const Register = () => {
//   const { user, loading: authLoading } = useAuth();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "",
//     storeCode: "",
//   });

//   const [loading, setLoading] = useState(false);

//   if (authLoading) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         <p>Checking authentication...</p>
//       </div>
//     );
//   }

//   if (user) {
//     return <Navigate to="/" replace />;
//   }

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const { name, email, password, role, storeCode } = form;

//     if (!name || !email || !password || !role) {
//       toast.error("All fields are required");
//       return;
//     }

//     if (
//       (role === ROLES.CASHIER || role === ROLES.INVENTORY_MANAGER) &&
//       storeCode.length !== 5
//     ) {
//       toast.error("Store code must be 5 digits");
//       return;
//     }

//     try {
//       setLoading(true);

//       await api.post("/auth/register", {
//         name,
//         email,
//         password,
//         role,
//         storeCode:
//           role === ROLES.CASHIER || role === ROLES.INVENTORY_MANAGER
//             ? storeCode
//             : null,
//       });

//       toast.success("Registration successful");
//       navigate("/login");
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Registration failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const showStoreCode =
//     form.role === ROLES.CASHIER || form.role === ROLES.INVENTORY_MANAGER;

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-100">
//       <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
//         <h2 className="mb-6 text-center text-2xl font-semibold text-blue-600">
//           Register User
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <Input
//             label="Name"
//             type="text"
//             name="name"
//             value={form.name}
//             onChange={handleChange}
//             placeholder="John Doe"
//           />

//           <Input
//             label="Email"
//             type="email"
//             name="email"
//             value={form.email}
//             onChange={handleChange}
//             placeholder="user@pos.com"
//           />

//           <Input
//             label="Password"
//             type="password"
//             name="password"
//             value={form.password}
//             onChange={handleChange}
//             placeholder="••••••••"
//           />

//           <div>
//             <label className="block text-sm font-medium mb-1">Role</label>
//             <select
//               name="role"
//               value={form.role}
//               onChange={handleChange}
//               className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
//             >
//               <option value="">Select role</option>
//               <option value={ROLES.MANAGER}>Manager</option>
//               <option value={ROLES.CASHIER}>Cashier</option>
//               <option value={ROLES.INVENTORY_MANAGER}>Inventory Manager</option>
//             </select>
//           </div>

//           {showStoreCode && (
//             <Input
//               label="Store Code"
//               type="text"
//               name="storeCode"
//               value={form.storeCode}
//               onChange={handleChange}
//               placeholder="12345"
//               maxLength={5}
//             />
//           )}

//           <Button type="submit" disabled={loading}>
//             {loading ? "Registering..." : "Register"}
//           </Button>
//         </form>

//         <div className="text-center text-sm mt-4">
//           <span className="text-gray-600">Already have an account?</span>{" "}
//           <Link
//             to="/login"
//             className="font-medium text-blue-600 hover:underline"
//           >
//             Login
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;
import { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

import useAuth from "../hooks/useAuth";
import { ROLES } from "../auth/roles";
import api from "../api/axios";

const Register = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    storeCode: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-300 text-lg">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, role, storeCode } = form;

    if (!name || !email || !password || !role) {
      toast.error("All fields are required");
      return;
    }

    if (
      (role === ROLES.CASHIER || role === ROLES.INVENTORY_MANAGER) &&
      storeCode.length !== 5
    ) {
      toast.error("Store code must be 5 digits");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        name,
        email,
        password,
        role,
        storeCode:
          role === ROLES.CASHIER || role === ROLES.INVENTORY_MANAGER
            ? storeCode
            : null,
      });

      toast.success("Registration successful");
      navigate("/login");
    } catch (err) {
     toast.error(
  err?.response?.data?.error ||
  err?.response?.data?.message ||
  "Registration failed"
);
    } finally {
      setLoading(false);
    }
  };

  const showStoreCode =
    form.role === ROLES.CASHIER || form.role === ROLES.INVENTORY_MANAGER;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black px-4">
      
      <div className="w-full max-w-md rounded-2xl bg-gray-900/70 backdrop-blur-xl border border-gray-800 p-8 shadow-2xl">

        <h2 className="mb-6 text-center text-3xl font-bold text-white">
          Create Account
        </h2>

        <p className="text-center text-gray-400 mb-8 text-sm">
          Register a new user account
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="user@pos.com"
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Password with Eye */}
          <div className="relative">
            <label className="block text-sm text-gray-400 mb-2">
              Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-gray-400 hover:text-white transition"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Role Select */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="">Select role</option>
              <option value={ROLES.MANAGER}>Manager</option>
              <option value={ROLES.CASHIER}>Cashier</option>
              <option value={ROLES.INVENTORY_MANAGER}>Inventory Manager</option>
            </select>
          </div>

          {/* Store Code */}
          {showStoreCode && (
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Store Code
              </label>
              <input
                type="text"
                name="storeCode"
                value={form.storeCode}
                onChange={handleChange}
                placeholder="12345"
                maxLength={5}
                className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 transition duration-300 py-3 font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="text-center text-sm mt-6">
          <span className="text-gray-400">Already have an account?</span>{" "}
          <Link
            to="/login"
            className="font-medium text-blue-500 hover:text-blue-400 transition"
          >
            Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;