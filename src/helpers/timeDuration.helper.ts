export const is24hoursCompleted = (d) => {
    const dateString = new Date(d);
    const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
    const timestamp = new Date().getTime();
    const time = new Date(dateString).getTime();
    const timeDifference = timestamp - time;
    return timeDifference >= ONE_DAY_IN_MS ? true : false;
};
