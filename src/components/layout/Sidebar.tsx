import { Users, Briefcase, Video, MessageCircle, User, FileText, History, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  activeSection?: string;
}

export function Sidebar({ activeSection }: SidebarProps) {
  const navigate = useNavigate();

  const menuItems = [
    { path: '/talent', label: '新泰人才库', icon: Users },
    { path: '/jobs', label: '新泰好工作', icon: Briefcase },
    { path: '/entertainment', label: '新泰职场圈', icon: Video },
    { path: '/forum', label: '新泰职友说', icon: MessageCircle },
  ];

  const userMenuItems = [
    { path: '/user/profile', label: '个人资料', icon: User },
    { path: '/user/resume', label: '简历管理', icon: FileText },
    { path: '/user/jobs', label: '求职记录', icon: History },
    { path: '/user/points', label: '积分商城', icon: Gift },
  ];

  return (
    <aside className="hidden md:block w-64 bg-white border-r border-gray-100 h-[calc(100vh-64px)] sticky top-16">
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">功能导航</h3>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary-50 text-primary-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-8">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">个人中心</h3>
          <nav className="space-y-1">
            {userMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-primary-50 text-primary-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}