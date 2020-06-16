import React from "react";
import { Router, createHistory, LocationProvider } from "@reach/router";
import { LessonComponent } from "./Lesson";
import { Layout } from "../components/Layout";
import { Provider } from "mobx-react";
import { LessonsStore } from "../store/Lessons";

//@ts-ignore
const history = createHistory(window);

const lessons = new LessonsStore(history);

export const LessonsRouter: React.FC<any> = () => {
  return (
    <LocationProvider history={history}>
      <Provider lessons={lessons}>
        <Layout>
          <Router>
            <LessonComponent history={history} path="lessons/:lessonId" />
          </Router>
        </Layout>
      </Provider>
    </LocationProvider>
  );
};
