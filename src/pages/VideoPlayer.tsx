import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, MessageCircle, Share2, Clock, User, Send } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { videoApi } from '../services/api';
import { generateAvatar } from '../utils/helpers';
import useAuthStore from '../stores/authStore';

export function VideoPlayer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (id) {
      fetchVideo();
    }
  }, [id]);

  const fetchVideo = async () => {
    setLoading(true);
    try {
      const response = await videoApi.getDetail(id!);
      setVideo(response.data);
      setLikeCount(response.data.likes || 0);
    } catch (error) {
      console.error('获取视频失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const response = await videoApi.like({ video_id: id! });
      setLiked(response.data.liked);
      setLikeCount(prev => response.data.liked ? prev + 1 : prev - 1);
    } catch (error) {
      console.error('点赞失败:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated) {
      return;
    }
    try {
      setNewComment('');
    } catch (error) {
      console.error('评论失败:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">视频不存在</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white sticky top-0 z-10 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <button
            onClick={() => navigate('/entertainment')}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-800">视频详情</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative aspect-video bg-gray-900">
                {video.url ? (
                  <video
                    src={video.url}
                    controls
                    className="w-full h-full"
                    poster={video.thumbnail}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white/60">
                    <Clock className="w-16 h-16 mb-4" />
                    <p className="text-lg">视频加载中...</p>
                  </div>
                )}
              </div>
              
              <div className="p-4 sm:p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3">{video.title}</h2>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={video.user_avatar || generateAvatar(video.user_nickname)} 
                      alt={video.user_nickname} 
                      className="w-10 h-10 rounded-full" 
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{video.user_nickname}</p>
                      <p className="text-sm text-gray-500">{video.views || 0} 播放 · {video.created_at}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleLike}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                        liked ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                      <span className="font-medium">{likeCount}</span>
                    </button>
                    
                    <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all">
                      <MessageCircle className="w-5 h-5" />
                      <span className="font-medium">{comments.length}</span>
                    </button>
                    
                    <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all">
                      <Share2 className="w-5 h-5" />
                      <span className="font-medium">分享</span>
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-gray-500">标签：</span>
                    {video.tags && video.tags.split(',').map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary-50 text-primary-600 text-sm rounded"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm mt-6 p-4 sm:p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">评论 ({comments.length})</h3>
              
              <form onSubmit={handleSubmitComment} className="mb-6">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={isAuthenticated ? '写下你的评论...' : '登录后才能评论'}
                    disabled={!isAuthenticated}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-400"
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim() || !isAuthenticated}
                    className="p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>

              {comments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>暂无评论，快来抢沙发吧</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment, index) => (
                    <div key={index} className="flex gap-3">
                      <img
                        src={generateAvatar(comment.user_nickname)}
                        alt={comment.user_nickname}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-800">{comment.user_nickname}</span>
                          <span className="text-xs text-gray-400">{comment.created_at}</span>
                        </div>
                        <p className="text-gray-600">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 sticky top-20">
              <h3 className="text-lg font-bold text-gray-800 mb-4">推荐视频</h3>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="w-24 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 line-clamp-2">
                        这是一个推荐视频的标题，内容很精彩哦
                      </p>
                      <p className="text-xs text-gray-500 mt-1">作者名称</p>
                      <p className="text-xs text-gray-400">1.2万播放</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}