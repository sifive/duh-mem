'use strict';

const head = p =>
`module ${p.moduleName} (

);

endmodule
`;

const fir = opt => {
  console.log(opt);
  const res = head(opt);
  return res;
};

module.exports = fir;
