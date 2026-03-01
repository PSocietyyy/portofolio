import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Code,
  Briefcase,
  Award,
  MessageCircle,
  TrendingUp,
} from "lucide-react";
import supabase from "../../../utils/supabase";

interface Stats {
  skills: number;
  projects: number;
  certificates: number;
  testimonials: number;
}

const DashboardPage = () => {
  const [stats, setStats] = useState<Stats>({
    skills: 0,
    projects: 0,
    certificates: 0,
    testimonials: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [skills, projects, certificates, testimonials] = await Promise.all([
        supabase.from("skills").select("id", { count: "exact", head: true }),
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase
          .from("certificates")
          .select("id", { count: "exact", head: true }),
        supabase
          .from("testimonials")
          .select("id", { count: "exact", head: true }),
      ]);

      setStats({
        skills: skills.count ?? 0,
        projects: projects.count ?? 0,
        certificates: certificates.count ?? 0,
        testimonials: testimonials.count ?? 0,
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  const cards = [
    {
      label: "Total Skills",
      value: stats.skills,
      icon: Code,
      color: "from-indigo-500 to-indigo-600",
      bgLight: "bg-indigo-500/10",
      textColor: "text-indigo-400",
    },
    {
      label: "Total Projects",
      value: stats.projects,
      icon: Briefcase,
      color: "from-emerald-500 to-emerald-600",
      bgLight: "bg-emerald-500/10",
      textColor: "text-emerald-400",
    },
    {
      label: "Total Certificates",
      value: stats.certificates,
      icon: Award,
      color: "from-amber-500 to-amber-600",
      bgLight: "bg-amber-500/10",
      textColor: "text-amber-400",
    },
    {
      label: "Total Testimonials",
      value: stats.testimonials,
      icon: MessageCircle,
      color: "from-rose-500 to-rose-600",
      bgLight: "bg-rose-500/10",
      textColor: "text-rose-400",
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-indigo-500/15 rounded-xl flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-sm text-gray-500">Overview portfolio data</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map(({ label, value, icon: Icon, bgLight, textColor }) => (
          <div
            key={label}
            className="bg-gray-900 border border-gray-800/50 rounded-2xl p-6 hover:border-gray-700/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 ${bgLight} rounded-xl flex items-center justify-center`}
              >
                <Icon className={`w-6 h-6 ${textColor}`} />
              </div>
              <TrendingUp className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              {loading ? (
                <div className="h-9 w-16 bg-gray-800 rounded-lg animate-pulse" />
              ) : (
                <p className="text-3xl font-bold text-white">{value}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Info */}
      <div className="mt-8 bg-gray-900 border border-gray-800/50 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Selamat Datang 👋
        </h2>
        <p className="text-gray-400 leading-relaxed">
          Gunakan panel admin ini untuk mengelola semua data portfolio Anda.
          Anda bisa menambah, mengedit, dan menghapus data Skills, Projects,
          Certificates, Testimonials, serta mengatur Profile Anda melalui menu
          sidebar di sebelah kiri.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
