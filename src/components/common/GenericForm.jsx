import React from "react";

const GenericForm = ({
  title,
  fields = [],
  onSubmit,
  submitText = "Submit",
  loading = false,
  actions,
  compact = false, // 👈 NEW (default false)
}) => {
  const baseInputClass =
    "w-full h-10 px-3 rounded-md text-sm border border-gray-300 bg-white " +
    "focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 " +
    "disabled:bg-gray-100 disabled:cursor-not-allowed";

  return (
    <div
      className={`bg-white rounded-xl shadow ${compact ? "p-3 space-y-3" : "p-6 space-y-5"
        }`}
    >
      {title && (
        <h3
          className={`font-semibold text-gray-800 ${compact ? "text-sm" : "text-lg"
            }`}
        >
          {title}
        </h3>
      )}

      {/* FIELDS */}
      <div
        className={
          compact
            ? "grid grid-cols-1 md:grid-cols-4 gap-3 items-end"
            : "grid grid-cols-1 md:grid-cols-2 gap-4"
        }
      >
        {fields.map((field) => {
          /* TEXT / EMAIL / PASSWORD */
          if (!field.type || ["text", "email", "password"].includes(field.type)) {
            return (
              <div key={field.name} className="flex flex-col gap-1">
                {field.label && !compact && (
                  <label className="text-sm font-medium text-gray-600">
                    {field.label}
                  </label>
                )}
                <input
                  type={field.type || "text"}
                  placeholder={field.placeholder}
                  value={field.value || ""}
                  disabled={field.disabled}
                  onChange={(e) => field.onChange(e.target.value)}
                  className={baseInputClass}
                />
                {field.error && (
                  <p className="text-red-500 text-xs mt-1">
                    {field.error}
                  </p>
                )}

                {field.helperText && !field.error && (
                  <p className={`text-xs mt-1 ${field.success ? "text-green-600" : "text-gray-500"}`}>
                    {field.helperText}
                  </p>
                )}

              </div>
            );
          }

          /* TEXTAREA */
          if (field.type === "textarea") {
            return (
              <div
                key={field.name}
                className={`flex flex-col gap-1 ${compact ? "md:col-span-4" : "md:col-span-2"
                  }`}
              >
                {field.label && (
                  <label className="text-sm font-medium text-gray-600">
                    {field.label}
                  </label>
                )}
                <textarea
                  placeholder={field.placeholder}
                  value={field.value || ""}
                  disabled={field.disabled}
                  onChange={(e) => field.onChange(e.target.value)}
                  className={`${baseInputClass} h-24 resize-none`}
                />
                {field.error && (
                  <span className="text-xs text-red-600">
                    {field.error}
                  </span>
                )}
              </div>
            );
          }

          /* SELECT */
          if (field.type === "select") {
            return (
              <div key={field.name} className="flex flex-col gap-1">
                {field.label && !compact && (
                  <label className="text-sm font-medium text-gray-600">
                    {field.label}
                  </label>
                )}
                <select
                  value={field.value || ""}
                  disabled={field.disabled}
                  onChange={(e) => field.onChange(e.target.value)}
                  className={baseInputClass}
                >
                  <option value="">Select</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {field.error && (
                  <span className="text-xs text-red-600">
                    {field.error}
                  </span>
                )}
              </div>
            );
          }

          /* CHECKBOX */
          if (field.type === "checkbox") {
            return (
              <div key={field.name} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={!!field.value}
                  disabled={field.disabled}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="h-4 w-4 accent-blue-600"
                />
                <span className="text-sm text-gray-700">
                  {field.label}
                </span>
              </div>
            );
          }

          /* RADIO */
          if (field.type === "radio") {
            return (
              <div key={field.name} className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-600">
                  {field.label}
                </label>
                <div className="flex gap-4">
                  {field.options?.map((opt) => (
                    <label
                      key={opt.value}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <input
                        type="radio"
                        name={field.name}
                        checked={field.value === opt.value}
                        onChange={() => field.onChange(opt.value)}
                        className="accent-blue-600"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
            );
          }

          return null;
        })}

        {/* COMPACT MODE BUTTON */}
        {compact && onSubmit && (
          <button
            onClick={onSubmit}
            disabled={loading}
            className="h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm disabled:opacity-60"
          >
            {loading ? "Please wait..." : submitText}
          </button>
        )}
      </div>

      {/* ACTIONS (NORMAL MODE) */}
      {!compact && (
        <div className="flex justify-end gap-3 pt-2">
          {actions}
          {onSubmit && (
            <button
              onClick={onSubmit}
              disabled={loading}
              className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm disabled:opacity-60"
            >
              {loading ? "Please wait..." : submitText}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default GenericForm;
