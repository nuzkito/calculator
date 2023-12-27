import TokenType from '../Lexer/TokenType.js'
import Assignement from '../Parser/Tree/Assignement.js'
import BinaryOperation from '../Parser/Tree/BinaryOperation.js'
import EmptyStatement from '../Parser/Tree/EmptyStatement.js'
import InvalidStatement from '../Parser/Tree/InvalidStatement.js'
import NumericValue from '../Parser/Tree/NumericValue.js'
import UnaryOperation from '../Parser/Tree/UnaryOperation.js'
import Variable from '../Parser/Tree/Variable.js'
import Results from './Results.js'

export default class Interpreter {
    #variables = {}

    constructor(parser) {
        this.parser = parser
    }

    execute() {
        const tree = this.parser.parse()

        return new Results(tree.map(node => this.#evaluateStatement(node)))
    }

    #evaluateStatement(node) {
        if (node instanceof InvalidStatement) {
            return node.text()
        }

        if (node instanceof EmptyStatement) {
            return ''
        }

        if (node instanceof Assignement) {
            return this.#evaluateAssignement(node)
        }

        return this.#evaluateExpression(node)
    }

    #evaluateAssignement(node) {
        return this.#variables[node.variable.token.text] = this.#evaluateExpression(node.expression)
    }

    #evaluateExpression(node) {
        if (node instanceof NumericValue) {
            return node.value()
        }

        if (node instanceof BinaryOperation) {
            return this.#evaluateBinaryOperation(node)
        }

        if (node instanceof UnaryOperation) {
            return this.#evaluateUnaryOperation(node)
        }

        if (node instanceof Variable) {
            return this.#evaluateVariable(node)
        }
    }

    #evaluateVariable(node) {
        return this.#variables[node.token.text]
    }

    #evaluateBinaryOperation(node) {
        const leftOperandValue = this.#evaluateExpression(node.leftOperand)
        const rightOperandValue = this.#evaluateExpression(node.rightOperand)

        if (node.operator.token.kind === TokenType.Plus) {
            return leftOperandValue + rightOperandValue
        }

        if (node.operator.token.kind === TokenType.Minus) {
            return leftOperandValue - rightOperandValue
        }

        if (node.operator.token.kind === TokenType.Asterisk) {
            return leftOperandValue * rightOperandValue
        }

        if (node.operator.token.kind === TokenType.Slash) {
            return leftOperandValue / rightOperandValue
        }

        if (node.operator.token.kind === TokenType.DoubleAsterisk) {
            return leftOperandValue ** rightOperandValue
        }
    }

    #evaluateUnaryOperation(node) {
        if (node.isNegative()) {
            return -this.#evaluateExpression(node.operand())
        }

        return this.#evaluateExpression(node.operand())
    }
}
