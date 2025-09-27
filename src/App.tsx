import React, { useState, useEffect } from "react";
import {
  Home,
  User,
  Code,
  Briefcase,
  Mail,
  Github,
  ExternalLink,
  ChevronDown,
  Menu,
  X,
  Linkedin,
  Twitter,
  Instagram,
  Download,
  Phone,
  Award,
} from "lucide-react";

// Import
import ProfilePicture from "./assets/profile-picture.jpeg";
import AboutMe from "./assets/aboutme.jpg";
import ECommerce from "./assets/project-ecommerce-editor-product.jpg";
import Marketplace from "./assets/project-marketplace.jpg";
import RecomendationFilm from "./assets/project-rekomendation-film.jpg";

// Sertifikat
import SertifLinuxFundamental from "./assets/linux-fundamental.jpg";
import SertifCybrary from "./assets/cybrary-security.jpg";
import SertifLinuxKernel from "./assets/sertif-linux-kernel.jpg";

// Skill
import SkillGithub from "./assets/skills/Github.jpg";
import SkillJavascript from "./assets/skills/JavaScript.jpg";
import SkillTypeScript from "./assets/skills/TypeScript.png";
import SkillReactJS from "./assets/skills/React.jpg";
import SkillTailwind from "./assets/skills/TailwindCss.png";
import SkillPHP from "./assets/skills/PHP.png";
import SkillMysql from "./assets/skills/MySql.png";
import SkillLinux from "./assets/skills/Linux.png";
import SkillLaravel from "./assets/skills/Laravel.png";
import SkillPython from "./assets/skills/Python.png";
import SkillScikitLearn from "./assets/skills/Scikit-learn.png";
import SkillTensorFlow from "./assets/skills/TensorFlow.png";

const App = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const skills = [
    { name: "PHP", image: SkillPHP },
    { name: "JavaScript", image: SkillJavascript },
    { name: "TypeScript", image: SkillTypeScript },
    { name: "Python", image: SkillPython },
    { name: "TailwindCSS", image: SkillTailwind },
    { name: "MySQL", image: SkillMysql },
    { name: "Laravel", image: SkillLaravel },
    { name: "React", image: SkillReactJS },
    { name: "Linux", image: SkillLinux },
    { name: "GitHub", image: SkillGithub },
    { name: "Scikit-Learn", image: SkillScikitLearn },
    { name: "TensorFlow", image: SkillTensorFlow },
  ];

  const certificates = [
    {
      id: 1,
      title: "Linux Fundamental",
      issuer: "Aguna Course",
      date: "2024",
      image: SertifLinuxFundamental,
    },
    {
      id: 2,
      title: "Defensif Security Operation",
      issuer: "Cybrary",
      date: "2024",
      image: SertifCybrary,
    },
    {
      id: 3,
      title: "Linux Kernel Development",
      issuer: "Linux Foundation",
      date: "2024",
      image: SertifLinuxKernel,
    },
  ];

  const projects = [
    {
      id: 1,
      title: "E-Commerce Editor Product",
      description:
        "Platform e-commerce dengan fitur editor produk yang memungkinkan seller untuk mengedit detail produk secara real-time",
      image: ECommerce,
      tags: ["React", "Laravel", "MySQL"],
    },
    {
      id: 2,
      title: "Marketplace Platform",
      description:
        "Platform marketplace multi-vendor dengan sistem pembayaran terintegrasi dan manajemen inventori",
      image: Marketplace,
      github: "https://github.com/PSocietyyy/marketplace",
      tags: ["PHP", "Laravel", "MySQL"],
    },
    {
      id: 3,
      title: "Film Recommendation System",
      description:
        "Sistem rekomendasi film menggunakan machine learning untuk memberikan saran film berdasarkan film yang sedang ditonton",
      image: RecomendationFilm,
      github: "https://github.com/PSocietyyy/recomendation_film",
      tags: ["Python", "Scikit-Learn"],
    },
  ];

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

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-bold text-blue-600">Ferdiansyah</div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {[
                { id: "home", label: "Home", icon: Home },
                { id: "about", label: "About", icon: User },
                { id: "skills", label: "Skills", icon: Code },
                { id: "projects", label: "Projects", icon: Briefcase },
                { id: "certificates", label: "Certificates", icon: Award },
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
            {/* Content - Left Side */}
            <div className="text-center md:text-left order-2 md:order-1">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-blue-600">
                Ferdiansyah Pratama
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-6">
                Freelancer Web Developer & Machine Learning Enthusiast
              </p>

              <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                Saya menyukai tantangan dalam problem solving dan menulis kode
                yang rapi serta terstruktur. Saya menciptakan solusi digital
                inovatif melalui pengembangan web dan machine learning.
              </p>

              <div className="flex justify-start mb-8">
                <button
                  onClick={() => scrollToSection("projects")}
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
                >
                  Lihat Projek Saya
                </button>
              </div>
            </div>

            {/* Image - Right Side */}
            <div className="flex justify-center order-1 md:order-2">
              <img
                src={ProfilePicture}
                alt="Ferdiansyah Pratama"
                className="w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-blue-500 shadow-xl object-cover"
              />
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
              <img
                src={AboutMe}
                alt="About Ferdiansyah"
                className="rounded-lg shadow-xl"
              />
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-blue-600">
                Halo! Saya Ferdiansyah, mahasiswa yang passionate dengan
                teknologi
              </h3>

              <p className="text-gray-600 leading-relaxed">
                Saya adalah mahasiswa Pendidikan Teknik Informatika yang aktif
                sebagai freelancer dengan pengalaman lebih dari 1 tahun. Saya
                memiliki passion khusus dalam problem solving dan selalu
                berusaha menulis kode yang rapi, terstruktur, dan mudah
                dipelihara.
              </p>

              <p className="text-gray-600 leading-relaxed">
                Sebagai seseorang yang menyukai tantangan, saya selalu antusias
                menghadapi masalah-masalah kompleks dalam pengembangan aplikasi
                web modern. Ketika tidak sedang coding, saya aktif belajar
                teknologi baru.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-6">
                <div>
                  <h4 className="font-semibold text-blue-600 mb-2">
                    Pengalaman
                  </h4>
                  <p className="text-gray-500">1+ Tahun Freelancer</p>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-600 mb-2">Status</h4>
                  <p className="text-gray-500">Mahasiswa Aktif</p>
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
            {skills.map((skill, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <img
                  src={skill.image}
                  alt={skill.name}
                  className="w-16 h-16 mx-auto mb-4 object-contain"
                />
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
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-blue-600">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex space-x-3">
                    {project.github ? (
                      <a
                        href={project.github}
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
                  <img
                    src={certificate.image}
                    alt={certificate.title}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
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

            <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <a
                href="mailto:ferdiansyahpratama716@gmail.com"
                className="flex flex-col items-center p-6 bg-gray-50 rounded-lg hover:bg-blue-50 hover:shadow-md transition-all group"
              >
                <Mail
                  className="text-blue-600 group-hover:text-blue-700 mb-4"
                  size={32}
                />
                <h4 className="font-semibold text-gray-800 mb-2">Email</h4>
                <span className="text-gray-600 text-sm text-center">
                  ferdiansyahpratama716@gmail.com
                </span>
              </a>

              <a
                href="https://github.com/PSocietyyy"
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
                  PSocietyyy
                </span>
              </a>

              <a
                href="https://instagram.com/ferdiansyah_p69"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-6 bg-gray-50 rounded-lg hover:bg-blue-50 hover:shadow-md transition-all group"
              >
                <Instagram
                  className="text-blue-600 group-hover:text-blue-700 mb-4"
                  size={32}
                />
                <h4 className="font-semibold text-gray-800 mb-2">Instagram</h4>
                <span className="text-gray-600 text-sm text-center">
                  @ferdiansyah_p69
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500">
            © 2025 Ferdiansyah Pratama. All rights reserved. Dibangun dengan
            React & TailwindCSS
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
