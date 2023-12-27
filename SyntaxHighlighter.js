import TokenType from './Lexer/TokenType.js'

export default class SyntaxHighlighter {
    #tokens

    constructor(tokens) {
        this.#tokens = tokens
    }

    highlight() {
        return this.#tokens.map(token => {
            if (this.#isComment(token)) return this.#comment(token)
            if (this.#isVariable(token)) return this.#variable(token)
            if (this.#isNumber(token)) return this.#number(token)
            if (this.#isRoundBracket(token)) return this.#roundBracket(token)
            if (this.#isOperator(token)) return this.#operator(token)

            return this.#default(token)
        }).join('')
    }

    #isComment(token) {
        return token.check(TokenType.Comment)
    }

    #isVariable(token) {
        return token.check(TokenType.Variable)
    }

    #isNumber(token) {
        return token.check(TokenType.Number)
    }

    #isRoundBracket(token) {
        return token.check(TokenType.LeftRoundBracket, TokenType.RightRoundBracket)
    }

    #isOperator(token) {
        return token.check(TokenType.Plus, TokenType.Minus, TokenType.Asterisk, TokenType.DoubleAsterisk, TokenType.Slash)
    }

    #comment(token) {
        return `<span style="color:#AAAAAA">${token.text}</span>`
    }

    #variable(token) {
        return `<span style="color:#B10DC9">${token.text}</span>`
    }

    #number(token) {
        return `<span style="color:#3D9970">${token.text}</span>`
    }

    #roundBracket(token) {
        return `<span style="color:#FF851B">${token.text}</span>`
    }

    #operator(token) {
        return `<span style="color:#0074D9">${token.text}</span>`
    }

    #default(token) {
        return `<span style="color:#FF4136">${token.text}</span>`
    }
}
