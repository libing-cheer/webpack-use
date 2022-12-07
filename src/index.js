import '../style/index.css';
import '../style/index.less';

console.log('hello world');
console.log('where is a will there is a way');

function quickSort(data) {
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
}

const data = quickSort([1,3,4,55,6,77,888]);
console.log(data);
const map = new Map();
console.log(map);