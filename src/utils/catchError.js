const catchError = (controller) => (req, res, next) =>
  controller(req, res, next).catch((error) => next(error));

export default catchError;
