import { Client, Stronghold } from '@tauri-apps/plugin-stronghold';
import { appDataDir } from '@tauri-apps/api/path';
import { hashString } from '$lib/utils/html';

// Revisit security
const clientName = 'reader-project';

const initStronghold = async () => {
  const vaultPath = `${await appDataDir()}/vault.hold`;
  const code = await hashString(clientName);
  const stronghold = await Stronghold.load(vaultPath, code);

  let client: Client;
  try {
    client = await stronghold.loadClient(clientName);
  } catch {
    client = await stronghold.createClient(clientName);
  }

  return {
    stronghold,
    client,
  };
};

const { stronghold, client } = await initStronghold();
const store = client.getStore();

export async function setSecretRecord(key: string, value: string) {
  const data = Array.from(new TextEncoder().encode(value));
  await store.insert(key, data);
  await stronghold.save();
}

export async function getSecretRecord(key: string): Promise<string> {
  const data = await store.get(key);
  if(data)
    return new TextDecoder().decode(new Uint8Array(data)); 
  return '';
}
