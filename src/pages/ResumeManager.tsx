import { useState, useEffect } from 'react';
import { Plus, FileText, Edit, Trash2, Eye, Star, Briefcase, GraduationCap, Calendar, MapPin } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Sidebar } from '../components/layout/Sidebar';
import { useNavigate } from 'react-router-dom';
import { resumeApi } from '../services/api';

interface Resume {
  id: string;
  name: string;
  template: string;
  title: string;
  education: string;
  experience: string;
  skills: string;
  location: string;
  is_default: boolean;
  updated_at: string;
}

const templates = [
  { id: 'professional', name: '专业版', icon: Briefcase, color: 'from-blue-500 to-blue-600', desc: '经典商务风格，适合技术岗位' },
  { id: 'creative', name: '创意版', icon: Star, color: 'from-purple-500 to-purple-600', desc: '个性创意风格，适合设计岗位' },
  { id: 'simple', name: '简约版', icon: FileText, color: 'from-green-500 to-green-600', desc: '简洁清爽风格，适合通用岗位' },
];

export function ResumeManager() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const response = await resumeApi.getList();
      const data = response.data as Resume[];
      setResumes(data);
    } catch (error) {
      console.error('获取简历列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddResume = () => {
    if (selectedTemplate) {
      navigate(`/user/resume/edit?template=${selectedTemplate}`);
      setShowAddModal(false);
      setSelectedTemplate('');
    }
  };

  const handleDeleteResume = async (id: string) => {
    if (window.confirm('确定要删除这份简历吗？')) {
      try {
        await resumeApi.delete(id);
        setResumes(resumes.filter((r) => r.id !== id));
      } catch (error) {
        console.error('删除简历失败:', error);
      }
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await resumeApi.setDefault(id);
      setResumes(resumes.map((r) => ({ ...r, is_default: r.id === id })));
    } catch (error) {
      console.error('设置默认简历失败:', error);
    }
  };

  const getSkillsArray = (skills: string) => {
    return skills ? skills.split(',') : [];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar activeSection="/user/resume" />
        
        <main className="flex-1 pb-20 md:min-h-screen">
          <div className="bg-white border-b border-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">简历管理</h1>
              <p className="text-sm sm:text-base text-gray-500">管理您的个人简历，支持多份简历和多种模板</p>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-800">我的简历</h2>
                <p className="text-xs sm:text-sm text-gray-500">共 {resumes.length} 份简历</p>
              </div>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                添加简历
              </Button>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : resumes.length === 0 ? (
              <Card className="p-8 sm:p-12 text-center">
                <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">暂无简历</h3>
                <p className="text-gray-500 mb-4">创建您的第一份简历，开始求职之旅</p>
                <Button onClick={() => setShowAddModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  创建简历
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {resumes.map((resume) => (
                  <Card key={resume.id} className="p-4 sm:p-5">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br ${templates.find(t => t.id === resume.template)?.color || 'from-blue-500 to-blue-600'} flex items-center justify-center`}>
                          {(() => {
                            const Icon = templates.find(t => t.id === resume.template)?.icon || FileText;
                            return <Icon className="w-5 h-5 text-white" />;
                          })()}
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-800">{resume.name}</h3>
                          <span className="text-xs text-gray-500">{templates.find(t => t.id === resume.template)?.name || '专业版'}模板</span>
                        </div>
                      </div>
                      {resume.is_default && (
                        <span className="px-2 py-1 bg-primary-100 text-primary-600 rounded-full text-xs font-medium">默认</span>
                      )}
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Briefcase className="w-4 h-4 text-primary-500" />
                        <span>{resume.title}</span>
                      </div>
                      {resume.education && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <GraduationCap className="w-4 h-4 text-secondary-500" />
                          <span>{resume.education}</span>
                        </div>
                      )}
                      {resume.experience && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{resume.experience}工作经验</span>
                        </div>
                      )}
                      {resume.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{resume.location}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {getSkillsArray(resume.skills).slice(0, 4).map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          {skill.trim()}
                        </span>
                      ))}
                      {getSkillsArray(resume.skills).length > 4 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          +{getSkillsArray(resume.skills).length - 4}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-400">更新于 {new Date(resume.updated_at).toLocaleDateString()}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSetDefault(resume.id)}
                          className={`text-xs px-2 py-1 rounded transition-colors ${
                            resume.is_default
                              ? 'bg-primary-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {resume.is_default ? '默认' : '设为默认'}
                        </button>
                        <button
                          onClick={() => navigate(`/user/resume/edit?id=${resume.id}`)}
                          className="p-2 text-gray-400 hover:text-primary-500 transition-colors"
                          title="编辑"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteResume(resume.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">选择简历模板</h2>
              <button
                onClick={() => { setShowAddModal(false); setSelectedTemplate(''); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            <div className="space-y-3">
              {templates.map((template) => {
                const Icon = template.icon;
                const isSelected = selectedTemplate === template.id;
                return (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${template.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${isSelected ? 'text-primary-600' : 'text-gray-800'}`}>
                          {template.name}
                        </h3>
                        <p className="text-sm text-gray-500">{template.desc}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => { setShowAddModal(false); setSelectedTemplate(''); }}>
                取消
              </Button>
              <Button className="flex-1" onClick={handleAddResume} disabled={!selectedTemplate}>
                开始创建
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}