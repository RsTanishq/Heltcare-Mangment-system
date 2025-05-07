
/**
 * H-TPI (Healthcare Transaction Priority Index) Algorithm
 * Provides a priority score to each transaction based on various factors
 * 
 * Formula: H-TPI = (U × P_Weight) / (S × L × T_Type)
 * 
 * @param urgency - Urgency factor (emergency = 1, routine = 0)
 * @param paymentWeight - Payment type weight (cryptocurrency > cash)
 * @param dataSize - Size of the transaction data in KB
 * @param networkLoad - Network load (normalized between 0.1 and 1)
 * @param transactionType - Transaction type (data update = 0.5, payment = 1)
 * @returns Priority score for the transaction
 */
export const calculateHTPIScore = (
  urgency: number, // 0 or 1 
  paymentWeight: number, // Typically between 1-5 (Higher for cryptocurrency)
  dataSize: number, // in KB
  networkLoad: number, // normalized between 0.1 and 1
  transactionType: number // data update = 0.5, payment = 1
): number => {
  // Prevent division by zero
  const safeDataSize = Math.max(dataSize, 0.1); 
  const safeNetworkLoad = Math.max(networkLoad, 0.1);
  const safeTransactionType = Math.max(transactionType, 0.1);
  
  const score = (urgency * paymentWeight) / (safeDataSize * safeNetworkLoad * safeTransactionType);
  
  // Round to 4 decimal places for more readable scores
  return Math.round(score * 10000) / 10000; 
};

/**
 * H-ADSP (Healthcare Access Decision and Security Protocol)
 * Determines if access to healthcare data should be granted based on multiple factors
 * 
 * Formula: Access Granted = (Urgency Level ≥ Threshold) ∧ (Payment Valid) ∧ (Patient Consent Granted)
 * 
 * @param urgencyLevel - Level of urgency for the data access request (0-10)
 * @param urgencyThreshold - Minimum urgency threshold to consider (0-10)
 * @param paymentValid - Whether payment is valid (true/false)
 * @param patientConsent - Whether patient has given consent (true/false)
 * @returns Boolean indicating whether access should be granted
 */
export const checkHADSPAccess = (
  urgencyLevel: number,
  urgencyThreshold: number,
  paymentValid: boolean,
  patientConsent: boolean
): boolean => {
  return (
    (urgencyLevel >= urgencyThreshold) && 
    paymentValid && 
    patientConsent
  );
};
