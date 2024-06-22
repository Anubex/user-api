/* eslint-disable @typescript-eslint/no-explicit-any */
const isExceptionResult = (obj: any) => {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    'code' in obj &&
    'message' in obj &&
    'status' in obj
  );
};

const resultHelper = {
  isExceptionResult,
};

export default resultHelper;
