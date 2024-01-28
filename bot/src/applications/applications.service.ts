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