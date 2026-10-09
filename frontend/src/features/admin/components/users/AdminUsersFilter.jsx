import React, { memo } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

const roleOptions = ["All", "Admin", "User"];

const AdminUsersFilter = ({ search, setSearch, roleFilter, setRoleFilter }) => {
  return (
    <div
      className="
        bg-white/70 backdrop-blur-xl
        border border-gray-100
        rounded-[24px]
        p-5
        shadow-[0_25px_80px_rgba(0,0,0,0.05)]
      "
    >
      <div className="flex flex-col xl:flex-row xl:items-center gap-4 ">
        <div className="relative flex-1 group">
          <div
            className="
              absolute inset-0
              rounded-2xl
              bg-[linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0)_34%)]
              pointer-events-none 
            "
          />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`
              relative z-10
              h-12
              w-full
              rounded-lg
              border
              ${
                search.trim()
                  ? "border-black/[0.08] bg-black/[0.03]"
                  : "border-black/[0.045] bg-white/[0.92]"
              }
              pl-11
              pr-4
              text-base
              sm:text-sm
              font-medium
              tracking-[-0.01em]
              text-black/80
              placeholder:text-black/40
              outline-none
              shadow-[0_2px_16px_rgba(0,0,0,0.04)]
              transition-all
              duration-150
              [transition-timing-function:cubic-bezier(.22,1,.36,1)]
              hover-supported:hover:border-black/[0.08]
              hover-supported:hover:bg-white
              focus:border-black/[0.08]
              focus:bg-white
              focus:shadow-[0_8px_40px_rgba(0,0,0,0.05)]
            `}
          />

          <span
            className={`
                  absolute left-4 top-1/2
                  z-20
                  -translate-y-1/2
                  transition-colors
                  duration-150
    
                  ${
                    search.trim()
                      ? "text-black/55"
                      : "text-black/30 group-focus-within:text-black/50"
                  }
                `}
          >
            <Search size={16} strokeWidth={2} />
          </span>
        </div>

        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger
            className={`
                         group
                         h-12
                         w-full sm:w-[190px]
                         rounded-lg
                         border
                         shrink-0
                         ${
                           roleFilter !== "All"
                             ? "border-black/[0.08] bg-black/[0.03]"
                             : "border-black/[0.045] bg-white/[0.92]"
                         }
                        px-4
              text-base sm:text-sm
              font-medium
              tracking-[-0.01em]
              text-black/80
               shadow-[0_2px_16px_rgba(0,0,0,0.04)]
              transition-all
              duration-150
              hover-supported:hover:border-black/[0.08]
              hover-supported:hover:bg-white
              focus:border-black/[0.08]
              focus:bg-white
              data-[state=open]:bg-white
              data-[state=open]:border-black/[0.08]
                       `}
          >
            <SelectValue />
          </SelectTrigger>

          <SelectContent
            className="
                        overflow-hidden
              rounded-lg
              border border-black/[0.05]
              bg-white/[0.92]
              backdrop-blur-2xl
              p-1.5
              shadow-[0_20px_60px_rgba(0,0,0,0.08)]
               animate-in fade-in-0 zoom-in-95 duration-150
                       "
          >
            {roleOptions.map((role) => (
              <SelectItem
                key={role}
                value={role}
                className="
                                h-12
            rounded-lg
            px-3
            text-base sm:text-sm
            font-medium
            tracking-[-0.01em]
            text-black/75
            transition-all
            duration-150
            hover-supported:hover:translate-x-[2px]
            hover-supported:hover:bg-black/[0.035]
            hover-supported:hover:text-black/90
            focus:translate-x-[2px]
            focus:bg-black/[0.035]
            focus:text-black/90
            data-[state=checked]:bg-black/[0.92]
            data-[state=checked]:text-white
            data-[state=checked]:hover:translate-x-0
            data-[state=checked]:focus:translate-x-0
            data-[state=checked]:hover:bg-black/[0.92]
            data-[state=checked]:focus:bg-black/[0.92]
            data-[state=checked]:hover:text-white
            data-[state=checked]:focus:text-white
            cursor-pointer
                           "
              >
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default memo(AdminUsersFilter);
