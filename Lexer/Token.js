import TokenType from './TokenType.js'

export default class Token {
    constructor(text, kind) {
        this.text = text
        this.kind = kind
    }

    static equal(text) {
        return new Token(text, TokenType.Equal)
    }

    static plus(text) {
        return new Token(text, TokenType.Plus)
    }

    static minus(text) {
        return new Token(text, TokenType.Minus)
    }

    static slash(text) {
        return new Token(text, TokenType.Slash)
    }

    static asterisk(text) {
        return new Token(text, TokenType.Asterisk)
    }

    static doubleAsterisk(text) {
        return new Token(text, TokenType.DoubleAsterisk)
    }

    static percentage(text) {
        return new Token(text, TokenType.Percentage)
    }

    static leftRoundBracket(text) {
        return new Token(text, TokenType.LeftRoundBracket)
    }

    static rightRoundBracket(text) {
        return new Token(text, TokenType.RightRoundBracket)
    }

    static number(text) {
        return new Token(text, TokenType.Number)
    }

    static variable(text) {
        return new Token(text, TokenType.Variable)
    }

    static comment(text) {
        return new Token(text, TokenType.Comment)
    }

    static whitespace(text) {
        return new Token(text, TokenType.Whitespace)
    }

    static newline(text) {
        return new Token(text, TokenType.Newline)
    }

    static endOfFile() {
        return new Token('', TokenType.EndOfFile)
    }

    static unknown(text) {
        return new Token(text, TokenType.Unknown)
    }

    check(...kinds) {
        for (const kind of kinds) {
            if (kind === this.kind) {
                return true
            }
        }

        return false
    }
}
