import React from 'react';
import { useRoutes } from 'react-router-dom';
import SignIn from "./pages/SignIn";
import SignUp from './pages/SignUp';
import TeacherAddNewWork from './pages/TeacherAddNewWork';
import TeacherPage from './pages/TeacherPage';
import StudentPage from './pages/StudentPage';
import StudentProfileSettings from './pages/StudentProfileSettings';
import TeacherProfileSettings from './pages/TeacherProfileSettings';
import TeacherListWorks from './pages/TeacherListWorks';
import TeacherAddNewGroup from './pages/TeacherAddNewGroup';

const Router = (props) => {
  let routes = useRoutes([
    { path: "/student", element: <StudentPage/> },
    { path: "/sign-up", element: <SignUp/> },
    { path: "/student/settings", element: <StudentProfileSettings/> },
    { path: "/teacher/settings", element: <TeacherProfileSettings/> },
    { path: "/sign-in", element: <SignIn/> },
    { path: "/teacher", element: <TeacherPage/> },
    { path: "/teacher/add-new-work", element: <TeacherAddNewWork/> },
    { path: "/teacher/list-works", element: <TeacherListWorks/> },
    { path: "/teacher/add-new-group", element: <TeacherAddNewGroup/>}
  ]);
  return routes
}

export default Router;