import { useState } from 'react';
import { Eye, EyeOff, Phone, Lock, ArrowRight } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { authApi } from '../services/api';

export function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ phone: '', password: '', general: '' });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuthStore();

  const validate = () => {
    const newErrors = { phone: '', password: '', general: '' };
    
    if (!phone) {
      newErrors.phone = '请输入手机号';
    } else if (!/^1[3-9]\d{9}$/.test(phone)) {
      newErrors.phone = '请输入有效的手机号';
    }
    
    if (!password) {
      newErrors.password = '请输入密码';
    } else if (password.length < 6) {
      newErrors.password = '密码长度不能少于6位';
    }
    
    setErrors(newErrors);
    return !newErrors.phone && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      setLoading(true);
      setErrors((prev) => ({ ...prev, general: '' }));
      
      try {
        const response = await authApi.login({ phone, password });
        const { user, token, refreshToken } = response.data;
        login(user, token, refreshToken);
        navigate('/');
      } catch (error) {
        setErrors((prev) => ({ ...prev, general: (error as Error).message }));
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">优</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">欢迎来到新泰优聘</h1>
            <p className="text-gray-500 mt-2">登录您的账号，开启职业之旅</p>
          </div>

          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="tel"
              label="手机号"
              placeholder="请输入手机号"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={errors.phone}
              icon={<Phone className="w-5 h-5" />}
            />
            
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                label="密码"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                icon={<Lock className="w-5 h-5" />}
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-10 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" className="rounded border-gray-300 text-primary-500" />
                记住我
              </label>
              <a href="#" className="text-sm text-primary-500 hover:text-primary-600">
                忘记密码？
              </a>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? '登录中...' : <><span>登录</span> <ArrowRight className="w-5 h-5 ml-2" /></>}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500">
              还没有账号？{' '}
              <a href="/register" className="text-primary-500 hover:text-primary-600 font-medium">
                立即注册
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}