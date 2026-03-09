import { useState } from "react";

type Role = "center" | "teacher";

interface RoleOption {
  label: string;
  value: Role;
}

interface RoleSwitcherProps {
  onChange?: (role: Role) => void;
}

const roles: RoleOption[] = [
  { label: "O'quv Markaz", value: "center" },
  { label: "O'qituvchi", value: "teacher" },
];

export default function RoleSwitcher({ onChange }: RoleSwitcherProps) {
  const [selected, setSelected] = useState<Role>("center");

  const handleSelect = (role: Role) => {
    setSelected(role);
    onChange?.(role); // parentga yuboradi
  };

  return (
    <div className="inline-flex w-full rounded-xl bg-gray-100 p-1 gap-1 shadow-inner">
      {roles.map(({ label, value }) => {
        const isActive = selected === value;

        return (
          <button
            key={value}
            onClick={() => handleSelect(value)}
            className={`
              px-1 sm:px-6 py-2.5 cursor-pointer rounded-lg text-sm font-semibold
              transition-all duration-200 ease-in-out
              focus:outline-none focus-visible:ring-2 w-full focus-visible:ring-blue-400
              ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
            `}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
