import { useState } from 'react';
import { Search, MessageCircle, Heart, Share2, Clock, Tag, Plus } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Sidebar } from '../components/layout/Sidebar';
import { generateAvatar } from '../utils/helpers';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  likes: number;
  comments: number;
  views: number;
  createdAt: string;
  tags: string[];
}

const mockPosts: Post[] = [
  { id: 1, title: '在新泰找工作，这些坑千万别踩！', content: '作为一个在新泰工作了5年的老油条，给大家分享一下找工作时需要注意的一些坑...', author: '职场老司机', likes: 234, comments: 56, views: 1234, createdAt: '2026-03-15', tags: ['求职经验', '避坑指南'] },
  { id: 2, title: '新泰哪个公司待遇比较好？求推荐', content: '刚从外地回来，想在新泰找个稳定的工作，有没有推荐的公司？薪资待遇怎么样？', author: '返乡青年', likes: 156, comments: 89, views: 890, createdAt: '2026-03-14', tags: ['公司推荐', '薪资待遇'] },
  { id: 3, title: '面试技巧分享：如何回答优缺点问题', content: '面试中最常见的问题之一，分享一下我的回答思路和技巧...', author: 'HR小姐姐', likes: 345, comments: 123, views: 2345, createdAt: '2026-03-13', tags: ['面试技巧', '求职经验'] },
  { id: 4, title: '新泰房价这么高，年轻人怎么买房？', content: '工作几年了，想在新泰买房定居，但房价越来越高，有没有什么建议？', author: '奋斗青年', likes: 456, comments: 234, views: 3456, createdAt: '2026-03-12', tags: ['生活讨论', '买房建议'] },
  { id: 5, title: '程序员在新泰的薪资水平怎么样？', content: '想回新泰发展，做了3年前端开发，想了解一下新泰本地的薪资水平...', author: '码农小明', likes: 289, comments: 67, views: 1567, createdAt: '2026-03-11', tags: ['薪资待遇', '程序员'] },
  { id: 6, title: '如何平衡工作和生活？', content: '工作压力越来越大，感觉没时间陪家人，大家是怎么平衡的？', author: '职场妈妈', likes: 567, comments: 189, views: 4567, createdAt: '2026-03-10', tags: ['职场生活', '时间管理'] },
];

export function Forum() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('全部');

  const allTags = ['全部', '求职经验', '面试技巧', '公司推荐', '薪资待遇', '职场生活', '生活讨论'];

  const filteredPosts = mockPosts.filter((post) => {
    const matchesSearch =
      post.title.includes(searchQuery) ||
      post.content.includes(searchQuery);
    const matchesTag =
      activeTag === '全部' ||
      post.tags.some((tag) => tag === activeTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar activeSection="/forum" />
        
        <main className="flex-1 pb-20 md:min-h-screen">
          <div className="bg-white border-b border-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                <div>
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">新泰职友说</h1>
                  <p className="text-sm sm:text-base text-gray-500">求职经验交流，职场生活分享</p>
                </div>
                <Button className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  发布帖子
                </Button>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder="搜索帖子..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                    activeTag === tag
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="space-y-3 sm:space-y-4">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="p-4 sm:p-5">
                  <div className="flex gap-3 sm:gap-4">
                    <img
                      src={generateAvatar(post.author)}
                      alt={post.author}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2 line-clamp-2">{post.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 sm:mb-4 line-clamp-2">{post.content}</p>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
                        <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                          <span className="line-clamp-1">{post.author}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3 sm:w-4 sm:h-4" />{post.createdAt}</span>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                          <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />{post.comments}</span>
                          <span className="flex items-center gap-1"><Heart className="w-3 h-3 sm:w-4 sm:h-4" />{post.likes}</span>
                          <span className="flex items-center gap-1">浏览 {post.views}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-4">
                        {post.tags.map((tag, index) => (
                          <Tag key={index} size="sm">{tag}</Tag>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12 sm:py-16">
                <MessageCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                <p className="text-sm sm:text-base text-gray-500">暂无相关帖子</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}