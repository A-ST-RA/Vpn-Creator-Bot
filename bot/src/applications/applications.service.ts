import { backendApi } from "../api";

export const createApplication = async (telegramId: number, period: number, cost: number) => {
  try {
    const currentDate = new Date()
    const dateToAlive = currentDate.getMonth() + +period;
    currentDate.setMonth(dateToAlive);
    await backendApi.post('/subscribers', {
      data: {
        dateToAlive: currentDate.toISOString().split('T')[0],
        telegramId: telegramId.toString(),
        period: period,
        totalCost: (+cost * +period).toString(),
      },
    });
    
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const sendCheck = async (telegramId: number, checkUrl: string) => {
  try {
    await backendApi.post('/subscribers/update/' + telegramId, {
      data: {
        check: checkUrl,
      },
    });
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const setKeyToUser = async (telegramId: string, keyId: string) => {
  await backendApi.post('/subscribers/update/' + telegramId, {
    data: {
      accessGained: true,
      vpnKeyId: keyId,
    }
  });
}

export const getNotAccessedToVpnClients = async () => {
  const { data: { data } } = await backendApi.get(`/subscribers?filters[accepted][$eq]=true&filters[accessGained][$eq]=false`);

  return data?.map((el: { id: number; attributes: { telegramId: any; }; }) => ({
    id: el.id,
    telegramId: el.attributes.telegramId,
  }));
};
