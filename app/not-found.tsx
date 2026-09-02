import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#f4f7fd] px-4 text-center dark:bg-[#20212c]">
      <h1 className="text-2xl font-bold text-[#000112] dark:text-white">
        Page not found
      </h1>

      <p className="mt-3 text-sm font-medium text-[#828fa3]">
        The page you are looking for does not exist.
      </p>

      <Link
        href="/"
        className="mt-6 rounded-full bg-[#635fc7] px-5 py-3 text-xs font-bold text-white transition-colors hover:bg-[#a8a4ff]"
      >
        Go to Home Board
      </Link>
    </main>
  );
}