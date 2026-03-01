import { useState, useEffect } from "react";
import {
  MessageCircle,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Quote,
} from "lucide-react";
import supabase from "../../../utils/supabase";

interface Testimonial {
  id: string;
  name: string;
  project: string | null;
  message: string | null;
  sort_order: number;
}

const TestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form
  const [name, setName] = useState("");
  const [project, setProject] = useState("");
  const [message, setMessage] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true });
    setTestimonials(data || []);
    setLoading(false);
  };

  const openAddModal = () => {
    setEditingItem(null);
    setName("");
    setProject("");
    setMessage("");
    setSortOrder(testimonials.length);
    setModalOpen(true);
  };

  const openEditModal = (item: Testimonial) => {
    setEditingItem(item);
    setName(item.name);
    setProject(item.project || "");
    setMessage(item.message || "");
    setSortOrder(item.sort_order);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name,
      project: project || null,
      message: message || null,
      sort_order: sortOrder,
    };
    if (editingItem) {
      await supabase
        .from("testimonials")
        .update(payload)
        .eq("id", editingItem.id);
    } else {
      await supabase.from("testimonials").insert(payload);
    }
    setSaving(false);
    setModalOpen(false);
    fetchTestimonials();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from("testimonials").delete().eq("id", deleteId);
    setDeleteId(null);
    fetchTestimonials();
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
            <MessageCircle className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Testimonials</h1>
            <p className="text-sm text-gray-500">
              Kelola testimoni ({testimonials.length})
            </p>
          </div>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/25"
        >
          <Plus size={18} />
          <span>Tambah Testimoni</span>
        </button>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {testimonials.map((item) => (
          <div
            key={item.id}
            className="bg-gray-900 border border-gray-800/50 rounded-2xl p-6 hover:border-gray-700/50 transition-all group relative"
          >
            {/* Actions */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => openEditModal(item)}
                className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => setDeleteId(item.id)}
                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Quote icon */}
            <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4">
              <Quote size={18} className="text-indigo-400" />
            </div>

            {/* Message */}
            {item.message && (
              <p className="text-gray-300 leading-relaxed mb-4 italic text-sm">
                "{item.message}"
              </p>
            )}

            {/* Author */}
            <div className="border-t border-gray-800/50 pt-4">
              <h3 className="text-white font-semibold">{item.name}</h3>
              {item.project && (
                <p className="text-sm text-gray-500">{item.project}</p>
              )}
            </div>
          </div>
        ))}
        {testimonials.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-12">
            Belum ada testimoni. Klik "Tambah Testimoni" untuk menambahkan.
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
          <div className="relative bg-gray-900 border border-gray-800/50 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingItem ? "Edit Testimoni" : "Tambah Testimoni"}
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
                  Nama Klien *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nama Project
                </label>
                <input
                  type="text"
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  placeholder="e.g. E-Commerce Website"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Pesan Testimoni
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
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
              Hapus Testimoni?
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

export default TestimonialsPage;
