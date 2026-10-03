

const TableRow = ({ title, content }) => {
  return (
    <div className="grid grid-cols-[1fr_1.3fr] border-b border-white/10 last:border-b-0">

      <div className="border-r border-white/10 p-4 text-sm font-medium leading-6 text-zinc-200">
        {title}
      </div>

      <div className="space-y-1 p-4 text-sm leading-6 text-zinc-300">
        {content}
      </div>

    </div>
  );
};
export default TableRow