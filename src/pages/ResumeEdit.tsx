import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Briefcase, GraduationCap, Calendar, MapPin, User, Mail, Phone, FileText } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Sidebar } from '../components/layout/Sidebar';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resumeApi } from '../services/api';

interface ResumeFormData {
  name: string;
  title: string;
  nickname: string;
  phone: string;
  email: string;
  education: string;
  experience: string;
  location: string;
  skills: string;
  summary: string;
  workExperience: string;
  educationExperience: string;
  projects: string;
}

const educationOptions = ['小学', '初中', '高中', '中专', '大专', '本科', '硕士', '博士'];
const experienceOptions = ['应届生', '1年以下', '1-3年', '3-5年', '5-10年', '10年以上'];
const locationOptions = ['青云街道', '新汶街道', '开发区', '各乡镇', '其他'];

const templates = [
  { id: 'professional', name: '专业版', color: 'from-blue-500 to-blue-600' },
  { id: 'creative', name: '创意版', color: 'from-purple-500 to-purple-600' },
  { id: 'simple', name: '简约版', color: 'from-green-500 to-green-600' },
];

export function ResumeEdit() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState<ResumeFormData>({
    name: '',
    title: '',
    nickname: '',
    phone: '',
    email: '',
    education: '本科',
    experience: '1-3年',
    location: '青云街道',
    skills: '',
    summary: '',
    workExperience: '',
    educationExperience: '',
    projects: '',
  });
  const [template, setTemplate] = useState<string>('professional');
  const [errors, setErrors] = useState<Partial<ResumeFormData>>({});
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const templateParam = searchParams.get('template');
    const idParam = searchParams.get('id');
    
    if (templateParam) {
      setTemplate(templateParam);
    }
    
    if (idParam) {
      setResumeId(idParam);
      fetchResume(idParam);
    }
  }, [searchParams]);

  const fetchResume = async (id: string) => {
    setLoading(true);
    try {
      const response = await resumeApi.getDetail(id);
      const data = response.data;
      setFormData({
        name: data.name || '',
        title: data.title || '',
        nickname: '',
        phone: data.phone || '',
        email: data.email || '',
        education: data.education || '本科',
        experience: data.experience || '1-3年',
        location: data.location || '青云街道',
        skills: data.skills || '',
        summary: data.summary || '',
        workExperience: data.work_experience || '',
        educationExperience: data.education_experience || '',
        projects: data.projects || '',
      });
      if (data.template) {
        setTemplate(data.template);
      }
    } catch (error) {
      console.error('获取简历详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors: Partial<ResumeFormData> = {};
    
    if (!formData.name.trim()) newErrors.name = '请输入简历名称';
    if (!formData.title.trim()) newErrors.title = '请输入期望职位';
    if (!formData.phone.trim()) newErrors.phone = '请输入联系电话';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      setSaving(true);
      try {
        const resumeData = {
          name: formData.name,
          title: formData.title,
          phone: formData.phone,
          email: formData.email,
          education: formData.education,
          experience: formData.experience,
          location: formData.location,
          skills: formData.skills,
          summary: formData.summary,
          work_experience: formData.workExperience,
          education_experience: formData.educationExperience,
          projects: formData.projects,
          template,
        };
        
        if (resumeId) {
          await resumeApi.update(resumeId, resumeData);
        } else {
          await resumeApi.create(resumeData);
        }
        
        navigate('/user/resume');
      } catch (error) {
        console.error('保存简历失败:', error);
        alert('保存失败，请重试');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleChange = (field: keyof ResumeFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const currentTemplate = templates.find((t) => t.id === template);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar activeSection="/user/resume" />
        
        <main className="flex-1 pb-20 md:min-h-screen">
          <div className="bg-white border-b border-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/user/resume')}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{resumeId ? '编辑简历' : '创建简历'}</h1>
                  <p className="text-sm sm:text-base text-gray-500">完善您的简历信息</p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${currentTemplate?.color} flex items-center justify-center`}>
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-800">{currentTemplate?.name}模板</h2>
                  <p className="text-xs text-gray-500">适合技术岗位</p>
                </div>
              </div>
              <Button onClick={handleSubmit} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? '保存中...' : '保存简历'}
              </Button>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                  <Card className="p-4 sm:p-5">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <User className="w-4 h-4 text-primary-500" />
                      基本信息
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="简历名称"
                        placeholder="例如：专业版简历"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        error={errors.name}
                      />
                      <Input
                        label="期望职位"
                        placeholder="例如：前端开发工程师"
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        error={errors.title}
                      />
                      <Input
                        label="联系电话"
                        placeholder="请输入手机号码"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        error={errors.phone}
                      />
                      <Input
                        type="email"
                        label="电子邮箱"
                        placeholder="请输入邮箱地址"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                      />
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          学历
                        </label>
                        <select
                          value={formData.education}
                          onChange={(e) => handleChange('education', e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        >
                          {educationOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          工作经验
                        </label>
                        <select
                          value={formData.experience}
                          onChange={(e) => handleChange('experience', e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        >
                          {experienceOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          所在地区
                        </label>
                        <select
                          value={formData.location}
                          onChange={(e) => handleChange('location', e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        >
                          {locationOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                      <Input
                        label="技能标签"
                        placeholder="多个技能用逗号分隔，如：React, TypeScript, Node.js"
                        value={formData.skills}
                        onChange={(e) => handleChange('skills', e.target.value)}
                      />
                    </div>
                  </Card>

                  <Card className="p-4 sm:p-5">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-primary-500" />
                      自我评价
                    </h3>
                    <textarea
                      placeholder="简单介绍一下您的专业背景、核心优势和职业目标..."
                      value={formData.summary}
                      onChange={(e) => handleChange('summary', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                      rows={4}
                    />
                  </Card>

                  <Card className="p-4 sm:p-5">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary-500" />
                      工作经历
                    </h3>
                    <textarea
                      placeholder="请按时间倒序填写您的工作经历，包括公司名称、职位、工作时间和主要职责..."
                      value={formData.workExperience}
                      onChange={(e) => handleChange('workExperience', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                      rows={6}
                    />
                  </Card>

                  <Card className="p-4 sm:p-5">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-secondary-500" />
                      教育背景
                    </h3>
                    <textarea
                      placeholder="请按时间倒序填写您的教育经历，包括学校名称、专业、学历和在校时间..."
                      value={formData.educationExperience}
                      onChange={(e) => handleChange('educationExperience', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                      rows={4}
                    />
                  </Card>

                  <Card className="p-4 sm:p-5">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      项目经验
                    </h3>
                    <textarea
                      placeholder="请填写您参与的主要项目，包括项目名称、角色、时间和主要贡献..."
                      value={formData.projects}
                      onChange={(e) => handleChange('projects', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                      rows={6}
                    />
                  </Card>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <Card className="p-4 sm:p-5">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">简历预览</h3>
                    <div className={`bg-gradient-to-br ${currentTemplate?.color} p-4 rounded-xl text-white`}>
                      <h4 className="font-bold text-lg mb-1">{formData.title || '请输入期望职位'}</h4>
                      <p className="text-white/80 text-sm">{formData.education} | {formData.experience}</p>
                    </div>
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{formData.phone || '请填写联系电话'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{formData.email || '请填写邮箱'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{formData.location}</span>
                      </div>
                    </div>
                    {formData.skills && (
                      <div className="mt-4">
                        <h4 className="text-xs font-semibold text-gray-500 mb-2">技能</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {formData.skills.split(',').map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>

                  <Card className="p-4 sm:p-5">
                    <h3 className="text-sm font-semibold text-gray-800 mb-3">快捷提示</h3>
                    <ul className="space-y-2 text-xs text-gray-500">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 flex-shrink-0"></span>
                        简历名称用于区分不同版本的简历
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 flex-shrink-0"></span>
                        建议填写完整的工作经历和项目经验
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 flex-shrink-0"></span>
                        技能标签可以帮助企业更快找到您
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 flex-shrink-0"></span>
                        可以设置一份简历为默认简历
                      </li>
                    </ul>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}