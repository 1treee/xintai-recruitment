import { Users, Briefcase, Video, MessageCircle, TrendingUp, Sparkles, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Tag } from '../components/common/Tag';
import { Button } from '../components/common/Button';
import { useNavigate } from 'react-router-dom';

export function Home() {
  const navigate = useNavigate();

  const stats = [
    { icon: Users, label: '优秀人才', value: '3,200+', color: 'text-primary-500' },
    { icon: Briefcase, label: '优质岗位', value: '500+', color: 'text-secondary-500' },
    { icon: Video, label: '职场视频', value: '800+', color: 'text-purple-500' },
    { icon: MessageCircle, label: '职友讨论', value: '12,000+', color: 'text-green-500' },
  ];

  const quickLinks = [
    { path: '/talent', title: '新泰人才库', desc: '发现本地优秀人才', icon: Users, color: 'from-primary-500 to-primary-600' },
    { path: '/jobs', title: '新泰好工作', desc: '本地优质岗位推荐', icon: Briefcase, color: 'from-secondary-500 to-secondary-600' },
    { path: '/entertainment', title: '新泰职场圈', desc: '职场生活精彩内容', icon: Video, color: 'from-purple-500 to-purple-600' },
    { path: '/forum', title: '新泰职友说', desc: '求职经验交流分享', icon: MessageCircle, color: 'from-green-500 to-green-600' },
  ];

  const hotJobs = [
    { id: 1, title: '前端开发工程师', company: '新泰科技有限公司', salary: '8k-12k', location: '青云街道', tags: ['经验不限', '五险一金'] },
    { id: 2, title: '销售经理', company: '泰安商贸集团', salary: '6k-15k', location: '新汶街道', tags: ['3年经验', '提成丰厚'] },
    { id: 3, title: '行政专员', company: '新泰市政府', salary: '4k-6k', location: '市府路', tags: ['1年经验', '周末双休'] },
  ];

  return (
    <div className="pb-20">
      <section className="bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">找工作，交朋友</h1>
            <p className="text-xl text-white/80 mb-8">发现新泰好工作，开启职业新篇章</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="搜索岗位、企业、人才..."
                  className="w-full px-6 py-4 rounded-full text-gray-800 focus:outline-none focus:ring-4 focus:ring-white/30"
                />
              </div>
              <Button size="lg" className="rounded-full">
                搜索
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className={`inline-flex p-3 rounded-full bg-gray-100 ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800 mt-3">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800">探索新泰职业社区</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <Card key={index} onClick={() => navigate(link.path)} className="p-6">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{link.title}</h3>
                  <p className="text-sm text-gray-500">{link.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800">热门岗位推荐</h2>
            <button onClick={() => navigate('/jobs')} className="text-primary-500 hover:text-primary-600 flex items-center gap-1">
              查看更多 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {hotJobs.map((job) => (
              <Card key={job.id} onClick={() => navigate(`/jobs/${job.id}`)} className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
                  <span className="text-primary-500 font-bold">{job.salary}</span>
                </div>
                <p className="text-gray-600 mb-3">{job.company}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag, index) => (
                    <Tag key={index} variant="secondary">{tag}</Tag>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-r from-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Sparkles className="w-12 h-12 text-primary-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">加入新泰优聘人才社区</h2>
            <p className="text-gray-600 mb-8">汇聚新泰本地优秀人才与优质企业，打造最具活力的职业生活社区</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/register')}>
                立即注册
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/talent')}>
                浏览人才
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}