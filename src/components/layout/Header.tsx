import { useState } from 'react';
import { User, Search, Bell, MapPin, Menu, X } from 'lucide-react';
import useAuthStore from '../../stores/authStore';
import { Button } from '../common/Button';
import { useNavigate } from 'react-router-dom';
import { generateAvatar } from '../../utils/helpers';

export function Header() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">优</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-800">新泰优聘</h1>
              <p className="text-xs text-gray-500">人才社区</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-8">
            <Search className="w-5 h-5 text-gray-400 absolute left-3" />
            <input
              type="text"
              placeholder="搜索岗位、企业、人才..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-2 text-gray-600 hover:text-primary-500 transition-colors"
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search className="w-5 h-5" />
            </button>
            
            <button className="relative p-2 text-gray-600 hover:text-primary-500 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-800">{user.nickname}</p>
                  <p className="text-xs text-gray-500">{user.points}积分</p>
                </div>
                <div className="relative">
                  <img
                    src={user.avatar || generateAvatar(user.nickname)}
                    alt={user.nickname}
                    className="w-9 h-9 rounded-full object-cover cursor-pointer"
                    onClick={() => navigate('/user/profile')}
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
              </div>
            ) : (
              <>
                <div className="hidden sm:flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                    登录
                  </Button>
                  <Button size="sm" onClick={() => navigate('/register')}>
                    注册
                  </Button>
                </div>
                <button 
                  className="sm:hidden p-2 text-gray-600"
                  onClick={() => navigate('/login')}
                >
                  <User className="w-6 h-6" />
                </button>
              </>
            )}

            <button 
              className="md:hidden p-2 text-gray-600"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {showSearch && (
          <div className="md:hidden pb-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索岗位、企业、人才..."
                className="w-full pl-10 pr-4 py-3 bg-gray-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                autoFocus
              />
            </div>
          </div>
        )}

        {showMobileMenu && (
          <div className="md:hidden pb-4 border-t border-gray-100 pt-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-gray-600 py-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">新泰市</span>
              </div>
              {!user && (
                <>
                  <Button variant="outline" className="w-full" onClick={() => { navigate('/login'); setShowMobileMenu(false); }}>
                    登录
                  </Button>
                  <Button className="w-full" onClick={() => { navigate('/register'); setShowMobileMenu(false); }}>
                    注册
                  </Button>
                </>
              )}
              {user && (
                <Button variant="outline" className="w-full" onClick={() => { logout(); setShowMobileMenu(false); }}>
                  退出登录
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}