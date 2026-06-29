const mockGet = jest.fn();
const mockPost = jest.fn();
const mockPut = jest.fn();
const mockDelete = jest.fn();

const mockInstance = {
  get: mockGet,
  post: mockPost,
  put: mockPut,
  delete: mockDelete,
};

const axios = {
  create: jest.fn(() => mockInstance),
  get: mockGet,
  post: mockPost,
  put: mockPut,
  delete: mockDelete,
};

export default axios;
export { mockGet, mockPost, mockPut, mockDelete };
