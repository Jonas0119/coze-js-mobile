export enum LocalStorageKey {
  VIDEO_STATE = 'video_state',
  EVENT_DATA = 'event_data'
}

export class LocalManager {
  get(key: string): string | null {
    return localStorage.getItem(key);
  }

  set(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }
}
