import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useEffect } from 'react';

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const colors = {
  success: 'bg-green-500/10 border-green-500 text-green-400',
  error: 'bg-red-500/10 border-red-500 text-red-400',
  info: 'bg-blue-500/10 border-blue-500 text-blue-400',
  warning: 'bg-yellow-500/10 border-yellow-500 text-yellow-400',
};

function Toast({ message, type = 'info', onClose, duration = 3000 }) {
  const Icon = icons[type];

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border backdrop-blur-sm ${colors[type]} shadow-lg min-w-[320px] max-w-md animate-slide-in-right`}
    >
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="text-current hover:opacity-70 transition-opacity shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default Toast;
