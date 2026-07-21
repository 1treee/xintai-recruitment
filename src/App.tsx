import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { BottomNav } from './components/layout/BottomNav';
import { Home } from './pages/Home';
import { Talent } from './pages/Talent';
import { Jobs } from './pages/Jobs';
import { Entertainment } from './pages/Entertainment';
import { Forum } from './pages/Forum';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { UserProfile } from './pages/UserProfile';
import { ResumeManager } from './pages/ResumeManager';
import { ResumeEdit } from './pages/ResumeEdit';
import { VideoPlayer } from './pages/VideoPlayer';

function App() {
  const authRoutes = ['/login', '/register'];
  
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/videos/:id"
          element={<VideoPlayer />}
        />
        <Route
          path="/*"
          element={
            <>
              <Header />
              <main className="min-h-screen bg-gray-50">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/talent" element={<Talent />} />
                  <Route path="/jobs" element={<Jobs />} />
                  <Route path="/entertainment" element={<Entertainment />} />
                  <Route path="/forum" element={<Forum />} />
                  <Route path="/user/profile" element={<UserProfile />} />
                  <Route path="/user/resume" element={<ResumeManager />} />
                  <Route path="/user/resume/edit" element={<ResumeEdit />} />
                </Routes>
              </main>
              <Footer />
              <BottomNav />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;