export function StatusFilter() {
  return (
    <select className="rounded-md border border-[#30374a] bg-[#1c2333] px-4 py-2 text-white">
      <option>All Status</option>
      <option>Healthy</option>
      <option>Degraded</option>
      <option>Critical</option>
    </select>
  )
}
