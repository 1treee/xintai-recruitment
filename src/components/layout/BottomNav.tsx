import { Home, Users, Briefcase, Video, MessageCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface BottomNavProps {
  show?: boolean;
}

export function BottomNav({ show = true }: BottomNavProps) {
  const location = useLocation();
  const navigate = useNavigate();

  if (!show) return null;

  const navItems = [
    { path: '/', label: '首页', icon: Home },
    { path: '/talent', label: '人才库', icon: Users },
    { path: '/jobs', label: '好工作', icon: Briefcase },
    { path: '/entertainment', label: '职场圈', icon: Video },
    { path: '/forum', label: '职友说', icon: MessageCircle },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                active ? 'text-primary-500' : 'text-gray-400'
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 transition-transform ${active ? 'scale-110' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
              {active && (
                <span className="absolute bottom-0 w-8 h-1 bg-primary-500 rounded-t-full"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}