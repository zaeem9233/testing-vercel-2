import useAuth from "@/utils/useAuth";

export default function LogoutPage() {
  const { signOut } = useAuth();
  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 dark:bg-[#1E1E1E] p-4">
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-[#262626] p-8 shadow-2xl dark:shadow-none dark:ring-1 dark:ring-gray-700">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
          Sign Out
        </h1>

        <button
          onClick={handleSignOut}
          className="w-full py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 active:bg-black dark:active:bg-white transition-colors font-jetbrains-mono"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
