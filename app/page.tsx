import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-greyCustom">
      <h1 className="text-4xl font-bold text-blackCustom mb-8">
        Dummy JSON App
      </h1>
      <div className="space-x-4">
        <Link
          href="/users"
          className="px-4 py-2 bg-blueCustom text-white rounded"
        >
          Users
        </Link>
        <Link
          href="/products"
          className="px-4 py-2 bg-yellowCustom text-blackCustom rounded"
        >
          Products
        </Link>
      </div>
    </div>
  );
}
