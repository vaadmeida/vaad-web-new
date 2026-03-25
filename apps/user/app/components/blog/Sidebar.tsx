import Image from "next/image";

export default function Sidebar() {
  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <input
          type="text"
          placeholder="Type to search..."
          className="w-full border rounded-md px-3 py-2 text-sm outline-none"
        />
      </div>

      {/* Categories */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h4 className="font-semibold text-sm mb-3">Blog Categories</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>Visibility (15)</li>
          <li>Locations & Visibility (08)</li>
          <li>News & Updates (20)</li>
          <li>Campaigns (07)</li>
        </ul>
      </div>

      {/* Recent Posts */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h4 className="font-semibold text-sm mb-3">Recent Posts</h4>

        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 mb-3">
            <div className="relative w-14 h-14">
              <Image
                src="https://www.digitalstrike.com/wp-content/uploads/2018/02/Benefits-of-Blogging-cover-image-1.png"
                alt=""
                fill
                className="object-cover rounded"
                unoptimized
              />
            </div>
            <div className="text-xs">
              <p className="font-medium text-gray-700">
                Don’t Count on Friends
              </p>
              <span className="text-gray-400">July 10, 2025</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tags */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h4 className="font-semibold text-sm mb-3">Tags</h4>
        <div className="flex flex-wrap gap-2">
          {["News", "Campaigns", "Visibility", "Security"].map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1 border rounded-md text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}