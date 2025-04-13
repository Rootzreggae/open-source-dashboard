import { PollersList } from "@/components/pollers/pollers-list"

export default function PollersPage() {
  return (
    <div className="flex flex-col bg-[#111827] min-h-screen">
      <div className="p-6 w-full">
        <div className="w-full mb-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <h1 className="text-2xl font-bold text-white">Pollers</h1>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search pollers or services..."
                  className="w-64 rounded-md border border-[#252A3D] bg-[#171C2C] py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <select className="rounded-md border border-[#252A3D] bg-[#171C2C] px-4 py-2 text-white">
                <option>All Status</option>
                <option>Healthy</option>
                <option>Degraded</option>
                <option>Critical</option>
              </select>
            </div>
          </div>
        </div>
        <PollersList />
      </div>
    </div>
  )
}
