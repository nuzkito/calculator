export default class NumericValue {
    constructor(token) {
        this.token = token
    }

    value() {
        return parseFloat(this.token.text)
    }
}
