<template>
    <div class="app__container">
        二. tree-shaking 的原理 （webpack）
        common.js 和 es6 中模块引入的区别？
        1、CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
        2、CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
        3、CommonJs 是单个值导出，ES6 Module可以导出多个
        4、CommonJs 是动态语法可以写在判断里，ES6 Module 静态语法只能写在顶层
        5、CommonJs 的 this 是当前模块，ES6 Module的 this 是 undefined
        Tree shaking 的本质 - 消除无用的JavaScript代码
        因为 ES6 Model 的出现，ES6 Model 依赖关系是确定的，和运行时的状态无关，可以进行可靠的静态分析。
        ES6 Module引入进行静态分析，故而编译的时候正确判断到底加载了那些模块
        静态分析程序流，判断那些模块和变量未被使用或者引用，进而删除对应代码
    </div>
</template>
<script>
    export default {
        name: 'App',
        setup() {
            console.log('Webpack App 热更新');
            const quickSort = (data) => {
                if (!data) return;
                if (data.length <= 1) return data;
                const pivotIndex = Math.floor(data.length / 2);
                const pivot = data.splice(pivotIndex, 1)[0];

                let left = [];
                let right = [];
                for (let i = 0; i < data.length; i++) {
                    if (data[i] < pivot) {
                        left.push(data[i]);
                    } else {
                        right.push(data[i]);
                    }
                }
                return quickSort(left).concat([pivot], quickSort(right));
            };
            const data = quickSort([1, 3, 4, 55, 6, 77, 888]);
            console.log(data);
        }
    }
</script>
<style lang="less" scoped>
    .app__container {
        width: 800px;
        height: 800px;
        line-height: 50px;
        background: wheat;
        color: green;
        text-align: center;
    }
</style>