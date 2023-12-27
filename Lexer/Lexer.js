import Token from './Token.js'
import TokenType from './TokenType.js'

export default class Lexer {
    #source
    #previous = ''
    #current = ''
    #position = -1

    constructor(source) {
        this.#source = source + '\n'
        this.#advance()
    }

    tokens() {
        const tokens = []
        let token

        do {
            tokens.push(token = this.#token())
        } while (!token.check(TokenType.EndOfFile));

        return tokens
    }

    #token() {
        if (this.#match('=')) return Token.equal(this.#previous)
        if (this.#match('+')) return Token.plus(this.#previous)
        if (this.#match('-')) return Token.minus(this.#previous)
        if (this.#match('/')) return Token.slash(this.#previous)
        if (this.#match('%')) return Token.percentage(this.#previous)
        if (this.#match('(')) return Token.leftRoundBracket(this.#previous)
        if (this.#match(')')) return Token.rightRoundBracket(this.#previous)
        if (this.#match('\n')) return Token.newline(this.#previous)
        if (this.#match('\0')) return Token.endOfFile()

        if (this.#match('*')) {
            if (this.#match('*')) {
                return Token.doubleAsterisk('**')
            }

            return Token.asterisk(this.#previous)
        }

        if (this.#isDigit(this.#current)) {
            const startPosition = this.#position

            while (this.#isDigit(this.#peek())) {
                this.#advance()
            }

            if (this.#peek() === '.') {
                this.#advance()

                if (!this.#isDigit(this.#peek())) {
                    return Token.number(this.#source.substring(startPosition, this.#position))
                }

                while (this.#isDigit(this.#peek())) {
                    this.#advance()
                }
            }

            this.#advance()

            return Token.number(this.#source.substring(startPosition, this.#position))
        }

        if (this.#isAlphabetic(this.#current)) {
            const startPosition = this.#position

            while (this.#isAlphanumeric(this.#peek())) {
                this.#advance()
            }

            this.#advance()

            return Token.variable(this.#source.substring(startPosition, this.#position))
        }

        if (this.#match(' ', '\t', '\r')) {
            const startPosition = this.#position - 1

            while (this.#check(' ', '\t', '\r')) {
                this.#advance()
            }

            return Token.whitespace(this.#source.substring(startPosition, this.#position))
        }

        if (this.#match('#')) {
            const startPosition = this.#position - 1

            while (!this.#check('\n')) {
                this.#advance()
            }

            return Token.comment(this.#source.substring(startPosition, this.#position))
        }

        this.#advance()

        return Token.unknown(this.#previous)
    }

    #match(...chars) {
        if (this.#check(...chars)) {
            this.#advance()

            return true
        }

        return false
    }

    #check(...chars) {
        for (const char of chars) {
            if (this.#current === char) {
                return true
            }
        }

        return false
    }

    #advance() {
        this.#position += 1
        this.#previous = this.#current

        if (this.#position >= this.#source.length) {
            this.#current = '\0'
        } else {
            this.#current = this.#source[this.#position]
        }
    }

    #peek() {
        if (this.#position + 1 >= this.#source.length) {
            return '\0'
        }

        return this.#source[this.#position + 1]
    }

    #isDigit(char) {
        return char >= '0' && char <= '9'
    }

    #isAlphabetic(char) {
        return (char >= 'A' && char <= 'Z') || (char >= 'a' && char <= 'z');
    }

    #isAlphanumeric(char) {
        return this.#isDigit(char) || this.#isAlphabetic(char);
    }
}
