import React from "react";
import {createHistory, LocationProvider, Router} from "@reach/router";
import {LessonComponent} from "./Lesson";
import {Layout} from "../components/Layout";
import {Provider} from "mobx-react";
import {LessonsStore} from "../store/Lessons";

//@ts-ignore
const history = createHistory(window);

const lessonsStore = new LessonsStore(history);

export const LessonsRouter: React.FC<any> = () => {
    return (
        <LocationProvider history={history}>
            <Provider lessonsStore={lessonsStore}>
                <Layout>
                    <Router>
                        <LessonComponent history={history} path="lessons/:lessonId"/>
                        <LessonComponent history={history} path="tables/:lessonId"/>
                    </Router>
                </Layout>
            </Provider>
        </LocationProvider>
    );
};
