import { redirect } from "next/navigation";
import getCurrentUser from "@/lib/getCurrentUser";

export default async function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) redirect("/auth/login");

  if (!user.isPremium) {
    // redirect user to pay screen or show a locked notice
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center p-10">
        <h1 className="text-2xl font-semibold mb-4 text-white">Report is a Premium Feature</h1>
        <p className="text-gray-600 mb-6">Upgrade to unlock analytics and download reports.</p>

        <a
          href={`/upgrade`}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Upgrade Now
        </a>
      </div>
    );
  }

  return <>{children}</>;
}
