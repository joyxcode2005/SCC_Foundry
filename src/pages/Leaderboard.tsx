export default function Leaderboard() {
    return (
        <div className="flex flex-col space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
                <p className="text-gray-500">View top performing students.</p>
            </div>

            {/* Page content goes here */}
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                <p>Leaderboard data will load here...</p>
            </div>
        </div>
    )
}