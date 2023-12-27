export default class InvalidStatement {
    #text

    constructor(text) {
        this.#text = text
    }

    text() {
        return this.#text
    }
}
