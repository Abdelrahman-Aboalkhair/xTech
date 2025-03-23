interface ResponseData {
  [key: string]: any;
}

const sendResponse = (
  res: any,
  statusCode: number,
  data: ResponseData,
  message: string = "Success"
) => {
  res.status(statusCode).json({
    success: statusCode < 400,
    message,
    ...data,
  });
};

export default sendResponse;
