var STEPS = 3;
var EPS = 0.01;
var NODES = 8; // IT HAS TO BE SIZE OF p AND a

// вероятности переходов между верщинами (состояниями)
// матрица перехода за один шаг
var p = [
	[0, 1, 0, 0, 0, 0, 0, 0],
	[0, 0.5, 0.2, 0, 0, 0, 0, 0.3],
	[0, 0, 0, 1, 0, 0, 0, 0],
	[0, 0, 0, 0, 0.5, 0.5, 0, 0],
	[0, 0, 0, 0, 0, 0.1, 0, 0.9],
	[0, 0, 0, 0, 0.2, 0.8, 0, 0],
	[0.3, 0, 0, 0, 0, 0.7, 0, 0],
	[0.6, 0, 0, 0, 0, 0, 0, 0.4]
];

// ищем численно, начальный вектор умножается на матрицу перехода,
// каждый раз при этом получаем
// очередной вектор вероятностей состояний на текущем шаге
function multiply(vec, mat) { //[line][column]
	var result = [];
	for(var i = 0; i < NODES; i++) {
		result[i] = 0;
		for(var j = 0; j < NODES; j++) {
			result[i] += vec[j] * mat[j][i];
		}
	}
	return result;
}

function countSquareDiff (prev, cur) {
	var sum = 0;
	for(var i = 0; i < NODES; i++) {
		sum += (prev[i] - cur[i]) * (prev[i] - cur[i]);
	}
	return sum;
}

function analyseState(a) {
	console.log("----- STARTING -----")
	var next;
	var diff = 2 * EPS;
	while(diff > EPS) {
		next = multiply(a, p);
		diff = countSquareDiff(a, next);
		console.log(diff);
		a = next;
	}
	console.log(a);
	console.log("----- FINISHED -----")
}

// анализируем первый вектор начальных состояний
analyseState([0, 0.1, 0.2, 0, 0.3, 0.1, 0, 0.3]);

// а теперь второй
analyseState([0.1, 0.1, 0.1, 0, 0.2, 0.5, 0, 0]);
