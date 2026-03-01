import { useState, useEffect } from "react";
import {
  Briefcase,
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  Loader2,
  Github,
  ExternalLink,
} from "lucide-react";
import supabase from "../../../utils/supabase";
import StorageImage from "../../components/StorageImage";

interface Project {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  github_url: string | null;
  tags: string[];
  sort_order: number;
}

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [githubUrl, setGithubUrl] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });
    setProjects(data || []);
    setLoading(false);
  };

  const openAddModal = () => {
    setEditingProject(null);
    setTitle("");
    setDescription("");
    setImageUrl("");
    setImagePreview(null);
    setGithubUrl("");
    setTagsInput("");
    setSortOrder(projects.length);
    setModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setTitle(project.title);
    setDescription(project.description || "");
    setImageUrl(project.image_url || "");
    setImagePreview(null);
    setGithubUrl(project.github_url || "");
    setTagsInput(project.tags?.join(", ") || "");
    setSortOrder(project.sort_order);
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `projects/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("portfolio")
      .upload(fileName, file, { upsert: true });
    if (error) {
      alert("Gagal upload: " + error.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("portfolio").getPublicUrl(fileName);
    setImageUrl(data.publicUrl);
    setUploading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title,
      description: description || null,
      image_url: imageUrl || null,
      github_url: githubUrl || null,
      tags,
      sort_order: sortOrder,
    };

    if (editingProject) {
      await supabase
        .from("projects")
        .update(payload)
        .eq("id", editingProject.id);
    } else {
      await supabase.from("projects").insert(payload);
    }

    setSaving(false);
    setModalOpen(false);
    fetchProjects();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from("projects").delete().eq("id", deleteId);
    setDeleteId(null);
    fetchProjects();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500/15 rounded-xl flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Projects</h1>
            <p className="text-sm text-gray-500">
              Kelola projek ({projects.length})
            </p>
          </div>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/25"
        >
          <Plus size={18} />
          <span>Tambah Project</span>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-gray-900 border border-gray-800/50 rounded-2xl overflow-hidden hover:border-gray-700/50 transition-all group"
          >
            {/* Image */}
            <div className="relative h-44 bg-gray-800 overflow-hidden">
              {project.image_url ? (
                <StorageImage
                  path={project.image_url}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  fallback={
                    <div className="w-full h-full flex items-center justify-center">
                      <Briefcase size={32} className="text-gray-700" />
                    </div>
                  }
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Briefcase size={32} className="text-gray-700" />
                </div>
              )}
              {/* Actions overlay */}
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEditModal(project)}
                  className="p-2 bg-gray-900/80 backdrop-blur-sm text-indigo-400 hover:bg-indigo-500/20 rounded-lg transition-all"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setDeleteId(project.id)}
                  className="p-2 bg-gray-900/80 backdrop-blur-sm text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-lg font-semibold text-white mb-2">
                {project.title}
              </h3>
              {project.description && (
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                  {project.description}
                </p>
              )}
              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {project.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {/* GitHub link */}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-indigo-400 transition-colors"
                >
                  <Github size={14} />
                  <span>GitHub</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-12">
            Belum ada project. Klik "Tambah Project" untuk menambahkan.
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative bg-gray-900 border border-gray-800/50 rounded-2xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingProject ? "Edit Project" : "Tambah Project"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Judul Project *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Gambar
                </label>
                {(imagePreview || imageUrl) && (
                  <StorageImage
                    path={imagePreview || imageUrl}
                    alt="Preview"
                    className="w-full h-32 rounded-xl object-cover mb-3"
                  />
                )}
                <label className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700/50 text-gray-300 rounded-xl cursor-pointer transition-all w-fit">
                  {uploading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Upload size={18} />
                  )}
                  <span className="text-sm">
                    {uploading ? "Mengupload..." : "Upload Gambar"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tags (pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="React, Laravel, MySQL"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Urutan
                </label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-xl transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/50 text-white font-medium rounded-xl transition-all"
                >
                  {saving && <Loader2 size={18} className="animate-spin" />}
                  <span>{saving ? "Menyimpan..." : "Simpan"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleteId(null)}
          />
          <div className="relative bg-gray-900 border border-gray-800/50 rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-3">
              Hapus Project?
            </h2>
            <p className="text-gray-400 mb-6">
              Data yang dihapus tidak bisa dikembalikan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-xl transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-all"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
