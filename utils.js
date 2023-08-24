// utils.js
function calculateIRF(salary) {
    if (salary <= 1903.98) {
      return 0;
    } else if (salary <= 2826.65) {
      return (salary - 1903.98) * 0.075;
    } else if (salary <= 3751.06) {
      return (salary - 2826.65) * 0.15 + 69.38;
    } else if (salary <= 4664.68) {
      return (salary - 3751.06) * 0.225 + 138.36;
    } else {
      return (salary - 4664.68) * 0.275 + 390.55;
    }
  }
  
  module.exports = { calculateIRF };
  