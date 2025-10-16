import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/home/Home';
import Questions from './pages/questions/Questions';
import Profile from './pages/profile/Profile';
import NewQuestionPage from './pages/questions/NewQuestionPage';
import { ASK_NEW_QUESTION, DRAFTS, LOGIN_PAGE, MANAGER, MYUSERS, NEW_USER, QUESTION_DEATIL_PAGE, QUESTIONS_PAGE, SIGN_UP_PAGE, UPDATE_PROFILE, USER_OVERVIEW, USER_QUESTIONS } from './util/Routes';
import QuestionDetailPage from './pages/questions/QuestionDetailPage';
import Login from './pages/login/Login';
import SignUp from './pages/login/SignUp';
import UpdateProfile from './pages/profile/UpdateProfile';
import ProtectedRoutes from './util/ProtectedRoutes';
import Toastify from './components/Toastify';
import QuestionDrafts from './pages/drafts/QuestionDrafts';
import UserQuestions from './pages/questions/UserQuestions.';
import ManagerPage from './pages/manager/ManagerPage';
import UserOverviewPage from './pages/manager/UserOverviewPage';
import CreateNewUserPage from './pages/profile/CreateNewUserPage';
import MyTeamUsers from './pages/manager/MyTeamUsers';
//import './styles/carbon.scss'; // ✅ Your custom SCSS with Carbon setup



function App() {
  return (
    <Router>
<Toastify/>
      <Routes>
  {/* Public routes */}
  <Route path={LOGIN_PAGE} element={<Login />} />
  <Route path={SIGN_UP_PAGE} element={<SignUp />} />
  <Route path={UPDATE_PROFILE} element={<UpdateProfile />} />

  {/* Protected + Layout-wrapped routes */}
  <Route
    path="/"
    element={
      <ProtectedRoutes>
        <Layout />
      </ProtectedRoutes>
    }
  >
    <Route index element={<Home />} />
    <Route path={QUESTIONS_PAGE} element={<Questions />} />
    <Route path="/profile" element={<Profile />} />
    <Route path={ASK_NEW_QUESTION} element={<NewQuestionPage />} />
    <Route path={QUESTION_DEATIL_PAGE} element={<QuestionDetailPage />} />
    <Route path={DRAFTS} element={<QuestionDrafts/>} />
    <Route path={USER_QUESTIONS} element={<UserQuestions/>} />
    <Route path={MANAGER} element={<ManagerPage/>} />
    <Route path={USER_OVERVIEW} element={<UserOverviewPage/>} />
    <Route path={NEW_USER} element={<CreateNewUserPage/>} />
    <Route path={MYUSERS} element={<MyTeamUsers/>} />
  </Route>
</Routes>

     
    </Router>
  );
}

export default App;
