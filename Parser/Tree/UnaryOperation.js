import TokenType from "../../Lexer/TokenType.js"

export default class UnaryOperation {
    #operator
    #operand

    constructor(operator, operand) {
        this.#operator = operator
        this.#operand = operand
    }

    isNegative() {
        return this.#operator.token.kind === TokenType.Minus
    }

    operand() {
        return this.#operand
    }
}
