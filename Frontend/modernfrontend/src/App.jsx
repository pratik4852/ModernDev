import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/dashboard";
import Signin from "./pages/signin";
import Signup from "./pages/signup";
import Users from "./pages/users";
import Notification from "./pages/notification";
import Lms from "./pages/lms";
import Household from "./pages/household";
import Member from "./pages/member";
import Tickets from "./pages/tickets";
import Survey from "./pages/survey";
import Audience from "./pages/audience";
import Settings from "./pages/settings";
import Feedback from "./pages/feedback";
import AddSurvey from "./pages/AddSurvey";
import Demo from "./pages/demo";

const ProtectedLayout = () => {
  const { token, user } = useSelector((state) => state.auth);

  if (!token && !user) {
    return <Navigate to="/signin" replace />;
  }

  return <Layout />;
};

function App() {
  return (
    <BrowserRouter basename="/moderndev">
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/lms" element={<Lms />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/household" element={<Household />} />
          <Route path="/member" element={<Member />} />
          <Route path="/tickets" element={<Tickets/>} />
          <Route path="/survey" element={<Survey/>} />
          <Route path="/addsurvey/:surveyId" element={<AddSurvey/>} />
          <Route path="/audience" element={<Audience/>} />
          <Route path="/settings" element={<Settings/>} />
          <Route path="/demo" element={<Demo/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
