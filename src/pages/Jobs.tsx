import { useState } from 'react';
import { Search, Filter, MapPin, Clock, Briefcase, Award, Heart, ArrowRight } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Tag } from '../components/common/Tag';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Sidebar } from '../components/layout/Sidebar';
import { Job } from '../types';

const mockJobs: Job[] = [
  { id: 1, title: '前端开发工程师', company: '新泰科技有限公司', salary: '8k-12k', location: '青云街道', experience: '经验不限', education: '本科', tags: ['React', 'TypeScript', '五险一金'], views: 234, createdAt: '2026-03-15' },
  { id: 2, title: '销售经理', company: '泰安商贸集团', salary: '6k-15k', location: '新汶街道', experience: '3年经验', education: '大专', tags: ['销售', '提成丰厚', '出差'], views: 567, createdAt: '2026-03-14' },
  { id: 3, title: '行政专员', company: '新泰市政府', salary: '4k-6k', location: '市府路', experience: '1年经验', education: '本科', tags: ['行政', '周末双休', '五险一金'], views: 890, createdAt: '2026-03-13' },
  { id: 4, title: '后端开发工程师', company: '山东软件', salary: '10k-15k', location: '青云街道', experience: '3年经验', education: '本科', tags: ['Java', 'Spring Boot', 'MySQL'], views: 456, createdAt: '2026-03-12' },
  { id: 5, title: 'UI设计师', company: '泰安设计工作室', salary: '6k-10k', location: '新汶街道', experience: '2年经验', education: '大专', tags: ['Figma', 'Sketch', '交互设计'], views: 321, createdAt: '2026-03-11' },
  { id: 6, title: '运营专员', company: '新泰电商平台', salary: '4k-7k', location: '青云街道', experience: '1年经验', education: '本科', tags: ['运营', '数据分析', '活动策划'], views: 678, createdAt: '2026-03-10' },
];

export function Jobs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [salaryRange, setSalaryRange] = useState('');

  const allTags = ['React', 'Java', '销售', '行政', 'UI设计', '运营', '五险一金', '周末双休'];
  const salaryRanges = ['3k以下', '3k-5k', '5k-8k', '8k-12k', '12k以上'];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredJobs = mockJobs.filter((job) => {
    const matchesSearch =
      job.title.includes(searchQuery) ||
      job.company.includes(searchQuery) ||
      job.tags.some((tag) => tag.includes(searchQuery));
    const matchesTags =
      selectedTags.length === 0 ||
      job.tags.some((tag) => selectedTags.includes(tag));
    return matchesSearch && matchesTags;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar activeSection="/jobs" />
        
        <main className="flex-1 pb-20 md:min-h-screen">
          <div className="bg-white border-b border-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">新泰好工作</h1>
              <p className="text-sm sm:text-base text-gray-500">海量本地优质岗位，助你找到心仪工作</p>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder="搜索岗位、企业..."
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

            <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
              {salaryRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => setSalaryRange(salaryRange === range ? '' : range)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                    salaryRange === range
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {range}
                </button>
              ))}
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

            <div className="space-y-3 sm:space-y-4">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-1">{job.title}</h3>
                        <span className="text-primary-500 font-bold text-base sm:text-lg whitespace-nowrap">{job.salary}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{job.company}</p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3 sm:w-4 sm:h-4" />{job.location}</span>
                        <span className="flex items-center gap-1"><Briefcase className="w-3 h-3 sm:w-4 sm:h-4" />{job.experience}</span>
                        <span className="flex items-center gap-1"><Award className="w-3 h-3 sm:w-4 sm:h-4" />{job.education}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3 sm:w-4 sm:h-4" />{job.createdAt}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {job.tags.map((tag, index) => (
                          <Tag key={index} variant="secondary" size="sm">{tag}</Tag>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-0 sm:ml-4 sm:pl-4 sm:border-l sm:border-gray-100">
                      <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <Heart className="w-5 h-5" />
                      </button>
                      <Button size="sm" className="w-full sm:w-auto">
                        立即投递 <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <div className="text-center py-12 sm:py-16">
                <Search className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                <p className="text-sm sm:text-base text-gray-500">暂无匹配的岗位</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}