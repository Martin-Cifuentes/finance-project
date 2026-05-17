type Props = {
  alertMsg: { title: string; type: 'warning' | 'danger' } | null;
  onClose: () => void;
};

export default function AlertToast({ alertMsg, onClose }: Props) {
  if (!alertMsg) return null;

  return (
    <div className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-md animate-bounce flex items-center gap-3 ${alertMsg.type === 'danger' ? 'bg-red-500/20 border-red-500/50 text-red-100' : 'bg-amber-500/20 border-amber-500/50 text-amber-100'}`}>
      <svg className={`w-6 h-6 ${alertMsg.type === 'danger' ? 'text-red-400' : 'text-amber-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
      <span className="font-medium">{alertMsg.title}</span>
      <button onClick={onClose} className="ml-4 opacity-70 hover:opacity-100">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
  );
}
