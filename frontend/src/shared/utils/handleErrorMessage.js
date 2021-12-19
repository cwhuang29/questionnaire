const extractErrorMessage = (error) => (error && error.response && error.response.data) || error.message || error.toString();

export default extractErrorMessage;
