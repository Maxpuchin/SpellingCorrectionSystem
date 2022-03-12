import React from "react"
import ReactDOM from "react-dom"
import { makeAutoObservable } from "mobx"
import { observer } from "mobx-react"

class UserStatus {
    secondsPassed = 0

    constructor() {
        makeAutoObservable(this);
    }

    increase() {
        this.secondsPassed += 1;
    }

    reset() {
        this.secondsPassed = 0;
    }
}

export default new UserStatus();
