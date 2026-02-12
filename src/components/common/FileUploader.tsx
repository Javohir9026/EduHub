import { useRef } from "react";
import { X } from "lucide-react";

type Props = {
  value?: string | null;          
  onChange?: (file: File | null) => void;
};

const FileUploader = ({ value, onChange }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onChange?.(file);
  };

  const handleDelete = () => {
    if (inputRef.current) inputRef.current.value = "";
    onChange?.(null);
  };

  return (
    <div className="relative w-28 h-28">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleSelect}
      />

      <div
        onClick={() => inputRef.current?.click()}
        className="w-full h-full rounded-full border-2 border-dashed border-gray-300 
        flex items-center justify-center cursor-pointer overflow-hidden 
        bg-gray-50 hover:bg-gray-100 transition"
      >
        {value ? (
          <img src={value} className="w-full h-full object-cover" />
        ) : (
          <span className="text-sm text-gray-400 !font-semibold">Logotip</span>
        )}
      </div>

      {value && (
        <button
          onClick={handleDelete}
          className=" cursor-pointer absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default FileUploader;
