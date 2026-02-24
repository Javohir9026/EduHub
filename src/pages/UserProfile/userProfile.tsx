import { DefaultUserIcon } from "@/assets/exportImg";
import { UserEditModal } from "@/components/common/User/UserEditModal";
import { useUser } from "@/context/UserContext";
import { useState } from "react";
import { Eye, Download, X } from "lucide-react";

const userProfile = () => {
  const { userData, loading } = useUser();
  const [openImage, setOpenImage] = useState(false);

  const hasImage = !!userData?.image;

  const handleDownload = async () => {
    try {
      if (!hasImage) return;

      const response = await fetch(userData.image);
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
    <div className="flex flex-col gap-5">
      <h1 className="text-[20px] !font-semibold">Shaxsiy Profil</h1>
      {loading ? (
        <div className="bg-white dark:bg-fullbg rounded-lg p-5 flex flex-col gap-7 animate-pulse">
          <div
            className="border border-black/10 dark:border-white/10 p-4 rounded-lg 
      flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-center sm:text-left">
              <div className="rounded-full w-20 h-20 bg-gray-200 dark:bg-gray-700" />

              <div className="flex flex-col gap-2 items-center sm:items-start">
                <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>

            <div className="h-9 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>

          <div className="border border-black/10 dark:border-white/10 p-4 rounded-lg flex flex-col gap-5">
            <div className="flex justify-between">
              <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-9 w-28 bg-gray-200 dark:bg-gray-700 rounded hidden sm:block" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 w-full sm:w-1/2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-fullbg rounded-lg p-5 flex flex-col gap-7">
          <div
            className="border border-black/10 dark:border-white/10 p-4 rounded-lg 
flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-center sm:items-center text-center sm:text-left">
              {/* IMAGE */}
              {hasImage ? (
                <div
                  className="relative border bg-fullbg dark:bg-fullbg rounded-full w-20 h-20 overflow-hidden shrink-0 group cursor-pointer"
                  onClick={() => setOpenImage(true)}
                >
                  <img
                    src={userData?.image}
                    alt="logo"
                    className="object-cover w-full h-full"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <Eye className="text-white" size={22} />
                  </div>
                </div>
              ) : (
                <div className="border bg-fullbg dark:bg-fullbg rounded-full w-20 h-20 overflow-hidden shrink-0">
                  <img
                    src={DefaultUserIcon}
                    alt="logo"
                    className="object-cover w-full h-full"
                  />
                </div>
              )}

              <div>
                <h1 className="text-[20px] !font-semibold">{userData?.name}</h1>
                <h1 className="text-[14px] text-black/50 dark:text-white/50">
                  {userData?.phone}
                </h1>
              </div>
            </div>

            <div className="flex justify-center sm:justify-end">
              <UserEditModal classname="cursor-pointer border items-center justify-center border-black/20 dark:border-white/20 flex rounded-lg py-2 gap-2 hover:bg-black/10 dark:hover:bg-white/10 px-1 w-full sm:w-auto" />
            </div>
          </div>

          <div className="border border-black/10 dark:border-white/10 p-4 rounded-lg flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h1 className="text-[17px] !font-semibold">
                Shaxsiy Ma'lumotlar
              </h1>

              <UserEditModal classname="cursor-pointer border rounded-lg gap-2 items-center border-black/20 dark:border-white/20 py-2 px-1 hover:bg-black/10 dark:hover:bg-white/10 w-full sm:w-auto hidden sm:flex" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 w-full sm:w-1/2 gap-4">
              <div className="flex flex-col">
                <h1 className="text-[15px] text-black/50 dark:text-white/50">
                  Nomi
                </h1>
                <h1>{userData?.name}</h1>
              </div>

              <div className="flex flex-col">
                <h1 className="text-[15px] text-black/50 dark:text-white/50">
                  Email
                </h1>
                <h1>{userData?.email}</h1>
              </div>

              <div className="flex flex-col">
                <h1 className="text-[15px] text-black/50 dark:text-white/50">
                  Telefon Raqam
                </h1>
                <h1>{userData?.phone}</h1>
              </div>

              <div className="flex flex-col">
                <h1 className="text-[15px] text-black/50 dark:text-white/50">
                  Login
                </h1>
                <h1>{userData?.login}</h1>
              </div>

              <div className="flex flex-col">
                <h1 className="text-[15px] text-black/50 dark:text-white/50">
                  Role
                </h1>
                <h1>
                  {userData?.role == "LEARNING_CENTER"
                    ? "Ta'lim Markazi"
                    : userData?.role == "TEACHER"
                      ? "Ustoz"
                      : userData?.role}
                </h1>
              </div>

              <div className="flex flex-col">
                <h1 className="text-[15px] text-black/50 dark:text-white/50">
                  Status
                </h1>
                <h1
                  className={
                    userData?.is_blocked ? "text-red-500" : "text-green-500"
                  }
                >
                  {userData?.is_blocked ? "Bloklangan" : "Aktiv"}
                </h1>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE MODAL */}
      {openImage && hasImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="relative max-w-[90%] max-h-[90%]">
            {/* BUTTONLAR */}
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                onClick={handleDownload}
                className=" cursor-pointer bg-white/90 backdrop-blur p-2 rounded-full hover:bg-white dark:bg-blue-900"
              >
                <Download size={20} />
              </button>

              <button
                onClick={() => setOpenImage(false)}
                className=" cursor-pointer bg-white/90 backdrop-blur p-2 rounded-full hover:bg-white dark:bg-blue-900"
              >
                <X size={20} />
              </button>
            </div>

            <img
              src={userData?.image}
              alt="preview"
              className="max-w-[90vw] max-h-[90vh] rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default userProfile;
