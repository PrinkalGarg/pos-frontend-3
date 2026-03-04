// import { useState } from "react";
// import { Navigate, useNavigate, Link } from "react-router-dom";
// import { toast } from "react-toastify";

// import useAuth from "../hooks/useAuth";
// import { ROLES } from "../auth/roles";

// import Input from "../components/common/Input";
// import Button from "../components/common/Button";

// const Login = () => {
//   const { login, user, loading: authLoading } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   // ⏳ Wait for auth check
//   if (authLoading) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         <p>Checking authentication...</p>
//       </div>
//     );
//   }

//   // 🔁 Already logged in → redirect by role
//   if (user) {
//     switch (user.role) {
//       case ROLES.ADMIN:
//         return <Navigate to="/admin" replace />;
//       case ROLES.MANAGER:
//         return <Navigate to="/manager" replace />;
//       case ROLES.INVENTORY_MANAGER:
//         return <Navigate to="/inventory" replace />;
//       case ROLES.CASHIER:
//         return <Navigate to="/cashier" replace />;
//       default:
//         return <Navigate to="/login" replace />;
//     }
//   }

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!form.email || !form.password) {
//       toast.error("Email and password are required");
//       return;
//     }

//     try {
//       setLoading(true);
//       const loggedInUser = await login(form.email, form.password);

//       switch (loggedInUser.role) {
//         case ROLES.ADMIN:
//           navigate("/admin", { replace: true });
//           break;
//         case ROLES.MANAGER:
//           navigate("/manager", { replace: true });
//           break;
//         case ROLES.INVENTORY_MANAGER:
//           navigate("/inventory", { replace: true });
//           break;
//         case ROLES.CASHIER:
//           navigate("/cashier", { replace: true });
//           break;
//         default:
//           navigate("/login");
//       }
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Invalid credentials");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-100">
//       <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
//         <h2 className="mb-6 text-center text-2xl font-semibold text-blue-600">
//           Login
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <Input
//             label="Email"
//             type="email"
//             name="email"
//             value={form.email}
//             onChange={handleChange}
//             placeholder="admin@pos.com"
//           />

//           <Input
//             label="Password"
//             type="password"
//             name="password"
//             value={form.password}
//             onChange={handleChange}
//             placeholder="••••••••"
//           />

//           <Button type="submit" disabled={loading}>
//             {loading ? "Logging in..." : "Login"}
//           </Button>
//         </form>

//         <div className="text-center text-sm mt-4">
//           <span className="text-gray-600">Don't have an account?</span>{" "}
//           <Link
//             to="/register"
//             className="font-medium text-blue-600 hover:underline"
//           >
//             Register
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
import { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

import useAuth from "../hooks/useAuth";
import { ROLES } from "../auth/roles";

import Input from "../components/common/Input";
import Button from "../components/common/Button";

const Login = () => {
  const { login, user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // ⏳ Wait for auth check
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

  // 🔁 Already logged in → redirect by role
  if (user) {
    switch (user.role) {
      case ROLES.ADMIN:
        return <Navigate to="/admin" replace />;
      case ROLES.MANAGER:
        return <Navigate to="/manager" replace />;
      case ROLES.INVENTORY_MANAGER:
        return <Navigate to="/inventory" replace />;
      case ROLES.CASHIER:
        return <Navigate to="/cashier" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      const loggedInUser = await login(form.email, form.password);

      switch (loggedInUser.role) {
        case ROLES.ADMIN:
          navigate("/admin", { replace: true });
          break;
        case ROLES.MANAGER:
          navigate("/manager", { replace: true });
          break;
        case ROLES.INVENTORY_MANAGER:
          navigate("/inventory", { replace: true });
          break;
        case ROLES.CASHIER:
          navigate("/cashier", { replace: true });
          break;
        default:
          navigate("/login");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black px-4">
      
      <div className="w-full max-w-md rounded-2xl bg-gray-900/70 backdrop-blur-xl border border-gray-800 p-8 shadow-2xl">

        <h2 className="mb-6 text-center text-3xl font-bold text-white">
          Welcome Back
        </h2>

        <p className="text-center text-gray-400 mb-8 text-sm">
          Login to access your dashboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@pos.com"
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

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

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 transition duration-300 py-3 font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center text-sm mt-6">
          <span className="text-gray-400">Don't have an account?</span>{" "}
          <Link
            to="/register"
            className="font-medium text-blue-500 hover:text-blue-400 transition"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;