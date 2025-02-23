import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#ebebeb]">
      <div className="max-w-2xl w-full p-8 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold text-[#322625] mb-6">
          Welcome to the Dashboard
        </h1>
        
        <p className="text-lg text-[#322625] mb-8">
          Explore and manage your users and products with our comprehensive dashboard.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/users"
            className="p-6 bg-[#c0e3e5] rounded-lg hover:bg-[#c0e3e5]/90 transition-colors"
          >
            <h2 className="text-2xl font-semibold text-[#322625] mb-2">Users</h2>
            <p className="text-[#322625]">
              Manage and view all user information
            </p>
          </Link>

          <Link
            href="/products"
            className="p-6 bg-[#fdc936] rounded-lg hover:bg-[#fdc936]/90 transition-colors"
          >
            <h2 className="text-2xl font-semibold text-[#322625] mb-2">Products</h2>
            <p className="text-[#322625]">
              Explore and manage product inventory
            </p>
          </Link>
        </div>

        <div className="mt-8 text-sm text-[#322625]">
          Built with Next.js, TypeScript, and Tailwind CSS
        </div>
      </div>
    </div>
  );
}