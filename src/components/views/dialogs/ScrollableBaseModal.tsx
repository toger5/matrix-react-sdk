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

import React from "react";
import { MatrixClient } from "matrix-js-sdk/src/client";
import { MatrixClientPeg } from "../../../MatrixClientPeg";
import { Key } from "../../../Keyboard";
import { IDialogProps } from "./IDialogProps";
import MatrixClientContext from "../../../contexts/MatrixClientContext";
import FocusLock from "react-focus-lock";
import { _t } from "../../../languageHandler";
import AccessibleButton from "../elements/AccessibleButton";

export interface IScrollableBaseState {
    canSubmit: boolean;
    title: string;
    actionLabel: string;
}

/**
 * Scrollable dialog base from Compound (Web Components).
 */
export abstract class ScrollableBaseModal<TProps extends IDialogProps, TState extends IScrollableBaseState>
    extends React.PureComponent<TProps, TState> {

    protected constructor(props: TProps) {
        super(props);
    }

    protected get matrixClient(): MatrixClient {
        return MatrixClientPeg.get();
    }

    private onKeyDown = (e: KeyboardEvent | React.KeyboardEvent): void => {
        if (e.key === Key.ESCAPE) {
            e.stopPropagation();
            e.preventDefault();
            this.cancel();
        }
    };

    private onCancel = () => {
        this.cancel();
    };

    private onSubmit = () => {
        this.submit();
    };

    protected abstract cancel(): void;
    protected abstract submit(): void;
    protected abstract renderContent(): React.ReactNode;

    public render(): JSX.Element {
        return (
            <MatrixClientContext.Provider value={this.matrixClient}>
                <FocusLock
                    returnFocus={true}
                    lockProps={{
                        onKeyDown: this.onKeyDown,
                        role: "dialog",
                        ["aria-labelledby"]: "mx_CompoundDialog_title",

                        // Like BaseDialog, we'll just point this at the whole content
                        ["aria-describedby"]: "mx_CompoundDialog_content",
                    }}
                    className="mx_CompoundDialog mx_ScrollableBaseDialog"
                >
                    <div className="mx_CompoundDialog_header">
                        <h1>{ this.state.title }</h1>
                        <AccessibleButton
                            onClick={this.onCancel}
                            className="mx_CompoundDialog_cancelButton"
                            aria-label={_t("Close dialog")}
                        />
                    </div>
                    <div className="mx_CompoundDialog_content">
                        { this.renderContent() }
                    </div>
                    <div className="mx_CompoundDialog_footer">
                        <AccessibleButton onClick={this.onCancel} kind="primary_outline">
                            { _t("Cancel") }
                        </AccessibleButton>
                        <AccessibleButton onClick={this.onSubmit} kind="primary" disabled={!this.state.canSubmit}>
                            { this.state.actionLabel }
                        </AccessibleButton>
                    </div>
                </FocusLock>
            </MatrixClientContext.Provider>
        );
    }
}
