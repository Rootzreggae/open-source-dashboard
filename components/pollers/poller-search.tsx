import { Search } from "lucide-react"

export function PollerSearch() {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      <input
        type="text"
        placeholder="Search pollers or services..."
        className="w-64 rounded-md border border-[#30374a] bg-[#0d1117] py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  )
}
