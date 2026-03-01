import { useState, useEffect } from "react";
import {
  Home,
  User,
  Code,
  Briefcase,
  Mail,
  Github,
  Menu,
  X,
  Instagram,
  Award,
  MessageCircle,
} from "lucide-react";
import supabase from "../utils/supabase";
import StorageImage from "./components/StorageImage";

interface Profile {
  full_name: string;
  tagline: string;
  bio: string;
  about_title: string;
  about_paragraph_1: string;
  about_paragraph_2: string;
  experience: string;
  status: string;
  email: string;
  github: string;
  instagram: string;
  profile_image_url: string;
  about_image_url: string;
}

interface Skill {
  id: string;
  name: string;
  image_url: string | null;
}

interface Project {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  github_url: string | null;
  tags: string[];
}

interface Certificate {
  id: string;
  title: string;
  issuer: string | null;
  date: string | null;
  image_url: string | null;
}

interface Testimonial {
  id: string;
  name: string;
  project: string | null;
  message: string | null;
}

const App = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [profileRes, skillsRes, projectsRes, certsRes, testimonialsRes] =
        await Promise.all([
          supabase.from("profiles").select("*").limit(1).single(),
          supabase.from("skills").select("*").order("sort_order"),
          supabase.from("projects").select("*").order("sort_order"),
          supabase.from("certificates").select("*").order("sort_order"),
          supabase.from("testimonials").select("*").order("sort_order"),
        ]);

      if (profileRes.data) setProfile(profileRes.data);
      setSkills(skillsRes.data || []);
      setProjects(projectsRes.data || []);
      setCertificates(certsRes.data || []);
      setTestimonials(testimonialsRes.data || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsMenuOpen(false);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "home",
        "about",
        "skills",
        "certificates",
        "projects",
        "testimonials",
        "contact",
      ];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500">Memuat portfolio...</p>
        </div>
      </div>
    );
  }

  const displayName = profile?.full_name || "Portfolio";
  const displayEmail = profile?.email || "";
  const displayGithub = profile?.github || "";
  const displayInstagram = profile?.instagram || "";
  const githubUsername = displayGithub.replace("https://github.com/", "");
  const instagramUsername = displayInstagram
    .replace("https://instagram.com/", "")
    .replace("https://www.instagram.com/", "");

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-bold text-blue-600">
              {displayName.split(" ")[0]}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {[
                { id: "home", label: "Home", icon: Home },
                { id: "about", label: "About", icon: User },
                { id: "skills", label: "Skills", icon: Code },
                { id: "projects", label: "Projects", icon: Briefcase },
                { id: "certificates", label: "Certificates", icon: Award },
                {
                  id: "testimonials",
                  label: "Testimonials",
                  icon: MessageCircle,
                },
                { id: "contact", label: "Contact", icon: Mail },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                    activeSection === id
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              {[
                { id: "home", label: "Home", icon: Home },
                { id: "about", label: "About", icon: User },
                { id: "skills", label: "Skills", icon: Code },
                { id: "projects", label: "Projects", icon: Briefcase },
                { id: "certificates", label: "Certificates", icon: Award },
                {
                  id: "testimonials",
                  label: "Testimonials",
                  icon: MessageCircle,
                },
                { id: "contact", label: "Contact", icon: Mail },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className="flex items-center space-x-3 w-full px-3 py-3 text-left rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-all"
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Home Section */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-center px-4 pt-20"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left order-2 md:order-1">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-blue-600">
                {displayName}
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-6">
                {profile?.tagline || ""}
              </p>

              <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                {profile?.bio || ""}
              </p>

              <div className="flex w-full justify-center md:justify-start mb-8">
                <button
                  onClick={() => scrollToSection("projects")}
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
                >
                  Lihat Projek Saya
                </button>
              </div>
            </div>

            <div className="flex justify-center order-1 md:order-2">
              {profile?.profile_image_url ? (
                <StorageImage
                  path={profile.profile_image_url}
                  alt={displayName}
                  className="w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-blue-500 shadow-xl object-cover"
                />
              ) : (
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-blue-500 shadow-xl bg-gray-100 flex items-center justify-center">
                  <User size={64} className="text-gray-400" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-blue-600">
            Tentang Saya
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              {profile?.about_image_url ? (
                <StorageImage
                  path={profile.about_image_url}
                  alt="About"
                  className="rounded-lg shadow-xl"
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 rounded-lg shadow-xl flex items-center justify-center">
                  <User size={48} className="text-gray-400" />
                </div>
              )}
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-blue-600">
                {profile?.about_title || ""}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {profile?.about_paragraph_1 || ""}
              </p>

              <p className="text-gray-600 leading-relaxed">
                {profile?.about_paragraph_2 || ""}
              </p>

              <div className="grid grid-cols-2 gap-6 pt-6">
                <div>
                  <h4 className="font-semibold text-blue-600 mb-2">
                    Pengalaman
                  </h4>
                  <p className="text-gray-500">{profile?.experience || ""}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-600 mb-2">Status</h4>
                  <p className="text-gray-500">{profile?.status || ""}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-blue-600">
            Keahlian
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                {skill.image_url ? (
                  <StorageImage
                    path={skill.image_url}
                    alt={skill.name}
                    className="w-16 h-16 mx-auto mb-4 object-contain"
                  />
                ) : (
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Code size={24} className="text-gray-400" />
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-700">
                  {skill.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-blue-600">
            Projek
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all overflow-hidden"
              >
                <div className="relative overflow-hidden">
                  {project.image_url ? (
                    <StorageImage
                      path={project.image_url}
                      alt={project.title}
                      className="w-full h-48 object-contain md:object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                      <Briefcase size={32} className="text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-blue-600">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex space-x-3">
                    {project.github_url ? (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all flex-1 justify-center"
                      >
                        <Github size={18} />
                        <span>Lihat Kode</span>
                      </a>
                    ) : (
                      <button className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all flex-1 justify-center">
                        <p className="font-medium">Repository Private</p>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificates Section */}
      <section id="certificates" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-blue-600">
            Sertifikat
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificates.map((certificate) => (
              <div
                key={certificate.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all overflow-hidden"
              >
                <div className="relative overflow-hidden">
                  {certificate.image_url ? (
                    <StorageImage
                      path={certificate.image_url}
                      alt={certificate.title}
                      className="w-full h-48 object-contain md:object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                      <Award size={32} className="text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-blue-600">
                    {certificate.title}
                  </h3>
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-600">
                      <span className="font-medium">Penerbit:</span>{" "}
                      {certificate.issuer}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Tahun:</span>{" "}
                      {certificate.date}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-blue-600">
            Testimoni
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-8 border-l-4 border-blue-600"
              >
                <MessageCircle className="text-blue-600 mb-4" size={32} />

                <p className="text-gray-600 leading-relaxed mb-6 italic">
                  "{testimonial.message}"
                </p>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-semibold text-blue-600 mb-1">
                    {testimonial.name}
                  </h3>
                  <p className="text-gray-500 text-sm">{testimonial.project}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-blue-600">
            Mari Berkolaborasi
          </h2>

          <div className="bg-white rounded-2xl shadow-lg p-12">
            <h3 className="text-2xl font-semibold mb-6 text-blue-600">
              Hubungi Saya
            </h3>
            <p className="text-gray-600 mb-12 leading-relaxed text-lg max-w-2xl mx-auto">
              Saya selalu terbuka untuk diskusi tentang proyek menarik,
              tantangan problem solving yang kompleks, atau sekadar berbagi
              pengalaman seputar clean code dan arsitektur software. Mari
              berkolaborasi!
            </p>

            <div className="grid md:grid-cols-3 gap-8 justify-center max-w-3xl mx-auto">
              {displayEmail && (
                <a
                  href={`mailto:${displayEmail}`}
                  className="flex flex-col items-center p-6 bg-gray-50 rounded-lg hover:bg-blue-50 hover:shadow-md transition-all group"
                >
                  <Mail
                    className="text-blue-600 group-hover:text-blue-700 mb-4"
                    size={32}
                  />
                  <h4 className="font-semibold text-gray-800 mb-2">Email</h4>
                  <span className="text-gray-600 text-sm text-center">
                    {displayEmail}
                  </span>
                </a>
              )}

              {displayGithub && (
                <a
                  href={displayGithub}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center p-6 bg-gray-50 rounded-lg hover:bg-blue-50 hover:shadow-md transition-all group"
                >
                  <Github
                    className="text-blue-600 group-hover:text-blue-700 mb-4"
                    size={32}
                  />
                  <h4 className="font-semibold text-gray-800 mb-2">GitHub</h4>
                  <span className="text-gray-600 text-sm text-center">
                    {githubUsername}
                  </span>
                </a>
              )}

              {displayInstagram && (
                <a
                  href={displayInstagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center p-6 bg-gray-50 rounded-lg hover:bg-blue-50 hover:shadow-md transition-all group"
                >
                  <Instagram
                    className="text-blue-600 group-hover:text-blue-700 mb-4"
                    size={32}
                  />
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Instagram
                  </h4>
                  <span className="text-gray-600 text-sm text-center">
                    @{instagramUsername}
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500">
            © 2025 {displayName}. All rights reserved. Dibangun dengan React &
            TailwindCSS
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
