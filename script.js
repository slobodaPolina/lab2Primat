var STEPS = 3;
var EPS = 0.0001;
var NODES = 8; // IT HAS TO BE SIZE OF p AND a

// вероятности переходов между верщинами (состояниями)
// матрица перехода за один шаг
var p = [
	[0, 1, 0, 0, 0, 0, 0, 0],
	[0, 0.5, 0.2, 0, 0, 0, 0, 0.3],
	[0, 0, 0, 0.5, 0, 0, 0.5, 0],
	[0, 0.2, 0.1, 0, 0.5, 0.2, 0, 0],
	[0, 0, 0, 0.1, 0, 0.1, 0.3, 0.5],
	[0, 0, 0.4, 0, 0.2, 0.4, 0, 0],
	[0.2, 0, 0, 0, 0, 0.7, 0.1, 0],
	[0.3, 0, 0, 0.3, 0, 0, 0, 0.4]
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



// теперь аналитически.
// уравнение pi = pi * Pt (Это значит, что вектор состояния не будет меняться)
// pi * (E - Pt) = 0. Назовем (E - Pt) = B;    pi * B = 0
function createSquareMatrix(side) {
	var matrix = new Array(side);
	for (var i = 0; i < side; i++) {
		matrix[i] = new Array(side);
	}
	return matrix;
}

var B = createSquareMatrix(NODES);
for (var i = 0; i < NODES; i++) {
	for (var j = 0; j < NODES; j++) {
		B[i][j] = - p[j][i];
		if (i == j) {
			B[i][j] += 1;
		}
	}
}

// pi * B = 0, получаем систему. А еще сумма координат pi должна быть 1.
// поэтому можно заменить последнее уравнение,
// поставить в B полследний столбец из 1, получить
// pi * B = (0, 0, ..., 0, 1).
// Это потеря информации, и меня смущает, что мы вообще производим эту операцию.
// по идее, если так не сделать, то будет возможно одно из решений pi = 0,
// и это нам явно не подходит
for (var i = 0; i < NODES; i++) {
	B[i][NODES] = 1;
}

// надо заметить, что это будет эквивалентно Bt * pit = (0, 0, ..., 0, 1)t,
// где pit- транспонированный вектор (вектор-столбец)
// метод Крамера
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
		for (var h = 0; h < n - 1; h++) {
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
	}
	return detA;
}

// Считаем определитель
if (Determinant(B) != 0) {
	// меняем последовательно СТРОКИ B на свободные члены (тк В транспонирована)
	// и считаем остальные определители
	for(var i = 0; i < NODES; i++) {
		console.log(
			Determinant(
				B.slice(0, i)
				.concat([[0, 0, 0, 0, 0, 0, 0, 1]])
				.concat(B.slice(i + 1, NODES))
			)
		);
	}
} else {
	console.log("I am really sorry, I cant solve it");
	// i cannot guarantee there is the only one solution
}
