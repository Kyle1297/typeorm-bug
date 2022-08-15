import * as fpe from 'node-fpe';

const ORDER_NUMBER_SEED_PHRASE = 'order-id-seed-phrase';

export const orderNumber = (secret = ORDER_NUMBER_SEED_PHRASE) => {
  const cipher = fpe({ secret });

  const generate = (date?: Date | number): string => {
    let now = date
      ? new Date(date).getTime().toString()
      : Date.now().toString();

    // pad with additional random digits
    if (now.length < 14) {
      const pad = 14 - now.length;
      now += randomNumber(pad);
    }
    now = cipher.encrypt(now);

    // split into xxxx-xxxxxx-xxxx format
    return [now.slice(0, 4), now.slice(4, 10), now.slice(10, 14)].join('-');
  };

  const getTime = (id: string) => {
    let response = id.replace(/-/g, '');
    response = response.slice(0, 13);
    response = cipher.decrypt(response);
    const finalResponse = parseInt(response, 10);

    return finalResponse;
  };

  return { generate, getTime };
};

const randomNumber = (length: number) => {
  return Math.floor(
    Math.pow(10, length - 1) +
      Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1),
  ).toString();
};
