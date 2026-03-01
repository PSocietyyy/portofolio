import { useState, useEffect } from "react";
import { User, Save, Upload, Loader2, CheckCircle } from "lucide-react";
import supabase from "../../../utils/supabase";
import StorageImage from "../../components/StorageImage";

interface Profile {
  id?: string;
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

const emptyProfile: Profile = {
  full_name: "",
  tagline: "",
  bio: "",
  about_title: "",
  about_paragraph_1: "",
  about_paragraph_2: "",
  experience: "",
  status: "",
  email: "",
  github: "",
  instagram: "",
  profile_image_url: "",
  about_image_url: "",
};

const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingAbout, setUploadingAbout] = useState(false);
  // Local blob URLs for instant preview (bypass CORS)
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [aboutPreview, setAboutPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .limit(1)
      .single();
    if (data) setProfile(data);
    setLoading(false);
  };

  const uploadImage = async (
    file: File,
    folder: string,
  ): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("portfolio")
      .upload(fileName, file, { upsert: true });

    if (error) {
      alert("Gagal upload gambar: " + error.message);
      return null;
    }

    const { data } = supabase.storage.from("portfolio").getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleProfileImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Instant local preview
    setProfilePreview(URL.createObjectURL(file));
    setUploadingProfile(true);
    const url = await uploadImage(file, "profile");
    if (url) setProfile((p) => ({ ...p, profile_image_url: url }));
    setUploadingProfile(false);
  };

  const handleAboutImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Instant local preview
    setAboutPreview(URL.createObjectURL(file));
    setUploadingAbout(true);
    const url = await uploadImage(file, "about");
    if (url) setProfile((p) => ({ ...p, about_image_url: url }));
    setUploadingAbout(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const { id, ...data } = profile;

    if (id) {
      await supabase
        .from("profiles")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", id);
    } else {
      await supabase.from("profiles").insert(data);
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    fetchProfile();
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
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-indigo-500/15 rounded-xl flex items-center justify-center">
          <User className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          <p className="text-sm text-gray-500">Kelola data profil portfolio</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Images */}
        <div className="bg-gray-900 border border-gray-800/50 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Foto</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Profile Image */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Foto Profil
              </label>
              {(profilePreview || profile.profile_image_url) && (
                <StorageImage
                  path={profilePreview || profile.profile_image_url}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-2 border-indigo-500/30 mb-4"
                />
              )}
              <label className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700/50 text-gray-300 rounded-xl cursor-pointer transition-all w-fit">
                {uploadingProfile ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Upload size={18} />
                )}
                <span className="text-sm">
                  {uploadingProfile ? "Mengupload..." : "Upload Foto"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* About Image */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Foto About
              </label>
              {(aboutPreview || profile.about_image_url) && (
                <StorageImage
                  path={aboutPreview || profile.about_image_url}
                  alt="About"
                  className="w-full max-w-xs h-32 rounded-xl object-cover border-2 border-indigo-500/30 mb-4"
                />
              )}
              <label className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700/50 text-gray-300 rounded-xl cursor-pointer transition-all w-fit">
                {uploadingAbout ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Upload size={18} />
                )}
                <span className="text-sm">
                  {uploadingAbout ? "Mengupload..." : "Upload Foto"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAboutImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-gray-900 border border-gray-800/50 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">
            Informasi Dasar
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={profile.full_name}
                onChange={(e) =>
                  setProfile({ ...profile, full_name: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tagline
              </label>
              <input
                type="text"
                value={profile.tagline || ""}
                onChange={(e) =>
                  setProfile({ ...profile, tagline: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Pengalaman
              </label>
              <input
                type="text"
                value={profile.experience || ""}
                onChange={(e) =>
                  setProfile({ ...profile, experience: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <input
                type="text"
                value={profile.status || ""}
                onChange={(e) =>
                  setProfile({ ...profile, status: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Bio & About */}
        <div className="bg-gray-900 border border-gray-800/50 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">
            Bio & Tentang
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Bio (Hero Section)
              </label>
              <textarea
                value={profile.bio || ""}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Judul About
              </label>
              <input
                type="text"
                value={profile.about_title || ""}
                onChange={(e) =>
                  setProfile({ ...profile, about_title: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Paragraf About 1
              </label>
              <textarea
                value={profile.about_paragraph_1 || ""}
                onChange={(e) =>
                  setProfile({ ...profile, about_paragraph_1: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Paragraf About 2
              </label>
              <textarea
                value={profile.about_paragraph_2 || ""}
                onChange={(e) =>
                  setProfile({ ...profile, about_paragraph_2: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Contact Links */}
        <div className="bg-gray-900 border border-gray-800/50 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">
            Kontak & Sosial Media
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={profile.email || ""}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                GitHub URL
              </label>
              <input
                type="url"
                value={profile.github || ""}
                onChange={(e) =>
                  setProfile({ ...profile, github: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Instagram URL
              </label>
              <input
                type="url"
                value={profile.instagram || ""}
                onChange={(e) =>
                  setProfile({ ...profile, instagram: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/50 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/25"
          >
            {saving ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Save size={20} />
            )}
            <span>{saving ? "Menyimpan..." : "Simpan Perubahan"}</span>
          </button>
          {saved && (
            <div className="flex items-center gap-2 text-emerald-400 text-sm">
              <CheckCircle size={18} />
              <span>Berhasil disimpan!</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
