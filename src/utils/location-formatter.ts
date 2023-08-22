import { Location } from "../hooks/useCurrentLocation";

interface LocationArray {
  latitude: [number, number, number];
  longitude: [number, number, number];
}

const locationArrayToFloat = (
  aboveDecimalPoint: number,
  secondDecimalPoint: number,
  thirdDecimalPoint: number
) => {
  return aboveDecimalPoint + secondDecimalPoint / 60 + thirdDecimalPoint / 3600;
};

/**
 *
 * @param locationArray exif에서 반환하는 배열 형태의 위치 정보 값 (ex. latitude: [37, 17, 48.024959], longitude: [126, 50, 19.633919])
 * @returns 소수 형태로 반환한 latitude 값과 longitude 값
 */
export const locationFormatter = (locationArray: LocationArray): Location => {
  const { latitude: exifLatitude, longitude: exifLongitude } = locationArray;

  // * latitude 배열을 소수 표현으로 변경
  let [aboveDecimalPoint, secondDecimalPoint, thirdDecimalPoint] = exifLatitude;
  const latitude = locationArrayToFloat(
    aboveDecimalPoint,
    secondDecimalPoint,
    thirdDecimalPoint
  );

  [aboveDecimalPoint, secondDecimalPoint, thirdDecimalPoint] = exifLongitude;
  // * longitude 배열을 소수 표현으로 변경
  const longitude = locationArrayToFloat(
    aboveDecimalPoint,
    secondDecimalPoint,
    thirdDecimalPoint
  );

  return {
    latitude,
    longitude,
  };
};
