import { resolveModelUrl } from './model/resolveModelUrl';
export const REMOTE_MODEL_STORE = 'https://pub-70e24999b560412a8cf712bd468e82c2.r2.dev/';
export const resolveRemoteAsset = (source: string) => resolveModelUrl(source, REMOTE_MODEL_STORE);
