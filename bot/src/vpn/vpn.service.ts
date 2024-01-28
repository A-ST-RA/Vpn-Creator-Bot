import { randomUUID } from "crypto";
import { vpnApi } from "../api"

export const makeVpnKey = async () => {
  try {
    const name = randomUUID();
  
    const { data } = await vpnApi.post('/access-keys', {
      method: "aes-192-gcm",
      name
    });

    return data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteAccessKey = async (keyId: string) => {
  try {
    await vpnApi.delete(`/access-keys/${keyId}`);
  } catch (error) {
    console.error(error);
  }
};
