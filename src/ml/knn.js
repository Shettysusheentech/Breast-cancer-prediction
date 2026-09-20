/**
 * Re-implements prediction for a fitted scikit-learn KNeighborsClassifier
 * (default weights="uniform", Euclidean distance). No approximation: this
 * is the same "find the k closest training points, take a majority vote"
 * algorithm, applied to the same training data the notebook's model was
 * fit on (exported verbatim in model_export.json).
 *
 * @param {number[]} point - a 9-feature vector in the model's feature order
 * @param {number[][]} xTrain - training feature rows
 * @param {number[]} yTrain - training labels, same order as xTrain
 * @param {number} k
 * @returns {{ prediction: number, neighbors: {label: number, distance: number}[] }}
 */
export function knnPredict(point, xTrain, yTrain, k = 5) {
  const distances = xTrain.map((row, i) => {
    let sumSq = 0;
    for (let j = 0; j < row.length; j++) {
      const diff = row[j] - point[j];
      sumSq += diff * diff;
    }
    return { index: i, distance: Math.sqrt(sumSq) };
  });

  distances.sort((a, b) => a.distance - b.distance);
  const nearest = distances.slice(0, k);

  const votes = {};
  nearest.forEach(({ index }) => {
    const label = yTrain[index];
    votes[label] = (votes[label] || 0) + 1;
  });

  let prediction = null;
  let maxVotes = -1;
  Object.entries(votes).forEach(([label, count]) => {
    if (count > maxVotes) {
      maxVotes = count;
      prediction = Number(label);
    }
  });

  return {
    prediction,
    agreeingNeighbors: maxVotes,
    totalNeighbors: k,
    neighbors: nearest.map((n) => ({ label: yTrain[n.index], distance: n.distance })),
  };
}
