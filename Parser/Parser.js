import TokenType from '../Lexer/TokenType.js'
import Assignement from './Tree/Assignement.js'
import BinaryOperation from './Tree/BinaryOperation.js'
import EmptyStatement from './Tree/EmptyStatement.js'
import InvalidStatement from './Tree/InvalidStatement.js'
import NumericValue from './Tree/NumericValue.js'
import Operator from './Tree/Operator.js'
import UnaryOperation from './Tree/UnaryOperation.js'
import Variable from './Tree/Variable.js'

export default class Parser {
    #previous = undefined
    #current = undefined
    #peek = undefined
    #symbols = []
    #tokens
    #position = -1

    constructor(tokens) {
        this.#tokens = this.#filterNotEvaluableTokens(tokens)
        this.#peek = this.#tokens[0]
        this.#advance()
    }

    parse() {
        return this.#program()
    }

    #filterNotEvaluableTokens(tokens) {
        return tokens.filter(token => !token.check(TokenType.Comment, TokenType.Whitespace))
    }

    #isNotLastToken() {
        return !this.#check(TokenType.EndOfFile)
    }

    #check(...kinds) {
        return this.#current.check(...kinds)
    }

    #match(...kinds) {
        if (this.#check(...kinds)) {
            this.#advance()

            return true
        }

        return false
    }

    #advance() {
        this.#position += 1
        this.#previous = this.#current
        this.#current = this.#peek
        this.#peek = this.#tokens[this.#position + 1]
    }

    #program() {
        let statements = []

        while (this.#isNotLastToken()) {
            try {
                statements.push(this.#statement())
            } catch(error) {
                statements.push(new InvalidStatement(error.message))

                while (!this.#check(TokenType.Newline)) {
                    this.#advance()
                }

                this.#advance()
            }
        }

        return statements
    }

    #statement() {
        if (this.#match(TokenType.Newline)) {
            return new EmptyStatement()
        }

        let node

        if (this.#check(TokenType.Variable) && this.#peek.check(TokenType.Equal)) {
            const variable = new Variable(this.#current)
            this.#advance()
            this.#advance()
            node = new Assignement(variable, new Operator(this.#previous), this.#expression())
            this.#addSymbol(variable.token.text)
        } else if (this.#check(TokenType.Variable, TokenType.Number, TokenType.Plus, TokenType.Minus, TokenType.LeftRoundBracket, TokenType.RightRoundBracket)) {
            node = this.#expression()
        }

        if (this.#match(TokenType.Newline)) {
            return node
        }

        this.#error(`Invalid "${this.#current.text}"`)
    }

    #addSymbol(symbol) {
        if (!this.#symbols.includes(symbol)) {
            this.#symbols.push(symbol)
        }
    }

    #expression() {
        let node = this.#term()

        while (this.#match(TokenType.Plus, TokenType.Minus)) {
            node = new BinaryOperation(node, new Operator(this.#previous), this.#term())
        }

        return node
    }

    #term() {
        let node = this.#exponent()

        while (this.#match(TokenType.Asterisk, TokenType.Slash)) {
            node = new BinaryOperation(node, new Operator(this.#previous), this.#exponent())
        }

        return node
    }

    #exponent() {
        let node = this.#unary()

        while (this.#match(TokenType.DoubleAsterisk)) {
            node = new BinaryOperation(node, new Operator(this.#previous), this.#unary())
        }

        return node
    }

    #unary() {
        if (this.#match(TokenType.Plus, TokenType.Minus)) {
            return new UnaryOperation(new Operator(this.#previous), this.#primary())
        }

        return this.#primary()
    }

    #primary() {
        if (this.#match(TokenType.Number)) {
            return new NumericValue(this.#previous)
        }

        if (this.#match(TokenType.LeftRoundBracket)) {
            const node = this.#expression()

            if (this.#match(TokenType.RightRoundBracket)) {
                return node
            }

            this.#error(`Expected ")"`)
        }

        if (!this.#match(TokenType.Variable)) {
            this.#error(`Unexpected ${this.#current.text} after ${this.#previous.text}`)
        }

        if (this.#symbols.includes(this.#previous.text)) {
            return new Variable(this.#previous)
        }

        this.#error(`"${this.#previous.text}" is not defined.`)
    }

    #error(message) {
        throw new Error(message)
    }
}
