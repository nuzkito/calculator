import Interpreter from './Interpreter/Interpreter.js'
import Lexer from './Lexer/Lexer.js'
import Parser from './Parser/Parser.js'
import SyntaxHighlighter from './SyntaxHighlighter.js'

function calculate(source) {
    const lexer = new Lexer(source)
    const parser = new Parser(lexer.tokens())
    const interpreter = new Interpreter(parser)
    const results = interpreter.execute()

    document.querySelector('#results').innerHTML = results.joinMap(result => `<div class="result">${result}</div>`)
    document.querySelector('#total').innerHTML = results.total()
}

function highlightSyntax() {
    const lexer = new Lexer(textarea.value)
    const syntaxHighlighter = new SyntaxHighlighter(lexer.tokens())
    const result = syntaxHighlighter.highlight()
    document.querySelector('#syntax-highlighted').innerHTML = result
}

const textarea = document.querySelector('#input')
textarea.addEventListener('keyup', () => localStorage.setItem('input', textarea.value))
textarea.addEventListener('keydown', () => setTimeout(() => calculate(textarea.value)))
textarea.addEventListener('keydown', () => setTimeout(highlightSyntax))

if (localStorage.getItem('input')) {
    textarea.value = localStorage.getItem('input')
}

calculate(textarea.value)
highlightSyntax()
