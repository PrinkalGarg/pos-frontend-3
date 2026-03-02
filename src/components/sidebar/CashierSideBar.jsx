// import { forwardRef } from "react";
// import { NavLink } from "react-router-dom";

// const CashierSidebar = forwardRef(({ open, setOpen }, ref) => {
//   const closeSidebar = () => setOpen(false);
//   const toggleSidebar = () => setOpen(!open);

//   // SVG Icons
//   const POSIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
//     </svg>
//   );

//   const OrdersIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//     </svg>
//   );

//   const BillingIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
//     </svg>
//   );

//   const PersonIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//     </svg>
//   );

//   const MenuIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//     </svg>
//   );

//   const CloseIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//     </svg>
//   );

//   return (
//     <>
//       {/* Mobile Toggle Button */}
//       <button
//         onClick={toggleSidebar}
//         className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-blue-900 text-white shadow-lg md:hidden"
//       >
//         {open ? <CloseIcon /> : <MenuIcon />}
//       </button>

//       {/* Sidebar */}
//       <aside
//         ref={ref}
//         className={`fixed md:relative h-screen bg-linear-to-b from-blue-900 to-blue-950 text-white transition-all duration-300
//           ${open ? "w-64" : "w-16"}
//           overflow-hidden border-r border-blue-800/50 z-40 flex flex-col`}
//       >
//         {/* Toggle Button for Desktop */}
//         <div className="hidden md:flex justify-end p-3">
//           <button
//             onClick={toggleSidebar}
//             className="p-1.5 rounded-lg hover:bg-blue-800 transition-colors"
//           >
//             {open ? <CloseIcon /> : <MenuIcon />}
//           </button>
//         </div>

//         {/* Cashier Panel Header - Reduced spacing */}
//         {open ? (
//           <div className="flex flex-col items-center py-4 border-b border-blue-800/50">
//             <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center mb-1">
//               <PersonIcon />
//             </div>
//             <h2 className="text-base font-semibold text-blue-100">Cashier Panel</h2>
//           </div>
//         ) : (
//           /* Cashier Panel Icon when closed - Reduced spacing */
//           <div className="flex flex-col items-center py-4 border-b border-blue-800/50">
//             <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center">
//               <PersonIcon />
//             </div>
//           </div>
//         )}

//         {/* Navigation Items - Further reduced spacing */}
//         <div className="flex flex-col items-center pt-4 space-y-2 px-3">
//           {/* POS */}
//           {open ? (
//             <NavLink 
//               to="/cashier" 
//               end 
//               className={({ isActive }) =>
//                 `w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all
//                 ${
//                   isActive
//                     ? "bg-blue-600 text-white shadow-md"
//                     : "text-blue-100 hover:bg-blue-700/60"
//                 }`
//               } 
//               onClick={closeSidebar}
//             >
//               <POSIcon />
//               <span className="flex-1">POS</span>
//             </NavLink>
//           ) : (
//             <NavLink 
//               to="/cashier" 
//               end 
//               className={({ isActive }) =>
//                 `p-2.5 rounded-lg transition-all flex items-center justify-center
//                 ${isActive ? "bg-blue-600 text-white shadow-md" : "text-blue-100 hover:bg-blue-700/60"}`
//               } 
//               onClick={closeSidebar}
//               title="POS"
//             >
//               <POSIcon />
//             </NavLink>
//           )}

//           {/* Orders */}
//           {open ? (
//             <NavLink 
//               to="/cashier/orders" 
//               className={({ isActive }) =>
//                 `w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all
//                 ${
//                   isActive
//                     ? "bg-blue-600 text-white shadow-md"
//                     : "text-blue-100 hover:bg-blue-700/60"
//                 }`
//               } 
//               onClick={closeSidebar}
//             >
//               <OrdersIcon />
//               <span className="flex-1">Orders</span>
//             </NavLink>
//           ) : (
//             <NavLink 
//               to="/cashier/orders" 
//               className={({ isActive }) =>
//                 `p-2.5 rounded-lg transition-all flex items-center justify-center
//                 ${isActive ? "bg-blue-600 text-white shadow-md" : "text-blue-100 hover:bg-blue-700/60"}`
//               } 
//               onClick={closeSidebar}
//               title="Orders"
//             >
//               <OrdersIcon />
//             </NavLink>
//           )}

//           {/* Billing */}
//           {open ? (
//             <NavLink 
//               to="/cashier/billing" 
//               className={({ isActive }) =>
//                 `w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all
//                 ${
//                   isActive
//                     ? "bg-blue-600 text-white shadow-md"
//                     : "text-blue-100 hover:bg-blue-700/60"
//                 }`
//               } 
//               onClick={closeSidebar}
//             >
//               <BillingIcon />
//               <span className="flex-1">Billing</span>
//             </NavLink>
//           ) : (
//             <NavLink 
//               to="/cashier/billing" 
//               className={({ isActive }) =>
//                 `p-2.5 rounded-lg transition-all flex items-center justify-center
//                 ${isActive ? "bg-blue-600 text-white shadow-md" : "text-blue-100 hover:bg-blue-700/60"}`
//               } 
//               onClick={closeSidebar}
//               title="Billing"
//             >
//               <BillingIcon />
//             </NavLink>
//           )}
//         </div>
//       </aside>

//       {/* Overlay for mobile */}
//       {open && (
//         <div
//           className="fixed inset-0 bg-black/50 z-30 md:hidden"
//           onClick={closeSidebar}
//         />
//       )}
//     </>
//   );
// });

// export default CashierSidebar;


import { forwardRef } from "react";
import { NavLink } from "react-router-dom";

const CashierSidebar = forwardRef(({ open, setOpen }, ref) => {
  const closeSidebar = () => setOpen(false);
  const toggleSidebar = () => setOpen(!open);

  // SVG Icons
  const POSIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );

  const OrdersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  );

  const PersonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );

  const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  const SalesIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-blue-900 text-white shadow-lg md:hidden"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* Sidebar */}
      <aside
        ref={ref}
        className={`fixed md:relative h-screen bg-linear-to-b from-blue-900 to-blue-950 text-white transition-all duration-300
          ${open ? "w-64" : "w-16"}
          overflow-hidden border-r border-blue-800/50 z-40 flex flex-col`}
      >
        {/* Toggle Button for Desktop */}
        <div className="hidden md:flex justify-end p-3">
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-blue-800 transition-colors"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* Cashier Panel Header - Reduced spacing */}
        {open ? (
          <div className="flex flex-col items-center py-4 border-b border-blue-800/50">
            <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center mb-1">
              <PersonIcon />
            </div>
            <h2 className="text-base font-semibold text-blue-100">Cashier Panel</h2>
          </div>
        ) : (
          /* Cashier Panel Icon when closed - Reduced spacing */
          <div className="flex flex-col items-center py-4 border-b border-blue-800/50">
            <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center">
              <PersonIcon />
            </div>
          </div>
        )}

        {/* Navigation Items - Further reduced spacing */}
        <div className="flex flex-col items-center pt-4 space-y-2 px-3">
          {/* POS */}
          {open ? (
            <NavLink
              to="/cashier"
              end
              className={({ isActive }) =>
                `w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all
                ${isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-blue-100 hover:bg-blue-700/60"
                }`
              }
              onClick={closeSidebar}
            >
              <POSIcon />
              <span className="flex-1">POS</span>
            </NavLink>
          ) : (
            <NavLink
              to="/cashier"
              end
              className={({ isActive }) =>
                `p-2.5 rounded-lg transition-all flex items-center justify-center
                ${isActive ? "bg-blue-600 text-white shadow-md" : "text-blue-100 hover:bg-blue-700/60"}`
              }
              onClick={closeSidebar}
              title="POS"
            >
              <POSIcon />
            </NavLink>
          )}

          {/* Sales */}
          {open ? (
            <NavLink
              to="/cashier/orders"
              className={({ isActive }) =>
                `w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all
                ${isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-blue-100 hover:bg-blue-700/60"
                }`
              }
              onClick={closeSidebar}
            >
              <SalesIcon />
              <span className="flex-1">Sales</span>
            </NavLink>
          ) : (
            <NavLink
              to="/cashier/sales"
              className={({ isActive }) =>
                `p-2.5 rounded-lg transition-all flex items-center justify-center
                ${isActive ? "bg-blue-600 text-white shadow-md" : "text-blue-100 hover:bg-blue-700/60"}`
              }
              onClick={closeSidebar}
              title="Sales"
            >
              <SalesIcon />
            </NavLink>
          )}
          {open ? (
            <NavLink
              to="/cashier/orders"
              className={({ isActive }) =>
                `w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all
                ${isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-blue-100 hover:bg-blue-700/60"
                }`
              }
              onClick={closeSidebar}
            >
              <OrdersIcon />
              <span className="flex-1">Orders</span>
            </NavLink>
          ) : (
            <NavLink
              to="/cashier/billing"
              className={({ isActive }) =>
                `p-2.5 rounded-lg transition-all flex items-center justify-center
                ${isActive ? "bg-blue-600 text-white shadow-md" : "text-blue-100 hover:bg-blue-700/60"}`
              }
              onClick={closeSidebar}
              title="Billing"
            >
              <OrdersIcon />
            </NavLink>

          )}

        </div>
      </aside>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}
    </>
  );
});

export default CashierSidebar;