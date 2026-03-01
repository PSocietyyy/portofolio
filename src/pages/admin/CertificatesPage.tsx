import { useState, useEffect } from "react";
import { Award, Plus, Pencil, Trash2, X, Upload, Loader2 } from "lucide-react";
import supabase from "../../../utils/supabase";
import StorageImage from "../../components/StorageImage";

interface Certificate {
  id: string;
  title: string;
  issuer: string | null;
  date: string | null;
  image_url: string | null;
  sort_order: number;
}

const CertificatesPage = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [date, setDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    const { data } = await supabase
      .from("certificates")
      .select("*")
      .order("sort_order", { ascending: true });
    setCertificates(data || []);
    setLoading(false);
  };

  const openAddModal = () => {
    setEditingCert(null);
    setTitle("");
    setIssuer("");
    setDate("");
    setImageUrl("");
    setImagePreview(null);
    setSortOrder(certificates.length);
    setModalOpen(true);
  };

  const openEditModal = (cert: Certificate) => {
    setEditingCert(cert);
    setTitle(cert.title);
    setIssuer(cert.issuer || "");
    setDate(cert.date || "");
    setImageUrl(cert.image_url || "");
    setImagePreview(null);
    setSortOrder(cert.sort_order);
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `certificates/${Date.now()}.${ext}`;
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
    const payload = {
      title,
      issuer: issuer || null,
      date: date || null,
      image_url: imageUrl || null,
      sort_order: sortOrder,
    };
    if (editingCert) {
      await supabase
        .from("certificates")
        .update(payload)
        .eq("id", editingCert.id);
    } else {
      await supabase.from("certificates").insert(payload);
    }
    setSaving(false);
    setModalOpen(false);
    fetchCertificates();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from("certificates").delete().eq("id", deleteId);
    setDeleteId(null);
    fetchCertificates();
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
            <Award className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Certificates</h1>
            <p className="text-sm text-gray-500">
              Kelola sertifikat ({certificates.length})
            </p>
          </div>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/25"
        >
          <Plus size={18} />
          <span>Tambah Sertifikat</span>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="bg-gray-900 border border-gray-800/50 rounded-2xl overflow-hidden hover:border-gray-700/50 transition-all group"
          >
            {/* Image */}
            <div className="relative h-44 bg-gray-800 overflow-hidden">
              {cert.image_url ? (
                <StorageImage
                  path={cert.image_url}
                  alt={cert.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  fallback={
                    <div className="w-full h-full flex items-center justify-center">
                      <Award size={32} className="text-gray-700" />
                    </div>
                  }
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Award size={32} className="text-gray-700" />
                </div>
              )}
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEditModal(cert)}
                  className="p-2 bg-gray-900/80 backdrop-blur-sm text-indigo-400 hover:bg-indigo-500/20 rounded-lg transition-all"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setDeleteId(cert.id)}
                  className="p-2 bg-gray-900/80 backdrop-blur-sm text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-lg font-semibold text-white mb-2">
                {cert.title}
              </h3>
              <div className="space-y-1">
                {cert.issuer && (
                  <p className="text-sm text-gray-400">
                    <span className="text-gray-500">Penerbit: </span>
                    {cert.issuer}
                  </p>
                )}
                {cert.date && (
                  <p className="text-sm text-gray-400">
                    <span className="text-gray-500">Tahun: </span>
                    {cert.date}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
        {certificates.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-12">
            Belum ada sertifikat. Klik "Tambah Sertifikat" untuk menambahkan.
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
          <div className="relative bg-gray-900 border border-gray-800/50 rounded-2xl w-full max-w-md p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingCert ? "Edit Sertifikat" : "Tambah Sertifikat"}
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
                  Judul Sertifikat *
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
                  Penerbit
                </label>
                <input
                  type="text"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  placeholder="e.g. Linux Foundation"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tahun
                </label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="e.g. 2024"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Gambar Sertifikat
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
              Hapus Sertifikat?
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

export default CertificatesPage;
