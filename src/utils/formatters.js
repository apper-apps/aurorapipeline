import { format, formatDistanceToNow as formatDistanceToNowDateFns } from "date-fns";

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPercentage = (value) => {
  return `${value > 0 ? '+' : ''}${value}%`;
};

export const formatDate = (dateString) => {
  return format(new Date(dateString), "MMM dd, yyyy");
};

export const formatDateTime = (dateString) => {
  return format(new Date(dateString), "MMM dd, yyyy 'at' h:mm a");
};

export const formatDistanceToNow = (dateString) => {
  return formatDistanceToNowDateFns(new Date(dateString), { addSuffix: false });
};

export const formatNumber = (number) => {
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1)}M`;
  } else if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}K`;
  }
  return number.toString();
};