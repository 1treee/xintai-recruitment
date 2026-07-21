import { useState, useEffect } from 'react';
import { Play, Heart, MessageCircle, Share2, TrendingUp, Clock, User, Plus, Upload } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Tag } from '../components/common/Tag';
import { Sidebar } from '../components/layout/Sidebar';
import { Button } from '../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { videoApi } from '../services/api';
import { generateAvatar } from '../utils/helpers';
import useAuthStore from '../stores/authStore';

interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  views: number;
  likes: number;
  comments: number;
  user_nickname: string;
  user_avatar: string;
  duration: string;
  category: string;
  url: string;
}

export function Entertainment() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [activeCategory, setActiveCategory] = useState('全部');
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({ title: '', url: '', thumbnail: '', tags: '', category: '' });

  const categories = ['全部', '职场技巧', '销售技巧', '企业探访', '职场穿搭', '职场生活', '求职技巧'];

  useEffect(() => {
    fetchVideos();
  }, [activeCategory]);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const params = activeCategory === '全部' ? {} : { category: activeCategory };
      const response = await videoApi.getList(params);
      setVideos(response.data.list);
    } catch (error) {
      console.error('获取视频列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!uploadData.url) {
      alert('请输入视频URL');
      return;
    }
    try {
      await videoApi.create(uploadData);
      setShowUploadModal(false);
      setUploadData({ title: '', url: '', thumbnail: '', tags: '', category: '' });
      fetchVideos();
      alert('视频发布成功');
    } catch (error) {
      console.error('上传视频失败:', error);
      alert('上传失败，请重试');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar activeSection="/entertainment" />
        
        <main className="flex-1 pb-20 md:min-h-screen">
          <div className="bg-white border-b border-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">新泰职场圈</h1>
                  <p className="text-sm sm:text-base text-gray-500">分享职场生活，记录精彩瞬间</p>
                </div>
                <Button onClick={() => {
                  if (!isAuthenticated) {
                    navigate('/login');
                  } else {
                    setShowUploadModal(true);
                  }
                }} className="self-start sm:self-auto">
                  <Upload className="w-5 h-5 mr-2" />
                  发布视频
                </Button>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                    activeCategory === category
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {videos.length > 0 ? (
                  videos.map((video) => (
                    <Card 
                      key={video.id} 
                      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => navigate(`/videos/${video.id}`)}
                    >
                      <div className="relative aspect-video bg-gray-800">
                        {video.thumbnail ? (
                          <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
                            <Play className="w-12 h-12 sm:w-16 sm:h-16 text-white/80" />
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30">
                          <Play className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                        </div>
                        <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {video.duration || '00:00'}
                        </span>
                      </div>
                      
                      <div className="p-3 sm:p-4">
                        <h3 className="text-sm sm:text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{video.title}</h3>
                        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
                          <img 
                            src={video.user_avatar || generateAvatar(video.user_nickname)} 
                            alt={video.user_nickname} 
                            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full" 
                          />
                          <span className="line-clamp-1">{video.user_nickname}</span>
                          <Tag variant="secondary" size="sm">{video.category}</Tag>
                        </div>
                        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
                          <div className="flex items-center gap-3 sm:gap-4">
                            <span className="flex items-center gap-1"><Play className="w-3 h-3 sm:w-4 sm:h-4" />{video.views}</span>
                            <span className="flex items-center gap-1"><Heart className="w-3 h-3 sm:w-4 sm:h-4" />{video.likes}</span>
                            <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />{video.comments}</span>
                          </div>
                          <button className="text-gray-400 hover:text-primary-500">
                            <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 sm:py-16">
                    <TrendingUp className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                    <p className="text-sm sm:text-base text-gray-500">暂无相关视频</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">发布视频</h2>
              <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600">
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">视频标题</label>
                <input
                  type="text"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                  placeholder="输入视频标题"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">视频URL</label>
                <input
                  type="text"
                  value={uploadData.url}
                  onChange={(e) => setUploadData({ ...uploadData, url: e.target.value })}
                  placeholder="输入视频链接地址"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">封面图片URL</label>
                <input
                  type="text"
                  value={uploadData.thumbnail}
                  onChange={(e) => setUploadData({ ...uploadData, thumbnail: e.target.value })}
                  placeholder="输入封面图片链接"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                <select
                  value={uploadData.category}
                  onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                >
                  <option value="">请选择分类</option>
                  {categories.filter(c => c !== '全部').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">标签（逗号分隔）</label>
                <input
                  type="text"
                  value={uploadData.tags}
                  onChange={(e) => setUploadData({ ...uploadData, tags: e.target.value })}
                  placeholder="输入标签，用逗号分隔"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button variant="secondary" onClick={() => setShowUploadModal(false)} className="flex-1">
                取消
              </Button>
              <Button onClick={handleUpload} className="flex-1">
                发布
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}