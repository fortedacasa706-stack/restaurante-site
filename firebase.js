// Este arquivo não é utilizado pelo projeto atualmente.
// O backend foi migrado para Supabase e agora o código principal importa apenas `supabase.js`.

export const firebaseConfigured = false;
export function saveReservation() {
  throw new Error('Firebase não está mais em uso. Use supabase.js.');
}
export function saveOrder() {
  throw new Error('Firebase não está mais em uso. Use supabase.js.');
}
export function fetchRecentOrders() {
  throw new Error('Firebase não está mais em uso. Use supabase.js.');
}
export function fetchRecentReservations() {
  throw new Error('Firebase não está mais em uso. Use supabase.js.');
}
export function signInAdmin() {
  throw new Error('Firebase não está mais em uso. Use supabase.js.');
}
export function logoutAdmin() {
  throw new Error('Firebase não está mais em uso. Use supabase.js.');
}
export function onAuthChange() {
  return () => {};
}
