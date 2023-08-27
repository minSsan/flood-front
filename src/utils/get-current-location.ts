export interface Location {
  latitude: number;
  longitude: number;
}

interface Position {
  coords: Location;
}

export const getCurrentLocation = (options = {}): Promise<Position> => {
  const { geolocation } = navigator;

  return new Promise((resolve, reject) => {
    geolocation.getCurrentPosition(resolve, reject, options);
  });
};
