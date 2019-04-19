
var NODES = 8; // IT HAS TO BE SIZE OF p AND a

function multiplyM(mat, n) { //[line][column]
	var result = [];
	for(var i = 0; i < NODES; i++) {
		result[i] = Array(NODES).fill(0);
		for(var u = 0; u < NODES; u ++) {
			result[i][u] = mat[i][u];
		}
	}

	var res1 = [];
	for(var i = 0; i < NODES; i++) {
		res1[i] = Array(NODES).fill(0);
	}

	for(var u = 0; u < n; u++) {
		for(var i = 0; i < NODES; i++) {
			for(var j = 0; j < NODES; j++) {
				for(var k = 0; k < NODES; k++) {
					res1[i][j] += result[i][k] * mat[j][k];
				}
			}
		}
		for(var i = 0; i < NODES; i++) {
			for(var j = 0; j < NODES; j ++) {
				result[i][j] = res1[i][j];
			}
		}
		for(var i = 0; i < NODES; i++) {
			res1[i] = Array(NODES).fill(0);
		}
	}
	return result;
}


var EPS = 0.000001;

// вероятности переходов между верщинами (состояниями)
// матрица перехода за один шаг
var p = [
	[0, 1, 0, 0, 0, 0, 0, 0],
	[0, 0.5, 0.2, 0, 0, 0, 0, 0.3],
	[0, 0, 0.4, 0.1, 0, 0, 0.5, 0],
	[0, 0.2, 0.1, 0, 0.5, 0.2, 0, 0],
	[0, 0, 0, 0.1, 0, 0.1, 0.3, 0.5],
	[0, 0, 0.4, 0, 0.2, 0.4, 0, 0],
	[0.2, 0, 0, 0, 0, 0.7, 0.1, 0],
	[0.3, 0, 0, 0.3, 0, 0, 0, 0.4]
];

var t = multiplyM(p, 20);
for(var i = 0; i < NODES; i++) {
	for(var j = 0; j < NODES; j++) {
		console.log(t[i][j] + " ");
	}
	console.log();
}

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

function Determinant(A)	{
	var n = A.length, subA = [], detA = 0;
	if (n==1) return A[0][0];
	if (n==2) return (A[0][0]*A[1][1]-A[0][1]*A[1][0]);
	if (n==3) {
		return ((
			A[0][0]*A[1][1]*A[2][2] +
			A[0][1]*A[1][2]*A[2][0] +
			A[0][2]*A[1][0]*A[2][1]
		) - (
			A[0][0]*A[1][2]*A[2][1] +
			A[0][1]*A[1][0]*A[2][2] +
			A[0][2]*A[1][1]*A[2][0]
		));
	}
	for (var i = 0; i < n; i++) {
		for (var h = 0; h < n - 1; h++)
			subA[h] = [];
		for (var a = 1; a < n; a++) {
			for (var b = 0; b < n; b++) {
				if (b < i) subA[a - 1][b] = A[a][b];
				else if (b > i) subA[a - 1][b - 1] = A[a][b];
			}
		}
		var sign = (i % 2 == 0) ? 1 : -1;
		detA += sign * A[0][i] * Determinant(subA);
	}
	return detA;
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
	console.log("SOLUTION IS " + a);
	console.log("----- FINISHED -----");
	return a;
}

function createSquareMatrix(side) {
	var matrix = new Array(side);
	for (var i = 0; i < side; i++) {
		matrix[i] = new Array(side);
	}
	return matrix;
}

// анализируем первый вектор начальных состояний
var test1 = analyseState([0, 0.1, 0.2, 0, 0.3, 0.1, 0, 0.3]);

// а теперь второй
var test2 = analyseState([0.1, 0.1, 0.1, 0, 0.2, 0.5, 0, 0]);

// теперь аналитически
// уравнение pi = pi * p (Это значит, что вектор состояния не будет меняться)
// оно эквивалентно pit = pt * pit, pit будут векторы - столбцы,
// pt - транспонированная матрица p
// (pt - E) * pit = 0. Назовем (pt - E) = B;    B * pit = 0
var B = createSquareMatrix(NODES);
for (var i = 0; i < NODES; i++) {
	for (var j = 0; j < NODES; j++) {
		B[i][j] = p[j][i];
		if (i == j) {
			B[i][j] -= 1;
		}
	}
}

// получаем систему. А еще сумма координат pit должна быть 1.
// поэтому можно заменить последнее уравнение,
// поставить в B последнюю строку из 1, получить
// B * pit = (0, 0, ..., 0, 1)t.
// Это потеря информации, и меня смущает, что мы вообще производим эту операцию.
// по идее, если так не сделать, то будет возможно одно из решений pit = 0,
// и это нам явно не подходит
for (var i = 0; i < NODES; i++) {
	B[NODES - 1][i] = 1;
}

// метод Крамера
// Считаем определитель
var detB = Determinant(B);
if (detB != 0) {
	console.log("----- ANALYTICS -----");
	var result = [];
	// меняем последовательно столбцы B на свободные члены
	// и считаем остальные определители
	var tmp = createSquareMatrix(NODES);
	for (var k = 0; k < NODES; k++) { // меняем столбец k
		for(var i = 0; i < NODES; i++) {
			for(var j = 0; j < NODES; j++) {
				tmp[i][j] = B[i][j];
				if (j == k) {
					tmp[i][j] = i < NODES - 1 ? 0 : 1;
				}
			}
		}
		result.push(Determinant(tmp)/detB);
	}
	console.log("SOLUTION IS " + result);
	console.log("SQUAREDIFF FROM TEST 1: " + countSquareDiff(result, test1));
	console.log("SQUAREDIFF FROM TEST 2: " + countSquareDiff(result, test2));
} else {
	console.log("I am really sorry, I cant solve it");
	// i cannot guarantee there is the only one solution
}
