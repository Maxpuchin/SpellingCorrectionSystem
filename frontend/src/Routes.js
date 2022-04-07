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
import TeacherGroups from './pages/TeacherGroups';
import EssayPage from './pages/EssayPage';
import StudentListWorks from './pages/StudentListWorks';
import TeacherCases from './pages/TeacherCases';
import TeacherMark from './pages/TeacherMark';
import StudentWorkPage from './pages/StudentWorkPage';
import StudentResultPage from './pages/StudentResultPage';
import TeacherListWorks2 from './pages/TeacherListWorks2';

const Router = (props) => {
  let routes = useRoutes([
    { path: "/student", element: <StudentPage/> },
    { path: "/sign-up", element: <SignUp/> },
    { path: "/student/settings", element: <StudentProfileSettings/> },
    { path: "/teacher/settings", element: <TeacherProfileSettings/> },
    { path: "/sign-in", element: <SignIn/> },
    { path: "/teacher", element: <TeacherPage/> },
    { path: "/teacher/add-new-work", element: <TeacherAddNewWork setStatus={props.setStatus}/> },
    { path: "/teacher/list-works", element: <TeacherListWorks2/> },
    { path: "/teacher/groups", element: <TeacherGroups/>},
    { path: "/student/list-works", element: <StudentListWorks/> },
    { path: "/student/list-works/participate", element:<StudentWorkPage/> },
    { path: "/teacher/list-works/list-cases", element: <TeacherCases/> },
    { path: "/teacher/list-works/case", element: <TeacherMark/> },
    { path: "/student/list-works/results", element: <StudentResultPage/> }
  ]);
  return routes
}

export default Router;