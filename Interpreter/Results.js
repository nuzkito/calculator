export default class Results {
    #values

    constructor(values) {
        this.#values = values
    }

    joinMap(callback) {
        return this.#values.map(callback).join('')
    }

    total() {
        return this.#values
            .filter(number => !isNaN(number))
            .reduce((total, number) => total + Number(number), 0)
    }
}
