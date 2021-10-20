/*
Copyright 2021 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { IScrollableBaseState, ScrollableBaseModal } from "../dialogs/ScrollableBaseModal";
import { IDialogProps } from "../dialogs/IDialogProps";
import React, { ChangeEvent } from "react";
import { _t } from "../../../languageHandler";
import { Room } from "matrix-js-sdk/src/models/room";
import Field from "./Field";
import AccessibleButton from "./AccessibleButton";

interface IProps extends IDialogProps {
    room: Room;
}

interface IState extends IScrollableBaseState {
    question: string;
}

export default class PollCreateDialog extends ScrollableBaseModal<IProps, IState> {
    public constructor(props: IProps) {
        super(props);

        this.state = {
            title: _t("Create poll"),
            actionLabel: _t("Create Poll"),
            canSubmit: false, // need to add a question and at least one option first

            question: "",
        };
    }

    private checkCanSubmit() {
        this.setState({
            canSubmit:
                this.state.question.trim().length > 0,
        });
    }

    private onQuestionChange = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({ question: e.target.value }, () => this.checkCanSubmit());
    };

    protected submit(): void {
        console.log("@@ TODO");
        this.props.onFinished(true);
    }

    protected cancel(): void {
        this.props.onFinished(false);
    }

    protected renderContent(): React.ReactNode {
        return <div className="mx_PollCreateDialog">
            <h2>{ _t("What is your poll question or topic?") }</h2>
            <Field
                value={this.state.question}
                label={_t("Question or topic")}
                placeholder={_t("Write something...")}
                onChange={this.onQuestionChange}
            />
        </div>;
    }
}
