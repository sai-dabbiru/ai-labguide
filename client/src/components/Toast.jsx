import { useApp } from '../context/AppContext.jsx';

export default function Toast() {
  const { toast } = useApp();
  return (
    <div className={`toast ${toast.visible ? 'show' : ''}`}>
      {toast.xp && <span className="t-xp">{toast.xp}</span>}
      <span>{toast.msg}</span>
    </div>
  );
}
