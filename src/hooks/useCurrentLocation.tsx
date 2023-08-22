import { useEffect, useState } from "react";

export interface Location {
  latitude: number;
  longitude: number;
}

interface SuccessProps {
  coords: Location;
}

interface ErrorProps {
  code: number;
  message: string;
}

/**
 * 디바이스의 현재 위치를 리턴한다.
 * 위치 정보를 불러오는데 실패하면 에러 메시지를 error에 담아서 리턴한다.
 * @param options geolocation.getCurrentPosition()의 param 값
 * @returns location: 디바이스의 현재 위치(위도, 경도)값, error: 에러 메시지
 */
function useCurrentLocation(options = {}) {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = (position: SuccessProps) => {
    const { latitude, longitude } = position.coords;
    setLocation({
      latitude,
      longitude,
    });
  };

  const handleError = (error: ErrorProps) => {
    setError(error.message);
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported");
      return;
    }

    const { geolocation } = navigator;

    geolocation.getCurrentPosition(handleSuccess, handleError, options);
  }, []);

  return { location, error };
}

export default useCurrentLocation;
