export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">优</span>
              </div>
              <span className="font-bold text-gray-800">新泰优聘</span>
            </div>
            <p className="text-sm text-gray-500">新泰人的职业生活社区</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-4">快速链接</h4>
            <ul className="space-y-2">
              <li><a href="/talent" className="text-sm text-gray-500 hover:text-primary-500 transition-colors">人才库</a></li>
              <li><a href="/jobs" className="text-sm text-gray-500 hover:text-primary-500 transition-colors">招聘专区</a></li>
              <li><a href="/entertainment" className="text-sm text-gray-500 hover:text-primary-500 transition-colors">职场圈</a></li>
              <li><a href="/forum" className="text-sm text-gray-500 hover:text-primary-500 transition-colors">职友说</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-4">帮助中心</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-500 hover:text-primary-500 transition-colors">常见问题</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-primary-500 transition-colors">用户协议</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-primary-500 transition-colors">隐私政策</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-primary-500 transition-colors">联系我们</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-4">关注我们</h4>
            <p className="text-sm text-gray-500 mb-4">扫码关注公众号</p>
            <div className="w-24 h-24 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
              <span className="text-xs text-gray-400">二维码</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-400">© 2026 新泰优聘人才社区 版权所有</p>
        </div>
      </div>
    </footer>
  );
}