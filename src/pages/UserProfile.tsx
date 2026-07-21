import { useState } from 'react';
import { User, Mail, MapPin, Briefcase, Award, Star, Edit, Save } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Sidebar } from '../components/layout/Sidebar';
import { generateAvatar } from '../utils/helpers';
import useAuthStore from '../stores/authStore';

export function UserProfile() {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(user || {
    id: 1,
    nickname: '用户昵称',
    email: 'user@example.com',
    avatar: '',
    jobTitle: '前端开发工程师',
    company: '新泰科技',
    location: '青云街道',
    experience: '3年',
    education: '本科',
    tags: ['React', 'TypeScript', 'Node.js'],
    points: 2580,
  });

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar activeSection="/user/profile" />
        
        <main className="flex-1 pb-20 md:min-h-screen">
          <div className="bg-white border-b border-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">个人资料</h1>
              <p className="text-sm sm:text-base text-gray-500">管理您的个人信息</p>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <Card className="p-4 sm:p-6">
              <div className="flex flex-col gap-4 sm:gap-8">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <img
                      src={profile.avatar || generateAvatar(profile.nickname)}
                      alt={profile.nickname}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
                    />
                    <button className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 bg-primary-500 rounded-full flex items-center justify-center text-white">
                      <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800 mt-3 sm:mt-4">{profile.nickname}</h2>
                  <div className="flex items-center gap-1 text-yellow-500 mt-1">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                    <span className="text-xs sm:text-sm font-medium">{profile.points}积分</span>
                  </div>
                </div>

                <div className="flex-1 w-full">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">基本信息</h3>
                    {isEditing ? (
                      <Button size="sm">
                        <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        保存
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm">
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        编辑
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        昵称
                      </label>
                      {isEditing ? (
                        <Input
                          value={profile.nickname}
                          onChange={(e) => setProfile({ ...profile, nickname: e.target.value })}
                        />
                      ) : (
                        <p className="text-gray-800 text-sm">{profile.nickname}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        邮箱
                      </label>
                      {isEditing ? (
                        <Input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        />
                      ) : (
                        <p className="text-gray-800 text-sm">{profile.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        职位
                      </label>
                      {isEditing ? (
                        <Input
                          value={profile.jobTitle}
                          onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })}
                        />
                      ) : (
                        <p className="text-gray-800 text-sm">{profile.jobTitle}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        公司
                      </label>
                      {isEditing ? (
                        <Input
                          value={profile.company}
                          onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                        />
                      ) : (
                        <p className="text-gray-800 text-sm">{profile.company}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        所在地区
                      </label>
                      {isEditing ? (
                        <Input
                          value={profile.location}
                          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        />
                      ) : (
                        <p className="text-gray-800 text-sm">{profile.location}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        工作经验
                      </label>
                      {isEditing ? (
                        <Input
                          value={profile.experience}
                          onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                        />
                      ) : (
                        <p className="text-gray-800 text-sm">{profile.experience}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        学历
                      </label>
                      {isEditing ? (
                        <Input
                          value={profile.education}
                          onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                        />
                      ) : (
                        <p className="text-gray-800 text-sm">{profile.education}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-6">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      技能标签
                    </label>
                    {isEditing ? (
                      <Input
                        value={profile.tags.join(', ')}
                        onChange={(e) => setProfile({ ...profile, tags: e.target.value.split(', ') })}
                      />
                    ) : (
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {profile.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2.5 sm:px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-xs sm:text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}