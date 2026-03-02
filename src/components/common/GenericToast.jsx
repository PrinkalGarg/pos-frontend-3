import { toast } from "react-toastify";
import { X, AlertTriangle, CheckCircle, AlertCircle, Info } from "lucide-react";

const baseOptions = {
  position: "top-right",
  autoClose: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

const GenericToast = {
  success: (message, options = {}) =>
    toast.success(message, { ...baseOptions, ...options }),

  error: (message, options = {}) =>
    toast.error(message, { ...baseOptions, ...options }),

  info: (message, options = {}) =>
    toast.info(message, { ...baseOptions, ...options }),

  warning: (message, options = {}) =>
    toast.warn(message, { ...baseOptions, ...options }),

  /**
   * ENHANCED CONFIRM MODAL WITH IMPROVED BUTTON DESIGN
   */
  confirm: ({
    title = "Confirm Action",
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "warning", // success | error | info | warning
    onConfirm,
    onCancel,
    showIcon = true,
    destructive = false,
  }) => {
    // Icon configuration
    const iconConfig = {
      success: { 
        icon: CheckCircle, 
        bgColor: "bg-green-50", 
        iconColor: "text-green-600",
        borderColor: "border-green-200",
        confirmColor: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
        ringColor: "focus:ring-green-500"
      },
      error: { 
        icon: AlertCircle, 
        bgColor: "bg-red-50", 
        iconColor: "text-red-600",
        borderColor: "border-red-200",
        confirmColor: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
        ringColor: "focus:ring-red-500"
      },
      info: { 
        icon: Info, 
        bgColor: "bg-blue-50", 
        iconColor: "text-blue-600",
        borderColor: "border-blue-200",
        confirmColor: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
        ringColor: "focus:ring-blue-500"
      },
      warning: { 
        icon: AlertTriangle, 
        bgColor: "bg-yellow-50", 
        iconColor: "text-yellow-600",
        borderColor: "border-yellow-200",
        confirmColor: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
        ringColor: "focus:ring-yellow-500"
      },
    };

    const { 
      icon: IconComponent, 
      bgColor, 
      iconColor, 
      borderColor,
      confirmColor,
      ringColor
    } = iconConfig[type];

    // Destructive action styling override
    const finalConfirmColor = destructive 
      ? "bg-red-600 hover:bg-red-700 focus:ring-red-500" 
      : confirmColor;
    const finalRingColor = destructive 
      ? "focus:ring-red-500" 
      : ringColor;

    return toast(
      ({ closeToast }) => (
        <div className="w-full">
          <div className={`rounded-2xl border ${borderColor} ${bgColor} p-1`}>
            <div className="w-full bg-white rounded-xl p-5">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  {showIcon && (
                    <div className={`shrink-0 flex h-12 w-12 items-center justify-center rounded-full ${bgColor}`}>
                      <IconComponent className={`h-6 w-6 ${iconColor}`} />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                      {title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                      {message}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onCancel?.();
                    closeToast();
                  }}
                  className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-200"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Enhanced Footer with better button design */}
              <div className="mt-7 flex justify-end gap-3">
                <button
                  onClick={() => {
                    onCancel?.();
                    closeToast();
                  }}
                  className="
                    px-6 py-2.5 text-sm font-medium text-gray-700 
                    bg-white border border-gray-300 rounded-lg 
                    hover:bg-gray-50 hover:border-gray-400 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
                    transition-all duration-200
                    shadow-sm hover:shadow
                    min-w-25
                  "
                >
                  {cancelText}
                </button>

                <button
                  onClick={() => {
                    onConfirm?.();
                    closeToast();
                  }}
                  className={`
                    px-6 py-2.5 text-sm font-medium text-white 
                    rounded-lg 
                    hover:shadow-lg 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 ${finalRingColor}
                    transition-all duration-200
                    transform hover:-translate-y-0.5 active:translate-y-0
                    shadow-md hover:shadow-xl
                    min-w-25
                    ${finalConfirmColor}
                  `}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        hideProgressBar: true,
        // CRITICAL FIXES:
        closeButton: false, // Disable react-toastify's default close button
        className: "", // Remove default toast styling
        bodyClassName: "!p-0", // Remove default body padding
        toastClassName: "!p-0 !bg-transparent !shadow-none !overflow-visible", // Remove toast container styling
        style: {
          width: "500px",
          maxWidth: "95vw",
          marginTop: "15vh",
          background: "transparent", // Remove default background
          boxShadow: "none", // Remove default shadow
        },
      }
    );
  },
};

export default GenericToast;