import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

const getUserDecorator = () => {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Page number',
      example: 1,
    }),
    ApiQuery({
      name: 'perPage',
      required: false,
      type: Number,
      description: 'Number of items per page',
      example: 10,
    }),
    ApiQuery({
      name: 'filter',
      required: false,
      type: String,
      description: 'Key word for search',
      example: '',
    }),
  );
};

const userDecorator = {
  getUserDecorator,
};

export default userDecorator;
