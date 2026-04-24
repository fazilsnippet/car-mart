export default function ChatWindow({ conversation, onBack }) {
  return (
    <div className="h-full flex flex-col">
      
      {/* HEADER */}
    <div className="p-3 font-semibold border-b flex items-center gap-3">

  {/* BACK BUTTON */}
  <button
    onClick={onBack}
    className="md:hidden flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-black"
  >
    ←
  </button>

  {/* TITLE */}
  <span className="truncate">
    {conversation.car?.title || "Conversation"}
  </span>
</div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-3">
        {/* your messages */}
      </div>

      {/* INPUT */}
      <div className="p-3 border-t">
        {/* your input */}
      </div>
    </div>
  );
}