const tabs = [
  "Car Management",
  "Package Management",
  "Service Package",
  "Payment",
  "Reports",
];

function Navbar({ activeTab, setActiveTab, user, onLogout }) {
  return (
    <nav className="bg-blue-700 text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <h1 className="text-lg font-bold">SmartPark CWSMS</h1>
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`rounded-md px-3 py-1 text-sm ${
                activeTab === tab ? "bg-white text-blue-700" : "bg-blue-600 hover:bg-blue-500"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">{user?.fullName || user?.email}</span>
          <button
            type="button"
            className="rounded bg-red-500 px-4 py-1 text-sm hover:bg-red-400"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
