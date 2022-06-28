
/**
 * transfer date stamp to hh:mm:ss
 * @param stamp 
 * @returns 
 */
export const formatDuring = (stamp: number) => {
  if (stamp <= 0) {
    return '00:00:00';
  }
  // var days = parseInt(stamp / (1000 * 60 * 60 * 24));
  const hour = parseInt(
    `${(stamp % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)}`,
    10
  );
  const minute = parseInt(`${(stamp % (1000 * 60 * 60)) / (1000 * 60)}`, 10);
  const second = Math.floor((stamp % (1000 * 60)) / 1000);

  return `${hour < 10 ? `0${hour}` : hour}:${
    minute < 10 ? `0${minute}` : minute
  }:${second < 10 ? `0${second}` : second}`;
};