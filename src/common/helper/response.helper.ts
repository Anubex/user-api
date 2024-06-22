/* eslint-disable @typescript-eslint/no-explicit-any */
import resultHelper from './result.helper';
import { HttpException, HttpStatus } from '@nestjs/common';

const parseHttpStatusCode = (response: any) => {
  if (resultHelper.isExceptionResult(response)) {
    let httpStatus: HttpStatus;
    switch (response.status) {
      case 401:
        httpStatus = HttpStatus.UNAUTHORIZED;
        break;
      case 403:
        httpStatus = HttpStatus.FORBIDDEN;
        break;
      case 404:
        httpStatus = HttpStatus.NOT_FOUND;
        break;
      default:
        httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    throw new HttpException(
      {
        code: `${response.code}`,
        message: response.message,
        // status: response.status,
        // detail: response?.detail ?? undefined,
      },
      httpStatus,
    );
  } else {
    return response;
  }
};

const responseHelper = {
  parseHttpStatusCode,
};

export default responseHelper;
