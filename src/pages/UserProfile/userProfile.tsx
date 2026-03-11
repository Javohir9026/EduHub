import { DefaultUserIcon, TeacherIcon } from "@/assets/exportImg";
import { UserEditModal } from "@/components/common/User/UserEditModal";
import { useUser } from "@/context/UserContext";
import { useState } from "react";
import { Eye, Download, X } from "lucide-react";
import { BreadcrumbBasic } from "@/components/common/BreadCrumb";

const UserProfile = () => {
  const { userData, loading } = useUser();
  const [openImage, setOpenImage] = useState(false);
  const role = localStorage.getItem("role");

  let imageSrc = DefaultUserIcon;

  if (userData && role === "center" && "image" in userData && userData.image) {
    imageSrc = userData.image;
  } else {
    imageSrc = TeacherIcon;
  }
  const isBlocked =
    userData && "is_blocked" in userData ? userData.is_blocked : false;
  const handleDownload = async () => {
    try {
      if (!imageSrc) return;

      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "profile-image.jpg";
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight">Shaxsiy Profil</h1>

        <BreadcrumbBasic
          items={[
            { title: "Bosh sahifa", href: "/" },
            { title: "Shaxsiy Profil", href: "/user-profile" },
          ]}
        />
      </div>

      {loading ? (
        <div className="bg-white dark:bg-fullbg rounded-xl p-6 shadow-sm animate-pulse flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="flex flex-col gap-2">
                <div className="w-40 h-5 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="w-28 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>

            <div className="w-28 h-9 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* PROFILE CARD */}
          <div className="bg-white dark:bg-fullbg rounded-xl shadow-md border border-black/5 dark:border-white/10 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 hover:shadow-lg transition">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              {/* AVATAR */}
              {imageSrc ? (
                <div
                  onClick={() => setOpenImage(true)}
                  className="relative w-20 h-20 rounded-full p-[2px] bg-gradient-to-tr from-blue-500 to-indigo-500 cursor-pointer"
                >
                  <div className="rounded-full overflow-hidden w-full h-full bg-white dark:bg-black group">
                    <img
                      src={imageSrc}
                      alt="avatar"
                      className="object-cover w-full h-full"
                    />

                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-full">
                      <Eye className="text-white" size={22} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full overflow-hidden border">
                  <img
                    src={DefaultUserIcon}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div>
                <h2 className="text-xl font-semibold">{userData?.name}</h2>
                <p className="text-sm text-gray-500">{userData?.phone}</p>
              </div>
            </div>
            {role === "center" && (
              <UserEditModal classname="border border-black/20 dark:border-white/20 flex items-center justify-center rounded-lg py-2 px-4 gap-2 hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer" />
            )}
          </div>

          {/* INFO CARD */}
          <div className="bg-white dark:bg-fullbg rounded-xl shadow-md border border-black/5 dark:border-white/10 p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Shaxsiy Ma'lumotlar</h2>
              {role === "center" && (
                <UserEditModal classname="hidden sm:flex border border-black/20 dark:border-white/20 rounded-lg py-2 px-4 gap-2 hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer" />
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Info label="Nomi" value={userData?.name} />
              <Info label="Email" value={userData?.email} />
              <Info label="Telefon" value={userData?.phone} />
              <Info label="Login" value={userData?.login} />

              <Info
                label="Role"
                value={
                  role == "center"
                    ? "Ta'lim Markazi"
                    : role == "teacher"
                      ? "Ustoz"
                      : userData?.role
                }
              />

              {role === "center" && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>

                  <span
                    className={`px-3 py-1 dark:bg-slate-800 rounded-full text-xs font-medium ${
                      isBlocked
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {isBlocked ? "Bloklangan" : "Aktiv"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* IMAGE MODAL */}
      {openImage && imageSrc && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-50">
          <div className="relative max-w-[90%] max-h-[90%]">
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                onClick={handleDownload}
                className="bg-white/90 p-2 dark:bg-slate-800 rounded-full hover:bg-white cursor-pointer"
              >
                <Download size={20} />
              </button>

              <button
                onClick={() => setOpenImage(false)}
                className="bg-white/90 p-2 rounded-full dark:bg-slate-800  hover:bg-white cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <img
              src={imageSrc}
              alt="preview"
              className="max-w-[90vw] max-h-[90vh] rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

const Info = ({ label, value }: { label: string; value: any }) => (
  <div>
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

export default UserProfile;
