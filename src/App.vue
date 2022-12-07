<template>
    <div class="app__container">App</div>
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
            const data = quickSort([1,3,4,55,6,77,888]);
            console.log(data);
        }
    }
</script>
<style lang="less" scoped>
    .app__container {
        width: 100px;
        height: 100px;
        line-height: 100px;
        background: wheat;
        color: white;
        text-align: center;
    }
</style>