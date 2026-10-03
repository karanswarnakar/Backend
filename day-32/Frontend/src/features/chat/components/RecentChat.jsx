


const RecentChat = ({ title }) => {
  return (
    <button className="mb-1 flex w-full items-center gap-3 rounded-lg px-1 py-2 text-left text-xs text-zinc-400 hover:bg-white/5 hover:text-zinc-200">

      <MessageSquare size={15} />

      <span className="truncate">
        {title}
      </span>

    </button>
  );
};
export default RecentChat;