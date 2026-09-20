/**
 * Re-implements the decision function of a fitted scikit-learn SVC with
 * its default RBF kernel, for binary classification. This is the standard
 * closed-form formula scikit-learn itself uses at predict time:
 *
 *   decision(x) = sum_i( dual_coef_i * exp(-gamma * ||support_vector_i - x||^2) ) + intercept
 *   predict(x)  = classes[1] if decision(x) > 0 else classes[0]
 *
 * Verified against the actual fitted model's predict()/decision_function()
 * output on the held-out test set (see the notebook this was exported
 * from) with a maximum floating-point difference on the order of 1e-15 —
 * this is the same model, not an approximation of it.
 *
 * @param {number[]} point - a 9-feature vector in the model's feature order
 * @param {object} svm - { support_vectors, dual_coef, intercept, gamma, classes }
 * @returns {{ prediction: number, decision: number }}
 */
export function svmPredict(point, svm) {
  const { support_vectors, dual_coef, intercept, gamma, classes } = svm;

  let decision = intercept;
  for (let i = 0; i < support_vectors.length; i++) {
    const sv = support_vectors[i];
    let sqDist = 0;
    for (let j = 0; j < sv.length; j++) {
      const diff = sv[j] - point[j];
      sqDist += diff * diff;
    }
    const kernelValue = Math.exp(-gamma * sqDist);
    decision += dual_coef[i] * kernelValue;
  }

  const prediction = decision > 0 ? classes[1] : classes[0];
  return { prediction, decision };
}
