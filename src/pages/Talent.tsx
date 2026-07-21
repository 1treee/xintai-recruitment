import { useState } from 'react';
import { Search, Filter, Star, Briefcase, MapPin, Award, ArrowRight } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Tag } from '../components/common/Tag';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Sidebar } from '../components/layout/Sidebar';
import { generateAvatar } from '../utils/helpers';
import { User } from '../types';

const mockTalents: User[] = [
  { id: 1, nickname: '张伟', avatar: '', jobTitle: '前端开发工程师', company: '新泰科技', location: '青云街道', experience: '3年', education: '本科', tags: ['React', 'TypeScript', 'Node.js'], points: 2580 },
  { id: 2, nickname: '李娜', avatar: '', jobTitle: 'UI设计师', company: '泰安设计', location: '新汶街道', experience: '5年', education: '本科', tags: ['Figma', 'Sketch', '交互设计'], points: 3200 },
  { id: 3, nickname: '王强', avatar: '', jobTitle: '后端开发工程师', company: '山东软件', location: '西张庄镇', experience: '4年', education: '硕士', tags: ['Java', 'Spring Boot', 'MySQL'], points: 2890 },
  { id: 4, nickname: '刘芳', avatar: '', jobTitle: '产品经理', company: '新泰电商', location: '青云街道', experience: '6年', education: '本科', tags: ['需求分析', '项目管理', '数据分析'], points: 3500 },
];

export function Talent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = ['React', 'TypeScript', 'Java', 'UI设计', '产品经理', 'Python'];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredTalents = mockTalents.filter((talent) => {
    const matchesSearch =
      talent.nickname.includes(searchQuery) ||
      talent.jobTitle.includes(searchQuery) ||
      talent.tags.some((tag) => tag.includes(searchQuery));
    const matchesTags =
      selectedTags.length === 0 ||
      talent.tags.some((tag) => selectedTags.includes(tag));
    return matchesSearch && matchesTags;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar activeSection="/talent" />
        
        <main className="flex-1 pb-20 md:min-h-screen">
          <div className="bg-white border-b border-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">新泰人才库</h1>
              <p className="text-sm sm:text-base text-gray-500">发现新泰本地优秀人才，助力企业发展</p>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder="搜索人才、技能、职位..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="w-full sm:w-auto">
                <Filter className="w-4 h-4 mr-2" />
                筛选
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredTalents.map((talent) => (
                <Card key={talent.id} className="p-4 sm:p-5">
                  <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <img
                      src={talent.avatar || generateAvatar(talent.nickname)}
                      alt={talent.nickname}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-1">{talent.nickname}</h3>
                      <p className="text-primary-500 font-medium text-sm">{talent.jobTitle}</p>
                      <p className="text-xs sm:text-sm text-gray-500 line-clamp-1">{talent.company}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 sm:w-4 sm:h-4" />{talent.location}</span>
                    <span className="flex items-center gap-1"><Briefcase className="w-3 h-3 sm:w-4 sm:h-4" />{talent.experience}</span>
                    <span className="flex items-center gap-1"><Award className="w-3 h-3 sm:w-4 sm:h-4" />{talent.education}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                    {talent.tags.map((tag, index) => (
                      <Tag key={index} size="sm">{tag}</Tag>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                      <span className="text-xs sm:text-sm font-medium">{talent.points}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      查看详情 <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {filteredTalents.length === 0 && (
              <div className="text-center py-12 sm:py-16">
                <Search className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                <p className="text-sm sm:text-base text-gray-500">暂无匹配的人才</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}