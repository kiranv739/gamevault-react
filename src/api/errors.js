export const getApiErrorMessage = (error, fallback = 'Request failed') => {
  const detail = error?.response?.data?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => (typeof item === 'string' ? item : item?.msg))
      .filter((message) => typeof message === 'string' && message.length > 0);
    if (messages.length) return messages.join('; ');
  }
  if (typeof detail?.msg === 'string') return detail.msg;
  return typeof error?.message === 'string' ? error.message : fallback;
};
