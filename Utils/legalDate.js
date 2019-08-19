function is13andUp (birthDateString) {
  const today = new Date();
  const birthDate = new Date(birthDateString);
  const age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
  }
  return age >= 13;
}