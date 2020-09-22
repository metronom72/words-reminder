import React from "react";
import {RouteComponentProps} from "@reach/router";
import {inject, observer} from "mobx-react";


export const LessonComponent: React.FC<RouteComponentProps & any> = inject(
    "lessons"
)(
    observer(({lessons}) => {
        return null
    })
)