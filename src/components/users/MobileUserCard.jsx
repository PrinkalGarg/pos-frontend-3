const MobileUserCard = ({ user, onApprove, onReject, onBlock }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-medium text-gray-900 truncate">{user.name}</h3>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
            user.isActive
              ? "bg-green-50 text-green-700"
              : "bg-gray-50 text-gray-600"
          }`}>
            <span className={`mr-1 h-1.5 w-1.5 rounded-full ${
              user.isActive ? "bg-green-500" : "bg-gray-400"
            }`}></span>
            {user.isActive ? "ACTIVE" : "INACTIVE"}
          </span>
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
            {user.role}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {!user.isActive ? (
          <>
            <button
              onClick={() => onApprove(user)}
              className="flex-1 min-w-30 inline-flex items-center justify-center rounded-lg bg-green-500 px-3 py-2 text-xs font-medium text-white hover:bg-green-600 transition-colors"
            >
              <svg className="mr-2 h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Approve
            </button>
            <button
              onClick={() => onReject(user.id)}
              className="flex-1 min-w-30 inline-flex items-center justify-center rounded-lg bg-gray-400 px-3 py-2 text-xs font-medium text-white hover:bg-gray-500 transition-colors"
            >
              <svg className="mr-2 h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reject
            </button>
          </>
        ) : (
          <button
            onClick={() => onBlock(user.id)}
            className="flex-1 inline-flex items-center justify-center rounded-lg bg-red-500 px-3 py-2 text-xs font-medium text-white hover:bg-red-600 transition-colors"
          >
            <svg className="mr-2 h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            Block
          </button>
        )}
      </div>
    </div>
  );
};

export default MobileUserCard;