import { MoreHorizontal } from "lucide-react";

const SidebarChat = ({ icon, title }) => {
  return (
    <button className="group flex w-full items-center justify-between rounded-lg px-2 py-2.5 text-left hover:bg-white/5">

      <div className="flex items-center gap-3">

        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs text-zinc-300">
          {icon}
        </div>

        <span className="text-sm text-zinc-300">
          {title}
        </span>

      </div>

      <MoreHorizontal
        size={16}
        className="text-zinc-600 opacity-0 group-hover:opacity-100"
      />

    </button>
  );
};
export default SidebarChat
