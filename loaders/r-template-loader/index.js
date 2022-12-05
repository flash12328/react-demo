const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
const types = require('@babel/types');
/**
 *
 * @param {string|Buffer} content 源文件的内容
 * @param {object} [map] 可以被 https://github.com/mozilla/source-map 使用的 SourceMap 数据
 * @param {any} [meta] meta 数据，可以是任何内容
 */
const directives = ['r-if', 'r-show']
module.exports = function (content) {

    let result = content;

    // 代码块中包含相关指令时才去做解析和转换
    if (directives.find((directive) => content.includes(directive))) {
        // Parse(解析)
        const ast = parser.parse(content, { sourceType: "module", plugins: ["jsx", "typescript"] });

        //Transform(转换)
        traverse(ast, {
            JSXElement(path) {
                const attributes = path.node.openingElement.attributes;
                attributes.forEach((node, index) => {
                    /**
                     * r-if 指令处理
                     * @use <div r-if="show"></div>
                     * @warn r-if 的值必须是变量，不能是表达式 
                     */
                    if (node.name.name === 'r-if') {
                        if (!types.isJSXExpressionContainer(node.value)) {
                            throw new Error('r-if 的值不是一个对象');
                        }
                        if (node.value.expression?.name === undefined) {
                            throw new Error('r-if 的值不合法');
                        }
                        const value = node.value.expression?.name;
                        attributes.splice(index, 1);
                        path.replaceWith(
                            types.jsxExpressionContainer(
                                types.logicalExpression('&&', types.identifier(value), path.node)
                            )
                        );
                    }
                    /**
                     * r-show 指令处理
                     * @use <div r-show="show"></div>
                     * @warn r-show 的值必须是变量，不能是表达式
                     */
                    if (node.name.name === 'r-show') {
                        if (!types.isJSXExpressionContainer(node.value)) {
                            throw new Error('r-show 的值不是一个对象');
                        }
                        if (node.value.expression?.name === undefined) {
                            throw new Error('r-show 的值不合法');
                        }
                        const value = node.value.expression?.name;
                        attributes.splice(index, 1);
                        const conditionalExpression = types.conditionalExpression(types.identifier(value), types.stringLiteral('block'), types.stringLiteral('none'));
                        const objectProperty = types.objectProperty(types.identifier('display'), conditionalExpression);
                        if (attributes.find(_node => _node.name.name === 'style')) {
                            if (attributes.find(_node => _node.name.name === 'style')?.value?.expression?.properties?.find(_node => _node.key.name === 'display')) {
                                attributes.forEach(_node => {
                                    if (_node.name.name === 'style') {
                                        _node.value?.expression?.properties?.forEach(property => {
                                            if (property.key.name === 'display') {
                                                property.value = conditionalExpression;
                                            }
                                        });
                                    }
                                })
                            } else {
                                const objectProperties = attributes.find(_node => _node.name.name === 'style')?.value?.expression?.properties || [];
                                objectProperties.push(objectProperty);
                            }
                        } else {
                            const objectProperties = attributes.find(_node => _node.name.name === 'style')?.value?.expression?.properties || [];
                            objectProperties.push(objectProperty);
                            attributes.push(types.jsxAttribute(types.jsxIdentifier('style'), types.jsxExpressionContainer(types.objectExpression(objectProperties))
                            ))
                        }
                    }
                    // r-for 指令处理 
                    // 有问题，无法处理局部变量未声明导致TS报错
                    // if (node.name.name === 'r-for') {
                    //     const value = node.value.value;
                    //     const item = value?.trim().split('in')[0]?.trim();
                    //     const list = value?.trim().split('in')[1]?.trim();
                    //     attributes.splice(index, 1);
                    //     path.replaceWith(
                    //         types.jsxExpressionContainer(
                    //             types.logicalExpression(
                    //                 '&&',
                    //                 types.logicalExpression(
                    //                     '&&',
                    //                     types.callExpression(
                    //                         types.memberExpression(types.identifier('Array'), types.identifier('isArray')),
                    //                         [types.identifier(list)]
                    //                     ),
                    //                     types.binaryExpression(
                    //                         '>',
                    //                         types.memberExpression(types.identifier(list), types.identifier('length')),
                    //                         types.numericLiteral(0)
                    //                     )
                    //                 ),
                    //                 types.callExpression(
                    //                     types.memberExpression(types.identifier(list), types.identifier('map')),
                    //                     [
                    //                         types.arrowFunctionExpression(
                    //                             [types.identifier(item), types.identifier('index')],
                    //                             types.blockStatement([types.returnStatement(path.node)])
                    //                         )
                    //                     ]
                    //                 )
                    //             )
                    //         )
                    //     );
                    // }
                });
            }
        })

        // Generate(代码生成)
        result = generator(ast, {}).code;
    }

    return result;
}

