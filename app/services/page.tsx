export default function ServicesPage() {
  return (
    <div className="flex flex-col bg-[#111827] min-h-screen">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Services</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Services content would go here */}
          <div className="bg-[#171C2C] rounded-lg p-6 h-40"></div>
          <div className="bg-[#171C2C] rounded-lg p-6 h-40"></div>
          <div className="bg-[#171C2C] rounded-lg p-6 h-40"></div>
        </div>
      </div>
    </div>
  )
}
